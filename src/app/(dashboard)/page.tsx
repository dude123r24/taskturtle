'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTaskStore } from '@/store/taskStore';
import EisenhowerMatrix from '@/components/tasks/EisenhowerMatrix';
import TaskCard from '@/components/tasks/TaskCard';

interface CalendarEvent {
    id: string;
    summary: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}

interface OverloadInfo {
    taskCount: number;
    maxDaily: number;
    isOverloaded: boolean;
    totalMinutes: number;
    maxDailyMinutes: number;
    isTimeOverloaded: boolean;
}

export default function DashboardPage() {
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [overload, setOverload] = useState<OverloadInfo | null>(null);
    const [todayTasks, setTodayTasks] = useState<typeof tasks>([]);

    useEffect(() => {
        fetchTasks();
        fetchTodayPlan();
        fetchCalendarEvents();
    }, []);

    const fetchTodayPlan = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`/api/planning/daily?date=${today}`);
            if (res.ok) {
                const data = await res.json();
                setOverload(data.overload);
                if (data.plan?.tasks) {
                    setTodayTasks(data.plan.tasks.map((pt: { task: typeof tasks[0] }) => pt.task));
                }
            }
        } catch { /* graceful degradation */ }
    };

    const fetchCalendarEvents = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`/api/calendar/events?date=${today}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setCalendarEvents(data);
            }
        } catch { /* graceful degradation */ }
    };

    const formatEventTime = (event: CalendarEvent) => {
        const start = event.start?.dateTime;
        if (!start) return 'All day';
        return new Date(start).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Stack spacing={3}>
                <Skeleton variant="rectangular" height={40} width={200} sx={{ borderRadius: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                    ))}
                </Box>
            </Stack>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Overload Warning */}
            {overload?.isOverloaded && (
                <Alert
                    severity="warning"
                    icon={<WarningAmberIcon />}
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(251, 140, 0, 0.1)',
                        border: '1px solid rgba(251, 140, 0, 0.3)',
                    }}
                >
                    You have {overload.taskCount} tasks planned for today (max: {overload.maxDaily}).
                    Consider deferring some tasks to stay focused.
                </Alert>
            )}
            {overload?.isTimeOverloaded && (
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(229, 57, 53, 0.1)',
                        border: '1px solid rgba(229, 57, 53, 0.3)',
                    }}
                >
                    Today&apos;s tasks total {Math.round(overload.totalMinutes / 60)}h
                    (max: {Math.round(overload.maxDailyMinutes / 60)}h). You&apos;re overcommitted!
                </Alert>
            )}

            {/* Eisenhower Matrix */}
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Eisenhower Matrix
                </Typography>
                <EisenhowerMatrix tasks={tasks} />
            </Box>

            {/* Bottom row: Today's Focus + Calendar */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                }}
            >
                {/* Today's Focus */}
                <Card
                    sx={{
                        background: 'rgba(26, 25, 41, 0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                📋 Today&apos;s Focus
                            </Typography>
                            <Chip
                                label={`${todayTasks.length} tasks`}
                                size="small"
                                color={overload?.isOverloaded ? 'warning' : 'default'}
                            />
                        </Stack>
                        <Stack spacing={1}>
                            {todayTasks.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}
                                >
                                    No tasks planned for today. Visit the Planner to set up your day.
                                </Typography>
                            ) : (
                                todayTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} compact />
                                ))
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Calendar Events */}
                <Card
                    sx={{
                        background: 'rgba(26, 25, 41, 0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                🗓️ Calendar
                            </Typography>
                            <Chip
                                label={`${calendarEvents.length} events`}
                                size="small"
                            />
                        </Stack>
                        <Stack spacing={1}>
                            {calendarEvents.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}
                                >
                                    No calendar events today, or sign in to connect Google Calendar.
                                </Typography>
                            ) : (
                                calendarEvents.map((event) => (
                                    <Box
                                        key={event.id}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(30, 136, 229, 0.08)',
                                            border: '1px solid rgba(30, 136, 229, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <CalendarTodayIcon
                                            sx={{ fontSize: '1rem', color: 'info.main' }}
                                        />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight={500} noWrap>
                                                {event.summary}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatEventTime(event)}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Stack>
    );
}
