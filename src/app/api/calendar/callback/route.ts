import { NextResponse } from 'next/server';
import { exchangeCodeForCalendarAccount } from '@/lib/google-calendar';

// GET /api/calendar/callback?code=...&state=...
// This is the OAuth callback for adding a new calendar account
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(
            new URL('/settings?calendarError=access_denied', request.url)
        );
    }

    if (!code || !stateParam) {
        return NextResponse.redirect(
            new URL('/settings?calendarError=missing_params', request.url)
        );
    }

    try {
        const state = JSON.parse(Buffer.from(stateParam, 'base64').toString());
        const { userId, calendarName, color } = state;

        if (!userId) {
            return NextResponse.redirect(
                new URL('/settings?calendarError=invalid_state', request.url)
            );
        }

        await exchangeCodeForCalendarAccount(userId, code, calendarName, color);

        return NextResponse.redirect(
            new URL('/settings?calendarAdded=true', request.url)
        );
    } catch (err) {
        console.error('Calendar OAuth callback error:', err);
        return NextResponse.redirect(
            new URL('/settings?calendarError=exchange_failed', request.url)
        );
    }
}
