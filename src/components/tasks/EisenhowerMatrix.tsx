'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { type Task } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';
import TaskCard from './TaskCard';

interface EisenhowerMatrixProps {
    tasks: Task[];
}

const quadrantOrder = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE'] as const;

const quadrantDescriptions: Record<string, string> = {
    DO_FIRST: 'Urgent & Important',
    SCHEDULE: 'Important, Not Urgent',
    DELEGATE: 'Urgent, Not Important',
    ELIMINATE: 'Neither Urgent nor Important',
};

export default function EisenhowerMatrix({ tasks }: EisenhowerMatrixProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                width: '100%',
            }}
        >
            {quadrantOrder.map((quadrant) => {
                const q = QUADRANT_LABELS[quadrant];
                const quadrantTasks = tasks.filter(
                    (t) => t.quadrant === quadrant && t.status !== 'ARCHIVED'
                );

                return (
                    <Box
                        key={quadrant}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: `1px solid ${q.color}22`,
                            background: `linear-gradient(135deg, ${q.color}08, transparent)`,
                            minHeight: 200,
                            transition: 'border-color 0.2s',
                            '&:hover': {
                                borderColor: `${q.color}44`,
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, color: q.color, fontSize: '1rem' }}
                                >
                                    {q.icon} {q.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {quadrantDescriptions[quadrant]}
                                </Typography>
                            </Box>
                            <Chip
                                label={quadrantTasks.length}
                                size="small"
                                sx={{
                                    bgcolor: `${q.color}22`,
                                    color: q.color,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                }}
                            />
                        </Stack>

                        <Stack spacing={1}>
                            {quadrantTasks.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        fontStyle: 'italic',
                                        opacity: 0.5,
                                    }}
                                >
                                    No tasks yet
                                </Typography>
                            ) : (
                                quadrantTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} compact />
                                ))
                            )}
                        </Stack>
                    </Box>
                );
            })}
        </Box>
    );
}
