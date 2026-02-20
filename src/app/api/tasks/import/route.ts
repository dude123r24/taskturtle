import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Task } from '@/store/taskStore'; // Reusing type if possible, or defining partial

// POST /api/tasks/import
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tasks } = body as { tasks: Partial<Task>[] };

        if (!Array.isArray(tasks) || tasks.length === 0) {
            return NextResponse.json(
                { error: 'No tasks provided' },
                { status: 400 }
            );
        }

        const tasksToCreate = tasks.map((t) => ({
            userId: session.user!.id,
            title: t.title || 'Untitled Import',
            description: t.description || null,
            quadrant:
                t.quadrant === 'DO_FIRST' ||
                    t.quadrant === 'SCHEDULE' ||
                    t.quadrant === 'DELEGATE' ||
                    t.quadrant === 'ELIMINATE'
                    ? t.quadrant
                    : 'SCHEDULE',
            status:
                t.status === 'TODO' ||
                    t.status === 'IN_PROGRESS' ||
                    t.status === 'DONE' ||
                    t.status === 'ARCHIVED'
                    ? t.status
                    : 'TODO',
            horizon:
                t.horizon === 'SHORT_TERM' || t.horizon === 'LONG_TERM'
                    ? t.horizon
                    : 'LONG_TERM',
            estimatedMinutes: t.estimatedMinutes ? Number(t.estimatedMinutes) : null,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
        }));

        const result = await prisma.task.createMany({
            data: tasksToCreate,
        });

        return NextResponse.json({
            message: `Successfully imported ${result.count} tasks`,
            count: result.count,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'Failed to import tasks' },
            { status: 500 }
        );
    }
}
