import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/time-slots
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timeSlots = await prisma.timeSlot.findMany({
        where: { userId: session.user.id },
        orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(timeSlots);
}

// POST /api/time-slots
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { label, startTime, endTime, daysOfWeek, color } = body;

    if (!label || !startTime || !endTime) {
        return NextResponse.json(
            { error: 'label, startTime, and endTime are required' },
            { status: 400 }
        );
    }

    const timeSlot = await prisma.timeSlot.create({
        data: {
            userId: session.user.id,
            label,
            startTime,
            endTime,
            daysOfWeek: daysOfWeek || [1, 2, 3, 4, 5], // Mon-Fri default
            color: color || '#4A90D9',
        },
    });

    return NextResponse.json(timeSlot, { status: 201 });
}
