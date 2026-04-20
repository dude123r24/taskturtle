'use client';

import React, { useState, memo, useCallback, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { alpha } from '@mui/material/styles';
import { type Task, type EisenhowerQuadrant, useTaskStore } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';
import { Z } from '@/lib/zIndex';
import { QUADRANT_ICONS } from '@/lib/quadrantIcons';
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

const BacklogList = memo(function BacklogList({ tasks }: { tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'UNASSIGNED' });
    const { setQuickAddOpen, createTask } = useTaskStore();
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkText, setBulkText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const didScrollRef = useRef(false);
    const touchStartY = useRef(0);

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
            onTouchStart={(e) => {
                didScrollRef.current = false;
                touchStartY.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
                if (Math.abs(e.touches[0].clientY - touchStartY.current) > 8) {
                    didScrollRef.current = true;
                }
            }}
            onClick={(e) => {
                if (didScrollRef.current) return;
                if (!(e.target as HTMLElement).closest('.MuiCard-root') && !(e.target as HTMLElement).closest('.bulk-add-area')) {
                    setQuickAddOpen(true, 'UNASSIGNED');
                }
            }}
            sx={{
                p: { xs: 1.25, md: 2 },
                borderRadius: '16px',
                border: isOver
                    ? '1.5px dashed rgba(17,17,17,0.35)'
                    : '1px solid rgba(17,17,17,0.08)',
                background: isOver ? 'rgba(17,17,17,0.03)' : '#FFFFFF',
                boxShadow: '0 1px 2px rgba(17,17,17,0.04), 0 1px 0 rgba(17,17,17,0.02)',
                height: { xs: 'auto', md: 'calc(40vh - 100px)' },
                minHeight: { xs: 120, md: 180 },
                maxHeight: { xs: 'none', md: 500 },
                overflowY: { xs: 'visible', md: 'auto' },
                transition: 'background-color 120ms ease, border-color 120ms ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { borderColor: 'rgba(17,17,17,0.14)' },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 1, md: 1.25 } }}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '999px',
                                bgcolor: 'rgba(17,17,17,0.4)',
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: '0.9375rem',
                                fontWeight: 600,
                                letterSpacing: '-0.005em',
                                color: 'text.primary',
                            }}
                        >
                            Backlog
                        </Typography>
                        <Box
                            component="span"
                            sx={{
                                fontVariantNumeric: 'tabular-nums',
                                fontSize: '0.78125rem',
                                fontWeight: 500,
                                color: 'rgba(17,17,17,0.5)',
                                bgcolor: 'rgba(17,17,17,0.04)',
                                px: 0.875,
                                py: 0.125,
                                borderRadius: '999px',
                            }}
                        >
                            {tasks.length}
                        </Box>
                    </Stack>
                    <Typography
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            mt: 0.5,
                            fontSize: '0.75rem',
                            color: 'rgba(17,17,17,0.42)',
                        }}
                    >
                        Drag tasks into the Matrix to prioritize them.
                    </Typography>
                </Box>
                <Tooltip title="Bulk add tasks">
                    <IconButton
                        className="bulk-add-area"
                        onClick={(e) => { e.stopPropagation(); setBulkMode(!bulkMode); }}
                        aria-label="Bulk add tasks"
                        size="small"
                        sx={{
                            color: bulkMode ? 'rgba(17,17,17,0.85)' : 'rgba(17,17,17,0.45)',
                            bgcolor: bulkMode ? 'rgba(17,17,17,0.06)' : 'transparent',
                            minWidth: 32,
                            minHeight: 32,
                            borderRadius: '8px',
                            '&:hover': { bgcolor: 'rgba(17,17,17,0.05)', color: 'rgba(17,17,17,0.85)' },
                        }}
                    >
                        <PlaylistAddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
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

            <Box
                sx={{
                    flex: 1,
                    '& > * + *': {
                        borderTop: '1px solid rgba(17,17,17,0.06)',
                    },
                }}
            >
                {tasks.length === 0 && !bulkMode ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'rgba(17,17,17,0.4)' }}>
                        No tasks in backlog
                    </Typography>
                ) : (
                    tasks.map((task) => <DraggableTaskCard key={task.id} task={task} compact disableSwipe variant="row" />)
                )}
            </Box>
        </Box>
    );
});

