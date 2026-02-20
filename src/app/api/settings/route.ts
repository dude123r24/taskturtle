import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id },
    });

    // Create defaults if not exists
    if (!settings) {
        settings = await prisma.userSettings.create({
            data: { userId: session.user.id },
        });
    }

    return NextResponse.json(settings);
}

// PATCH /api/settings
export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
        'maxDailyTasks', 'maxWeeklyTasks', 'maxDailyMinutes',
        'defaultView', 'calendarSyncEnabled',
        'autoClearArchivedEnabled', 'autoClearArchivedDays'
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            data[field] = body[field];
        }
    }

    const settings = await prisma.userSettings.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, ...data },
        update: data,
    });

    return NextResponse.json(settings);
}
