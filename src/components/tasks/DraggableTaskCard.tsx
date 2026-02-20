'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Box from '@mui/material/Box';
import TaskCard from './TaskCard';
import { type Task, useTaskStore } from '@/store/taskStore';
import { useState } from 'react';

interface DraggableTaskCardProps {
    task: Task;
    compact?: boolean;
    disableSwipe?: boolean;
}

export default function DraggableTaskCard({ task, compact, disableSwipe = false }: DraggableTaskCardProps) {
    const { patchTask } = useTaskStore();
    const [isDragging, setIsDragging] = useState(false);

    // DnD Kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isDnDDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDnDDragging ? 0.3 : 1,
        touchAction: 'none',
        zIndex: isDnDDragging ? 999 : 'auto',
    };

    // Swipe Gestures
    const x = useMotionValue(0);
    const backgroundArgs = useTransform(x, [-100, 0, 100], [
        'linear-gradient(90deg, #ef5350 0%, #ef5350 100%)', // Red (Archive)
        'transparent',
        'linear-gradient(90deg, #66bb6a 0%, #66bb6a 100%)', // Green (Done)
    ]);
    const opacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0.5, 0, 0.5, 1]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        setIsDragging(false);
        if (info.offset.x > 100) {
            // Swipe Right -> Done
            patchTask(task.id, { status: 'DONE' });
        } else if (info.offset.x < -100) {
            // Swipe Left -> Archive
            patchTask(task.id, { status: 'ARCHIVED' });
        }
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ position: 'relative' }}>
            {/* Swipe Background Layer */}
            {!disableSwipe && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: backgroundArgs,
                        borderRadius: 12,
                        zIndex: 0,
                        opacity,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px',
                        pointerEvents: 'none',
                    }}
                >
                    {/* Icons could go here if needed, but color is enough for now */}
                </motion.div>
            )}

            {/* Draggable Card Layer */}
            <motion.div
                drag={disableSwipe || isDnDDragging ? false : "x"} // Disable swipe when sorting or explicitly disabled
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ x, cursor: isDnDDragging ? 'grabbing' : 'grab', position: 'relative', zIndex: 1 }}
            >
                <TaskCard task={task} compact={compact} />
            </motion.div>
        </Box>
    );
}
