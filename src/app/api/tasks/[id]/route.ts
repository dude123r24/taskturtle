import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/tasks/[id] — Update a task
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
        where: { id: params.id },
        include: { updates: { orderBy: { createdAt: 'desc' } } },
    });
    if (!task || task.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = [
        'title', 'description', 'quadrant', 'horizon',
        'status', 'estimatedMinutes', 'actualMinutes',
        'dueDate', 'calendarEventId', 'sortOrder', 'isChase', 'parentId',
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            if (field === 'dueDate') {
                data[field] = body[field] ? new Date(body[field]) : null;
            } else {
                data[field] = body[field];
            }
        }
    }

    // If estimatedMinutes changed, log the change
    if (
        data.estimatedMinutes !== undefined &&
        data.estimatedMinutes !== task.estimatedMinutes
    ) {
        await prisma.timeEstimateLog.create({
            data: {
                taskId: task.id,
                oldEstimateMinutes: task.estimatedMinutes || 0,
                newEstimateMinutes: data.estimatedMinutes as number,
            },
        });
    }

    const updated = await prisma.task.update({
        where: { id: params.id },
        data,
        include: { updates: { orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json(updated);
}

// DELETE /api/tasks/[id] — Delete a task
export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    if (isPermanent) {
        await prisma.task.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } else {
        const updated = await prisma.task.update({
            where: { id: params.id },
            data: { status: 'ARCHIVED', archivedAt: new Date() },
            include: { updates: { orderBy: { createdAt: 'desc' } } },
        });
        return NextResponse.json(updated);
    }
}
