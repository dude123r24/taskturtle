import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCalendarAuthUrl } from '@/lib/google-calendar';

// GET /api/calendar/accounts — list all connected calendar accounts
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await prisma.calendarAccount.findMany({
        where: { userId: session.user.id },
        select: {
            id: true,
            googleEmail: true,
            calendarId: true,
            calendarName: true,
            color: true,
            enabled: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(accounts);
}

// POST /api/calendar/accounts — start OAuth flow to add a new calendar account
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const calendarName = body.calendarName || 'New Calendar';
    const color = body.color || '#4285F4';

    // Create a state token with user info + display preferences
    const state = Buffer.from(
        JSON.stringify({
            userId: session.user.id,
            calendarName,
            color,
        })
    ).toString('base64');

    const authUrl = getCalendarAuthUrl(state);

    return NextResponse.json({ authUrl });
}

// PATCH /api/calendar/accounts — update a calendar account (toggle, rename, recolor)
export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, enabled, calendarName, color } = body;

    if (!accountId) {
        return NextResponse.json({ error: 'accountId required' }, { status: 400 });
    }

    // Verify ownership
    const account = await prisma.calendarAccount.findFirst({
        where: { id: accountId, userId: session.user.id },
    });

    if (!account) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.calendarAccount.update({
        where: { id: accountId },
        data: {
            ...(enabled !== undefined && { enabled }),
            ...(calendarName && { calendarName }),
            ...(color && { color }),
        },
    });

    return NextResponse.json(updated);
}

// DELETE /api/calendar/accounts — remove a calendar account
export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
        return NextResponse.json({ error: 'accountId required' }, { status: 400 });
    }

    // Verify ownership
    const account = await prisma.calendarAccount.findFirst({
        where: { id: accountId, userId: session.user.id },
    });

    if (!account) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.calendarAccount.delete({ where: { id: accountId } });

    return NextResponse.json({ success: true });
}
