'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { useTaskStore, type Task } from '@/store/taskStore';
import { QUADRANT_LABELS, formatMinutes } from '@/lib/utils';
import TaskCard from '@/components/tasks/TaskCard';

export default function PlannerPage() {
    const { tasks, fetchTasks } = useTaskStore();
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [plannedTaskIds, setPlannedTaskIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const [overloadInfo, setOverloadInfo] = useState<{
        taskCount: number;
        maxDaily: number;
        isOverloaded: boolean;
        totalMinutes: number;
        maxDailyMinutes: number;
        isTimeOverloaded: boolean;
    } | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        fetchDailyPlan();
    }, [selectedDate]);

    const fetchDailyPlan = async () => {
        try {
            const res = await fetch(`/api/planning/daily?date=${selectedDate}`);
            if (res.ok) {
                const data = await res.json();
                setOverloadInfo(data.overload);
                if (data.plan?.tasks) {
                    setPlannedTaskIds(
                        new Set(data.plan.tasks.map((pt: { taskId: string }) => pt.taskId))
                    );
                } else {
                    setPlannedTaskIds(new Set());
                }
            }
        } catch { /* graceful degradation */ }
    };

    const toggleTask = (taskId: string) => {
        setPlannedTaskIds((prev) => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const savePlan = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/planning/daily', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    taskIds: Array.from(plannedTaskIds),
                }),
            });
            await fetchDailyPlan();
        } catch { /* error handling */ }
        setIsSaving(false);
    };

    const navigateDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const activeTasks = tasks.filter(
        (t) => t.status !== 'DONE' && t.status !== 'ARCHIVED'
    );

    const plannedTasks = tasks.filter((t) => plannedTaskIds.has(t.id));
    const totalPlannedMinutes = plannedTasks.reduce(
        (sum, t) => sum + (t.estimatedMinutes || 0),
        0
    );
    const maxDaily = overloadInfo?.maxDaily || 8;
    const maxMinutes = overloadInfo?.maxDailyMinutes || 480;
    const isOverloaded = plannedTaskIds.size > maxDaily;
    const isTimeOverloaded = totalPlannedMinutes > maxMinutes;

    const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    return (
        <Stack spacing={3}>
            {/* Date nav */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigateDate(-1)}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={600}>
                    {dateLabel}
                </Typography>
                <IconButton onClick={() => navigateDate(1)}>
                    <ChevronRightIcon />
                </IconButton>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TodayIcon />}
                    onClick={goToToday}
                >
                    Today
                </Button>
            </Stack>

            {/* Overload warning */}
            {isOverloaded && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    ⚠️ {plannedTaskIds.size}/{maxDaily} tasks — you&apos;re overcommitting!
                </Alert>
            )}
            {isTimeOverloaded && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    ⏰ {formatMinutes(totalPlannedMinutes)} planned vs {formatMinutes(maxMinutes)} max
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                }}
            >
                {/* Available tasks */}
                <Card
                    sx={{
                        background: 'rgba(26, 25, 41, 0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Available Tasks
                        </Typography>
                        <List dense disablePadding>
                            {activeTasks.map((task) => {
                                const q = QUADRANT_LABELS[task.quadrant];
                                const isPlanned = plannedTaskIds.has(task.id);
                                return (
                                    <ListItem key={task.id} disablePadding>
                                        <ListItemButton
                                            onClick={() => toggleTask(task.id)}
                                            sx={{ borderRadius: 1, mb: 0.5 }}
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={isPlanned}
                                                    edge="start"
                                                    tabIndex={-1}
                                                    disableRipple
                                                    sx={{
                                                        color: q.color,
                                                        '&.Mui-checked': { color: q.color },
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={task.title}
                                                secondary={
                                                    task.estimatedMinutes
                                                        ? formatMinutes(task.estimatedMinutes)
                                                        : undefined
                                                }
                                                primaryTypographyProps={{
                                                    fontWeight: 500,
                                                    fontSize: '0.9rem',
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{ color: q.color }}
                                            >
                                                {q.icon}
                                            </Typography>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                            {activeTasks.length === 0 && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}
                                >
                                    No active tasks. Create one with the + button.
                                </Typography>
                            )}
                        </List>
                    </CardContent>
                </Card>

                {/* Today's Plan */}
                <Card
                    sx={{
                        background: 'rgba(26, 25, 41, 0.6)',
                        border: '1px solid rgba(108,99,255,0.15)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                Day Plan
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                    label={`${plannedTaskIds.size}/${maxDaily}`}
                                    size="small"
                                    color={isOverloaded ? 'warning' : 'default'}
                                />
                                {totalPlannedMinutes > 0 && (
                                    <Chip
                                        label={formatMinutes(totalPlannedMinutes)}
                                        size="small"
                                        color={isTimeOverloaded ? 'error' : 'default'}
                                    />
                                )}
                            </Stack>
                        </Stack>

                        <Stack spacing={1}>
                            {plannedTasks.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}
                                >
                                    Select tasks from the left to plan your day.
                                </Typography>
                            ) : (
                                plannedTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} compact />
                                ))
                            )}
                        </Stack>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={savePlan}
                            disabled={isSaving}
                            sx={{ mt: 2 }}
                        >
                            {isSaving ? 'Saving...' : 'Save Day Plan'}
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Stack>
    );
}
