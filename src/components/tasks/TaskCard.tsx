'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
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
import { type Task, useTaskStore } from '@/store/taskStore';
import { formatMinutes, HORIZON_LABELS, QUADRANT_LABELS } from '@/lib/utils';

interface TaskCardProps {
    task: Task;
    compact?: boolean;
}

export default function TaskCard({ task, compact = false }: TaskCardProps) {
    const { patchTask, deleteTask, setEditingTask } = useTaskStore();

    const quadrantInfo = QUADRANT_LABELS[task.quadrant];
    const isDone = task.status === 'DONE';

    const toggleDone = (e: React.MouseEvent) => {
        e.stopPropagation();
        patchTask(task.id, {
            status: isDone ? 'TODO' : 'DONE',
        });
    };

    return (
        <Card
            onClick={() => setEditingTask(task)}
            sx={{
                cursor: 'pointer',
                background: isDone
                    ? 'rgba(67, 160, 71, 0.06)'
                    : 'rgba(26, 25, 41, 0.6)',
                border: `1px solid ${isDone ? 'rgba(67,160,71,0.2)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s ease',
                opacity: isDone ? 0.7 : 1,
                '&:hover': {
                    border: `1px solid ${quadrantInfo.color}44`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
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

                    {!compact && (
                        <Stack direction="row" spacing={0} sx={{ ml: 1 }}>
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTask(task);
                                    }}
                                    sx={{ color: 'text.secondary', p: 0.5 }}
                                >
                                    <EditIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(task.id);
                                    }}
                                    sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: 'error.main' } }}
                                >
                                    <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
