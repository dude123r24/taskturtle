'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTaskStore, type Task } from '@/store/taskStore';
import confetti from 'canvas-confetti';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function FocusPage() {
    const router = useRouter();
    const { tasks, fetchTasks, patchTask, isLoading } = useTaskStore();

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');

    useEffect(() => {
        // Fetch tasks if not loaded
        fetchTasks();
    }, []);

    useEffect(() => {
        // Find top priority task if none is selected
        if (!activeTask && tasks.length > 0) {
            const activeTasks = tasks.filter(t => t.status !== 'DONE' && t.status !== 'ARCHIVED');

            // Priority 1: DO_FIRST
            const doFirst = activeTasks.filter(t => t.quadrant === 'DO_FIRST');
            if (doFirst.length > 0) {
                setActiveTask(doFirst[0]);
                return;
            }

            // Priority 2: SCHEDULE (Short term)
            const schedule = activeTasks.filter(t => t.quadrant === 'SCHEDULE' && t.horizon === 'SHORT_TERM');
            if (schedule.length > 0) {
                setActiveTask(schedule[0]);
                return;
            }

            // Priority 3: Any active task
            if (activeTasks.length > 0) {
                setActiveTask(activeTasks[0]);
            }
        }
    }, [tasks, activeTask]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'work') {
                // Work done, start break
                setMode('break');
                setTimeLeft(BREAK_MINUTES * 60);
                new window.Notification('Pomodoro Complete!', { body: 'Time for a 5 minute break.' });
            } else {
                // Break done, start work
                setMode('work');
                setTimeLeft(WORK_MINUTES * 60);
                new window.Notification('Break Over!', { body: 'Time to focus.' });
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
    };

    const handleCompleteTask = async () => {
        if (!activeTask) return;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6C63FF', '#FF6584']
        });

        await patchTask(activeTask.id, { status: 'DONE' });

        // Timer resets and selects next task
        setActiveTask(null); // will trigger useEffect to find next
        setMode('break');
        setTimeLeft(BREAK_MINUTES * 60);
        setIsActive(false);
    };

    const handleSkipTask = () => {
        const activeTasks = tasks.filter(t => t.status !== 'DONE' && t.status !== 'ARCHIVED' && t.id !== activeTask?.id);
        if (activeTasks.length > 0) {
            const doFirst = activeTasks.filter(t => t.quadrant === 'DO_FIRST');
            if (doFirst.length > 0) setActiveTask(doFirst[0]);
            else setActiveTask(activeTasks[0]);
        } else {
            setActiveTask(null);
        }
        resetTimer();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'work'
        ? ((WORK_MINUTES * 60 - timeLeft) / (WORK_MINUTES * 60)) * 100
        : ((BREAK_MINUTES * 60 - timeLeft) / (BREAK_MINUTES * 60)) * 100;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1300,
                bgcolor: (theme) => theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
            }}
        >
            <IconButton
                onClick={() => router.push('/dashboard')}
                sx={{ position: 'absolute', top: 24, left: 24, color: 'text.secondary' }}
            >
                <CloseIcon fontSize="large" />
            </IconButton>

            {isLoading && !activeTask ? (
                <CircularProgress />
            ) : !activeTask ? (
                <Stack spacing={3} alignItems="center">
                    <Typography variant="h3" fontWeight={700}>All Caught Up! 🎉</Typography>
                    <Typography color="text.secondary">You have no active tasks currently.</Typography>
                    <Button variant="contained" onClick={() => router.push('/tasks')}>
                        Go to Tasks
                    </Button>
                </Stack>
            ) : (
                <Stack spacing={6} alignItems="center" sx={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>

                    {/* Mode indicator */}
                    <Chip
                        label={mode === 'work' ? 'FOCUS TIME' : 'BREAK TIME'}
                        color={mode === 'work' ? 'primary' : 'success'}
                        sx={{ px: 2, py: 2.5, fontSize: '1.2rem', fontWeight: 600, letterSpacing: 2, borderRadius: 8 }}
                    />

                    {/* Task Title */}
                    <Box>
                        <Typography variant="h2" fontWeight={700} sx={{ mb: 2, lineHeight: 1.2 }}>
                            {activeTask.title}
                        </Typography>
                        {activeTask.description && (
                            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                                {activeTask.description}
                            </Typography>
                        )}
                    </Box>

                    {/* Timer */}
                    <Box sx={{ position: 'relative', display: 'inline-flex', my: 4 }}>
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={320}
                            thickness={2}
                            sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={progress}
                            size={320}
                            thickness={2}
                            sx={{
                                color: mode === 'work' ? '#6C63FF' : '#FF6584',
                                position: 'absolute',
                                left: 0,
                                strokeLinecap: 'round'
                            }}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h1" fontWeight={700} sx={{ fontSize: '6rem', letterSpacing: -2 }}>
                                {formatTime(timeLeft)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Controls */}
                    <Stack direction="row" spacing={3}>
                        <IconButton onClick={resetTimer} size="large" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                            <RefreshIcon fontSize="large" />
                        </IconButton>

                        <Fab
                            color={mode === 'work' ? 'primary' : 'secondary'}
                            size="large"
                            onClick={toggleTimer}
                            sx={{ width: 80, height: 80 }}
                        >
                            {isActive ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
                        </Fab>

                        <IconButton onClick={handleSkipTask} size="large" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                            <SkipNextIcon fontSize="large" />
                        </IconButton>
                    </Stack>

                    {/* Complete Button */}
                    <Button
                        variant="outlined"
                        color="success"
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleCompleteTask}
                        sx={{ mt: 4, py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: 8, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                    >
                        Mark Completely Done
                    </Button>
                </Stack>
            )}
        </Box>
    );
}
