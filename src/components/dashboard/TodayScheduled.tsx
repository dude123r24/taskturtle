'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import type { DailyPlanTask } from '@/store/taskStore';
import type { Task } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';
import { QUADRANT_LABELS } from '@/lib/utils';

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
    const theme = useTheme();
    const isLuxury = useLuxuryDashboard();
    const isDark = theme.palette.mode === 'dark';

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
                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26, 26, 26, 0.14)',
                                backgroundColor: isDark ? 'rgba(30, 30, 40, 0.5)' : 'rgba(255, 252, 247, 0.4)',
                            }
                            : {
                                bgcolor: isDark ? 'action.hover' : 'rgba(249, 245, 235, 0.9)',
                                border: '1px dashed',
                                borderColor: 'divider',
                            }),
                    }}
                >
                    <Typography variant="body2" color="text.primary" fontWeight={500} textAlign="center" sx={{ opacity: 0.92 }}>
                        Nothing on today&apos;s plan.{' '}
                        <MuiLink component={Link} href="/planner" fontWeight={700} underline="hover">
                            Open the planner
                        </MuiLink>{' '}
                        to assign tasks.
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {planTasks.map((pt) => {
                const slot = formatSlot(pt.timeSlotStart, pt.timeSlotEnd);
                const t = pt.task;
                return (
                    <Box
                        key={pt.id}
                        onClick={() => onSelectTask(t)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectTask(t);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Task: ${t.title}`}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            borderLeft: `6px solid ${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}`,
                            cursor: 'pointer',
                            transition: 'background 0.18s',
                            ...(isLuxury
                                ? {
                                    ...frostedLuxury.panelDense,
                                    backgroundColor: `${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}0A`,
                                    '&:hover': {
                                        backgroundColor: `${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}14`,
                                        boxShadow: '0 6px 18px rgba(48, 32, 90, 0.07)',
                                    },
                                }
                                : {
                                    bgcolor: `${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}0A`,
                                    border: '1px solid rgba(26, 26, 26, 0.06)',
                                    borderLeft: `6px solid ${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}`,
                                    '&:hover': { bgcolor: `${QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E'}14` },
                                }),
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {slot && (
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: '0.02em' }}
                                >
                                    {slot}
                                </Typography>
                            )}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    color: QUADRANT_LABELS[t.quadrant]?.color || '#9E9E9E',
                                }}
                            >
                                {QUADRANT_LABELS[t.quadrant]?.label || 'Backlog'}
                            </Typography>
                        </Box>
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
