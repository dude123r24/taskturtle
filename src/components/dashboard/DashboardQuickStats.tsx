'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import type { Task } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

function todayDateStr() {
    return new Date().toISOString().split('T')[0];
}

function isActiveTask(t: Task) {
    return t.status !== 'DONE' && t.status !== 'ARCHIVED';
}

interface DashboardQuickStatsProps {
    tasks: Task[];
    plannedTodayCount: number;
}

/**
 * Productivity snapshot for the dashboard hero row (replaces nav shortcut tiles).
 * All values are derived from existing task + daily plan data.
 */
export function DashboardQuickStats({ tasks, plannedTodayCount }: DashboardQuickStatsProps) {
    const isLuxury = useLuxuryDashboard();
    const todayStr = todayDateStr();

    const active = tasks.filter(isActiveTask);
    const dueToday = active.filter((t) => t.dueDate && t.dueDate.startsWith(todayStr)).length;
    const overdue = active.filter((t) => {
        if (!t.dueDate) return false;
        const d = t.dueDate.split('T')[0];
        return d < todayStr;
    }).length;
    const doFirstOpen = active.filter((t) => t.quadrant === 'DO_FIRST').length;
    const backlogOpen = active.filter((t) => t.quadrant === 'UNASSIGNED').length;

    const rows: { label: string; value: number; emphasize?: 'warn' }[] = [
        { label: 'Due today', value: dueToday },
        { label: 'Overdue', value: overdue, emphasize: overdue > 0 ? 'warn' : undefined },
        { label: 'Do first (open)', value: doFirstOpen },
        { label: 'Today plan items', value: plannedTodayCount },
        { label: 'Backlog (unassigned)', value: backlogOpen },
    ];

    return (
        <Box
            sx={{
                width: { xs: '100%', md: 220 },
                flexShrink: 0,
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                ...(isLuxury
                    ? { ...frostedLuxury.panelDense, backgroundColor: 'rgba(255, 252, 247, 0.5)' }
                    : {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    }),
            }}
        >
            <Typography
                variant="overline"
                sx={{
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'text.secondary',
                    display: 'block',
                    mb: 2,
                }}
            >
                At a glance
            </Typography>
            <Stack divider={<Divider flexItem sx={{ borderColor: 'divider', opacity: 0.6 }} />} spacing={2}>
                {rows.map((row) => (
                    <Box key={row.label}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            {row.label}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                                color: row.emphasize === 'warn' ? 'error.main' : 'text.primary',
                            }}
                        >
                            {row.value}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
