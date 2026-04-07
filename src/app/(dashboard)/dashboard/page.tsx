'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import {
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    ZAxis,
} from 'recharts';
import { useTaskStore, type Task, type DailyPlan } from '@/store/taskStore';
import { GlassKpiStrip, type GlassKpiItem } from '@/components/dashboard/GlassKpiStrip';
import { DashboardQuickStats } from '@/components/dashboard/DashboardQuickStats';
import { PriorityTaskPath } from '@/components/dashboard/PriorityTaskPath';
import { isPlatformAdmin, tasksDeepLinks } from '@/lib/taskDeepLinks';
import { TodayScheduled } from '@/components/dashboard/TodayScheduled';
import { DashboardBanners } from '@/components/dashboard/DashboardBanners';
import { DashboardLuxuryCanvas } from '@/components/dashboard/DashboardLuxuryCanvas';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';
import type { OverloadInfo } from '@/components/dashboard/types';

const QUADRANT_COLORS = {
    DO_FIRST: '#EF4444',
    SCHEDULE: '#3B82F6',
    DELEGATE: '#F59E0B',
    ELIMINATE: '#9CA3AF',
};

const COMPLETED_CHART_DAYS = 28;

function localYmd(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildCompletedOverTimeSeries(tasks: Task[]) {
    const keys: string[] = [];
    for (let i = COMPLETED_CHART_DAYS - 1; i >= 0; i--) {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() - i);
        keys.push(localYmd(d));
    }
    const counts = new Map<string, number>(keys.map((k) => [k, 0]));
    for (const t of tasks) {
        if (t.status !== 'DONE' || !t.updatedAt) continue;
        const k = localYmd(new Date(t.updatedAt));
        if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return keys.map((k) => {
        const [y, m, day] = k.split('-').map(Number);
        const label = new Date(y, m - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return { date: label, completed: counts.get(k) ?? 0 };
    });
}

export default function DashboardPage() {
    const isLuxury = useLuxuryDashboard();
    const theme = useTheme();
    const { data: session } = useSession();
    const { tasks, isLoading, fetchTasks, patchTask, setEditingTask } = useTaskStore();
    const [overload, setOverload] = useState<OverloadInfo | null>(null);
    const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
    const [showAlert, setShowAlert] = useState(true);
    const [featureRequests, setFeatureRequests] = useState<{ status: string }[]>([]);

    const chartMuted = theme.palette.text.secondary;
    const chartGrid = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.08)';
    const tooltipBg = theme.palette.mode === 'dark' ? '#1a1929' : theme.palette.background.paper;
    const tooltipBorder = theme.palette.divider;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hide = localStorage.getItem('hideDashboardAlert');
            if (hide === 'true') setShowAlert(false);
        }
        fetchTasks();
        fetchTodayPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap
    }, []);

    const fetchFeatureRequests = async () => {
        try {
            const res = await fetch('/api/features');
            if (res.ok) setFeatureRequests(await res.json());
        } catch { /* graceful */ }
    };

    useEffect(() => {
        if (!isPlatformAdmin(session?.user?.email)) {
            setFeatureRequests([]);
            return;
        }
        void fetchFeatureRequests();
    }, [session?.user?.email]);

    const fetchTodayPlan = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`/api/planning/daily?date=${today}`);
            if (res.ok) {
                const data = await res.json();
                setOverload(data.overload);
                setDailyPlan(data.plan ?? null);
            }
        } catch { /* graceful */ }
    };

    const dismissWelcome = () => {
        localStorage.setItem('hideDashboardAlert', 'true');
        setShowAlert(false);
    };

    const activeCount = tasks.filter((t) => t.status !== 'DONE' && t.status !== 'ARCHIVED').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;
    const chasePct =
        tasks.length > 0 ? Math.round((tasks.filter((t) => t.isChase).length / tasks.length) * 100) : 0;
    const pendingFeatures = featureRequests.filter((fr) => fr.status === 'NEW' || fr.status === 'PLANNED').length;

    const showAdminInsights = isPlatformAdmin(session?.user?.email);

    const kpiItems = useMemo((): GlassKpiItem[] => {
        const base: GlassKpiItem[] = [
            { label: 'Active tasks', value: activeCount, href: tasksDeepLinks.active },
            { label: 'Completed', value: doneCount, accent: '#6EE7B7', href: tasksDeepLinks.done },
            { label: 'Chase rate', value: `${chasePct}%`, accent: '#FCD34D', href: tasksDeepLinks.chase },
        ];
        if (showAdminInsights) {
            base.push({
                label: 'Features pending',
                value: pendingFeatures,
                accent: '#C4B5FD',
                href: tasksDeepLinks.ideas,
            });
        }
        return base;
    }, [activeCount, chasePct, doneCount, pendingFeatures, showAdminInsights]);

    const planTasks = dailyPlan?.tasks ?? [];

    const completedOverTime = useMemo(() => buildCompletedOverTimeSeries(tasks), [tasks]);

    const insightCardSx = isLuxury
        ? {
            ...frostedLuxury.panelDense,
            backgroundColor: 'rgba(255, 252, 247, 0.42)',
        }
        : {};

    if (isLoading) {
        const skeleton = (
            <Stack spacing={3}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
                </Box>
            </Stack>
        );
        return isLuxury ? <DashboardLuxuryCanvas>{skeleton}</DashboardLuxuryCanvas> : skeleton;
    }

    const body = (
        <Stack spacing={2.5}>
            <DashboardBanners showWelcome={showAlert} onDismissWelcome={dismissWelcome} overload={overload} />

            <GlassKpiStrip items={kpiItems} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(280px, 1fr)' },
                    gap: 3,
                    alignItems: 'start',
                }}
            >
                <PriorityTaskPath
                    tasks={tasks}
                    onComplete={(id) => patchTask(id, { status: 'DONE' })}
                    onSelect={setEditingTask}
                />
                <Stack spacing={2.5} sx={{ minWidth: 0 }}>
                    <DashboardQuickStats tasks={tasks} plannedTodayCount={planTasks.length} />
                    <TodayScheduled planTasks={planTasks} onSelectTask={setEditingTask} />
                </Stack>
            </Box>

            <Box>
                <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" sx={{ mb: 2 }}>
                    Insights
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
                    <Card sx={insightCardSx}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                Upcoming due dates (7 days)
                            </Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <AreaChart
                                        data={Array.from({ length: 7 }).map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + i);
                                            const dateStr = d.toISOString().split('T')[0];
                                            return {
                                                date: d.toLocaleDateString(undefined, { weekday: 'short' }),
                                                tasks: tasks.filter(
                                                    (t) =>
                                                        t.dueDate &&
                                                        t.dueDate.startsWith(dateStr) &&
                                                        t.status !== 'DONE' &&
                                                        t.status !== 'ARCHIVED'
                                                ).length,
                                            };
                                        })}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorTasksLux" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke={chartMuted} tick={{ fill: chartMuted }} />
                                        <YAxis stroke={chartMuted} tick={{ fill: chartMuted }} allowDecimals={false} />
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: 8,
                                            }}
                                            labelStyle={{ color: theme.palette.text.primary }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="tasks"
                                            stroke={theme.palette.primary.main}
                                            fillOpacity={1}
                                            fill="url(#colorTasksLux)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={insightCardSx}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                Tasks completed over time
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Last {COMPLETED_CHART_DAYS} days, by completion date (local time).
                            </Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={completedOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="dashCompletedBars" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.9} />
                                                <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke={chartMuted}
                                            tick={{ fill: chartMuted, fontSize: 10 }}
                                            interval="preserveStartEnd"
                                            tickMargin={6}
                                        />
                                        <YAxis stroke={chartMuted} tick={{ fill: chartMuted }} allowDecimals={false} width={36} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: 8,
                                            }}
                                            labelStyle={{ color: theme.palette.text.primary }}
                                        />
                                        <Bar dataKey="completed" name="Completed" fill="url(#dashCompletedBars)" radius={[4, 4, 0, 0]} maxBarSize={14} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={insightCardSx}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                Focus: estimate vs actual
                            </Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                                        <XAxis
                                            type="number"
                                            dataKey="estimate"
                                            name="Estimated"
                                            unit=" min"
                                            stroke={chartMuted}
                                            tick={{ fill: chartMuted }}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="actual"
                                            name="Actual"
                                            unit=" min"
                                            stroke={chartMuted}
                                            tick={{ fill: chartMuted }}
                                        />
                                        <ZAxis type="number" range={[100, 100]} />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3' }}
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: 8,
                                            }}
                                            labelStyle={{ color: theme.palette.text.primary }}
                                        />
                                        <Scatter
                                            name="Tasks"
                                            data={tasks
                                                .filter((t) => t.estimatedMinutes && t.actualMinutes && t.actualMinutes > 0)
                                                .map((t) => ({
                                                    estimate: t.estimatedMinutes,
                                                    actual: t.actualMinutes,
                                                    name: t.title,
                                                }))}
                                            fill={theme.palette.secondary.main}
                                        />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={insightCardSx}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                By quadrant
                            </Typography>
                            <Box sx={{ height: 300, width: '100%', minHeight: 200 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Do First', value: tasks.filter((t) => t.quadrant === 'DO_FIRST').length, color: QUADRANT_COLORS.DO_FIRST },
                                                { name: 'Schedule', value: tasks.filter((t) => t.quadrant === 'SCHEDULE').length, color: QUADRANT_COLORS.SCHEDULE },
                                                { name: 'Delegate', value: tasks.filter((t) => t.quadrant === 'DELEGATE').length, color: QUADRANT_COLORS.DELEGATE },
                                                { name: 'Eliminate', value: tasks.filter((t) => t.quadrant === 'ELIMINATE').length, color: QUADRANT_COLORS.ELIMINATE },
                                            ].filter((d) => d.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={100}
                                            dataKey="value"
                                        >
                                            {(
                                                [
                                                    { name: 'Do First', value: tasks.filter((t) => t.quadrant === 'DO_FIRST').length, color: QUADRANT_COLORS.DO_FIRST },
                                                    { name: 'Schedule', value: tasks.filter((t) => t.quadrant === 'SCHEDULE').length, color: QUADRANT_COLORS.SCHEDULE },
                                                    { name: 'Delegate', value: tasks.filter((t) => t.quadrant === 'DELEGATE').length, color: QUADRANT_COLORS.DELEGATE },
                                                    { name: 'Eliminate', value: tasks.filter((t) => t.quadrant === 'ELIMINATE').length, color: QUADRANT_COLORS.ELIMINATE },
                                                ].filter((d) => d.value > 0)
                                            ).map((entry, index) => (
                                                <Cell key={`cell-q-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: 8,
                                            }}
                                            itemStyle={{ color: theme.palette.text.primary }}
                                        />
                                        <Legend wrapperStyle={{ color: chartMuted }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Stack>
    );

    return isLuxury ? <DashboardLuxuryCanvas>{body}</DashboardLuxuryCanvas> : body;
}
