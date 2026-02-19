import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function getCalendarClient(userId: string) {
    const account = await prisma.account.findFirst({
        where: { userId, provider: 'google' },
    });

    if (!account?.access_token) {
        throw new Error('No Google account linked');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.AUTH_GOOGLE_ID,
        process.env.AUTH_GOOGLE_SECRET
    );

    oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function listCalendarEvents(
    userId: string,
    date: string // YYYY-MM-DD
) {
    const calendar = await getCalendarClient(userId);

    const timeMin = new Date(`${date}T00:00:00`);
    const timeMax = new Date(`${date}T23:59:59`);

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items || [];
}

export async function createCalendarEvent(
    userId: string,
    summary: string,
    description: string | undefined,
    startTime: string, // ISO 8601
    endTime: string    // ISO 8601
) {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary,
            description,
            start: { dateTime: startTime },
            end: { dateTime: endTime },
        },
    });

    return response.data;
}

export async function deleteCalendarEvent(
    userId: string,
    eventId: string
) {
    const calendar = await getCalendarClient(userId);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId,
    });
}
