'use client';

import Link from 'next/link';
import {
    Timeline as TimelineIcon,
    Schedule as ScheduleIcon,
    AutoAwesome as SparklesIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Box, Container, Typography, Button, Stack, Grid } from '@mui/material';
import { marketingPalette as m } from '@/lib/marketingPalette';

const fontStack = 'var(--font-sans), ui-sans-serif, system-ui, sans-serif';

const LandingPage = () => {
    const features = [
        {
            title: 'Eisenhower Matrix',
            description:
                'Decide what is urgent versus important before your day decides for you. Drag tasks between quadrants as priorities shift.',
            icon: <TimelineIcon sx={{ fontSize: 36, color: m.coral }} />,
        },
        {
            title: 'Unified planning',
            description:
                'Move from matrix to day plan without retyping. Keep a single source of truth from capture to calendar.',
            icon: <ScheduleIcon sx={{ fontSize: 36, color: m.accent }} />,
        },
        {
            title: 'AI-assisted rhythm',
            description:
                'Use Gemini to reflect on workload and calendar so focus blocks stay realistic, not optimistic fiction.',
            icon: <SparklesIcon sx={{ fontSize: 36, color: m.sage }} />,
        },
    ];

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                fontFamily: fontStack,
                bgcolor: m.bg,
                color: m.surface,
                position: 'relative',
                overflowX: 'hidden',
            }}
        >
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 70% 45% at 15% 0%, ${m.sageMuted}, transparent 50%),
            radial-gradient(ellipse 55% 40% at 85% 15%, ${m.accentMuted}, transparent 45%),
            linear-gradient(180deg, ${m.bg} 0%, ${m.bgLift} 40%, ${m.bg} 100%)
          `,
                    pointerEvents: 'none',
                }}
            />
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.035,
                    backgroundImage: `linear-gradient(${m.surface} 1px, transparent 1px), linear-gradient(90deg, ${m.surface} 1px, transparent 1px)`,
                    backgroundSize: '56px 56px',
                    pointerEvents: 'none',
                }}
            />

            <Box
                component="header"
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    py: 2.5,
                    borderBottom: `1px solid ${m.line}`,
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            component={Link}
                            href="/"
                            sx={{
                                fontSize: '1.15rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: m.surface,
                                textDecoration: 'none',
                            }}
                        >
                            Task<span style={{ color: m.accent }}>Turtle</span>
                        </Typography>
                        <Button
                            component={Link}
                            href="/login"
                            variant="outlined"
                            sx={{
                                color: m.surface,
                                borderColor: m.line,
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 2.5,
                                '&:hover': {
                                    borderColor: m.accent,
                                    bgcolor: m.accentMuted,
                                },
                            }}
                        >
                            Sign in
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Box component="section" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 14 }, pb: { xs: 10, md: 14 } }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            component="p"
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: m.sage,
                                mb: 2,
                            }}
                        >
                            Eisenhower · Planner · Focus
                        </Typography>
                        <Typography
                            component="h1"
                            sx={{
                                fontSize: { xs: '2.65rem', sm: '3.5rem', md: '4.25rem' },
                                fontWeight: 800,
                                lineHeight: 1.05,
                                letterSpacing: '-0.035em',
                                mb: 3,
                            }}
                        >
                            Clarity before{' '}
                            <Box component="span" sx={{ color: m.accent }}>
                                velocity.
                            </Box>
                        </Typography>
                        <Typography
                            component="p"
                            sx={{
                                color: m.inkSubtle,
                                mb: 5,
                                maxWidth: 520,
                                mx: 'auto',
                                fontSize: { xs: '1.05rem', md: '1.15rem' },
                                lineHeight: 1.65,
                                fontWeight: 450,
                            }}
                        >
                            TaskTurtle is a quiet system for deciding what matters, scheduling it, and reviewing what actually
                            shipped—not another infinite scroll of unchecked boxes.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                            <Button
                                component={Link}
                                href="/login"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowIcon />}
                                disableElevation
                                sx={{
                                    bgcolor: m.accent,
                                    color: m.ink,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: m.accentHover },
                                }}
                            >
                                Open your workspace
                            </Button>
                            <Button
                                component={Link}
                                href="/login"
                                variant="text"
                                sx={{
                                    color: m.surface,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'rgba(244,240,232,0.06)' },
                                }}
                            >
                                Google sign-in →
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            <Box
                component="section"
                sx={{
                    py: { xs: 10, md: 12 },
                    borderTop: `1px solid ${m.line}`,
                    bgcolor: 'rgba(0,0,0,0.2)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        component="p"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: m.accent,
                            textAlign: 'center',
                            mb: 1.5,
                        }}
                    >
                        How it works
                    </Typography>
                    <Typography
                        component="h2"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: { xs: '1.85rem', md: '2.35rem' },
                            letterSpacing: '-0.02em',
                            mb: 6,
                            maxWidth: 520,
                            mx: 'auto',
                        }}
                    >
                        One loop: decide, schedule, do, review.
                    </Typography>

                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box
                                    sx={{
                                        p: 3.5,
                                        height: '100%',
                                        borderRadius: 3,
                                        bgcolor: 'rgba(244,240,232,0.04)',
                                        border: `1px solid ${m.line}`,
                                        transition: 'border-color 0.2s, background-color 0.2s',
                                        '&:hover': {
                                            bgcolor: 'rgba(244,240,232,0.07)',
                                            borderColor: 'rgba(201, 162, 39, 0.25)',
                                        },
                                    }}
                                >
                                    <Box sx={{ mb: 2.5 }}>{feature.icon}</Box>
                                    <Typography component="h3" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 1.5, letterSpacing: '-0.02em' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography component="p" sx={{ color: m.inkSubtle, lineHeight: 1.65, fontSize: '0.95rem' }}>
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box component="section" sx={{ py: { xs: 10, md: 14 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.25rem' }, mb: 3, letterSpacing: '-0.02em' }}>
                                Lists don’t fail—priorities do.
                            </Typography>
                            <Typography component="p" sx={{ color: m.inkSubtle, mb: 4, fontSize: '1.05rem', lineHeight: 1.75 }}>
                                When every task looks equal, everything feels urgent. TaskTurtle makes the tradeoffs visible so you
                                can protect deep work and still handle what’s on fire.
                            </Typography>
                            <Stack spacing={1.75}>
                                {[
                                    'Sort the matrix before you open email',
                                    'Drag today’s plan from real priorities',
                                    'Log time to sharpen estimates over weeks',
                                    'Glance at analytics without leaving flow',
                                ].map((item, i) => (
                                    <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                                        <CheckCircleIcon sx={{ color: m.sage, fontSize: 22, mt: 0.15, flexShrink: 0 }} />
                                        <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>{item}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    p: 2,
                                    border: `1px solid ${m.line}`,
                                    background: `linear-gradient(145deg, rgba(95,143,114,0.12) 0%, rgba(201,162,39,0.08) 50%, rgba(196,92,74,0.06) 100%)`,
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        minHeight: 280,
                                        bgcolor: 'rgba(244,240,232,0.06)',
                                        border: `1px dashed ${m.line}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 1,
                                        py: 6,
                                        px: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 1,
                                            maxWidth: 200,
                                            width: '100%',
                                        }}
                                    >
                                        {[m.coral, m.accent, m.sage, m.inkSubtle].map((c, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    aspectRatio: '1',
                                                    borderRadius: 1.5,
                                                    bgcolor: `${c}22`,
                                                    border: `1px solid ${c}44`,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography sx={{ color: m.inkSubtle, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', mt: 1 }}>
                                        MATRIX PREVIEW
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box component="section" sx={{ pb: { xs: 10, md: 14 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="md">
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: { xs: 5, md: 7 },
                            borderRadius: 3,
                            border: `1px solid ${m.line}`,
                            background: `linear-gradient(180deg, rgba(201,162,39,0.08) 0%, transparent 100%)`,
                        }}
                    >
                        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, mb: 2, letterSpacing: '-0.02em' }}>
                            Ready when you are.
                        </Typography>
                        <Typography component="p" sx={{ color: m.inkSubtle, mb: 4, fontSize: '1.05rem', lineHeight: 1.65 }}>
                            Sign in with Google and land straight on your tasks.
                        </Typography>
                        <Button
                            component={Link}
                            href="/login"
                            variant="contained"
                            size="large"
                            disableElevation
                            sx={{
                                bgcolor: m.surface,
                                color: m.ink,
                                px: 5,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 800,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { bgcolor: m.surface2 },
                            }}
                        >
                            Sign in to start
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 5,
                    borderTop: `1px solid ${m.line}`,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Container>
                    <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 2 }}>
                        <Link href="/privacy" style={{ textDecoration: 'none' }}>
                            <Typography sx={{ color: m.inkSubtle, fontSize: '0.875rem', '&:hover': { color: m.surface } }}>
                                Privacy
                            </Typography>
                        </Link>
                        <Link href="/terms" style={{ textDecoration: 'none' }}>
                            <Typography sx={{ color: m.inkSubtle, fontSize: '0.875rem', '&:hover': { color: m.surface } }}>
                                Terms
                            </Typography>
                        </Link>
                    </Stack>
                    <Typography sx={{ color: m.inkMuted, fontSize: '0.8rem' }}>© {new Date().getFullYear()} TaskTurtle</Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
