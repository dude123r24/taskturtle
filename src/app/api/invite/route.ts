import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/invite — Get or create an invite token for the current user
export async function POST() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return existing unused invite or create a new one
    let invite = await prisma.invite.findFirst({
        where: { inviterId: session.user.id, usedAt: null },
        orderBy: { createdAt: 'desc' },
    });

    if (!invite) {
        invite = await prisma.invite.create({
            data: { inviterId: session.user.id },
        });
    }

    return NextResponse.json({ token: invite.token });
}

// GET /api/invite — Get invite stats for the current user
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [invites, friendsJoined] = await Promise.all([
        prisma.invite.findFirst({
            where: { inviterId: session.user.id, usedAt: null },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.invite.count({
            where: { inviterId: session.user.id, usedAt: { not: null } },
        }),
    ]);

    return NextResponse.json({ token: invites?.token ?? null, friendsJoined });
}
