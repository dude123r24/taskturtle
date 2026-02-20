'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    DndContext,
    DragOverlay,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { type Task, useTaskStore } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';
import TaskCard from './TaskCard';
import DraggableTaskCard from './DraggableTaskCard';

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

function MatrixQuadrant({ quadrant, tasks }: { quadrant: string; tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: quadrant,
    });
    const q = QUADRANT_LABELS[quadrant];
    const { setQuickAddOpen } = useTaskStore();

    return (
        <Box
            ref={setNodeRef}
            onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.MuiCard-root')) {
                    setQuickAddOpen(true, quadrant as any);
                }
            }}
            sx={{
                p: 2,
                borderRadius: 3,
                border: isOver ? `2px dashed ${q.color}` : `1px solid ${q.color}22`,
                background: isOver
                    ? `${q.color}11`
                    : `linear-gradient(135deg, ${q.color}08, transparent)`,
                minHeight: 200,
                transition: 'all 0.2s',
                cursor: 'pointer',
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
                        {quadrant === 'ELIMINATE' && (
                            <Box component="span" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                Tasks in this quadrant are auto-archived after 7 days.
                            </Box>
                        )}
                    </Typography>
                </Box>
                <Chip
                    label={tasks.length}
                    size="small"
                    sx={{
                        bgcolor: `${q.color}22`,
                        color: q.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                />
            </Stack>

            <Stack spacing={2} sx={{ minHeight: 100 }}>
                {tasks.length === 0 ? (
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
                    tasks.map((task) => (
                        <DraggableTaskCard key={task.id} task={task} compact disableSwipe />
                    ))
                )}
            </Stack>
        </Box>
    );
}

function DroppableAction({
    id,
    icon: Icon,
    label,
    color,
    active
}: {
    id: string;
    icon: any;
    label: string;
    color: string;
    active: boolean;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Box
            ref={setNodeRef}
            component={motion.div}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.8 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: '50%',
                width: 100,
                height: 100,
                justifyContent: 'center',
                bgcolor: isOver ? `${color}22` : 'background.paper',
                border: `2px solid ${isOver ? color : 'divider'}`,
                boxShadow: isOver ? `0 0 20px ${color}44` : 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                transform: isOver ? 'scale(1.15)' : 'scale(1)',
                zIndex: 1000,
            }}
        >
            <Icon sx={{ fontSize: 32, color: isOver ? color : 'text.secondary' }} />
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 700,
                    color: isOver ? color : 'text.secondary',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

export default function EisenhowerMatrix({ tasks }: EisenhowerMatrixProps) {
    const { patchTask } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over) {
            const overId = over.id as string;

            if (overId === 'ARCHIVE_ACTION') {
                patchTask(active.id as string, { status: 'ARCHIVED' });
            } else if (overId === 'DONE_ACTION') {
                patchTask(active.id as string, { status: 'DONE' });
            } else if (quadrantOrder.includes(overId as any)) {
                patchTask(active.id as string, { quadrant: overId as any });
            }
        }
        setActiveId(null);
    };

    const activeTask = tasks.find((t) => t.id === activeId);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 2,
                        width: '100%',
                    }}
                >
                    {quadrantOrder.map((quadrant) => (
                        <MatrixQuadrant
                            key={quadrant}
                            quadrant={quadrant}
                            tasks={tasks.filter(
                                (t) => t.quadrant === quadrant && t.status !== 'ARCHIVED' && t.status !== 'DONE'
                            )}
                        />
                    ))}
                </Box>

                <AnimatePresence>
                    {activeId && (
                        <Stack
                            direction="row"
                            spacing={4}
                            sx={{
                                position: 'fixed',
                                bottom: 40,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 1000,
                            }}
                        >
                            <DroppableAction
                                id="ARCHIVE_ACTION"
                                label="Archive"
                                icon={DeleteIcon}
                                color="#ff4444"
                                active={true}
                            />
                            <DroppableAction
                                id="DONE_ACTION"
                                label="Done"
                                icon={CheckCircleIcon}
                                color="#00C853"
                                active={true}
                            />
                        </Stack>
                    )}
                </AnimatePresence>
            </Box>

            <DragOverlay>
                {activeId && activeTask ? (
                    <div style={{ opacity: 0.8, transform: 'scale(1.05)', cursor: 'grabbing' }}>
                        <TaskCard task={activeTask} compact />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

