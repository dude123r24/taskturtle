'use client';

import { useState } from 'react';
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
import { useTaskStore, type EisenhowerQuadrant } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';

interface QuickAddDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function QuickAddDialog({ open, onClose }: QuickAddDialogProps) {
    const { createTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('SCHEDULE');
    const [estimatedMinutes, setEstimatedMinutes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);

        await createTask({
            title: title.trim(),
            quadrant,
            estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
        });

        setTitle('');
        setQuadrant('SCHEDULE');
        setEstimatedMinutes('');
        setIsSubmitting(false);
        onClose();
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
            onClose={onClose}
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
            <DialogTitle sx={{ fontWeight: 600 }}>Quick Add Task</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        variant="outlined"
                    />

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
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!title.trim() || isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Task'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
