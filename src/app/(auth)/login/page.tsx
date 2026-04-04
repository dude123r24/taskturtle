'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGoogleSignIn() {
        setError(null);
        setLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: '/tasks',
                redirect: false,
            });

            if (!result) {
                setError('No response from the sign-in service. Is the dev server running?');
                return;
            }

            if (result.error) {
                setError(
                    result.error === 'Configuration'
                        ? 'Auth configuration error. Set AUTH_URL and NEXTAUTH_URL to this site’s URL (e.g. https://localhost:3000) and restart the server.'
                        : `Sign-in failed: ${result.error}`,
                );
                return;
            }

            if (result.url) {
                window.location.assign(result.url);
                return;
            }

            setError('Sign-in did not return a redirect URL. Check the browser console and server logs.');
        } catch (e) {
            console.error(e);
            setError(
                e instanceof Error
                    ? e.message
                    : 'Sign-in failed (network or server error). If you use HTTPS locally, open the app at the exact URL in NEXTAUTH_URL.',
            );
        } finally {
            setLoading(false);
        }
    }

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

                        {error && (
                            <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {/* Sign In */}
                        <Button
                            type="button"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            onClick={() => void handleGoogleSignIn()}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #6C63FF, #5A52E0)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7B73FF, #6C63FF)',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                <>
                                    <Box
                                        component="img"
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt=""
                                        sx={{ width: 20, height: 20, mr: 1.5 }}
                                    />
                                    Sign in with Google
                                </>
                            )}
                        </Button>



                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                            <Link href="/privacy" style={{ textDecoration: 'none' }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', textDecoration: 'underline' } }}
                                >
                                    Privacy Policy
                                </Typography>
                            </Link>
                            <Typography variant="caption" color="text.secondary">•</Typography>
                            <Link href="/terms" style={{ textDecoration: 'none' }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', textDecoration: 'underline' } }}
                                >
                                    Terms of Service
                                </Typography>
                            </Link>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
