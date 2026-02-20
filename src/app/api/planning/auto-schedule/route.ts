import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { date, tasks, events } = body;

        if (!date || !tasks || !Array.isArray(tasks)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (tasks.length === 0) {
            return NextResponse.json({ schedule: [] });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            taskId: { type: SchemaType.STRING, description: 'The ID of the task' },
                            timeSlotStart: { type: SchemaType.STRING, description: 'ISO 8601 datetime string' },
                            timeSlotEnd: { type: SchemaType.STRING, description: 'ISO 8601 datetime string' },
                        },
                        required: ['taskId', 'timeSlotStart', 'timeSlotEnd'],
                    }
                }
            }
        });

        const workingHoursStart = `${date}T08:00:00`;
        const workingHoursEnd = `${date}T18:00:00`;

        const prompt = `
You are an expert productivity assistant. Your job is to schedule a list of tasks into a user's day.
The day is ${date}. User's working hours are from ${workingHoursStart} to ${workingHoursEnd}.

Here are the user's existing calendar events for the day (DO NOT overlap with these):
${JSON.stringify(events, null, 2)}

Here are the tasks to schedule:
${JSON.stringify(tasks, null, 2)}

Rules:
1. Schedule every task in the list.
2. High priority tasks (quadrant = 'DO_FIRST') should be scheduled earlier in the day.
3. Respect 'estimatedMinutes' for the duration of the task. If null or 0, assume 30 minutes.
4. Return an array of objects mapping each 'taskId' to a 'timeSlotStart' and 'timeSlotEnd'. Both times must be in complete ISO 8601 datetime format matching the ${date} timezone (e.g. "${date}T09:00:00.000Z" but try to use local time matching the events like "${date}T09:00:00").
Wait, use the format: \`${date}T##:##:00\` exactly as the start/end times.
`;

        const response = await model.generateContent(prompt);
        const resultText = response.response.text();
        const schedule = JSON.parse(resultText);

        return NextResponse.json({ schedule });

    } catch (error: any) {
        console.error('Auto-schedule route failed:', error);
        return NextResponse.json({ error: 'AI scheduling failed' }, { status: 500 });
    }
}
