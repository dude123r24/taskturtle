'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTaskStore, type EisenhowerQuadrant, type TaskHorizon, type Task } from '@/store/taskStore';
import { QUADRANT_LABELS, HORIZON_LABELS } from '@/lib/utils';
import TaskCard from '@/components/tasks/TaskCard';

function RecycleBinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { tasks, patchTask, deleteTask } = useTaskStore();

    const archivedTasks = tasks
        .filter((t) => t.status === 'ARCHIVED')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const handleRestore = async (task: Task) => {
        await patchTask(task.id, { status: 'TODO' });
    };

    const handlePermanentDelete = async (task: Task) => {
        await deleteTask(task.id);
    };

    const handleEmptyBin = async () => {
        // Run deletions concurrently
        await Promise.all(archivedTasks.map(t => deleteTask(t.id)));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(239, 83, 80, 0.3)',
                    backdropFilter: 'blur(20px)',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteIcon /> Recycle Bin
                </Box>
                {archivedTasks.length > 0 && (
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={handleEmptyBin}
                    >
                        Empty Bin
                    </Button>
                )}
            </DialogTitle>
            <DialogContent>
                {archivedTasks.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center', fontStyle: 'italic' }}>
                        The recycle bin is empty.
                    </Typography>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {archivedTasks.map((task) => (
                            <Box
                                key={task.id}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(239, 83, 80, 0.05)',
                                    border: '1px solid rgba(239, 83, 80, 0.2)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body1" fontWeight={500} noWrap sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
                                        {task.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        Deleted: {new Date(task.updatedAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        size="small"
                                        startIcon={<RestoreIcon />}
                                        onClick={() => handleRestore(task)}
                                        sx={{ color: 'success.main' }}
                                    >
                                        Restore
                                    </Button>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handlePermanentDelete(task)}
                                        title="Permanently Delete"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </DialogContent>
            <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
                <Button onClick={onClose} color="inherit">Close</Button>
            </Box>
        </Dialog>
    );
}

export default function TasksPage() {
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const [search, setSearch] = useState('');
    const [statusTab, setStatusTab] = useState(0); // 0=Active, 1=Done, 2=All
    const [quadrantFilter, setQuadrantFilter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
    const [horizonFilter, setHorizonFilter] = useState<TaskHorizon | 'ALL'>('ALL');
    const [recycleBinOpen, setRecycleBinOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((t) => {
        // Exclude archived tasks from all normal views
        if (t.status === 'ARCHIVED') return false;

        // Status filter
        // 0=Active, 1=Done, 2=All
        if (statusTab === 0 && t.status === 'DONE') return false;
        if (statusTab === 1 && t.status !== 'DONE') return false;

        // Quadrant filter
        if (quadrantFilter !== 'ALL' && t.quadrant !== quadrantFilter) return false;

        // Horizon filter
        if (horizonFilter !== 'ALL' && t.horizon !== horizonFilter) return false;

        // Search
        if (search) {
            const s = search.toLowerCase();
            return (
                t.title.toLowerCase().includes(s) ||
                t.description?.toLowerCase().includes(s)
            );
        }

        return true;
    });

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    All Tasks
                </Typography>
                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setRecycleBinOpen(true)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Recycle Bin
                </Button>
            </Stack>

            {/* Filters */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
            >
                <TextField
                    size="small"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 200 }}
                />

                <ToggleButtonGroup
                    value={quadrantFilter}
                    exclusive
                    onChange={(_, val) => val && setQuadrantFilter(val)}
                    size="small"
                >
                    <ToggleButton value="ALL" sx={{ fontSize: '0.7rem' }}>All</ToggleButton>
                    {Object.entries(QUADRANT_LABELS).map(([key, q]) => (
                        <ToggleButton
                            key={key}
                            value={key}
                            sx={{
                                fontSize: '0.7rem',
                                '&.Mui-selected': {
                                    bgcolor: `${q.color}22`,
                                    color: q.color,
                                },
                            }}
                        >
                            {q.icon}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    value={horizonFilter}
                    exclusive
                    onChange={(_, val) => val && setHorizonFilter(val)}
                    size="small"
                >
                    <ToggleButton value="ALL" sx={{ fontSize: '0.7rem' }}>All</ToggleButton>
                    {Object.entries(HORIZON_LABELS).map(([key, label]) => (
                        <ToggleButton key={key} value={key} sx={{ fontSize: '0.7rem' }}>
                            {label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>

            {/* Status tabs */}
            <Tabs
                value={statusTab}
                onChange={(_, v) => setStatusTab(v)}
                sx={{
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
                }}
            >
                <Tab label={`Active (${tasks.filter((t) => t.status !== 'DONE' && t.status !== 'ARCHIVED').length})`} />
                <Tab label={`Done (${tasks.filter((t) => t.status === 'DONE').length})`} />
                <Tab label={`All (${tasks.filter((t) => t.status !== 'ARCHIVED').length})`} />
            </Tabs>

            {/* Task list */}
            <Stack spacing={1.5}>
                {isLoading ? (
                    <Typography color="text.secondary">Loading tasks...</Typography>
                ) : filteredTasks.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            color: 'text.secondary',
                            fontStyle: 'italic',
                        }}
                    >
                        <Typography variant="body1">
                            {search ? 'No tasks match your search.' : 'No tasks yet. Use the + button to add one!'}
                        </Typography>
                    </Box>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </Stack>

            <RecycleBinDialog open={recycleBinOpen} onClose={() => setRecycleBinOpen(false)} />
        </Stack>
    );
}
