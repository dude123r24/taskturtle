'use client';

import { useState, memo, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {
    DndContext,
    DragOverlay,
    useDroppable,
    PointerSensor,
    TouchSensor,
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
import ListAltIcon from '@mui/icons-material/ListAlt';

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

const BacklogList = memo(function BacklogList({ tasks }: { tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'UNASSIGNED' });
    const { setQuickAddOpen, createTask } = useTaskStore();
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkText, setBulkText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBulkAdd = async () => {
        const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;
        setIsSubmitting(true);
        for (const title of lines) {
            await createTask({ title, quadrant: 'UNASSIGNED' });
        }
        setBulkText('');
        setBulkMode(false);
        setIsSubmitting(false);
    };

    return (
        <Box
            ref={setNodeRef}
            onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.MuiCard-root') && !(e.target as HTMLElement).closest('.bulk-add-area')) {
                    setQuickAddOpen(true, 'UNASSIGNED');
                }
            }}
            sx={{
                p: 2,
                borderRadius: 3,
                border: isOver ? '2px dashed rgba(255, 255, 255, 0.4)' : '1px solid rgba(158, 158, 158, 0.2)',
                background: isOver
                    ? 'rgba(158, 158, 158, 0.1)'
                    : 'linear-gradient(135deg, rgba(158, 158, 158, 0.05), transparent)',
                height: { xs: 300, md: 'calc(40vh - 100px)' },
                minHeight: 250,
                maxHeight: 500,
                overflowY: 'auto',
                transition: 'all 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { borderColor: 'rgba(158, 158, 158, 0.4)' },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <ListAltIcon fontSize="small" sx={{ color: 'text.secondary' }} /> Backlog
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Drag tasks into the Matrix to prioritize them.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Tooltip title="Bulk add tasks">
                        <IconButton
                            size="small"
                            className="bulk-add-area"
                            onClick={(e) => { e.stopPropagation(); setBulkMode(!bulkMode); }}
                            sx={{
                                color: bulkMode ? 'primary.main' : 'text.secondary',
                                bgcolor: bulkMode ? 'rgba(108,99,255,0.1)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(108,99,255,0.15)' },
                            }}
                        >
                            <PlaylistAddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Chip
                        label={tasks.length}
                        size="small"
                        sx={{ bgcolor: 'rgba(158, 158, 158, 0.2)', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}
                    />
                </Stack>
            </Stack>

            {bulkMode && (
                <Box className="bulk-add-area" onClick={(e) => e.stopPropagation()} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth multiline minRows={3} maxRows={8} size="small"
                        placeholder={"Enter tasks, one per line...\ne.g.\nBuy milk\nCall dentist\nReview report"}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        autoFocus
                        sx={{ mb: 1, '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" color="inherit" onClick={() => { setBulkMode(false); setBulkText(''); }} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            size="small" variant="contained" onClick={handleBulkAdd}
                            disabled={!bulkText.trim() || isSubmitting} startIcon={<PlaylistAddIcon />}
                        >
                            {isSubmitting ? 'Adding...' : `Add ${bulkText.split('\n').filter((l) => l.trim()).length} Tasks`}
                        </Button>
                    </Stack>
                </Box>
            )}

            <Stack spacing={1} sx={{ flex: 1 }}>
                {tasks.length === 0 && !bulkMode ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontStyle: 'italic', opacity: 0.5 }}>
                        No tasks in backlog
                    </Typography>
                ) : (
                    tasks.map((task) => <DraggableTaskCard key={task.id} task={task} compact disableSwipe />)
                )}
            </Stack>
        </Box>
    );
});

const MatrixQuadrant = memo(function MatrixQuadrant({ quadrant, tasks }: { quadrant: string; tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id: quadrant });
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
                background: isOver ? `${q.color}11` : `linear-gradient(135deg, ${q.color}08, transparent)`,
                height: { xs: 300, md: 'calc(45vh - 100px)' },
                minHeight: 250,
                maxHeight: 500,
                overflowY: 'auto',
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': { borderColor: `${q.color}44` },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: q.color, fontSize: '1rem' }}>
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
                    label={tasks.length} size="small"
                    sx={{ bgcolor: `${q.color}22`, color: q.color, fontWeight: 600, fontSize: '0.75rem' }}
                />
            </Stack>

            <Stack spacing={1} sx={{ minHeight: 100 }}>
                {tasks.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontStyle: 'italic', opacity: 0.5 }}>
                        No tasks yet
                    </Typography>
                ) : (
                    tasks.map((task) => <DraggableTaskCard key={task.id} task={task} compact disableSwipe />)
                )}
            </Stack>
        </Box>
    );
});

function DroppableAction({ id, icon: Icon, label, color }: { id: string; icon: any; label: string; color: string }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Box
            ref={setNodeRef}
            component={motion.div}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.8 }}
            sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                p: 2, borderRadius: '50%', width: 100, height: 100, justifyContent: 'center',
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
                sx={{ fontWeight: 700, color: isOver ? color : 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
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
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over) {
            const overId = over.id as string;
            if (overId === 'ARCHIVE_ACTION') {
                patchTask(active.id as string, { status: 'ARCHIVED' });
            } else if (overId === 'DONE_ACTION') {
                patchTask(active.id as string, { status: 'DONE' });
            } else if (overId === 'UNASSIGNED') {
                patchTask(active.id as string, { quadrant: 'UNASSIGNED' });
            } else if (quadrantOrder.includes(overId as any)) {
                patchTask(active.id as string, { quadrant: overId as any });
            }
        }
        setActiveId(null);
    }, [patchTask]);

    const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [tasks, activeId]);

    const quadrantTasks = useMemo(() => {
        const result: Record<string, Task[]> = {};
        for (const q of quadrantOrder) {
            result[q] = tasks.filter((t) => t.quadrant === q && t.status !== 'ARCHIVED');
        }
        result['UNASSIGNED'] = tasks.filter((t) => t.quadrant === 'UNASSIGNED' && t.status !== 'ARCHIVED');
        return result;
    }, [tasks]);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignContent: 'start' }}>
                    {quadrantOrder.map((quadrant) => (
                        <MatrixQuadrant key={quadrant} quadrant={quadrant} tasks={quadrantTasks[quadrant]} />
                    ))}
                </Box>

                <Box>
                    <BacklogList tasks={quadrantTasks['UNASSIGNED']} />
                </Box>

                <AnimatePresence>
                    {activeId && (
                        <Stack
                            direction="row" spacing={4}
                            sx={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
                        >
                            <DroppableAction id="ARCHIVE_ACTION" label="Archive" icon={DeleteIcon} color="#ff4444" />
                            <DroppableAction id="DONE_ACTION" label="Done" icon={CheckCircleIcon} color="#00C853" />
                        </Stack>
                    )}
                </AnimatePresence>
            </Box>

            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeId && activeTask ? (
                    <div style={{ opacity: 0.85, transform: 'scale(1.03)', cursor: 'grabbing', pointerEvents: 'none' }}>
                        <TaskCard task={activeTask} compact />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
