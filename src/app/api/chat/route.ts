import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { chat, type ChatMessage } from '@/lib/gemini';

// POST /api/chat
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { message, history } = body as {
            message: string;
            history: ChatMessage[];
        };

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const response = await chat(
            session.user.id,
            message,
            history || []
        );

        return NextResponse.json({ response });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}
