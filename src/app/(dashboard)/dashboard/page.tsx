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
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    ZAxis,
    LineChart,
    Line,
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

    const [featureRequests, setFeatureRequests] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hide = localStorage.getItem('hideDashboardAlert');
            if (hide === 'true') setShowAlert(false);
        }
        fetchTasks();
        fetchTodayPlan();
        fetchFeatureRequests();
    }, []);

    const fetchFeatureRequests = async () => {
        try {
            const res = await fetch('/api/ideas');
            if (res.ok) setFeatureRequests(await res.json());
        } catch { /* graceful */ }
    };

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

                {/* KPI Cards Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Total Active Tasks</Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>{tasks.filter(t => t.status !== 'DONE' && t.status !== 'ARCHIVED').length}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Tasks Completed</Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: 'success.main' }}>{tasks.filter(t => t.status === 'DONE').length}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Chase Rate (Blocked)</Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: '#FF6D00' }}>
                                {tasks.length > 0 ? Math.round((tasks.filter(t => t.isChase).length / tasks.length) * 100) : 0}%
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Pending Feature Ideas</Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: 'primary.main' }}>
                                {featureRequests.filter(fr => fr.status === 'NEW' || fr.status === 'PLANNED').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Charts Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>

                    {/* Chart 1: Due Date Velocity (Area) */}
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Upcoming Due Date Velocity (7 Days)</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <AreaChart
                                        data={Array.from({ length: 7 }).map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + i);
                                            const dateStr = d.toISOString().split('T')[0];
                                            return {
                                                date: d.toLocaleDateString(undefined, { weekday: 'short' }),
                                                tasks: tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr) && t.status !== 'DONE' && t.status !== 'ARCHIVED').length
                                            };
                                        })}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                        <Area type="monotone" dataKey="tasks" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorTasks)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Chart 2: Feature Request Pipeline (Donut) */}
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Feature Request Pipeline</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                {featureRequests.length === 0 ? (
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography color="text.secondary" fontStyle="italic">No feature requests found.</Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'New', value: featureRequests.filter(fr => fr.status === 'NEW').length, color: '#3B82F6' },
                                                    { name: 'Planned', value: featureRequests.filter(fr => fr.status === 'PLANNED').length, color: '#F59E0B' },
                                                    { name: 'In Progress', value: featureRequests.filter(fr => fr.status === 'IN_PROGRESS').length, color: '#8B5CF6' },
                                                    { name: 'Completed', value: featureRequests.filter(fr => fr.status === 'COMPLETED').length, color: '#10B981' },
                                                    { name: 'Rejected', value: featureRequests.filter(fr => fr.status === 'REJECTED').length, color: '#EF4444' },
                                                ].filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {
                                                    [
                                                        { color: '#3B82F6' },
                                                        { color: '#F59E0B' },
                                                        { color: '#8B5CF6' },
                                                        { color: '#10B981' },
                                                        { color: '#EF4444' },
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
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Chart 3: Focus Session Efficiency (Scatter) */}
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Focus Efficiency (Estimated vs Actual)</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis type="number" dataKey="estimate" name="Estimated Time" unit=" min" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis type="number" dataKey="actual" name="Actual Time" unit=" min" stroke="rgba(255,255,255,0.5)" />
                                        <ZAxis type="number" range={[100, 100]} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                        <Scatter
                                            name="Tasks"
                                            data={tasks.filter(t => t.estimatedMinutes && t.actualMinutes && t.actualMinutes > 0).map(t => ({
                                                estimate: t.estimatedMinutes,
                                                actual: t.actualMinutes,
                                                name: t.title
                                            }))}
                                            fill={theme.palette.secondary.main}
                                            shape="circle"
                                        />
                                        {/* Reference line for 1:1 perfect estimation */}
                                        <Line dataKey="actual" data={[{ estimate: 0, actual: 0 }, { estimate: 120, actual: 120 }]} stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Chart 4: Quadrant Distribution (Pie) */}
                    <Card sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={3}>Task Distribution by Quadrant</Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Do First', value: tasks.filter(t => t.quadrant === 'DO_FIRST').length, color: QUADRANT_COLORS['DO_FIRST'] },
                                                { name: 'Schedule', value: tasks.filter(t => t.quadrant === 'SCHEDULE').length, color: QUADRANT_COLORS['SCHEDULE'] },
                                                { name: 'Delegate', value: tasks.filter(t => t.quadrant === 'DELEGATE').length, color: QUADRANT_COLORS['DELEGATE'] },
                                                { name: 'Eliminate', value: tasks.filter(t => t.quadrant === 'ELIMINATE').length, color: QUADRANT_COLORS['ELIMINATE'] },
                                            ].filter(d => d.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={100}
                                            dataKey="value"
                                        >
                                            {
                                                [
                                                    { color: QUADRANT_COLORS['DO_FIRST'] },
                                                    { color: QUADRANT_COLORS['SCHEDULE'] },
                                                    { color: QUADRANT_COLORS['DELEGATE'] },
                                                    { color: QUADRANT_COLORS['ELIMINATE'] },
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
                </Box>
            </Box>
        </Stack>
    );
}
