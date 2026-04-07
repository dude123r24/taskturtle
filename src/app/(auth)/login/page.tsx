'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { marketingPalette as m } from '@/lib/marketingPalette';

const fontStack = 'var(--font-sans), ui-sans-serif, system-ui, sans-serif';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGoogleSignIn() {
        setError(null);
        setLoading(true);
        try {
            const result = await signIn('google', {
                callbackUrl: '/dashboard',
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
            component="main"
            sx={{
                minHeight: '100vh',
                fontFamily: fontStack,
                bgcolor: m.bg,
                color: m.surface,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 80% 50% at 0% -20%, ${m.sageMuted}, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 100%, ${m.accentMuted}, transparent 50%),
            linear-gradient(165deg, ${m.bg} 0%, ${m.bgLift} 45%, ${m.bg} 100%)
          `,
                    pointerEvents: 'none',
                }}
            />
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.04,
                    backgroundImage: `linear-gradient(${m.surface} 1px, transparent 1px), linear-gradient(90deg, ${m.surface} 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                    pointerEvents: 'none',
                }}
            />

            <Grid container sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <Grid
                    item
                    md={5}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        px: { md: 5, lg: 8 },
                        py: 6,
                        borderRight: `1px solid ${m.line}`,
                    }}
                >
                    <Typography
                        component={Link}
                        href="/"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: m.accent,
                            textDecoration: 'none',
                            mb: 4,
                            '&:hover': { color: m.accentHover },
                        }}
                    >
                        ← Back home
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { md: '2.75rem', lg: '3.25rem' },
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                            color: m.surface,
                            mb: 2,
                        }}
                    >
                        Slow is smooth.
                        <Box component="span" sx={{ display: 'block', color: m.sage, mt: 0.5 }}>
                            Smooth is fast.
                        </Box>
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.05rem',
                            lineHeight: 1.65,
                            color: m.inkSubtle,
                            maxWidth: 360,
                            mb: 5,
                        }}
                    >
                        Sign in to your workspace. Priorities, planner, and calendar stay in one calm system.
                    </Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                        {[
                            { label: 'Do first', c: m.coral },
                            { label: 'Schedule', c: m.accent },
                            { label: 'Delegate', c: m.sage },
                            { label: 'Eliminate', c: m.inkSubtle },
                        ].map((q) => (
                            <Box
                                key={q.label}
                                sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 999,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    border: `1px solid ${q.c}55`,
                                    color: q.c,
                                    bgcolor: `${q.c}14`,
                                }}
                            >
                                {q.label}
                            </Box>
                        ))}
                    </Stack>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: { xs: 2, sm: 4 },
                        py: { xs: 4, md: 6 },
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            borderRadius: 3,
                            bgcolor: m.surface,
                            color: m.ink,
                            p: { xs: 3, sm: 4 },
                            boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset',
                        }}
                    >
                        <Stack spacing={3}>
                            <Box>
                                <Typography
                                    component={Link}
                                    href="/"
                                    sx={{
                                        display: { xs: 'inline-block', md: 'none' },
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: m.sage,
                                        textDecoration: 'none',
                                        mb: 2,
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    ← Home
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '1.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '-0.03em',
                                        lineHeight: 1.2,
                                        color: m.ink,
                                    }}
                                >
                                    TaskTurtle
                                </Typography>
                                <Typography sx={{ mt: 1, color: m.inkMuted, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Continue with Google to open your tasks and planner.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="button"
                                variant="contained"
                                size="large"
                                fullWidth
                                disableElevation
                                disabled={loading}
                                onClick={() => void handleGoogleSignIn()}
                                sx={{
                                    py: 1.35,
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    bgcolor: m.ink,
                                    color: m.surface,
                                    '&:hover': { bgcolor: '#1a2420' },
                                    '&:disabled': { bgcolor: m.inkSubtle, color: m.surface2 },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={22} sx={{ color: m.surface }} />
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

                            <Typography variant="caption" sx={{ color: m.inkSubtle, textAlign: 'center', display: 'block' }}>
                                By continuing you agree to our policies below.
                            </Typography>

                            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                                <Link href="/privacy" style={{ textDecoration: 'none' }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: m.inkMuted,
                                            fontWeight: 600,
                                            '&:hover': { color: m.ink, textDecoration: 'underline' },
                                        }}
                                    >
                                        Privacy
                                    </Typography>
                                </Link>
                                <Typography variant="caption" sx={{ color: m.lineOnPaper }}>
                                    ·
                                </Typography>
                                <Link href="/terms" style={{ textDecoration: 'none' }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: m.inkMuted,
                                            fontWeight: 600,
                                            '&:hover': { color: m.ink, textDecoration: 'underline' },
                                        }}
                                    >
                                        Terms
                                    </Typography>
                                </Link>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
