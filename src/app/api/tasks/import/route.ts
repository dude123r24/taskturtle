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
                    t.quadrant === 'ELIMINATE' ||
                    t.quadrant === 'UNASSIGNED'
                    ? t.quadrant
                    : 'UNASSIGNED',
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
            actualMinutes: t.actualMinutes ? Number(t.actualMinutes) : null,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            calendarEventId: t.calendarEventId || null,
            sortOrder: t.sortOrder ? Number(t.sortOrder) : 0,
            isChase: t.isChase === true || String(t.isChase) === 'true',
            archivedAt: t.archivedAt ? new Date(t.archivedAt) : null,
            createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
        }));

        // createMany doesn't support nested relations (like updates).
        // Since import sizes are generally small for this app, we can use a transaction with individual creates to support the nested updates array
        const result = await prisma.$transaction(
            tasks.map((t, index) => {
                const data = tasksToCreate[index];

                // Parse nested updates if they exist (usually from JSON imports)
                let parsedUpdates: any[] = [];
                if (t.updates) {
                    if (typeof t.updates === 'string') {
                        try {
                            parsedUpdates = JSON.parse(t.updates);
                        } catch (e) { /* ignore */ }
                    } else if (Array.isArray(t.updates)) {
                        parsedUpdates = t.updates;
                    }
                }

                return prisma.task.create({
                    data: {
                        ...data,
                        updates: parsedUpdates.length > 0 ? {
                            create: parsedUpdates.map((u: any) => ({
                                content: u.content,
                                createdAt: u.createdAt ? new Date(u.createdAt) : undefined
                            }))
                        } : undefined
                    }
                });
            })
        );

        return NextResponse.json({
            message: `Successfully imported ${result.length} tasks`,
            count: result.length,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'Failed to import tasks' },
            { status: 500 }
        );
    }
}
