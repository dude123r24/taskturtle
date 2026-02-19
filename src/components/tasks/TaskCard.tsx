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

    const toggleDone = () => {
        patchTask(task.id, {
            status: isDone ? 'TODO' : 'DONE',
        });
    };

    return (
        <Card
            sx={{
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
            <CardContent sx={{ p: compact ? 1.5 : 2, '&:last-child': { pb: compact ? 1.5 : 2 } }}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Tooltip title={isDone ? 'Mark as to do' : 'Mark as done'}>
                        <IconButton
                            size="small"
                            onClick={toggleDone}
                            sx={{ mt: -0.5, color: isDone ? 'success.main' : 'text.secondary' }}
                        >
                            {isDone ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant={compact ? 'body2' : 'body1'}
                            sx={{
                                fontWeight: 500,
                                textDecoration: isDone ? 'line-through' : 'none',
                                color: isDone ? 'text.secondary' : 'text.primary',
                            }}
                        >
                            {task.title}
                        </Typography>

                        {!compact && task.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5, display: 'block' }}
                            >
                                {task.description}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} flexWrap="wrap">
                            <Chip
                                label={HORIZON_LABELS[task.horizon]}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: 20 }}
                            />
                            {task.estimatedMinutes && (
                                <Chip
                                    icon={<AccessTimeIcon sx={{ fontSize: '0.8rem !important' }} />}
                                    label={formatMinutes(task.estimatedMinutes)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.65rem', height: 20 }}
                                />
                            )}
                            {task.actualMinutes !== null && task.actualMinutes !== undefined && task.estimatedMinutes && (
                                <Chip
                                    icon={
                                        task.actualMinutes > task.estimatedMinutes
                                            ? <TrendingUpIcon sx={{ fontSize: '0.8rem !important', color: 'error.main' }} />
                                            : <TrendingDownIcon sx={{ fontSize: '0.8rem !important', color: 'success.main' }} />
                                    }
                                    label={formatMinutes(task.actualMinutes)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.65rem', height: 20 }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {!compact && (
                        <Stack direction="row" spacing={0}>
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={() => setEditingTask(task)}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={() => deleteTask(task.id)}
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