const MatrixQuadrant = memo(function MatrixQuadrant({ quadrant, tasks }: { quadrant: EisenhowerQuadrant; tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id: quadrant });
    const q = QUADRANT_LABELS[quadrant];
    const QIcon = QUADRANT_ICONS[quadrant];
    const { setQuickAddOpen } = useTaskStore();
    const didScrollRef = useRef(false);
    const touchStartY = useRef(0);

    return (
        <Box
            ref={setNodeRef}
            onTouchStart={(e) => {
                didScrollRef.current = false;
                touchStartY.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
                if (Math.abs(e.touches[0].clientY - touchStartY.current) > 8) {
                    didScrollRef.current = true;
                }
            }}
            onClick={(e) => {
                if (didScrollRef.current) return;
                if (!(e.target as HTMLElement).closest('.MuiCard-root')) {
                    setQuickAddOpen(true, quadrant);
                }
            }}
            sx={{
                p: { xs: 1.25, md: 2 },
                borderRadius: '16px',
                border: isOver
                    ? `1.5px dashed ${alpha(q.color, 0.55)}`
                    : `1px solid ${alpha(q.color, 0.18)}`,
                background: isOver ? alpha(q.color, 0.08) : alpha(q.color, 0.045),
                boxShadow: '0 1px 2px rgba(17,17,17,0.04), 0 1px 0 rgba(17,17,17,0.02)',
                height: { xs: 'auto', md: 'calc(45vh - 100px)' },
                minHeight: { xs: 120, md: 180 },
                maxHeight: { xs: 'none', md: 500 },
                overflowY: { xs: 'visible', md: 'auto' },
                transition: 'background-color 120ms ease, border-color 120ms ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { borderColor: alpha(q.color, 0.32) },
            }}
        >
            <Box sx={{ mb: { xs: 1, md: 1.25 } }}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '999px',
                            bgcolor: q.color,
                            flexShrink: 0,
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            letterSpacing: '-0.005em',
                            color: q.color,
                        }}
                    >
                        {q.label}
                    </Typography>
                    <Box
                        component="span"
                        sx={{
                            fontVariantNumeric: 'tabular-nums',
                            fontSize: '0.78125rem',
                            fontWeight: 500,
                            color: 'rgba(17,17,17,0.5)',
                            bgcolor: 'rgba(17,17,17,0.04)',
                            px: 0.875,
                            py: 0.125,
                            borderRadius: '999px',
                        }}
                    >
                        {tasks.length}
                    </Box>
                </Stack>
                <Typography
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        mt: 0.5,
                        fontSize: '0.75rem',
                        color: 'rgba(17,17,17,0.42)',
                        letterSpacing: '0.01em',
                    }}
                >
                    {quadrantDescriptions[quadrant]}
                </Typography>
                {quadrant === 'ELIMINATE' && (
                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: '0.75rem',
                            color: 'rgba(17,17,17,0.42)',
                            fontStyle: 'italic',
                        }}
                    >
                        Auto-archived after 7 days.
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 80,
                    '& > * + *': {
                        borderTop: '1px solid rgba(17,17,17,0.06)',
                    },
                }}
            >
                {tasks.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            py: 4,
                            px: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '999px',
                                border: `1.5px dashed ${alpha(q.color, 0.4)}`,
                                display: 'grid',
                                placeItems: 'center',
                                color: 'rgba(17,17,17,0.4)',
                                mb: 1,
                            }}
                        >
                            <QIcon sx={{ fontSize: 16, color: alpha(q.color, 0.6) }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.84375rem', fontWeight: 500, color: 'rgba(17,17,17,0.6)' }}>
                            No tasks yet
                        </Typography>
                    </Box>
                ) : (
                    tasks.map((task) => <DraggableTaskCard key={task.id} task={task} compact disableSwipe variant="row" />)
                )}
            </Box>
        </Box>
    );
});

function DroppableAction({ id, icon: Icon, label, color }: { id: string; icon: React.ElementType; label: string; color: string }) {
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
                zIndex: Z.overlay,
            }}
        >
            <Icon sx={{ fontSize: 32, color: isOver ? color : 'text.secondary' }} />
            <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: isOver ? color : 'text.secondary', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
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
        // Longer delay so a quick vertical swipe registers as a scroll, not a drag
        useSensor(TouchSensor, { activationConstraint: { delay: 500, tolerance: 10 } }),
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 1.5, md: 2 }, alignContent: 'start' }}>
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
