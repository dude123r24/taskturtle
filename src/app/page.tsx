'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    RocketLaunch as RocketIcon,
    AutoAwesome as SparklesIcon,
    Timeline as TimelineIcon,
    CheckCircle as DoneIcon,
    ArrowForward as ArrowIcon,
    FilterList as FilterIcon,
    Schedule as ScheduleIcon,
    Psychology as AIIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Grid,
    Card,
    CardContent,
    useTheme,
    alpha,
    Divider
} from '@mui/material';

const LandingPage = () => {
    const theme = useTheme();

    const features = [
        {
            title: "Prioritize with Purpose",
            description: "Filter out the noise. Use the Eisenhower Matrix to categorize tasks by urgency and importance, focusing your energy on what truly move the needle.",
            icon: <TimelineIcon sx={{ fontSize: 40, color: '#6C63FF' }} />,
        },
        {
            title: "Intelligent Scheduling",
            description: "Move from 'To-Do' to 'Done'. Our Unified Planner bridges the gap between your backlog and your daily schedule with seamless drag-and-drop.",
            icon: <ScheduleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
        },
        {
            title: "AI-Powered Execution",
            description: "Your digital companion. Gemini analyzes your calendar to find focus blocks, suggests optimal task times, and helps you stay on track.",
            icon: <SparklesIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
        },
    ];

    const steps = [
        {
            number: "01",
            title: "Categorize",
            description: "Drop your tasks into the Matrix. Identify what to do first, what to schedule, and what to delegate."
        },
        {
            number: "02",
            title: "Plan",
            description: "Drag tasks from your backlog into your 'This Week' or 'Today' plan. Visualization is the key to clarity."
        },
        {
            number: "03",
            title: "Execute",
            description: "Let the AI Assistant handle the logistics. Focus on the work, not the management."
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0A0A14',
                color: 'white',
                position: 'relative',
                overflowX: 'hidden'
            }}
        >
            {/* Background Ambience */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-5%',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, rgba(108, 99, 255, 0) 70%)',
                    filter: 'blur(120px)',
                    zIndex: 0,
                }}
            />

            {/* Navbar */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        sx={{
                            background: 'linear-gradient(45deg, #6C63FF, #FF6B6B)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1.5px'
                        }}
                    >
                        TaskTurtle
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Link href="/login" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#6C63FF',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: '10px',
                                    px: 4,
                                    py: 1,
                                    '&:hover': { bgcolor: '#5A52D5' }
                                }}
                            >
                                Get Started
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Container>

            {/* Hero Section */}
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 18 }, pb: 15 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h1"
                        align="center"
                        sx={{
                            fontSize: { xs: '3.5rem', md: '5.5rem' },
                            fontWeight: 900,
                            lineHeight: 1,
                            mb: 4,
                            letterSpacing: '-2px'
                        }}
                    >
                        Control the chaos. <br />
                        Focus on the <span style={{ color: '#6C63FF' }}>signal.</span>
                    </Typography>

                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'rgba(255,255,255,0.5)',
                            mb: 8,
                            maxWidth: '650px',
                            mx: 'auto',
                            fontWeight: 400,
                            lineHeight: 1.6
                        }}
                    >
                        A professional productivity operating system that combines the Eisenhower Matrix with intelligent scheduling to help you reclaim your time.
                    </Typography>

                    <Stack direction="row" justifyContent="center" spacing={3}>
                        <Link href="/login" passHref legacyBehavior>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowIcon />}
                                sx={{
                                    bgcolor: '#6C63FF',
                                    px: 6,
                                    py: 2,
                                    borderRadius: '14px',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    boxShadow: '0 10px 40px rgba(108, 99, 255, 0.3)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        bgcolor: '#5A52D5',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Start for Free
                            </Button>
                        </Link>
                    </Stack>
                </motion.div>
            </Container>

            {/* Features - About Section */}
            <Box sx={{ py: 15, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <Typography variant="overline" sx={{ color: '#6C63FF', fontWeight: 800, letterSpacing: '4px', display: 'block', textAlign: 'center', mb: 2 }}>
                        THE PLATFORM
                    </Typography>
                    <Typography variant="h3" align="center" fontWeight={800} sx={{ mb: 10 }}>
                        Everything you need to <br /> stay in the flow.
                    </Typography>

                    <Grid container spacing={6}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                p: 3,
                                                borderRadius: '24px',
                                                bgcolor: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                mb: 4
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{feature.title}</Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '1.1rem' }}>
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How it Works */}
            <Container maxWidth="lg" sx={{ py: 20 }}>
                <Grid container spacing={10} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <Typography variant="overline" sx={{ color: '#6C63FF', fontWeight: 800, letterSpacing: '4px', display: 'block', mb: 2 }}>
                            WORKFLOW
                        </Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ mb: 4, lineHeight: 1.2 }}>
                            A smarter way <br /> to manage tasks.
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, fontSize: '1.1rem' }}>
                            Unlike traditional lists that just grow, TaskTurtle provides a structured framework to process your input and turn it into action.
                        </Typography>

                        <Stack spacing={4}>
                            {steps.map((step, index) => (
                                <Stack key={index} direction="row" spacing={3}>
                                    <Typography variant="h4" fontWeight={900} sx={{ color: alpha('#6C63FF', 0.2), lineHeight: 1 }}>
                                        {step.number}
                                    </Typography>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{step.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{step.description}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Box
                            sx={{
                                position: 'relative',
                                p: 2,
                                borderRadius: '32px',
                                bgcolor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
                            }}
                        >
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1484480974693-6db0a01adbc3?auto=format&fit=crop&q=80&w=1200"
                                alt="Productivity UI Preview"
                                sx={{
                                    width: '100%',
                                    borderRadius: '24px',
                                    display: 'block',
                                    opacity: 0.8
                                }}
                            />
                            {/* Floating UI micro-component mockup */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: -30,
                                    right: -30,
                                    p: 3,
                                    bgcolor: '#12121F',
                                    borderRadius: '20px',
                                    border: '1px solid #6C63FF',
                                    boxShadow: '0 20px 40px rgba(108, 99, 255, 0.2)',
                                    display: { xs: 'none', md: 'block' }
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <DoneIcon sx={{ color: '#4CAF50' }} />
                                    <Typography variant="subtitle2" fontWeight={700}>Daily Goal Achieved</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Final CTA */}
            <Container maxWidth="md" sx={{ pb: 20, textAlign: 'center' }}>
                <Box
                    sx={{
                        p: { xs: 6, md: 10 },
                        borderRadius: '40px',
                        background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, rgba(108, 99, 255, 0.03) 100%)',
                        border: '1px solid rgba(108, 99, 255, 0.2)'
                    }}
                >
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>Ready to dive in?</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 6, maxWidth: '500px', mx: 'auto' }}>
                        Join a new wave of thinkers who prioritize quality of work over quantity of noise.
                    </Typography>
                    <Link href="/login" passHref legacyBehavior>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                px: 5,
                                py: 2,
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Link>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 10, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 4 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', '&:hover': { color: 'white' } }}>Privacy</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', '&:hover': { color: 'white' } }}>Terms</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', '&:hover': { color: 'white' } }}>Twitter</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.2)' }}>
                    © 2026 TaskTurtle. Precision tools for modern builders.
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;
