import { useEffect, useState, useRef, useCallback } from 'react';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SendIcon from '@mui/icons-material/Send';
import { useTaskStore, type EisenhowerQuadrant, type TaskStatus, type TaskUpdate } from '@/store/taskStore';
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
    const { createTask, patchTask, editingTask, setEditingTask, draftQuadrant } = useTaskStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('SCHEDULE');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [estimatedMinutes, setEstimatedMinutes] = useState('');
    const [isChase, setIsChase] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update log state
    const [updates, setUpdates] = useState<TaskUpdate[]>([]);
    const [newUpdate, setNewUpdate] = useState('');
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);

    const isEditing = !!editingTask;

    const fetchUpdates = useCallback(async (taskId: string) => {
        setIsLoadingUpdates(true);
        try {
            const res = await fetch(`/api/tasks/${taskId}/updates`);
            if (res.ok) {
                const data = await res.json();
                setUpdates(data);
            }
        } catch { /* ignore */ }
        setIsLoadingUpdates(false);
    }, []);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setQuadrant(editingTask.quadrant);
            setStatus(editingTask.status);
            setEstimatedMinutes(editingTask.estimatedMinutes?.toString() || '');
            setIsChase(editingTask.isChase || false);
            fetchUpdates(editingTask.id);
        } else {
            setTitle('');
            setDescription('');
            setQuadrant(draftQuadrant || 'SCHEDULE');
            setStatus('TODO');
            setEstimatedMinutes('');
            setIsChase(false);
            setUpdates([]);
            setNewUpdate('');
        }
    }, [editingTask, open, draftQuadrant, fetchUpdates]);

    useEffect(() => {
        if (open) {
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
            description: description.trim() || undefined,
            quadrant,
            status,
            estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
            isChase,
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
        setIsSubmitting(true);
        await patchTask(editingTask.id, { status: 'ARCHIVED' });
        setIsSubmitting(false);
        handleClose();
    };

    const handleAddUpdate = async () => {
        if (!editingTask || !newUpdate.trim()) return;
        try {
            const res = await fetch(`/api/tasks/${editingTask.id}/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newUpdate.trim() }),
            });
            if (res.ok) {
                const update = await res.json();
                setUpdates((prev) => [update, ...prev]);
                setNewUpdate('');
            }
        } catch { /* ignore */ }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

                    <TextField
                        fullWidth
                        label="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        multiline
                        minRows={2}
                        maxRows={4}
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

                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            fullWidth
                            label="Estimated time (minutes)"
                            type="number"
                            value={estimatedMinutes}
                            onChange={(e) => setEstimatedMinutes(e.target.value)}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            inputProps={{ min: 0, step: 15 }}
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isChase}
                                    onChange={(e) => setIsChase(e.target.checked)}
                                    color="warning"
                                />
                            }
                            label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <DirectionsRunIcon sx={{ fontSize: '1rem', color: isChase ? '#FF6D00' : 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: isChase ? '#FF6D00' : 'text.secondary', fontWeight: isChase ? 600 : 400 }}>
                                        Chase
                                    </Typography>
                                </Stack>
                            }
                            sx={{ ml: 0, whiteSpace: 'nowrap' }}
                        />
                    </Stack>

                    {/* Update Log — only when editing */}
                    {isEditing && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                                    📝 Updates
                                </Typography>

                                {/* Add new update */}
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Add a status update..."
                                        value={newUpdate}
                                        onChange={(e) => setNewUpdate(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddUpdate();
                                            }
                                        }}
                                        multiline
                                        maxRows={3}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleAddUpdate}
                                        disabled={!newUpdate.trim()}
                                        sx={{ minWidth: 40, px: 1 }}
                                    >
                                        <SendIcon sx={{ fontSize: '1rem' }} />
                                    </Button>
                                </Stack>

                                {/* Update list */}
                                <Stack spacing={1} sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {isLoadingUpdates ? (
                                        <Typography variant="caption" color="text.secondary">Loading...</Typography>
                                    ) : updates.length === 0 ? (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No updates yet. Add one above to track progress.
                                        </Typography>
                                    ) : (
                                        updates.map((u) => (
                                            <Box
                                                key={u.id}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                                    {u.content}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                                    {formatDate(u.createdAt)}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                </Stack>
                            </Box>
                        </>
                    )}
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
