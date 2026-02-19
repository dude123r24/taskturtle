import {
    GoogleGenerativeAI,
    SchemaType,
    type FunctionDeclaration,
    type Part,
    type Content,
} from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { listAllCalendarEvents } from '@/lib/google-calendar';

// ─── Gemini Client ───────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are the TaskTurtle AI Assistant — a friendly, concise productivity coach.
You help users understand their day, find focus time, manage tasks, and plan effectively.

Guidelines:
- Be conversational but concise. Use bullet points and emojis sparingly for clarity.
- When showing calendar events, format times clearly (e.g. "9:00 AM – 10:00 AM").
- When suggesting focus time, look for gaps ≥30 minutes between events.
- When creating tasks, confirm what you're creating before doing it.
- Use the Eisenhower Matrix language: Do First (urgent+important), Schedule (important), Delegate (urgent), Eliminate (neither).
- If the user's question doesn't need a tool, just answer directly.
- Keep responses under 200 words unless the user asks for detail.`;

// ─── Function Declarations (Tools for Gemini) ────────────────────────

const toolDeclarations: FunctionDeclaration[] = [
    {
        name: 'getCalendarEvents',
        description:
            'Fetch calendar events for a specific date from all connected Google Calendar accounts. Returns event title, time, calendar name, and color.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                date: {
                    type: SchemaType.STRING,
                    description: 'The date to fetch events for in YYYY-MM-DD format. Defaults to today.',
                },
            },
            required: ['date'],
        },
    },
    {
        name: 'findFocusTime',
        description:
            'Analyze a day\'s calendar events and find available focus time blocks (gaps ≥30 minutes between events). Returns start/end times for each block.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                date: {
                    type: SchemaType.STRING,
                    description: 'The date to analyze in YYYY-MM-DD format.',
                },
                minMinutes: {
                    type: SchemaType.NUMBER,
                    description: 'Minimum focus block duration in minutes. Default 30.',
                },
            },
            required: ['date'],
        },
    },
    {
        name: 'createTask',
        description:
            'Create a new task for the user. Always confirm with the user before calling this.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                title: {
                    type: SchemaType.STRING,
                    description: 'The task title.',
                },
                description: {
                    type: SchemaType.STRING,
                    description: 'Optional task description.',
                },
                quadrant: {
                    type: SchemaType.STRING,
                    description:
                        'Eisenhower quadrant: DO_FIRST (urgent+important), SCHEDULE (important), DELEGATE (urgent), ELIMINATE (neither). Default: SCHEDULE.',
                },
                horizon: {
                    type: SchemaType.STRING,
                    description: 'Time horizon: SHORT_TERM or LONG_TERM. Default: SHORT_TERM.',
                },
                estimatedMinutes: {
                    type: SchemaType.NUMBER,
                    description: 'Estimated time in minutes.',
                },
            },
            required: ['title', 'quadrant'],
        },
    },
    {
        name: 'listTasks',
        description: 'List user tasks, optionally filtered by status or quadrant.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                status: {
                    type: SchemaType.STRING,
                    description: 'Filter by status: TODO, IN_PROGRESS, DONE, ARCHIVED. Leave empty for all active.',
                },
                quadrant: {
                    type: SchemaType.STRING,
                    description: 'Filter by quadrant: DO_FIRST, SCHEDULE, DELEGATE, ELIMINATE.',
                },
            },
        },
    },
    {
        name: 'updateTaskStatus',
        description: 'Update the status of a task by its ID.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                taskId: {
                    type: SchemaType.STRING,
                    description: 'The task ID to update.',
                },
                status: {
                    type: SchemaType.STRING,
                    description: 'New status: TODO, IN_PROGRESS, DONE, ARCHIVED.',
                },
            },
            required: ['taskId', 'status'],
        },
    },
    {
        name: 'getDayOverview',
        description:
            'Get a complete overview of a day: calendar events, active tasks, total estimated workload, and any overload warnings.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                date: {
                    type: SchemaType.STRING,
                    description: 'The date to overview in YYYY-MM-DD format.',
                },
            },
            required: ['date'],
        },
    },
];

// ─── Tool Execution ──────────────────────────────────────────────────

type ToolArgs = Record<string, unknown>;

async function executeTool(
    userId: string,
    functionName: string,
    args: ToolArgs
): Promise<string> {
    switch (functionName) {
        case 'getCalendarEvents': {
            const date = (args.date as string) || new Date().toISOString().split('T')[0];
            try {
                const events = await listAllCalendarEvents(userId, date);
                if (events.length === 0) {
                    return JSON.stringify({ message: 'No events found for this date.', events: [] });
                }
                return JSON.stringify({
                    date,
                    eventCount: events.length,
                    events: events
                        .filter((e) => !e.isDuplicate)
                        .map((e) => ({
                            summary: e.summary,
                            start: e.start?.dateTime || e.start?.date,
                            end: e.end?.dateTime || e.end?.date,
                            calendar: e.calendarName,
                        })),
                });
            } catch {
                return JSON.stringify({ message: 'Could not fetch calendar events. Calendar may not be connected.' });
            }
        }

        case 'findFocusTime': {
            const date = (args.date as string) || new Date().toISOString().split('T')[0];
            const minMinutes = (args.minMinutes as number) || 30;
            try {
                const events = await listAllCalendarEvents(userId, date);
                const busyBlocks = events
                    .filter((e) => !e.isDuplicate && e.start?.dateTime && e.end?.dateTime)
                    .map((e) => ({
                        start: new Date(e.start!.dateTime!).getTime(),
                        end: new Date(e.end!.dateTime!).getTime(),
                    }))
                    .sort((a, b) => a.start - b.start);

                // Define working hours: 8 AM to 6 PM
                const dayStart = new Date(`${date}T08:00:00`).getTime();
                const dayEnd = new Date(`${date}T18:00:00`).getTime();

                const focusBlocks: { start: string; end: string; minutes: number }[] = [];
                let cursor = dayStart;

                for (const block of busyBlocks) {
                    if (block.start > cursor) {
                        const gapMinutes = (block.start - cursor) / 60000;
                        if (gapMinutes >= minMinutes) {
                            focusBlocks.push({
                                start: new Date(cursor).toISOString(),
                                end: new Date(block.start).toISOString(),
                                minutes: Math.round(gapMinutes),
                            });
                        }
                    }
                    cursor = Math.max(cursor, block.end);
                }

                // Check gap after last event
                if (cursor < dayEnd) {
                    const gapMinutes = (dayEnd - cursor) / 60000;
                    if (gapMinutes >= minMinutes) {
                        focusBlocks.push({
                            start: new Date(cursor).toISOString(),
                            end: new Date(dayEnd).toISOString(),
                            minutes: Math.round(gapMinutes),
                        });
                    }
                }

                return JSON.stringify({
                    date,
                    minMinutes,
                    focusBlocks,
                    totalFocusMinutes: focusBlocks.reduce((sum, b) => sum + b.minutes, 0),
                });
            } catch {
                return JSON.stringify({ message: 'Could not analyze calendar. Calendar may not be connected.', focusBlocks: [] });
            }
        }

        case 'createTask': {
            const task = await prisma.task.create({
                data: {
                    userId,
                    title: args.title as string,
                    description: (args.description as string) || null,
                    quadrant: (args.quadrant as 'DO_FIRST' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE') || 'SCHEDULE',
                    horizon: (args.horizon as 'SHORT_TERM' | 'LONG_TERM') || 'SHORT_TERM',
                    estimatedMinutes: (args.estimatedMinutes as number) || null,
                },
            });
            return JSON.stringify({
                message: 'Task created successfully!',
                task: { id: task.id, title: task.title, quadrant: task.quadrant },
            });
        }

        case 'listTasks': {
            const where: Record<string, unknown> = { userId };
            if (args.status) {
                where.status = args.status;
            } else {
                where.status = { in: ['TODO', 'IN_PROGRESS'] };
            }
            if (args.quadrant) where.quadrant = args.quadrant;

            const tasks = await prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 20,
            });

            return JSON.stringify({
                taskCount: tasks.length,
                tasks: tasks.map((t) => ({
                    id: t.id,
                    title: t.title,
                    quadrant: t.quadrant,
                    status: t.status,
                    estimatedMinutes: t.estimatedMinutes,
                    dueDate: t.dueDate?.toISOString().split('T')[0],
                })),
            });
        }

        case 'updateTaskStatus': {
            const task = await prisma.task.update({
                where: { id: args.taskId as string },
                data: { status: args.status as 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED' },
            });
            return JSON.stringify({
                message: `Task "${task.title}" updated to ${task.status}.`,
            });
        }

        case 'getDayOverview': {
            const date = (args.date as string) || new Date().toISOString().split('T')[0];

            // Get tasks
            const tasks = await prisma.task.findMany({
                where: { userId, status: { in: ['TODO', 'IN_PROGRESS'] } },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

            const totalEstimatedMinutes = tasks.reduce(
                (sum, t) => sum + (t.estimatedMinutes || 0),
                0
            );

            // Get calendar events
            let calendarEvents: { summary: string; start?: string | null; end?: string | null; calendar: string }[] = [];
            try {
                const events = await listAllCalendarEvents(userId, date);
                calendarEvents = events
                    .filter((e) => !e.isDuplicate)
                    .map((e) => ({
                        summary: e.summary,
                        start: e.start?.dateTime || e.start?.date,
                        end: e.end?.dateTime || e.end?.date,
                        calendar: e.calendarName,
                    }));
            } catch { /* calendar not connected */ }

            // Get settings for overload check
            const settings = await prisma.userSettings.findUnique({
                where: { userId },
            });
            const maxDailyMinutes = settings?.maxDailyMinutes || 480;

            return JSON.stringify({
                date,
                calendarEvents,
                activeTasks: tasks.map((t) => ({
                    id: t.id,
                    title: t.title,
                    quadrant: t.quadrant,
                    status: t.status,
                    estimatedMinutes: t.estimatedMinutes,
                })),
                totalEstimatedMinutes,
                maxDailyMinutes,
                isOverloaded: totalEstimatedMinutes > maxDailyMinutes,
            });
        }

        default:
            return JSON.stringify({ error: `Unknown function: ${functionName}` });
    }
}

// ─── Chat Session ────────────────────────────────────────────────────

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export async function chat(
    userId: string,
    userMessage: string,
    history: ChatMessage[]
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: toolDeclarations }],
    });

    // Build conversation history for Gemini
    const contents: Content[] = history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));

    // Add the new user message
    contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
    });

    // Generate — may include function calls
    let response = await model.generateContent({ contents });
    let result = response.response;

    // Function call loop (max 5 iterations to prevent infinite loops)
    let iterations = 0;
    while (iterations < 5) {
        const functionCalls = result.candidates?.[0]?.content?.parts?.filter(
            (p: Part) => 'functionCall' in p
        );

        if (!functionCalls || functionCalls.length === 0) break;

        // Execute each function call
        for (const part of functionCalls) {
            if (!('functionCall' in part)) continue;
            const fc = part.functionCall!;
            const toolResult = await executeTool(userId, fc.name, fc.args as ToolArgs);

            // Add the function call and result to the conversation
            contents.push({
                role: 'model',
                parts: [{ functionCall: fc }],
            });
            contents.push({
                role: 'function' as 'user',
                parts: [
                    {
                        functionResponse: {
                            name: fc.name,
                            response: { result: JSON.parse(toolResult) },
                        },
                    },
                ],
            });
        }

        // Continue generation with tool results
        response = await model.generateContent({ contents });
        result = response.response;
        iterations++;
    }

    // Extract the final text response
    const textParts = result.candidates?.[0]?.content?.parts?.filter(
        (p: Part) => 'text' in p
    );

    return textParts?.map((p) => ('text' in p ? p.text : '')).join('') || 'I wasn\'t able to process that. Could you try again?';
}
