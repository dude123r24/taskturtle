import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listAllCalendarEvents } from '@/lib/google-calendar';

// GET /api/calendar/events?date=YYYY-MM-DD
export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const hideDuplicates = searchParams.get('hideDuplicates') === 'true';

    try {
        let events = await listAllCalendarEvents(session.user.id, date);

        // Optionally filter out duplicates
        if (hideDuplicates) {
            events = events.filter((e) => !e.isDuplicate);
        }

        return NextResponse.json(events);
    } catch (error) {
        console.error('Calendar API error:', error);
        return NextResponse.json([], { status: 200 }); // Graceful degradation
    }
}
