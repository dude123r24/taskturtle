import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tasks/export?format=json|csv
export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    try {
        const tasks = await prisma.task.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                title: true,
                description: true,
                quadrant: true,
                status: true,
                horizon: true,
                estimatedMinutes: true,
                dueDate: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `tasks-${timestamp}`;

        if (format === 'csv') {
            const headers = [
                'Title',
                'Description',
                'Quadrant',
                'Status',
                'Horizon',
                'Estimated Minutes',
                'Due Date',
                'Created At',
            ];

            const csvContent = [
                headers.join(','),
                ...tasks.map((t: any) =>
                    [
                        escapeCsv(t.title),
                        escapeCsv(t.description || ''),
                        t.quadrant,
                        t.status,
                        t.horizon,
                        t.estimatedMinutes || '',
                        t.dueDate ? t.dueDate.toISOString() : '',
                        t.createdAt.toISOString(),
                    ].join(',')
                ),
            ].join('\n');

            return new NextResponse(csvContent, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${filename}.csv"`,
                },
            });
        } else {
            return new NextResponse(JSON.stringify(tasks, null, 2), {
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="${filename}.json"`,
                },
            });
        }
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export tasks' },
            { status: 500 }
        );
    }
}

function escapeCsv(str: string): string {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}
