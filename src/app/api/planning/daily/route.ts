import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/planning/daily?date=YYYY-MM-DD
export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);

    const plan = await prisma.dailyPlan.findUnique({
        where: { userId_date: { userId: session.user.id, date } },
        include: {
            tasks: {
                include: { task: true },
                orderBy: { sortOrder: 'asc' },
            },
        },
    });

    // Also get user settings for overload check
    const settings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id },
    });

    const taskCount = plan?.tasks.length || 0;
    const maxDaily = settings?.maxDailyTasks || 8;
    const totalMinutes = plan?.tasks.reduce(
        (sum, pt) => sum + (pt.task.estimatedMinutes || 0), 0
    ) || 0;

    return NextResponse.json({
        plan,
        overload: {
            taskCount,
            maxDaily,
            isOverloaded: taskCount > maxDaily,
            totalMinutes,
            maxDailyMinutes: settings?.maxDailyMinutes || 480,
            isTimeOverloaded: totalMinutes > (settings?.maxDailyMinutes || 480),
        },
    });
}

// PUT /api/planning/daily — Assign tasks to a day
export async function PUT(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, tasks } = body as { date: string; tasks: { taskId: string; timeSlotStart?: string; timeSlotEnd?: string }[] };

    if (!date || !tasks) {
        return NextResponse.json(
            { error: 'date and tasks are required' },
            { status: 400 }
        );
    }

    const dateObj = new Date(date);

    // Upsert the daily plan
    const plan = await prisma.dailyPlan.upsert({
        where: { userId_date: { userId: session.user.id, date: dateObj } },
        create: {
            userId: session.user.id,
            date: dateObj,
            tasks: {
                create: tasks.map((t, i) => ({
                    task: { connect: { id: t.taskId } },
                    timeSlotStart: t.timeSlotStart || null,
                    timeSlotEnd: t.timeSlotEnd || null,
                    sortOrder: i,
                })),
            },
        },
        update: {
            tasks: {
                deleteMany: {},
                create: tasks.map((t, i) => ({
                    task: { connect: { id: t.taskId } },
                    timeSlotStart: t.timeSlotStart || null,
                    timeSlotEnd: t.timeSlotEnd || null,
                    sortOrder: i,
                })),
            },
        },
        include: {
            tasks: { include: { task: true }, orderBy: { sortOrder: 'asc' } },
        },
    });

    return NextResponse.json(plan);
}
