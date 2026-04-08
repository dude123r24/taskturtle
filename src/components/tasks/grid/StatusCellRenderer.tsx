'use client';

import { useCallback } from 'react';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { useTaskStore, type Task } from '@/store/taskStore';

export default function StatusCellRenderer(props: CustomCellRendererProps<Task>) {
    const { patchTask } = useTaskStore();
    const task = props.data;
    const isDone = task?.status === 'DONE';

    const handleToggle = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!task) return;
        await patchTask(task.id, { status: isDone ? 'TODO' : 'DONE' });
    }, [task, isDone, patchTask]);

    return (
        <Box
            onClick={handleToggle}
            role="checkbox"
            aria-checked={isDone}
            aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(e as any); } }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                cursor: 'pointer',
                color: isDone ? 'success.main' : 'text.disabled',
                '&:hover': { color: isDone ? 'success.dark' : 'text.secondary' },
                transition: 'color 0.15s',
            }}
        >
            {isDone ? (
                <CheckCircleIcon sx={{ fontSize: 20 }} />
            ) : (
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
            )}
        </Box>
    );
}
