'use client';

import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import EventIcon from '@mui/icons-material/Event';
import { type Task, useTaskStore } from '@/store/taskStore';
import { formatMinutes, HORIZON_LABELS, QUADRANT_LABELS } from '@/lib/utils';
import { useEffect, useState, memo, useCallback } from 'react';

let settingsCache: { flashOnDue: boolean; fetchedAt: number } | null = null;
const SETTINGS_CACHE_TTL = 60_000;

async function getFlashSetting(): Promise<boolean> {
    if (settingsCache && Date.now() - settingsCache.fetchedAt < SETTINGS_CACHE_TTL) {
        return settingsCache.flashOnDue;
    }
    try {
        const res = await fetch('/api/settings');
        if (res.ok) {
            const settings = await res.json();
            settingsCache = { flashOnDue: settings.flashOnDue, fetchedAt: Date.now() };
            return settings.flashOnDue;
        }
    } catch { /* ignore */ }
    return false;
}

interface TaskCardProps {
    task: Task;
    compact?: boolean;
}

function TaskCardInner({ task, compact = false }: TaskCardProps) {
    const router = useRouter();
    const { patchTask, setEditingTask } = useTaskStore();

    const quadrantInfo = QUADRANT_LABELS[task.quadrant];
    const isDone = task.status === 'DONE';
    const isDoFirst = task.quadrant === 'DO_FIRST';

    const [flashColor, setFlashColor] = useState<string | null>(null);

    useEffect(() => {
        if (!task.dueDate || isDone) return;
        if (typeof window === 'undefined') return;

        let cancelled = false;
        const checkFlash = async () => {
            const todayStr = new Date().toDateString();
            const flashedState = sessionStorage.getItem(`flashed_${task.id}`);
            if (flashedState === todayStr) return;

            const shouldFlash = await getFlashSetting();
            if (cancelled || !shouldFlash) return;

            const now = new Date();
            const due = new Date(task.dueDate!);
            const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

            let colorToUse: string | null = null;
            if (hoursUntilDue < 0) {
                colorToUse = 'rgba(239, 68, 68, 0.25)';
            } else if (hoursUntilDue <= 24) {
                colorToUse = 'rgba(34, 197, 94, 0.25)';
            }

            if (colorToUse && !cancelled) {
                sessionStorage.setItem(`flashed_${task.id}`, todayStr);
                for (let i = 0; i < 3; i++) {
                    if (cancelled) break;
                    setFlashColor(colorToUse);
                    await new Promise(r => setTimeout(r, 600));
                    setFlashColor(null);
                    if (i < 2) await new Promise(r => setTimeout(r, 30));
                }
            }
        };

        checkFlash();
        return () => { cancelled = true; };
    }, [task.dueDate, task.id, isDone]);

    const toggleDone = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        patchTask(task.id, { status: isDone ? 'TODO' : 'DONE' });
    }, [patchTask, task.id, isDone]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTask(task);
    }, [setEditingTask, task]);

    const handleArchive = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        patchTask(task.id, { status: 'ARCHIVED' });
    }, [patchTask, task.id]);

    const handleFocus = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/focus?taskId=${task.id}`);
    }, [router, task.id]);

    const handleCardClick = useCallback(() => {
        setEditingTask(task);
    }, [setEditingTask, task]);

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                cursor: 'pointer',
                background: (theme) => flashColor
                    ? flashColor
                    : (isDone
                        ? 'rgba(67, 160, 71, 0.06)'
                        : theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)'),
                border: (theme) => `1px solid ${isDone ? 'rgba(67,160,71,0.2)' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)')}`,
                transition: flashColor ? 'none' : 'all 0.2s ease',
                opacity: isDone ? 0.7 : 1,
                '&:hover': {
                    border: `1px solid ${quadrantInfo.color}44`,
                    boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                },
            }}
        >
            <CardContent sx={{ p: compact ? 0.75 : 1.5, '&:last-child': { pb: compact ? 0.75 : 1.5 }, display: 'flex', alignItems: compact ? 'center' : 'flex-start' }}>
                <Stack direction="row" spacing={0.5} alignItems={compact ? "center" : "flex-start"} sx={{ flex: 1, minWidth: 0 }}>
                    <Tooltip title={isDone ? 'Mark as to do' : 'Mark as done'}>
                        <IconButton
                            size="small"
                            onClick={toggleDone}
                            sx={{ p: compact ? 0.25 : 0.5, mt: compact ? 0 : -0.25, color: isDone ? 'success.main' : 'text.secondary' }}
                        >
                            {isDone ? (
                                <CheckCircleIcon sx={{ fontSize: compact ? '1.1rem' : '1.25rem' }} />
                            ) : (
                                <CheckCircleOutlineIcon sx={{ fontSize: compact ? '1.1rem' : '1.25rem' }} />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ flex: 1, minWidth: 0, display: compact ? 'flex' : 'block', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant={compact ? 'body2' : 'body1'}
                            noWrap
                            sx={{
                                fontWeight: compact ? 500 : 600,
                                fontSize: compact ? '0.8rem' : '0.9rem',
                                textDecoration: isDone ? 'line-through' : 'none',
                                color: isDone ? 'text.secondary' : 'text.primary',
                                flex: compact ? 1 : 'unset',
                                lineHeight: compact ? 1.2 : 1.5,
                            }}
                        >
                            {task.title}
                        </Typography>

                        {task.isChase && (
                            <Tooltip title="Chasing">
                                <DirectionsRunIcon sx={{ fontSize: compact ? '0.85rem' : '1rem', color: '#FF6D00', ml: 0.5, flexShrink: 0 }} />
                            </Tooltip>
                        )}

                        {!compact && task.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ mt: 0.25, display: 'block', fontSize: '0.7rem' }}
                            >
                                {task.description}
                            </Typography>
                        )}

                        {!compact && task.updates && task.updates.length > 0 && (
                            <Typography
                                variant="caption"
                                noWrap
                                sx={{
                                    mt: 0.25,
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    color: 'text.secondary',
                                    opacity: 0.8,
                                }}
                            >
                                📝 {task.updates[0].content}
                            </Typography>
                        )}

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: compact ? 0 : 0.75 }}
                            alignItems="center"
                            flexWrap="nowrap"
                        >
                            {!compact && (
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600 }}>
                                    {HORIZON_LABELS[task.horizon]}
                                </Typography>
                            )}

                            {task.estimatedMinutes && (
                                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: 'text.secondary' }}>
                                    <AccessTimeIcon sx={{ fontSize: '0.75rem' }} />
                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                                        {formatMinutes(task.estimatedMinutes)}
                                    </Typography>
                                </Stack>
                            )}

                            {task.dueDate && (
                                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: 'text.secondary' }}>
                                    <EventIcon sx={{ fontSize: '0.75rem' }} />
                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Stack>
                            )}

                            {task.actualMinutes !== null && task.actualMinutes !== undefined && task.estimatedMinutes && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.25}
                                    sx={{
                                        color: task.actualMinutes > task.estimatedMinutes ? 'error.main' : 'success.main'
                                    }}
                                >
                                    {task.actualMinutes > task.estimatedMinutes
                                        ? <TrendingUpIcon sx={{ fontSize: '0.75rem' }} />
                                        : <TrendingDownIcon sx={{ fontSize: '0.75rem' }} />
                                    }
                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                                        {formatMinutes(task.actualMinutes)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0} sx={{ ml: 1 }}>
                        {isDoFirst && !isDone && (
                            <Tooltip title="Focus on this">
                                <IconButton
                                    size="small"
                                    onClick={handleFocus}
                                    sx={{ color: '#6C63FF', p: 0.5, '&:hover': { color: '#5A52D5', bgcolor: 'rgba(108,99,255,0.1)' } }}
                                >
                                    <CenterFocusStrongIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!compact && (
                            <>
                                <Tooltip title="Edit">
                                    <IconButton
                                        size="small"
                                        onClick={handleEdit}
                                        sx={{ color: 'text.secondary', p: 0.5 }}
                                    >
                                        <EditIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        size="small"
                                        onClick={handleArchive}
                                        sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: 'error.main' } }}
                                    >
                                        <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

const TaskCard = memo(TaskCardInner);
export default TaskCard;
