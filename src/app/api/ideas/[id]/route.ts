import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/ideas/[id] — Update an idea
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const isAdmin = session.user.email === 'sanghviamit@gmail.com';
        const idea = await prisma.featureRequest.findUnique({ where: { id: params.id } });
        if (!idea || (!isAdmin && idea.userId !== session.user.id)) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, impact, effort, status } = body;

        // Ensure only admin can change the status
        if (status !== undefined && status !== idea.status && !isAdmin) {
            return NextResponse.json({ error: 'Only admins can update status' }, { status: 403 });
        }

        const updated = await prisma.featureRequest.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(impact !== undefined && { impact: Number(impact) }),
                ...(effort !== undefined && { effort: Number(effort) }),
                ...(status !== undefined && { status }),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
    }
}

// DELETE /api/ideas/[id] — Delete an idea
export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const isAdmin = session.user.email === 'sanghviamit@gmail.com';
        const idea = await prisma.featureRequest.findUnique({ where: { id: params.id } });
        if (!idea || (!isAdmin && idea.userId !== session.user.id)) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        await prisma.featureRequest.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
    }
}
