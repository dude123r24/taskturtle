import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/invite/[token] — Public: validate token, return inviter info
export async function GET(_req: Request, { params }: { params: { token: string } }) {
    const invite = await prisma.invite.findUnique({
        where: { token: params.token },
        include: {
            inviter: { select: { name: true, image: true } },
        },
    });

    if (!invite) {
        return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 });
    }

    return NextResponse.json({
        valid: true,
        used: invite.usedAt !== null,
        inviterName: invite.inviter.name,
        inviterImage: invite.inviter.image,
    });
}

// POST /api/invite/[token] — Authenticated: redeem invite token
export async function POST(_req: Request, { params }: { params: { token: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { token: params.token },
    });

    if (!invite) {
        return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 });
    }

    if (invite.usedAt !== null) {
        return NextResponse.json({ error: 'Invite already used' }, { status: 409 });
    }

    // Don't let users redeem their own invite
    if (invite.inviterId === session.user.id) {
        return NextResponse.json({ error: 'Cannot redeem your own invite' }, { status: 400 });
    }

    await prisma.$transaction([
        prisma.invite.update({
            where: { token: params.token },
            data: { usedAt: new Date(), usedByUserId: session.user.id },
        }),
        prisma.user.update({
            where: { id: session.user.id },
            data: { referredById: invite.inviterId },
        }),
    ]);

    return NextResponse.json({ success: true });
}
