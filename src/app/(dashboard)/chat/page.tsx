'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const QUICK_PROMPTS = [
    "What's my day look like today?",
    'Find me focus time today',
    'Show my active tasks',
    'What should I do first?',
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: text.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    history: messages,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages([
                    ...newMessages,
                    { role: 'model', text: data.response },
                ]);
            } else {
                setMessages([
                    ...newMessages,
                    {
                        role: 'model',
                        text: 'Sorry, I ran into an issue. Please try again.',
                    },
                ]);
            }
        } catch {
            setMessages([
                ...newMessages,
                {
                    role: 'model',
                    text: 'Network error. Please check your connection and try again.',
                },
            ]);
        }

        setIsLoading(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 120px)',
                maxHeight: 'calc(100vh - 120px)',
            }}
        >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SmartToyIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h5" fontWeight={600}>
                    AI Assistant
                </Typography>
                <Chip
                    label="Gemini 2.0"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(108, 99, 255, 0.15)',
                        color: 'primary.main',
                        fontSize: '0.7rem',
                    }}
                />
            </Stack>

            {/* Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    mb: 2,
                    pr: 1,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 3,
                    },
                }}
            >
                {messages.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 3,
                        }}
                    >
                        <SmartToyIcon
                            sx={{ fontSize: 64, color: 'rgba(108, 99, 255, 0.3)' }}
                        />
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Hi! I&apos;m your TaskTurtle assistant.
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            maxWidth={400}
                        >
                            I can help you understand your calendar, find focus time,
                            manage tasks, and plan your day. Try one of these:
                        </Typography>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                            justifyContent="center"
                        >
                            {QUICK_PROMPTS.map((prompt) => (
                                <Chip
                                    key={prompt}
                                    label={prompt}
                                    variant="outlined"
                                    onClick={() => sendMessage(prompt)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderColor: 'rgba(108, 99, 255, 0.3)',
                                        '&:hover': {
                                            bgcolor: 'rgba(108, 99, 255, 0.1)',
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {messages.map((msg, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                    flexDirection:
                                        msg.role === 'user'
                                            ? 'row-reverse'
                                            : 'row',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor:
                                            msg.role === 'user'
                                                ? 'rgba(108, 99, 255, 0.2)'
                                                : 'rgba(255, 101, 132, 0.2)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {msg.role === 'user' ? (
                                        <PersonIcon
                                            sx={{
                                                fontSize: 18,
                                                color: 'primary.main',
                                            }}
                                        />
                                    ) : (
                                        <SmartToyIcon
                                            sx={{
                                                fontSize: 18,
                                                color: 'secondary.main',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: '75%',
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor:
                                            msg.role === 'user'
                                                ? 'rgba(108, 99, 255, 0.12)'
                                                : 'rgba(255, 255, 255, 0.04)',
                                        border: `1px solid ${msg.role === 'user'
                                            ? 'rgba(108, 99, 255, 0.2)'
                                            : 'rgba(255, 255, 255, 0.06)'
                                            }`,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: 1.7,
                                            '& strong': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}

                        {isLoading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(255, 101, 132, 0.2)',
                                    }}
                                >
                                    <SmartToyIcon
                                        sx={{
                                            fontSize: 18,
                                            color: 'secondary.main',
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress
                                        size={16}
                                        sx={{ color: 'secondary.main' }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Thinking...
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Stack>
                )}
            </Box>

            {/* Input Area */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                }}
            >
                <TextField
                    inputRef={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your day, tasks, or schedule..."
                    multiline
                    maxRows={4}
                    fullWidth
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '0.95rem', px: 1 },
                    }}
                    disabled={isLoading}
                    autoFocus
                />
                <IconButton
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    sx={{
                        bgcolor: input.trim()
                            ? 'rgba(108, 99, 255, 0.2)'
                            : 'transparent',
                        '&:hover': { bgcolor: 'rgba(108, 99, 255, 0.3)' },
                    }}
                >
                    <SendIcon
                        sx={{
                            color: input.trim() ? 'primary.main' : 'text.disabled',
                        }}
                    />
                </IconButton>
            </Box>
        </Box>
    );
}
