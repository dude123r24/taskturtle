'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStats {
    users: {
        total: number;
        newLast7d: number;
        newLast30d: number;
        activeLast7d: number;
    };
    tasks: {
        total: number;
        createdLast7d: number;
        byStatus: Record<string, number>;
        byQuadrant: Record<string, number>;
    };
    features: {
        planner: { totalPlans: number; plansLast7d: number; uniqueUsers: number };
        calendar: { totalAccounts: number; uniqueUsers: number };
        settingsConfigured: number;
    };
    growth: {
        date: string;
        displayDate: string;
        newUsers: number;
        newTasks: number;
    }[];
    userList: {
        id: string;
        name: string | null;
        email: string;
        createdAt: string;
        taskCount: number;
        planCount: number;
        calendarCount: number;
    }[];
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
    color = 'primary.main',
}: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
}) {
    return (
        <Card
            sx={{
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? 'rgba(26, 25, 41, 0.6)'
                        : 'rgba(255,255,255,0.8)',
                border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} sx={{ color, my: 0.5 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ color, opacity: 0.4, mt: 0.5 }}>{icon}</Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function AdminPage() {
    const router = useRouter();
    const theme = useTheme();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 403) {
                setError('Access denied. You are not an admin.');
                setLoading(false);
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch stats');
            setStats(await res.json());
        } catch (e) {
            setError((e as Error).message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" mb={2}>
                    {error}
                </Typography>
                <Button variant="contained" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Box>
        );
    }

    if (!stats) return null;

    const QUADRANT_LABELS: Record<string, string> = {
        DO_FIRST: 'Do First',
        SCHEDULE: 'Schedule',
        DELEGATE: 'Delegate',
        ELIMINATE: 'Eliminate',
    };

    const STATUS_LABELS: Record<string, string> = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        DONE: 'Done',
        ARCHIVED: 'Archived',
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/dashboard')}
                        color="inherit"
                        size="small"
                    >
                        Dashboard
                    </Button>
                    <Typography variant="h4" fontWeight={700}>
                        Admin Portal
                    </Typography>
                    <Chip label="Internal" size="small" color="warning" />
                </Stack>
                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchStats}
                    variant="outlined"
                    size="small"
                >
                    Refresh
                </Button>
            </Stack>

            {/* ── User Metrics ── */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                👥 Users
            </Typography>
            <Grid container spacing={2} mb={4} alignItems="stretch">
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Total Users"
                            value={stats.users.total}
                            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                            color={theme.palette.primary.main}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Active (7d)"
                            value={stats.users.activeLast7d}
                            subtitle={`${stats.users.total > 0 ? Math.round((stats.users.activeLast7d / stats.users.total) * 100) : 0}% of total`}
                            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
                            color="#43A047"
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="New (7d)"
                            value={stats.users.newLast7d}
                            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                            color="#1E88E5"
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="New (30d)"
                            value={stats.users.newLast30d}
                            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                            color="#FB8C00"
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* ── Growth Charts ── */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                📈 30-Day Growth
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 2, background: theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={2}>New Users (Last 30 Days)</Typography>
                        <Box sx={{ height: 250, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.growth} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} />
                                    <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={30} />
                                    <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: theme.palette.mode === 'dark' ? '#1a1929' : '#fff', borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="newUsers" stroke={theme.palette.primary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 2, background: theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={2}>New Tasks (Last 30 Days)</Typography>
                        <Box sx={{ height: 250, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.growth} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} />
                                    <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={30} />
                                    <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: theme.palette.mode === 'dark' ? '#1a1929' : '#fff', borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="newTasks" stroke={theme.palette.success.main} strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Task Metrics ── */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                ✅ Tasks
            </Typography>
            <Grid container spacing={2} mb={2} alignItems="stretch">
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Total Tasks"
                            value={stats.tasks.total}
                            subtitle={`${stats.tasks.createdLast7d} created this week`}
                            icon={<TaskAltIcon sx={{ fontSize: 32 }} />}
                            color={theme.palette.primary.main}
                        />
                    </Box>
                </Grid>
                {Object.entries(stats.tasks.byStatus).map(([status, count]) => (
                    <Grid item xs={6} md={3} key={status} sx={{ display: 'flex' }}>
                        <Box sx={{ width: '100%' }}>
                            <StatCard
                                title={STATUS_LABELS[status] || status}
                                value={count}
                                icon={<TaskAltIcon sx={{ fontSize: 32 }} />}
                                color={
                                    status === 'DONE'
                                        ? '#43A047'
                                        : status === 'ARCHIVED'
                                            ? '#E53935'
                                            : '#FB8C00'
                                }
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Quadrant breakdown */}
            <Stack direction="row" spacing={1} mb={4} flexWrap="wrap" useFlexGap>
                {Object.entries(stats.tasks.byQuadrant).map(([q, count]) => (
                    <Chip
                        key={q}
                        label={`${QUADRANT_LABELS[q] || q}: ${count}`}
                        variant="outlined"
                        size="small"
                    />
                ))}
            </Stack>

            {/* ── Feature Usage ── */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                🧩 Feature Usage
            </Typography>
            <Grid container spacing={2} mb={4} alignItems="stretch">
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Daily Plans"
                            value={stats.features.planner.totalPlans}
                            subtitle={`${stats.features.planner.uniqueUsers} users · ${stats.features.planner.plansLast7d} this week`}
                            icon={<ViewTimelineIcon sx={{ fontSize: 32 }} />}
                            color={theme.palette.primary.main}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Calendars Connected"
                            value={stats.features.calendar.totalAccounts}
                            subtitle={`${stats.features.calendar.uniqueUsers} users`}
                            icon={<CalendarMonthIcon sx={{ fontSize: 32 }} />}
                            color="#1E88E5"
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3} sx={{ display: 'flex' }}>
                    <Box sx={{ width: '100%' }}>
                        <StatCard
                            title="Settings Configured"
                            value={stats.features.settingsConfigured}
                            subtitle={`${stats.users.total > 0 ? Math.round((stats.features.settingsConfigured / stats.users.total) * 100) : 0}% of users`}
                            icon={<TaskAltIcon sx={{ fontSize: 32 }} />}
                            color="#43A047"
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* ── User List ── */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                📋 User Directory
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'rgba(26, 25, 41, 0.6)'
                            : 'rgba(255,255,255,0.8)',
                    border: (theme) =>
                        `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Tasks</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Plans</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Calendars</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.userList.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.name || '—'}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                        {user.email}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={user.taskCount} size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={user.planCount} size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={user.calendarCount} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
}
