import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tasks — List tasks with optional filters
export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quadrant = searchParams.get('quadrant');
    const horizon = searchParams.get('horizon');
    const status = searchParams.get('status');

    // --- Auto-Archive and Cleanup Logic ---
    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId: session.user.id }
        }) || { autoClearArchivedEnabled: true, autoClearArchivedDays: 30 };

        const now = new Date();

        // 1. Auto-archive ELIMINATE tasks older than 7 days
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        await prisma.task.updateMany({
            where: {
                userId: session.user.id,
                quadrant: 'ELIMINATE',
                status: { not: 'ARCHIVED' },
                updatedAt: { lt: sevenDaysAgo }
            },
            data: { status: 'ARCHIVED' }
        });

        // 2. Auto-clear ARCHIVED tasks if enabled
        if (settings.autoClearArchivedEnabled && settings.autoClearArchivedDays > 0) {
            const clearThreshold = new Date(now.getTime() - settings.autoClearArchivedDays * 24 * 60 * 60 * 1000);
            await prisma.task.deleteMany({
                where: {
                    userId: session.user.id,
                    status: 'ARCHIVED',
                    updatedAt: { lt: clearThreshold }
                }
            });
        }
    } catch (e) {
        console.error('Failed to run auto-archive routines:', e);
        // Continue to fetch tasks even if cleanup fails
    }
    // --------------------------------------

    const where: Record<string, unknown> = { userId: session.user.id };
    if (quadrant) where.quadrant = quadrant;
    if (horizon) where.horizon = horizon;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(tasks);
}

// POST /api/tasks — Create a new task
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, quadrant, horizon, estimatedMinutes, dueDate } = body;

    if (!title || !quadrant) {
        return NextResponse.json(
            { error: 'Title and quadrant are required' },
            { status: 400 }
        );
    }

    const task = await prisma.task.create({
        data: {
            userId: session.user.id,
            title,
            description: description || null,
            quadrant,
            horizon: horizon || 'LONG_TERM',
            estimatedMinutes: estimatedMinutes || null,
            dueDate: dueDate ? new Date(dueDate) : null,
        },
    });

    return NextResponse.json(task, { status: 201 });
}
