import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listCalendarEvents } from '@/lib/google-calendar';

// GET /api/calendar/events?date=YYYY-MM-DD
export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    try {
        const events = await listCalendarEvents(session.user.id, date);
        return NextResponse.json(events);
    } catch (error) {
        console.error('Calendar API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar events', events: [] },
            { status: 200 } // Graceful degradation
        );
    }
}
