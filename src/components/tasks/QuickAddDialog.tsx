import { useEffect, useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTaskStore, type EisenhowerQuadrant, type TaskStatus } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';

interface QuickAddDialogProps {
    open: boolean;
    onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    TODO: { label: 'To Do', color: '#6C63FF' },
    DONE: { label: 'Done', color: '#43A047' },
    ARCHIVED: { label: 'Archived', color: '#ef5350' },
};

export default function QuickAddDialog({ open, onClose }: QuickAddDialogProps) {
    const { createTask, patchTask, deleteTask, editingTask, setEditingTask, draftQuadrant } = useTaskStore();
    const [title, setTitle] = useState('');
    const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('SCHEDULE');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [estimatedMinutes, setEstimatedMinutes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!editingTask;

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setQuadrant(editingTask.quadrant);
            setStatus(editingTask.status);
            setEstimatedMinutes(editingTask.estimatedMinutes?.toString() || '');
        } else {
            setTitle('');
            setQuadrant(draftQuadrant || 'SCHEDULE');
            setStatus('TODO');
            setEstimatedMinutes('');
        }
    }, [editingTask, open, draftQuadrant]);

    useEffect(() => {
        if (open) {
            // Slight delay ensures the dialog transition is complete and the input is focusable
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleClose = () => {
        setEditingTask(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);

        const taskData = {
            title: title.trim(),
            quadrant,
            status,
            estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
        };

        if (isEditing && editingTask) {
            await patchTask(editingTask.id, taskData);
        } else {
            await createTask(taskData);
        }

        setIsSubmitting(false);
        handleClose();
    };

    const handleDelete = async () => {
        if (!editingTask) return;
        if (confirm('Are you sure you want to delete this task?')) {
            setIsSubmitting(true);
            await deleteTask(editingTask.id);
            setIsSubmitting(false);
            handleClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(108,99,255,0.2)',
                    backdropFilter: 'blur(20px)',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {isEditing ? 'Edit Task' : 'Quick Add Task'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        label="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        variant="outlined"
                    />

                    {isEditing && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Status
                            </Typography>
                            <ToggleButtonGroup
                                value={status}
                                exclusive
                                onChange={(_, val) => val && setStatus(val)}
                                fullWidth
                                size="small"
                            >
                                {Object.entries(STATUS_LABELS).map(([key, s]) => (
                                    <ToggleButton
                                        key={key}
                                        value={key}
                                        sx={{
                                            flex: 1,
                                            fontSize: '0.75rem',
                                            '&.Mui-selected': {
                                                bgcolor: `${s.color}22`,
                                                color: s.color,
                                                borderColor: `${s.color}55`,
                                            },
                                        }}
                                    >
                                        {s.label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                    )}

                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Eisenhower Quadrant
                        </Typography>
                        <ToggleButtonGroup
                            value={quadrant}
                            exclusive
                            onChange={(_, val) => val && setQuadrant(val)}
                            fullWidth
                            size="small"
                        >
                            {Object.entries(QUADRANT_LABELS).map(([key, q]) => (
                                <ToggleButton
                                    key={key}
                                    value={key}
                                    sx={{
                                        flex: 1,
                                        fontSize: '0.75rem',
                                        '&.Mui-selected': {
                                            bgcolor: `${q.color}22`,
                                            color: q.color,
                                            borderColor: `${q.color}55`,
                                        },
                                    }}
                                >
                                    {q.icon} {q.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <TextField
                        fullWidth
                        label="Estimated time (minutes)"
                        type="number"
                        value={estimatedMinutes}
                        onChange={(e) => setEstimatedMinutes(e.target.value)}
                        onKeyDown={handleKeyDown}
                        variant="outlined"
                        inputProps={{ min: 0, step: 15 }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                <Box>
                    {isEditing && (
                        <Button
                            onClick={handleDelete}
                            color="error"
                            disabled={isSubmitting}
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!title.trim() || isSubmitting}
                    >
                        {isSubmitting
                            ? isEditing ? 'Saving...' : 'Adding...'
                            : isEditing ? 'Save Changes' : 'Add Task'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}
