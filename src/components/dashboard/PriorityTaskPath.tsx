'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlagIcon from '@mui/icons-material/Flag';
import type { Task, EisenhowerQuadrant } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

const QUADRANT_LABELS: Record<EisenhowerQuadrant, string> = {
    DO_FIRST: 'Do first',
    SCHEDULE: 'Schedule',
    DELEGATE: 'Delegate',
    ELIMINATE: 'Eliminate',
    UNASSIGNED: 'Unassigned',
};

function formatDue(due?: string) {
    if (!due) return '';
    const d = new Date(due);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function buildSubtitle(task: Task) {
    if (task.description?.trim()) return task.description.trim();
    if (task.updates?.length) return task.updates[0].content;
    const q = QUADRANT_LABELS[task.quadrant] || '';
    const due = formatDue(task.dueDate);
    return [q, due ? `Due ${due}` : ''].filter(Boolean).join(' · ');
}

export function buildPriorityPathTasks(tasks: Task[]): Task[] {
    const active = (t: Task) => t.status !== 'DONE' && t.status !== 'ARCHIVED';
    const chase = tasks.filter((t) => t.isChase && active(t));
    const doFirst = tasks.filter(
        (t) => t.quadrant === 'DO_FIRST' && active(t) && !t.isChase
    );
    const seen = new Set<string>();
    const out: Task[] = [];
    for (const t of chase) {
        if (!seen.has(t.id)) {
            seen.add(t.id);
            out.push(t);
        }
    }
    for (const t of doFirst) {
        if (!seen.has(t.id)) {
            seen.add(t.id);
            out.push(t);
        }
    }
    return out.slice(0, 10);
}

interface PriorityTaskPathProps {
    tasks: Task[];
    onComplete: (id: string) => void;
    onSelect: (task: Task) => void;
}

export function PriorityTaskPath({ tasks, onComplete, onSelect }: PriorityTaskPathProps) {
    const isLuxury = useLuxuryDashboard();

    if (tasks.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    ...(isLuxury
                        ? frostedLuxury.panelDense
                        : {
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                        }),
                }}
            >
                <Typography color="text.secondary" fontWeight={500}>
                    No priority or chase tasks right now. Add tasks from the Tasks page.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                ...(isLuxury
                    ? frostedLuxury.panel
                    : {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                    }),
            }}
        >
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" sx={{ mb: 3 }}>
                Priority path
            </Typography>
            <Box sx={{ position: 'relative', pl: { xs: 3, sm: 4 } }}>
                <Box
                    sx={{
                        position: 'absolute',
                        left: 15,
                        top: 12,
                        bottom: 12,
                        width: 2,
                        borderRadius: 1,
                        bgcolor: 'rgba(107, 70, 193, 0.2)',
                    }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasks.map((task) => (
                        <Box
                            key={task.id}
                            sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'flex-start' }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: -26,
                                    top: 4,
                                    width: 28,
                                    height: 28,
                                    borderRadius: 1,
                                    bgcolor: isLuxury ? 'rgba(255, 252, 247, 0.72)' : 'background.paper',
                                    backdropFilter: isLuxury ? 'blur(8px)' : undefined,
                                    WebkitBackdropFilter: isLuxury ? 'blur(8px)' : undefined,
                                    border: '2px solid',
                                    borderColor: task.isChase ? 'secondary.main' : 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {task.isChase ? (
                                    <FlagIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                ) : (
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 0.5,
                                            bgcolor: 'primary.main',
                                        }}
                                    />
                                )}
                            </Box>
                            <Box
                                onClick={() => onSelect(task)}
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    p: 2,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'background 0.18s, box-shadow 0.18s',
                                    ...(isLuxury
                                        ? {
                                            ...frostedLuxury.panelDense,
                                            backgroundColor: 'rgba(255, 252, 247, 0.52)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 252, 247, 0.68)',
                                                boxShadow: '0 6px 20px rgba(48, 32, 90, 0.08)',
                                            },
                                        }
                                        : {
                                            bgcolor: 'rgba(249, 245, 235, 0.6)',
                                            border: '1px solid rgba(26, 26, 26, 0.06)',
                                            '&:hover': { bgcolor: 'rgba(107, 70, 193, 0.06)' },
                                        }),
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={800}
                                        sx={{
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                            flex: '1 1 auto',
                                            minWidth: 0,
                                            lineHeight: 1.35,
                                        }}
                                    >
                                        {task.title}
                                    </Typography>
                                    {task.isChase && (
                                        <Chip
                                            label="Chase"
                                            size="small"
                                            sx={{
                                                height: 22,
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                bgcolor: 'rgba(201, 162, 39, 0.2)',
                                                color: 'secondary.dark',
                                            }}
                                        />
                                    )}
                                </Box>
                                {buildSubtitle(task) && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mt: 1,
                                            lineHeight: 1.55,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {buildSubtitle(task)}
                                    </Typography>
                                )}
                            </Box>
                            <IconButton
                                size="small"
                                aria-label="Mark done"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onComplete(task.id);
                                }}
                                sx={{ mt: 1, color: 'text.secondary', '&:hover': { color: 'success.main' } }}
                            >
                                <CheckCircleOutlineIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
