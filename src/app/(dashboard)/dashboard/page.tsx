'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTaskStore, type Task } from '@/store/taskStore';
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

interface OverloadInfo {
    taskCount: number;
    maxDaily: number;
    isOverloaded: boolean;
    totalMinutes: number;
    maxDailyMinutes: number;
    isTimeOverloaded: boolean;
}

function ChaseList({ tasks }: { tasks: Task[] }) {
    const { patchTask, setEditingTask } = useTaskStore();
    const chaseTasks = tasks.filter((t) => t.isChase && t.status !== 'ARCHIVED' && t.status !== 'DONE');

    if (chaseTasks.length === 0) return null;

    return (
        <Card
            sx={{
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(255, 109, 0, 0.08), rgba(26, 25, 41, 0.6))'
                        : 'linear-gradient(135deg, rgba(255, 109, 0, 0.05), rgba(255,255,255,0.8))',
                border: '1px solid rgba(255, 109, 0, 0.15)',
                borderRadius: 3,
            }}
        >
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <DirectionsRunIcon sx={{ color: '#FF6D00', fontSize: '1.5rem' }} />
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#FF6D00' }}>
                        Chase List
                    </Typography>
                    <Chip
                        label={chaseTasks.length}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,109,0,0.15)', color: '#FF6D00', fontWeight: 700 }}
                    />
                </Stack>

                <Stack spacing={1}>
                    {chaseTasks.map((task) => (
                        <Box
                            key={task.id}
                            onClick={() => setEditingTask(task)}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                border: (theme) =>
                                    `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                '&:hover': {
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark' ? 'rgba(255,109,0,0.08)' : 'rgba(255,109,0,0.04)',
                                    borderColor: 'rgba(255,109,0,0.25)',
                                },
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {task.title}
                                    </Typography>
                                    {task.updates && task.updates.length > 0 && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: 'block',
                                                mt: 0.5,
                                                fontSize: '0.7rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            📝 {task.updates[0].content}
                                        </Typography>
                                    )}
                                </Box>
                                <Stack direction="row" spacing={0}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            patchTask(task.id, { status: 'DONE' });
                                        }}
                                        sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'success.main' } }}
                                    >
                                        <CheckCircleOutlineIcon sx={{ fontSize: '1.1rem' }} />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const theme = useTheme();
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const [overload, setOverload] = useState<OverloadInfo | null>(null);
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hide = localStorage.getItem('hideDashboardAlert');
            if (hide === 'true') setShowAlert(false);
        }
        fetchTasks();
        fetchTodayPlan();
    }, []);

    const fetchTodayPlan = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`/api/planning/daily?date=${today}`);
            if (res.ok) {
                const data = await res.json();
                setOverload(data.overload);
            }
        } catch { /* graceful degradation */ }
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
                        bgcolor: (theme) => `${theme.palette.primary.main}0D`,
                        border: (theme) => `1px solid ${theme.palette.primary.main}26`,
                        '& .MuiAlert-icon': { color: 'primary.main' },
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Welcome to your Priority Dashboard! 🚀
                    </Typography>
                    <Typography variant="body2">
                        Welcome to your Analytics Dashboard! Here you can get a high-level overview of your
                        priorities, time allocation, and any overload warnings to help you stay focused.
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

            {/* Chase List */}
            <ChaseList tasks={tasks} />

            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Analytics & Insights
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {/* Chart 1: Quadrant Distribution */}
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Task Distribution</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
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
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Time: Planned vs Actual (Minutes)</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
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
                                        <Bar dataKey="planned" fill={theme.palette.primary.main} name="Planned (min)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="actual" fill={theme.palette.secondary.main} name="Actual (min)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Stack>
    );
}
