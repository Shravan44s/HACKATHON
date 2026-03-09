import { NextRequest, NextResponse } from 'next/server';
import { queryAgent } from '@/lib/gemini';
import type { AgentType } from '@/lib/types';

const VALID_AGENTS: AgentType[] = ['guide', 'idea', 'pitch', 'code', 'image', 'logo', 'readme', 'coach', 'techstack'];

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ agent: string }> }
) {
    try {
        const { agent } = await params;

        if (!VALID_AGENTS.includes(agent as AgentType)) {
            return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 });
        }

        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const chatHistory = history?.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const response = await queryAgent(agent as AgentType, message, chatHistory);

        return NextResponse.json({ response });
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Agent API Error:', errMsg);
        return NextResponse.json(
            { error: errMsg, fallback: 'The AI agent is currently unavailable. Please check your GEMINI_API_KEY in .env.local and try again.' },
            { status: 500 }
        );
    }
}
