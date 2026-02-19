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
