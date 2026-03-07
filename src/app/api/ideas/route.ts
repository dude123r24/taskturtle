import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/ideas — Get all ideas for the user
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'sanghviamit@gmail.com';

    const ideas = await prisma.featureRequest.findMany({
        where: isAdmin ? undefined : { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ideas);
}

// POST /api/ideas — Create a new idea
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, impact = 5, effort = 5, status = 'NEW' } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const idea = await prisma.featureRequest.create({
            data: {
                userId: session.user.id,
                title,
                description,
                impact: Number(impact),
                effort: Number(effort),
                status
            },
        });

        return NextResponse.json(idea, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create idea' },
            { status: 500 }
        );
    }
}
