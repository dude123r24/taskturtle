'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import type { Task } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';
import { tasksDeepLinks } from '@/lib/taskDeepLinks';

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
 * Productivity snapshot with deep links into filtered Tasks views.
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

    const rows: { label: string; value: number; emphasize?: 'warn'; href: string }[] = [
        { label: 'Due today', value: dueToday, href: tasksDeepLinks.dueToday },
        { label: 'Overdue', value: overdue, emphasize: overdue > 0 ? 'warn' : undefined, href: tasksDeepLinks.overdue },
        { label: 'Do first (open)', value: doFirstOpen, href: tasksDeepLinks.doFirst },
        { label: 'Today plan items', value: plannedTodayCount, href: '/planner' },
        { label: 'Backlog (unassigned)', value: backlogOpen, href: tasksDeepLinks.backlog },
    ];

    return (
        <Box
            sx={{
                width: '100%',
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
                    <Box
                        key={row.label}
                        component={Link}
                        href={row.href}
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block',
                            borderRadius: 1,
                            mx: -0.5,
                            px: 0.5,
                            py: 0.25,
                            transition: 'background-color 0.15s ease',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
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
