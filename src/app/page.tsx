'use client';

import React from 'react';
import Link from 'next/link';
import {
    Timeline as TimelineIcon,
    Schedule as ScheduleIcon,
    AutoAwesome as SparklesIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Grid,
    alpha
} from '@mui/material';

const LandingPage = () => {
    const features = [
        {
            title: "The Eisenhower Matrix",
            description: "Stop reacting, start prioritizing. Filter tasks by urgency and importance to discover what actually moves the needle.",
            icon: <TimelineIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
        },
        {
            title: "Unified Planning",
            description: "Drag and drop your top priorities directly into your daily schedule. Bridge the gap between 'to-do' and 'done'.",
            icon: <ScheduleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
        },
        {
            title: "AI-Powered Assistance",
            description: "Let Gemini analyze your workload and calendar. Automatically find focus blocks and keep your progress on track.",
            icon: <SparklesIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
        },
    ];

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                bgcolor: '#09090E',
                color: 'white',
                position: 'relative',
                overflowX: 'hidden',
                fontFamily: '"Inter", sans-serif'
            }}
        >
            {/* Subtle Gradient Background */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, rgba(108, 99, 255, 0) 70%)',
                    filter: 'blur(100px)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            {/* Navigation Header */}
            <Box component="header" sx={{ position: 'relative', zIndex: 10, py: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            variant="h5"
                            component="div"
                            fontWeight={900}
                            sx={{
                                background: 'linear-gradient(45deg, #6C63FF, #FF6B6B)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-1px'
                            }}
                        >
                            TaskTurtle
                        </Typography>
                        <Link href="/login" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                                    boxShadow: 'none'
                                }}
                            >
                                Sign In
                            </Button>
                        </Link>
                    </Stack>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box component="section" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 16 }, pb: { xs: 10, md: 16 } }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            component="h1"
                            variant="h1"
                            sx={{
                                fontSize: { xs: '3rem', md: '5rem' },
                                fontWeight: 900,
                                lineHeight: 1.1,
                                mb: 3,
                                letterSpacing: '-2px'
                            }}
                        >
                            Master your Focus. <br />
                            Conquer the <Box component="span" sx={{ color: '#6C63FF' }}>Chaos.</Box>
                        </Typography>

                        <Typography
                            component="p"
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.6)',
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                            }}
                        >
                            TaskTurtle isn't just a list. It's a strategic system that combines the Eisenhower Matrix with intelligent scheduling to elevate your productivity.
                        </Typography>

                        <Link href="/login" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowIcon />}
                                sx={{
                                    bgcolor: '#6C63FF',
                                    px: 5,
                                    py: 2,
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: '0 8px 30px rgba(108, 99, 255, 0.4)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        bgcolor: '#5A52D5',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 40px rgba(108, 99, 255, 0.5)',
                                    }
                                }}
                            >
                                Start Organizing Free
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Box component="section" sx={{ py: 12, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <Typography component="h2" variant="overline" sx={{ color: '#6C63FF', fontWeight: 800, letterSpacing: '3px', display: 'block', textAlign: 'center', mb: 2 }}>
                        CORE PILLARS
                    </Typography>
                    <Typography component="h3" variant="h3" align="center" fontWeight={800} sx={{ mb: 8, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                        A system designed for builders.
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        borderRadius: '24px',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        transition: 'background-color 0.3s',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 3 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography component="h4" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography component="p" variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Workflow Section */}
            <Box component="section" sx={{ py: { xs: 12, md: 16 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative' }}>
                                {/* Decorative elements */}
                                <Box sx={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, bgcolor: 'rgba(108, 99, 255, 0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />

                                <Typography component="h2" variant="h3" fontWeight={800} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
                                    Stop writing infinite lists.
                                </Typography>
                                <Typography component="p" variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    Most task managers fail because they treat all tasks equally. TaskTurtle forces you to make decisions early, so execution becomes effortless.
                                </Typography>

                                <Stack spacing={2}>
                                    {['Identify immediate priorities', 'Visual timeline planning', 'Track focused deep work', 'Review progress insights'].map((item, i) => (
                                        <Stack key={i} direction="row" spacing={2} alignItems="center">
                                            <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                                            <Typography variant="body1" fontWeight={500}>{item}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1507925922888-508782a9d80d?auto=format&fit=crop&q=80&w=1200"
                                    alt="Productivity Workspace"
                                    sx={{
                                        width: '100%',
                                        borderRadius: '16px',
                                        display: 'block',
                                        objectFit: 'cover',
                                        aspectRatio: '4/3',
                                        opacity: 0.9
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box component="section" sx={{ pb: 16 }}>
                <Container maxWidth="md">
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: { xs: 6, md: 8 },
                            borderRadius: '32px',
                            background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, rgba(108, 99, 255, 0.05) 100%)',
                            border: '1px solid rgba(108, 99, 255, 0.2)'
                        }}
                    >
                        <Typography component="h2" variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                            Reclaim your time.
                        </Typography>
                        <Typography component="p" variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontSize: '1.1rem' }}>
                            Join the productivity system built for intentional execution.
                        </Typography>
                        <Link href="/login" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'black',
                                    px: 6,
                                    py: 2,
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                }}
                            >
                                Enter Workspace
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 6, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <Container>
                    <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 3 }}>
                        <Link href="/privacy" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>Privacy</Typography>
                        </Link>
                        <Link href="/terms" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>Terms</Typography>
                        </Link>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.2)' }}>
                        © 2026 TaskTurtle. Engineered for focus.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
