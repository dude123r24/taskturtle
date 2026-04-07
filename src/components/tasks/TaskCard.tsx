'use client';

import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
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
    const theme = useTheme();
    const router = useRouter();
    const isMobileComfort = useMediaQuery(theme.breakpoints.down('md'));
    const comfortable = isMobileComfort || !compact;
    const { patchTask, setEditingTask } = useTaskStore();

    const quadrantInfo = QUADRANT_LABELS[task.quadrant];
    const isDone = task.status === 'DONE';
    const isDoFirst = task.quadrant === 'DO_FIRST';
    const accentColor = isDone ? theme.palette.text.disabled : quadrantInfo.color;

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
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (cancelled || !shouldFlash || prefersReducedMotion) return;

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
                    await new Promise((r) => setTimeout(r, 600));
                    setFlashColor(null);
                    if (i < 2) await new Promise((r) => setTimeout(r, 30));
                }
            }
        };

        checkFlash();
        return () => {
            cancelled = true;
        };
    }, [task.dueDate, task.id, isDone]);

    const toggleDone = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            patchTask(task.id, { status: isDone ? 'TODO' : 'DONE' });
        },
        [patchTask, task.id, isDone]
    );

    const handleEdit = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setEditingTask(task);
        },
        [setEditingTask, task]
    );

    const handleArchive = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            patchTask(task.id, { status: 'ARCHIVED' });
        },
        [patchTask, task.id]
    );

    const handleFocus = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            router.push(`/focus?taskId=${task.id}`);
        },
        [router, task.id]
    );

    const handleCardClick = useCallback(() => {
        setEditingTask(task);
    }, [setEditingTask, task]);

    const handleCardKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
            }
        },
        [handleCardClick]
    );

    const metaIconSx = comfortable
        ? { fontSize: '1.05rem' }
        : { fontSize: '0.75rem' };
    const metaTextSx = comfortable
        ? { fontSize: '0.875rem', fontWeight: 500 }
        : { fontSize: '0.75rem', fontWeight: 500 };

    const cardBg = flashColor
        ? flashColor
        : isDone
            ? alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.08 : 0.06)
            : alpha(accentColor, theme.palette.mode === 'dark' ? 0.12 : 0.08);

    const idleShadows: string[] = [];
    if (task.isChase && !isDone) {
        idleShadows.push(`inset 0 3px 0 0 ${alpha('#ff9800', 0.95)}`);
    }
    if (isDoFirst && !isDone) {
        idleShadows.push(`0 0 0 1px ${alpha(accentColor, 0.35)}`);
        idleShadows.push(`0 6px 20px ${alpha(accentColor, 0.12)}`);
    }

    const hoverShadows: string[] = [];
    if (task.isChase && !isDone) {
        hoverShadows.push(`inset 0 3px 0 0 ${alpha('#ff9800', 0.95)}`);
    }
    if (isDoFirst && !isDone) {
        hoverShadows.push(`0 0 0 1px ${alpha(accentColor, 0.45)}`);
        hoverShadows.push(`0 8px 24px ${alpha(accentColor, 0.16)}`);
    }

    return (
        <Card
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Task: ${task.title}`}
            sx={{
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: cardBg,
                border: `1px solid ${theme.palette.divider}`,
                borderLeft: `6px solid ${accentColor}`,
                boxShadow: idleShadows.length ? idleShadows.join(', ') : undefined,
                transition: flashColor ? 'none' : 'background-color 0.2s ease, box-shadow 0.2s ease',
                opacity: isDone ? 0.72 : 1,
                '&:hover': {
                    backgroundColor: flashColor || alpha(accentColor, theme.palette.mode === 'dark' ? 0.18 : 0.14),
                    boxShadow:
                        hoverShadows.length > 0
                            ? hoverShadows.join(', ')
                            : theme.palette.mode === 'dark'
                                ? '0 4px 14px rgba(0,0,0,0.35)'
                                : '0 4px 14px rgba(0,0,0,0.08)',
                },
            }}
        >
            <CardContent
                sx={{
                    p: comfortable ? 2 : compact ? 1 : 1.5,
                    py: comfortable ? 2 : undefined,
                    '&:last-child': { pb: comfortable ? 2 : compact ? 1 : 1.5 },
                    display: 'flex',
                    alignItems: comfortable ? 'flex-start' : compact ? 'center' : 'flex-start',
                }}
            >
                <Stack
                    direction="row"
                    spacing={comfortable ? 1.25 : 0.5}
                    alignItems={comfortable ? 'flex-start' : compact ? 'center' : 'flex-start'}
                    sx={{ flex: 1, minWidth: 0 }}
                >
                    <Tooltip title={isDone ? 'Mark as to do' : 'Mark as done'}>
                        <IconButton
                            size={comfortable ? 'medium' : 'small'}
                            onClick={toggleDone}
                            aria-label={isDone ? 'Mark as to do' : 'Mark as done'}
                            sx={{
                                p: comfortable ? 1 : compact ? 0.5 : 0.75,
                                mt: comfortable ? 0.25 : compact ? 0 : -0.25,
                                minWidth: 48,
                                minHeight: 48,
                                color: isDone ? 'success.main' : 'text.secondary',
                            }}
                        >
                            {isDone ? (
                                <CheckCircleIcon sx={{ fontSize: comfortable ? '1.35rem' : compact ? '1.1rem' : '1.25rem' }} />
                            ) : (
                                <CheckCircleOutlineIcon sx={{ fontSize: comfortable ? '1.35rem' : compact ? '1.1rem' : '1.25rem' }} />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: comfortable ? 'block' : compact ? 'flex' : 'block',
                            alignItems: comfortable ? undefined : compact ? 'center' : undefined,
                            gap: comfortable ? undefined : compact ? 1 : undefined,
                        }}
                    >
                        <Stack direction="row" alignItems="flex-start" spacing={1} flexWrap="wrap" sx={{ gap: 0.75 }}>
                            <Typography
                                variant={comfortable ? 'body1' : compact ? 'body2' : 'body1'}
                                {...(comfortable ? {} : { noWrap: true })}
                                sx={{
                                    fontWeight: comfortable ? 600 : compact ? 500 : 600,
                                    fontSize: comfortable ? '1rem' : compact ? '0.8rem' : '0.9rem',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    color: isDone ? 'text.secondary' : 'text.primary',
                                    flex: comfortable ? '1 1 100%' : compact ? 1 : 'unset',
                                    lineHeight: comfortable ? 1.45 : compact ? 1.2 : 1.5,
                                    ...(comfortable && {
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }),
                                }}
                            >
                                {task.title}
                            </Typography>
                            {comfortable && (
                                <Chip
                                    label={`${quadrantInfo.icon} ${quadrantInfo.label}`}
                                    size="small"
                                    sx={{
                                        height: 26,
                                        fontWeight: 700,
                                        fontSize: '0.72rem',
                                        bgcolor: alpha(accentColor, 0.2),
                                        color: accentColor,
                                        border: `1px solid ${alpha(accentColor, 0.35)}`,
                                    }}
                                />
                            )}
                            {task.isChase && (
                                <Tooltip title="Chasing">
                                    <Chip
                                        label="🏃 Chase"
                                        size="small"
                                        sx={{
                                            height: 26,
                                            fontWeight: 700,
                                            fontSize: '0.72rem',
                                            bgcolor: alpha('#ff9800', 0.2),
                                            color: 'warning.dark',
                                            border: `1px solid ${alpha('#ff9800', 0.35)}`,
                                        }}
                                    />
                                </Tooltip>
                            )}
                            {!comfortable && task.isChase && (
                                <Tooltip title="Chasing">
                                    <DirectionsRunIcon
                                        sx={{ fontSize: compact ? '0.85rem' : '1rem', color: '#FF6D00', ml: 0.5, flexShrink: 0 }}
                                    />
                                </Tooltip>
                            )}
                        </Stack>

                        {!compact && task.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap={!comfortable}
                                sx={{
                                    mt: comfortable ? 0.75 : 0.25,
                                    display: 'block',
                                    fontSize: comfortable ? '0.8rem' : '0.7rem',
                                    lineHeight: 1.45,
                                    ...(comfortable && {
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }),
                                }}
                            >
                                {task.description}
                            </Typography>
                        )}

                        {!compact && task.updates && task.updates.length > 0 && (
                            <Typography
                                variant="caption"
                                noWrap={!comfortable}
                                sx={{
                                    mt: 0.25,
                                    display: 'block',
                                    fontSize: comfortable ? '0.8rem' : '0.75rem',
                                    color: 'text.secondary',
                                    opacity: 0.85,
                                    ...(comfortable && {
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mt: 0.5,
                                    }),
                                }}
                            >
                                {task.updates[0].content}
                            </Typography>
                        )}

                        <Stack
                            direction="row"
                            spacing={comfortable ? 1.5 : 1}
                            sx={{ mt: comfortable ? 1.25 : compact ? 0 : 0.75 }}
                            alignItems="center"
                            flexWrap={comfortable ? 'wrap' : 'nowrap'}
                            useFlexGap
                        >
                            {!compact && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        ...metaTextSx,
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                    }}
                                >
                                    {HORIZON_LABELS[task.horizon]}
                                </Typography>
                            )}

                            {task.estimatedMinutes ? (
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                                    <AccessTimeIcon sx={metaIconSx} />
                                    <Typography variant="caption" sx={{ ...metaTextSx, color: 'text.secondary' }}>
                                        {formatMinutes(task.estimatedMinutes)}
                                    </Typography>
                                </Stack>
                            ) : null}

                            {task.dueDate ? (
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                                    <EventIcon sx={metaIconSx} />
                                    <Typography variant="caption" sx={{ ...metaTextSx, color: 'text.secondary' }}>
                                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Typography>
                                </Stack>
                            ) : null}

                            {task.actualMinutes != null && task.estimatedMinutes ? (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                    sx={{
                                        color: task.actualMinutes > task.estimatedMinutes ? 'error.main' : 'success.main',
                                    }}
                                >
                                    {task.actualMinutes > task.estimatedMinutes ? (
                                        <TrendingUpIcon sx={metaIconSx} />
                                    ) : (
                                        <TrendingDownIcon sx={metaIconSx} />
                                    )}
                                    <Typography variant="caption" sx={{ ...metaTextSx, fontWeight: 600 }}>
                                        {formatMinutes(task.actualMinutes)}
                                    </Typography>
                                </Stack>
                            ) : null}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.5} sx={{ ml: comfortable ? 0.5 : 1, flexShrink: 0 }}>
                        {isDoFirst && !isDone && (
                            <Tooltip title="Focus on this">
                                <IconButton
                                    size={comfortable ? 'medium' : 'small'}
                                    onClick={handleFocus}
                                    aria-label="Focus on this task"
                                    sx={{
                                        color: accentColor,
                                        p: comfortable ? 1 : 0.75,
                                        minWidth: 48,
                                        minHeight: 48,
                                        '&:hover': { bgcolor: alpha(accentColor, 0.12) },
                                    }}
                                >
                                    <CenterFocusStrongIcon sx={{ fontSize: comfortable ? '1.25rem' : '1rem' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!compact && (
                            <>
                                <Tooltip title="Edit">
                                    <IconButton
                                        size={comfortable ? 'medium' : 'small'}
                                        onClick={handleEdit}
                                        aria-label="Edit task"
                                        sx={{
                                            color: 'text.secondary',
                                            p: comfortable ? 1 : 0.75,
                                            minWidth: 48,
                                            minHeight: 48,
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: comfortable ? '1.2rem' : '1rem' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        size={comfortable ? 'medium' : 'small'}
                                        onClick={handleArchive}
                                        aria-label="Delete task"
                                        sx={{
                                            color: 'text.secondary',
                                            p: comfortable ? 1 : 0.75,
                                            minWidth: 48,
                                            minHeight: 48,
                                            '&:hover': { color: 'error.main' },
                                        }}
                                    >
                                        <DeleteOutlineIcon sx={{ fontSize: comfortable ? '1.2rem' : '1rem' }} />
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
