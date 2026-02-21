'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useTaskStore } from '@/store/taskStore';

const STATIC_ACTIONS = [
    { label: 'Go to Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Go to Tasks', path: '/tasks', icon: <ChecklistIcon /> },
    { label: 'Go to Planner', path: '/planner', icon: <ViewTimelineIcon /> },
    { label: 'Go to Calendar', path: '/calendar', icon: <CalendarMonthIcon /> },
    { label: 'Go to Focus Mode', path: '/focus', icon: <CenterFocusStrongIcon /> },
];

export default function CommandPalette() {
    const router = useRouter();
    const { tasks, createTask, setEditingTask } = useTaskStore();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((p) => !p);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClose = () => {
        setOpen(false);
        setQuery('');
    };

    const handleStaticAction = (path: string) => {
        router.push(path);
        handleClose();
    };

    const handleCreateTask = async () => {
        if (!query.trim()) return;
        await createTask({
            title: query.trim(),
            quadrant: 'SCHEDULE',
            horizon: 'SHORT_TERM'
        });
        handleClose();
    };

    const handleEditTask = (task: any) => {
        setEditingTask(task);
        handleClose();
        router.push('/tasks'); // Make sure we are on a page that handles editing if needed, or just let the global store handle it
    };

    // Filter logic
    const lowerQuery = query.toLowerCase();

    const filteredStatic = STATIC_ACTIONS.filter(a => a.label.toLowerCase().includes(lowerQuery));

    const filteredTasks = tasks
        .filter(t => t.status !== 'DONE' && t.status !== 'ARCHIVED' && t.title.toLowerCase().includes(lowerQuery))
        .slice(0, 5); // show max 5 tasks

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
                <InputBase
                    placeholder="Search or type a command..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    sx={{ width: '100%', fontSize: '1.2rem' }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1 }}>
                    ESC
                </Typography>
            </Box>

            <List sx={{ p: 1, maxHeight: 400, overflow: 'auto' }}>
                {query.length > 0 && (
                    <ListItemButton onClick={handleCreateTask} sx={{ borderRadius: 1 }}>
                        <ListItemIcon><AddTaskIcon color="primary" /></ListItemIcon>
                        <ListItemText
                            primary={`Create task: "${query}"`}
                            primaryTypographyProps={{ color: 'primary.main', fontWeight: 600 }}
                        />
                    </ListItemButton>
                )}

                {filteredStatic.length > 0 && (
                    <Box sx={{ mt: query.length > 0 ? 2 : 0 }}>
                        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Navigation</Typography>
                        {filteredStatic.map(action => (
                            <ListItemButton key={action.path} onClick={() => handleStaticAction(action.path)} sx={{ borderRadius: 1 }}>
                                <ListItemIcon>{action.icon}</ListItemIcon>
                                <ListItemText primary={action.label} />
                            </ListItemButton>
                        ))}
                    </Box>
                )}

                {query.length > 0 && filteredTasks.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Tasks</Typography>
                        {filteredTasks.map(task => (
                            <ListItemButton key={task.id} onClick={() => handleEditTask(task)} sx={{ borderRadius: 1 }}>
                                <ListItemIcon><EditNoteIcon /></ListItemIcon>
                                <ListItemText primary={task.title} secondary={task.quadrant} />
                            </ListItemButton>
                        ))}
                    </Box>
                )}

                {query.length > 0 && filteredStatic.length === 0 && filteredTasks.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">Press enter to create a new task.</Typography>
                    </Box>
                )}
            </List>
        </Dialog>
    );
}
