import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tasks/[id]/updates — List updates for a task
export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({ where: { id: params.id } });
    if (!task || task.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updates = await prisma.taskUpdate.findMany({
        where: { taskId: params.id },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(updates);
}

// POST /api/tasks/[id]/updates — Add an update to a task
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({ where: { id: params.id } });
    if (!task || task.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
        return NextResponse.json(
            { error: 'Content is required' },
            { status: 400 }
        );
    }

    const update = await prisma.taskUpdate.create({
        data: {
            taskId: params.id,
            content: content.trim(),
        },
    });

    return NextResponse.json(update, { status: 201 });
}
