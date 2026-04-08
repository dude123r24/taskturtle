'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Box from '@mui/material/Box';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TaskCard from './TaskCard';
import { type Task, useTaskStore } from '@/store/taskStore';
import { useRef, useCallback, memo } from 'react';

interface DraggableTaskCardProps {
    task: Task;
    compact?: boolean;
    disableSwipe?: boolean;
}

function DraggableTaskCardInner({ task, compact, disableSwipe = false }: DraggableTaskCardProps) {
    const { patchTask } = useTaskStore();
    const dragOccurred = useRef(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        isDragging: isDnDDragging,
    } = useDraggable({ id: task.id });

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDnDDragging ? 0.3 : 1,
        zIndex: isDnDDragging ? 999 : 'auto' as any,
        willChange: isDnDDragging ? 'transform' : undefined,
    };

    const handlePointerDown = useCallback(() => {
        dragOccurred.current = false;
    }, []);

    const wrappedListeners = {
        ...listeners,
        onPointerDown: (e: React.PointerEvent) => {
            handlePointerDown();
            listeners?.onPointerDown?.(e);
        },
    };

    const suppressClickAfterDrag = useCallback((e: React.MouseEvent) => {
        if (dragOccurred.current) {
            e.stopPropagation();
            e.preventDefault();
            dragOccurred.current = false;
        }
    }, []);

    if (isDnDDragging) {
        dragOccurred.current = true;
    }

    if (disableSwipe) {
        return (
            <Box
                ref={setNodeRef}
                style={{ ...style, touchAction: 'auto', display: 'flex', alignItems: 'stretch' }}
                onClickCapture={suppressClickAfterDrag}
            >
                {/* Drag handle — only this initiates drag, so the rest of the card can scroll naturally */}
                <Box
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...wrappedListeners}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.5,
                        cursor: isDnDDragging ? 'grabbing' : 'grab',
                        touchAction: 'none',
                        color: 'text.disabled',
                        flexShrink: 0,
                        '&:hover': { color: 'text.secondary' },
                    }}
                    aria-label="Drag to reorder"
                >
                    <DragIndicatorIcon fontSize="small" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TaskCard task={task} compact={compact} />
                </Box>
            </Box>
        );
    }

    return <SwipeableDraggableCard
        task={task}
        compact={compact}
        setNodeRef={setNodeRef}
        style={style}
        attributes={attributes}
        listeners={wrappedListeners}
        isDnDDragging={isDnDDragging}
        patchTask={patchTask}
        suppressClickAfterDrag={suppressClickAfterDrag}
    />;
}

function SwipeableDraggableCard({
    task, compact, setNodeRef, style, attributes, listeners,
    isDnDDragging, patchTask, suppressClickAfterDrag,
}: {
    task: Task;
    compact?: boolean;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    attributes: any;
    listeners: any;
    isDnDDragging: boolean;
    patchTask: (id: string, data: Partial<Task>) => Promise<void>;
    suppressClickAfterDrag: (e: React.MouseEvent) => void;
}) {
    const x = useMotionValue(0);
    const backgroundArgs = useTransform(x, [-100, 0, 100], [
        'linear-gradient(90deg, #ef5350 0%, #ef5350 100%)',
        'transparent',
        'linear-gradient(90deg, #66bb6a 0%, #66bb6a 100%)',
    ]);
    const opacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 0.5, 0, 0.5, 1]);

    const handleSwipeEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            patchTask(task.id, { status: 'DONE' });
        } else if (info.offset.x < -100) {
            patchTask(task.id, { status: 'ARCHIVED' });
        }
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClickCapture={suppressClickAfterDrag}
            sx={{ position: 'relative' }}
        >
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: backgroundArgs,
                    borderRadius: 12,
                    zIndex: 0,
                    opacity,
                    pointerEvents: 'none',
                }}
            />
            <motion.div
                drag={isDnDDragging ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleSwipeEnd}
                style={{ x, cursor: isDnDDragging ? 'grabbing' : 'grab', position: 'relative', zIndex: 1 }}
            >
                <TaskCard task={task} compact={compact} />
            </motion.div>
        </Box>
    );
}

const DraggableTaskCard = memo(DraggableTaskCardInner);
export default DraggableTaskCard;
