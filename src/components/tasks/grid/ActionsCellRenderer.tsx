'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { useTaskStore, type Task } from '@/store/taskStore';

export default function ActionsCellRenderer(props: CustomCellRendererProps<Task>) {
    const { setEditingTask, deleteTask } = useTaskStore();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const task = props.data;

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (task) setEditingTask(task);
    }, [task, setEditingTask]);

    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        setConfirmOpen(false);
        if (task) await deleteTask(task.id);
    }, [task, deleteTask]);

    return (
        <>
            <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 0.25 }}
                onClick={(e) => e.stopPropagation()}
            >
                <IconButton
                    size="small"
                    onClick={handleEdit}
                    aria-label="Edit task"
                    sx={{ color: 'text.secondary', minWidth: 44, minHeight: 44, '&:hover': { color: 'primary.main' } }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={handleDeleteClick}
                    aria-label="Archive task"
                    sx={{ color: 'text.secondary', minWidth: 44, minHeight: 44, '&:hover': { color: 'error.main' } }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Box>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
                aria-labelledby="delete-confirm-title"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle id="delete-confirm-title" sx={{ fontWeight: 600 }}>
                    Archive task?
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" variant="body2">
                        &ldquo;{task?.title}&rdquo; will be moved to the recycle bin. You can restore it from there.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Archive
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
