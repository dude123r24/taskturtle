import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// ─── OAuth Client Factory ────────────────────────────────────────────

function createOAuth2Client(redirectUri?: string) {
    return new google.auth.OAuth2(
        process.env.AUTH_GOOGLE_ID,
        process.env.AUTH_GOOGLE_SECRET,
        redirectUri || `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    );
}

/**
 * Build an authenticated calendar client for a specific CalendarAccount.
 * Auto-refreshes tokens if expired.
 */
async function getCalendarClientForAccount(accountId: string) {
    const account = await prisma.calendarAccount.findUnique({
        where: { id: accountId },
    });

    if (!account) throw new Error(`Calendar account ${accountId} not found`);

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
    });

    // Auto-refresh if expired
    const now = Math.floor(Date.now() / 1000);
    if (account.tokenExpiresAt && account.tokenExpiresAt < now && account.refreshToken) {
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            await prisma.calendarAccount.update({
                where: { id: accountId },
                data: {
                    accessToken: credentials.access_token!,
                    tokenExpiresAt: credentials.expiry_date
                        ? Math.floor(credentials.expiry_date / 1000)
                        : null,
                },
            });
            oauth2Client.setCredentials(credentials);
        } catch {
            console.error(`Failed to refresh token for calendar account ${accountId}`);
        }
    }

    return {
        client: google.calendar({ version: 'v3', auth: oauth2Client }),
        calendarId: account.calendarId,
        accountId: account.id,
        color: account.color,
        calendarName: account.calendarName,
    };
}

// ─── Fingerprint for deduplication ───────────────────────────────────

function eventFingerprint(summary: string, startISO: string, endISO: string): string {
    const raw = `${summary.trim().toLowerCase()}|${startISO}|${endISO}`;
    return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

// ─── Public API ──────────────────────────────────────────────────────

export interface MergedCalendarEvent {
    id: string;
    googleEventId: string;
    calendarAccountId: string;
    calendarName: string;
    calendarColor: string;
    summary: string;
    description?: string;
    start?: { dateTime?: string | null; date?: string | null };
    end?: { dateTime?: string | null; date?: string | null };
    isDuplicate: boolean;
}

/**
 * Fetch events from ALL enabled calendar accounts for a user on a given date.
 * Deduplicates across calendars using (summary + start + end) fingerprint.
 */
export async function listAllCalendarEvents(
    userId: string,
    date: string // YYYY-MM-DD
): Promise<MergedCalendarEvent[]> {
    const accounts = await prisma.calendarAccount.findMany({
        where: { userId, enabled: true },
    });

    if (accounts.length === 0) {
        // Fallback: try the legacy single-account approach
        return listLegacyCalendarEvents(userId, date);
    }

    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const allEvents: MergedCalendarEvent[] = [];
    const seenFingerprints = new Set<string>();

    for (const account of accounts) {
        try {
            const { client, calendarId, calendarName, color } =
                await getCalendarClientForAccount(account.id);

            const response = await client.events.list({
                calendarId,
                timeMin,
                timeMax,
                singleEvents: true,
                orderBy: 'startTime',
            });

            for (const event of response.data.items || []) {
                const startISO = event.start?.dateTime || event.start?.date || '';
                const endISO = event.end?.dateTime || event.end?.date || '';
                const fp = eventFingerprint(event.summary || '', startISO, endISO);
                const isDuplicate = seenFingerprints.has(fp);
                seenFingerprints.add(fp);

                allEvents.push({
                    id: `${account.id}:${event.id}`,
                    googleEventId: event.id || '',
                    calendarAccountId: account.id,
                    calendarName,
                    calendarColor: color,
                    summary: event.summary || '(No title)',
                    description: event.description || undefined,
                    start: event.start || undefined,
                    end: event.end || undefined,
                    isDuplicate,
                });
            }
        } catch (error) {
            console.error(`Failed to fetch events from ${account.googleEmail}:`, error);
            // Continue with other accounts
        }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
        const aTime = a.start?.dateTime || a.start?.date || '';
        const bTime = b.start?.dateTime || b.start?.date || '';
        return aTime.localeCompare(bTime);
    });

    return allEvents;
}

/**
 * Fallback: use the legacy Account table (from Auth.js) if no CalendarAccounts are set up yet.
 */
async function listLegacyCalendarEvents(
    userId: string,
    date: string
): Promise<MergedCalendarEvent[]> {
    const account = await prisma.account.findFirst({
        where: { userId, provider: 'google' },
    });

    if (!account?.access_token) return [];

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return (response.data.items || []).map((event) => ({
        id: `legacy:${event.id}`,
        googleEventId: event.id || '',
        calendarAccountId: 'legacy',
        calendarName: 'Primary',
        calendarColor: '#4285F4',
        summary: event.summary || '(No title)',
        description: event.description || undefined,
        start: event.start || undefined,
        end: event.end || undefined,
        isDuplicate: false,
    }));
}

/**
 * Create a calendar event on a specific CalendarAccount.
 */
export async function createCalendarEvent(
    calendarAccountId: string,
    summary: string,
    description: string | undefined,
    startTime: string,
    endTime: string
) {
    const { client, calendarId, accountId } =
        await getCalendarClientForAccount(calendarAccountId);

    const response = await client.events.insert({
        calendarId,
        requestBody: {
            summary,
            description,
            start: { dateTime: startTime },
            end: { dateTime: endTime },
        },
    });

    // Record in SyncedEvent for dedup tracking
    const fp = eventFingerprint(summary, startTime, endTime);
    await prisma.syncedEvent.upsert({
        where: {
            calendarAccountId_googleEventId: {
                calendarAccountId: accountId,
                googleEventId: response.data.id!,
            },
        },
        create: {
            calendarAccountId: accountId,
            googleEventId: response.data.id!,
            eventFingerprint: fp,
            summary,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        },
        update: {},
    });

    return response.data;
}

/**
 * Delete a calendar event from a specific CalendarAccount.
 */
export async function deleteCalendarEvent(
    calendarAccountId: string,
    googleEventId: string
) {
    const { client, calendarId, accountId } =
        await getCalendarClientForAccount(calendarAccountId);

    await client.events.delete({
        calendarId,
        eventId: googleEventId,
    });

    // Clean up SyncedEvent record
    await prisma.syncedEvent.deleteMany({
        where: { calendarAccountId: accountId, googleEventId },
    });
}

/**
 * Generate the OAuth URL for adding a new calendar account.
 */
export function getCalendarAuthUrl(state: string): string {
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/calendar/callback`;
    const oauth2Client = createOAuth2Client(callbackUrl);
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar',
        ],
        state,
    });
}

/**
 * Exchange an authorization code for tokens and create/update a CalendarAccount.
 */
export async function exchangeCodeForCalendarAccount(
    userId: string,
    code: string,
    calendarName: string,
    color: string
) {
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/calendar/callback`;
    const oauth2Client = createOAuth2Client(callbackUrl);
    const { tokens } = await oauth2Client.getToken(code);

    // Get user info to determine the Google email
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email!;

    // Upsert the calendar account
    const calendarAccount = await prisma.calendarAccount.upsert({
        where: {
            userId_googleEmail_calendarId: {
                userId,
                googleEmail,
                calendarId: 'primary',
            },
        },
        create: {
            userId,
            googleEmail,
            calendarId: 'primary',
            calendarName,
            color,
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token || null,
            tokenExpiresAt: tokens.expiry_date
                ? Math.floor(tokens.expiry_date / 1000)
                : null,
        },
        update: {
            calendarName,
            color,
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token || undefined,
            tokenExpiresAt: tokens.expiry_date
                ? Math.floor(tokens.expiry_date / 1000)
                : null,
        },
    });

    return calendarAccount;
}
