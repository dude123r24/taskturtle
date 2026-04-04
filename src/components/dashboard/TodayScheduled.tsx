'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import type { DailyPlanTask } from '@/store/taskStore';
import type { Task } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

function formatSlot(start?: string | null, end?: string | null) {
    if (!start && !end) return null;
    const fmt = (s: string) => {
        const d = new Date(s);
        return Number.isNaN(d.getTime())
            ? s
            : d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    };
        if (start && end) return `${fmt(start)} – ${fmt(end)}`;
        if (start) return fmt(start);
        return fmt(end!);
}

interface TodayScheduledProps {
    planTasks: DailyPlanTask[];
    onSelectTask: (task: Task) => void;
}

export function TodayScheduled({ planTasks, onSelectTask }: TodayScheduledProps) {
    const isLuxury = useLuxuryDashboard();

    return (
        <Box
            sx={{
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                height: 'fit-content',
                ...(isLuxury
                    ? frostedLuxury.panel
                    : {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                    }),
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
                    Today
                </Typography>
                <Button component={Link} href="/planner" size="small" sx={{ fontWeight: 700 }}>
                    Planner
                </Button>
            </Box>
            {planTasks.length === 0 ? (
                <Box
                    sx={{
                        py: 3,
                        px: 2,
                        borderRadius: 2,
                        ...(isLuxury
                            ? {
                                ...frostedLuxury.panelDense,
                                borderStyle: 'dashed',
                                borderColor: 'rgba(26, 26, 26, 0.14)',
                                backgroundColor: 'rgba(255, 252, 247, 0.4)',
                            }
                            : {
                                bgcolor: 'rgba(249, 245, 235, 0.8)',
                                border: '1px dashed rgba(26, 26, 26, 0.12)',
                            }),
                    }}
                >
                    <Typography variant="body2" color="text.secondary" fontWeight={500} textAlign="center">
                        Nothing on today&apos;s plan. Open the planner to assign tasks.
                    </Typography>
                </Box>
            ) : (
                <StackedPlan planTasks={planTasks} onSelectTask={onSelectTask} isLuxury={isLuxury} />
            )}
        </Box>
    );
}

function StackedPlan({
    planTasks,
    onSelectTask,
    isLuxury,
}: {
    planTasks: DailyPlanTask[];
    onSelectTask: (task: Task) => void;
    isLuxury: boolean;
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {planTasks.map((pt) => {
                const slot = formatSlot(pt.timeSlotStart, pt.timeSlotEnd);
                const t = pt.task;
                return (
                    <Box
                        key={pt.id}
                        onClick={() => onSelectTask(t)}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'background 0.18s',
                            ...(isLuxury
                                ? {
                                    ...frostedLuxury.panelDense,
                                    backgroundColor: 'rgba(255, 252, 247, 0.52)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 252, 247, 0.72)',
                                        boxShadow: '0 6px 18px rgba(48, 32, 90, 0.07)',
                                    },
                                }
                                : {
                                    bgcolor: 'rgba(255, 252, 247, 0.95)',
                                    border: '1px solid rgba(26, 26, 26, 0.06)',
                                    '&:hover': { bgcolor: 'rgba(107, 70, 193, 0.06)' },
                                }),
                        }}
                    >
                        {slot && (
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: '0.02em' }}
                            >
                                {slot}
                            </Typography>
                        )}
                        <Typography
                            variant="subtitle2"
                            fontWeight={800}
                            sx={{ mt: 0.5, lineHeight: 1.35, color: 'text.primary' }}
                        >
                            {t.title}
                        </Typography>
                        {t.description?.trim() && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.75, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                            >
                                {t.description}
                            </Typography>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
