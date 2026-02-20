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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTaskStore } from '@/store/taskStore';
import EisenhowerMatrix from '@/components/tasks/EisenhowerMatrix';
import TaskCard from '@/components/tasks/TaskCard';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const QUADRANT_COLORS = {
    DO_FIRST: '#EF4444',    // Red
    SCHEDULE: '#3B82F6',    // Blue
    DELEGATE: '#F59E0B',    // Amber
    ELIMINATE: '#9CA3AF',   // Gray
};

const QUADRANT_LABELS = {
    DO_FIRST: 'Do First',
    SCHEDULE: 'Schedule',
    DELEGATE: 'Delegate',
    ELIMINATE: 'Eliminate',
};

interface CalendarEvent {
    id: string;
    calendarName: string;
    calendarColor: string;
    summary: string;
    isDuplicate: boolean;
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
    const [tabIndex, setTabIndex] = useState(0);
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hide = localStorage.getItem('hideDashboardAlert');
            if (hide === 'true') setShowAlert(false);
        }
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
            const res = await fetch(`/api/calendar/events?date=${today}&hideDuplicates=true`);
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
            {/* Onboarding Info */}
            {showAlert && (
                <Alert
                    severity="info"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                localStorage.setItem('hideDashboardAlert', 'true');
                                setShowAlert(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(108, 99, 255, 0.05)',
                        border: '1px solid rgba(108, 99, 255, 0.15)',
                        '& .MuiAlert-icon': { color: '#6C63FF' },
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Welcome to your Priority Dashboard! 🚀
                    </Typography>
                    <Typography variant="body2">
                        Use the **Eisenhower Matrix** below to organize your tasks by Importance and Urgency.
                        Drag tasks between quadrants to prioritize, then head to the **Planner** to schedule them into your day.
                    </Typography>
                </Alert>
            )}

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

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)}>
                    <Tab label="Priorities" />
                    <Tab label="Analytics & Insights" />
                </Tabs>
            </Box>

            {tabIndex === 0 && (
                <Box>
                    {/* Eisenhower Matrix */}
                    <Box sx={{ mb: 4 }}>
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
                                                    bgcolor: `${event.calendarColor || '#1E88E5'}11`,
                                                    border: `1px solid ${event.calendarColor || '#1E88E5'}33`,
                                                    borderLeft: `3px solid ${event.calendarColor || '#1E88E5'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <CalendarTodayIcon
                                                    sx={{ fontSize: '1rem', color: event.calendarColor || 'info.main' }}
                                                />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight={500} noWrap>
                                                        {event.summary}
                                                    </Typography>
                                                    {event.calendarName && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {event.calendarName}
                                                        </Typography>
                                                    )}
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
                </Box>
            )}

            {tabIndex === 1 && (
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        Analytics & Insights
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        {/* Chart 1: Quadrant Distribution */}
                        <Card sx={{ background: 'rgba(26, 25, 41, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} mb={3}>Task Distribution</Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Do First', value: tasks.filter(t => t.quadrant === 'DO_FIRST').length },
                                                    { name: 'Schedule', value: tasks.filter(t => t.quadrant === 'SCHEDULE').length },
                                                    { name: 'Delegate', value: tasks.filter(t => t.quadrant === 'DELEGATE').length },
                                                    { name: 'Eliminate', value: tasks.filter(t => t.quadrant === 'ELIMINATE').length },
                                                ].filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {
                                                    [
                                                        { name: 'Do First', color: QUADRANT_COLORS['DO_FIRST'] },
                                                        { name: 'Schedule', color: QUADRANT_COLORS['SCHEDULE'] },
                                                        { name: 'Delegate', color: QUADRANT_COLORS['DELEGATE'] },
                                                        { name: 'Eliminate', color: QUADRANT_COLORS['ELIMINATE'] },
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Chart 2: Time Planned vs Focused */}
                        <Card sx={{ background: 'rgba(26, 25, 41, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} mb={3}>Time: Planned vs Actual (Minutes)</Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={[
                                                {
                                                    name: 'Do First',
                                                    planned: tasks.filter(t => t.quadrant === 'DO_FIRST').reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0),
                                                    actual: tasks.filter(t => t.quadrant === 'DO_FIRST').reduce((sum, t) => sum + (t.actualMinutes || 0), 0),
                                                },
                                                {
                                                    name: 'Schedule',
                                                    planned: tasks.filter(t => t.quadrant === 'SCHEDULE').reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0),
                                                    actual: tasks.filter(t => t.quadrant === 'SCHEDULE').reduce((sum, t) => sum + (t.actualMinutes || 0), 0),
                                                }
                                            ]}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                            <YAxis stroke="rgba(255,255,255,0.5)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
                                            />
                                            <Legend />
                                            <Bar dataKey="planned" fill="#6C63FF" name="Planned (min)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="actual" fill="#FF6584" name="Actual (min)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}
        </Stack>
    );
}
