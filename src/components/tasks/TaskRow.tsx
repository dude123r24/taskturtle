'use client';

import { useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { alpha, useTheme } from '@mui/material/styles';
import { type Task, useTaskStore } from '@/store/taskStore';
import { QUADRANT_LABELS, formatMinutes } from '@/lib/utils';

interface TaskRowProps {
    task: Task;
    compact?: boolean;
}

function TaskRowInner({ task }: TaskRowProps) {
    const theme = useTheme();
    const router = useRouter();
    const { patchTask, setEditingTask } = useTaskStore();
    const [hover, setHover] = useState(false);

    const quadrantInfo = QUADRANT_LABELS[task.quadrant];
    const isDone = task.status === 'DONE';
    const isDoFirst = task.quadrant === 'DO_FIRST';
    const accentColor = quadrantInfo.color;
    const inkPrimary = theme.palette.text.primary;
    const inkMuted = theme.palette.text.secondary;

    const toggleDone = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            patchTask(task.id, { status: isDone ? 'TODO' : 'DONE' });
        },
        [patchTask, task.id, isDone]
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

    const openEdit = useCallback(() => setEditingTask(task), [setEditingTask, task]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEdit();
            }
        },
        [openEdit]
    );

    const dueLabel = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <Box
            onClick={openEdit}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            tabIndex={0}
            role="button"
            aria-label={`Task: ${task.title}`}
            sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                py: 1,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background-color 120ms ease',
                '&:hover': { backgroundColor: alpha(inkPrimary, 0.03) },
                '&:focus-visible': { outline: `2px solid ${accentColor}`, outlineOffset: -2 },
            }}
        >
            {/* Circle check — fills with accent when done */}
            <IconButton
                size="small"
                onClick={toggleDone}
                aria-label={isDone ? 'Mark as to do' : 'Mark as done'}
                sx={{
                    p: 0,
                    width: 22,
                    height: 22,
                    minWidth: 22,
                    minHeight: 22,
                    borderRadius: '999px',
                    border: `1.5px solid ${isDone ? accentColor : alpha(inkPrimary, 0.18)}`,
                    backgroundColor: isDone ? accentColor : 'transparent',
                    color: isDone ? theme.palette.getContrastText(accentColor) : 'transparent',
                    transition: 'all 120ms ease',
                    '&:hover': {
                        borderColor: isDone ? accentColor : alpha(inkPrimary, 0.4),
                        backgroundColor: isDone ? accentColor : 'transparent',
                    },
                }}
            >
                {isDone && <CheckIcon sx={{ fontSize: 13 }} />}
            </IconButton>

            {/* Title + meta */}
            <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: '0.90625rem',
                            fontWeight: 500,
                            letterSpacing: '-0.005em',
                            color: isDone ? alpha(inkMuted, 0.7) : inkPrimary,
                            textDecoration: isDone ? 'line-through' : 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                        }}
                    >
                        {task.title}
                    </Typography>
                    {task.isChase && !isDone && (
                        <Tooltip title="Chasing">
                            <DirectionsRunIcon sx={{ fontSize: 14, color: '#d97706', flexShrink: 0 }} />
                        </Tooltip>
                    )}
                </Stack>
                {(task.estimatedMinutes || dueLabel) && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{
                            mt: 0.25,
                            fontSize: '0.78125rem',
                            color: inkMuted,
                            opacity: isDone ? 0.6 : 1,
                        }}
                    >
                        {task.estimatedMinutes != null && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 12, color: alpha(inkMuted, 0.75) }} />
                                <Box
                                    component="span"
                                    sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.78125rem' }}
                                >
                                    {formatMinutes(task.estimatedMinutes)}
                                </Box>
                            </Stack>
                        )}
                        {task.estimatedMinutes != null && dueLabel && (
                            <Box component="span" sx={{ color: alpha(inkMuted, 0.5) }}>
                                ·
                            </Box>
                        )}
                        {dueLabel && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <EventIcon sx={{ fontSize: 12, color: alpha(inkMuted, 0.75) }} />
                                <Box
                                    component="span"
                                    sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.78125rem' }}
                                >
                                    {dueLabel}
                                </Box>
                            </Stack>
                        )}
                    </Stack>
                )}
            </Box>

            {/* Right-side controls: focus (do-first) + delete (hover) */}
            <Stack direction="row" spacing={0.25} alignItems="center" sx={{ flexShrink: 0 }}>
                {isDoFirst && !isDone && (
                    <Tooltip title="Focus on this">
                        <IconButton
                            size="small"
                            onClick={handleFocus}
                            aria-label="Focus on this task"
                            sx={{
                                color: accentColor,
                                p: 0.5,
                                minWidth: 32,
                                minHeight: 32,
                                '&:hover': { backgroundColor: alpha(accentColor, 0.12) },
                            }}
                        >
                            <CenterFocusStrongIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        onClick={handleArchive}
                        aria-label="Delete task"
                        sx={{
                            color: alpha(inkPrimary, 0.45),
                            p: 0.5,
                            minWidth: 32,
                            minHeight: 32,
                            opacity: { xs: 1, md: hover ? 1 : 0 },
                            transition: 'opacity 120ms ease, color 120ms ease, background-color 120ms ease',
                            '&:hover': {
                                color: theme.palette.error.main,
                                backgroundColor: alpha(inkPrimary, 0.05),
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}

const TaskRow = memo(TaskRowInner);
export default TaskRow;
