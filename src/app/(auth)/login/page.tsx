'use client';

import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function LoginPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 60%), #0F0E17',
            }}
        >
            <Card
                sx={{
                    maxWidth: 440,
                    width: '100%',
                    mx: 2,
                    p: 2,
                    background: 'rgba(26, 25, 41, 0.8)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <CardContent>
                    <Stack spacing={4} alignItems="center">
                        {/* Logo / Brand */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 1,
                                }}
                            >
                                TaskTurtle
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Focus on what matters. Get things done.
                            </Typography>
                        </Box>

                        {/* Eisenhower Matrix Preview */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 1,
                                width: '100%',
                                maxWidth: 280,
                            }}
                        >
                            {[
                                { label: 'Do First', color: '#E53935', emoji: '🔴' },
                                { label: 'Schedule', color: '#1E88E5', emoji: '📅' },
                                { label: 'Delegate', color: '#FB8C00', emoji: '👥' },
                                { label: 'Eliminate', color: '#757575', emoji: '🗑️' },
                            ].map((q) => (
                                <Box
                                    key={q.label}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        border: `1px solid ${q.color}33`,
                                        background: `${q.color}0D`,
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        color: q.color,
                                        fontWeight: 500,
                                    }}
                                >
                                    {q.emoji} {q.label}
                                </Box>
                            ))}
                        </Box>

                        {/* Sign In */}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #6C63FF, #5A52E0)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7B73FF, #6C63FF)',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt=""
                                sx={{ width: 20, height: 20, mr: 1.5 }}
                            />
                            Sign in with Google
                        </Button>

                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Works with your corporate Google account &amp; security key
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
