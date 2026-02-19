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
import { useTaskStore, type EisenhowerQuadrant, type TaskHorizon } from '@/store/taskStore';
import { QUADRANT_LABELS, HORIZON_LABELS } from '@/lib/utils';
import TaskCard from '@/components/tasks/TaskCard';

export default function TasksPage() {
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const [search, setSearch] = useState('');
    const [statusTab, setStatusTab] = useState(0); // 0=Active, 1=Done, 2=All
    const [quadrantFilter, setQuadrantFilter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
    const [horizonFilter, setHorizonFilter] = useState<TaskHorizon | 'ALL'>('ALL');

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((t) => {
        // Status filter
        if (statusTab === 0 && (t.status === 'DONE' || t.status === 'ARCHIVED')) return false;
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
            <Typography variant="h5" fontWeight={600}>
                All Tasks
            </Typography>

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
                <Tab label={`All (${tasks.length})`} />
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
        </Stack>
    );
}
