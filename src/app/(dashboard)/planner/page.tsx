'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Skeleton from '@mui/material/Skeleton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import InboxIcon from '@mui/icons-material/Inbox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTaskStore, type Task } from '@/store/taskStore';
import { formatMinutes } from '@/lib/utils';
import {
    DndContext,
    DragOverlay,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import DraggableTaskCard from '@/components/tasks/DraggableTaskCard';
import TaskCard from '@/components/tasks/TaskCard';

interface CalendarEvent {
    id: string;
    calendarName: string;
    calendarColor: string;
    summary: string;
    isDuplicate: boolean;
    description?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}

interface PlannedTaskData {
    timeSlotStart: string | null;
    timeSlotEnd: string | null;
}

export default function PlannerPage() {
    const { tasks, isLoading: isTasksLoading, fetchTasks, patchTask } = useTaskStore();
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    // Map of taskId -> { timeSlotStart, timeSlotEnd }
    const [plannedTasksMap, setPlannedTasksMap] = useState<Record<string, PlannedTaskData>>({});

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isEventsLoading, setIsEventsLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const [isSaving, setIsSaving] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [inboxOpen, setInboxOpen] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);

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
        fetchEvents();
    }, [selectedDate]);

    const fetchDailyPlan = async () => {
        try {
            const res = await fetch(`/api/planning/daily?date=${selectedDate}`);
            if (res.ok) {
                const data = await res.json();
                setOverloadInfo(data.overload);
                if (data.plan?.tasks) {
                    const map: Record<string, PlannedTaskData> = {};
                    data.plan.tasks.forEach((pt: any) => {
                        map[pt.taskId] = {
                            timeSlotStart: pt.timeSlotStart,
                            timeSlotEnd: pt.timeSlotEnd,
                        };
                    });
                    setPlannedTasksMap(map);
                } else {
                    setPlannedTasksMap({});
                }
            }
        } catch { /* graceful degradation */ }
    };

    const fetchEvents = async () => {
        setIsEventsLoading(true);
        try {
            const res = await fetch(`/api/calendar/events?date=${selectedDate}&hideDuplicates=true`);
            if (res.ok) {
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            }
        } catch { /* graceful degradation */ }
        setIsEventsLoading(false);
    };

    const savePlan = async (silent = false) => {
        if (!silent) setIsSaving(true);
        try {
            const tasksArray = Object.entries(plannedTasksMap).map(([taskId, data]) => ({
                taskId,
                ...data
            }));

            await fetch('/api/planning/daily', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    tasks: tasksArray,
                }),
            });
            if (!silent) await fetchDailyPlan();
        } catch { /* error handling */ }
        if (!silent) setIsSaving(false);
    };

    const handleAutoSchedule = async () => {
        setIsScheduling(true);
        try {
            // Get all tasks in the Day Plan bucket without a timeslot
            const unblockedTasks = tasks.filter((t) => Object.hasOwn(plannedTasksMap, t.id) && !plannedTasksMap[t.id].timeSlotStart);
            if (unblockedTasks.length === 0) {
                alert("No unscheduled tasks in the Day Plan Bucket.");
                setIsScheduling(false);
                return;
            }

            const cleanEvents = events.map(e => ({
                summary: e.summary,
                start: e.start?.dateTime || e.start?.date,
                end: e.end?.dateTime || e.end?.date,
            }));

            const cleanTasks = unblockedTasks.map(t => ({
                taskId: t.id,
                title: t.title,
                estimatedMinutes: t.estimatedMinutes,
                quadrant: t.quadrant,
            }));

            const res = await fetch('/api/planning/auto-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    tasks: cleanTasks,
                    events: cleanEvents,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.schedule && Array.isArray(data.schedule)) {
                    setPlannedTasksMap(prev => {
                        const next = { ...prev };
                        data.schedule.forEach((item: any) => {
                            if (next[item.taskId]) {
                                next[item.taskId] = {
                                    timeSlotStart: item.timeSlotStart,
                                    timeSlotEnd: item.timeSlotEnd,
                                };
                            }
                        });
                        return next;
                    });
                }
            } else {
                alert("Failed to auto-schedule.");
            }
        } catch (e) {
            console.error(e);
            alert("Error auto-scheduling.");
        }
        setIsScheduling(false);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;
        const task = tasks.find(t => t.id === taskId);

        if (!task) return;

        if (overId === 'backlog' || overId === 'this-week') {
            // Remove from plan
            const horizon = overId === 'backlog' ? 'LONG_TERM' : 'SHORT_TERM';
            patchTask(taskId, { horizon });
            setPlannedTasksMap((prev) => {
                const next = { ...prev };
                delete next[taskId];
                return next;
            });
        } else if (overId === 'planned') {
            // Add to Day Plan bucket (no time slot)
            patchTask(taskId, { horizon: 'SHORT_TERM' });
            setPlannedTasksMap((prev) => ({
                ...prev,
                [taskId]: { timeSlotStart: null, timeSlotEnd: null }
            }));
        } else if (overId.startsWith('timeline-slot-')) {
            // Dropped onto a specific time slot on the calendar
            const hourStr = overId.replace('timeline-slot-', ''); // e.g. "09:00"
            const startStr = `${selectedDate}T${hourStr}:00`;

            // Calculate end time based on estimated minutes (default 30)
            const durationMins = task.estimatedMinutes || 30;
            const endDate = new Date(startStr);
            endDate.setMinutes(endDate.getMinutes() + durationMins);
            const endStr = endDate.toISOString();

            patchTask(taskId, { horizon: 'SHORT_TERM' });
            setPlannedTasksMap((prev) => ({
                ...prev,
                [taskId]: { timeSlotStart: startStr, timeSlotEnd: endStr }
            }));
        }
    };

    const updateTaskDuration = (taskId: string, minutesDelta: number) => {
        setPlannedTasksMap(prev => {
            const taskData = prev[taskId];
            if (!taskData || !taskData.timeSlotStart || !taskData.timeSlotEnd) return prev;

            const start = new Date(taskData.timeSlotStart);
            const end = new Date(taskData.timeSlotEnd);
            const currentDuration = Math.round((end.getTime() - start.getTime()) / 60000);
            const newDuration = Math.max(15, currentDuration + minutesDelta);

            const newEnd = new Date(start.getTime() + newDuration * 60000);

            // Background update to base task
            patchTask(taskId, { estimatedMinutes: newDuration });

            return {
                ...prev,
                [taskId]: {
                    ...taskData,
                    timeSlotEnd: newEnd.toISOString()
                }
            };
        });
    };

    const navigateDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    // Filter tasks
    const backlogTasks = tasks.filter(
        (t) => t.status !== 'DONE' && t.status !== 'ARCHIVED' && t.horizon === 'LONG_TERM' && !plannedTasksMap[t.id]
    );
    const thisWeekTasks = tasks.filter(
        (t) => t.status !== 'DONE' && t.status !== 'ARCHIVED' && t.horizon === 'SHORT_TERM' && !plannedTasksMap[t.id]
    );

    // Planned tasks inside the Day Plan (no time slot)
    const bucketTasks = tasks.filter((t) => plannedTasksMap[t.id] && !plannedTasksMap[t.id].timeSlotStart);

    // Timeblocked tasks (have a start time)
    const timeblockedTasks = tasks.filter((t) => plannedTasksMap[t.id]?.timeSlotStart);

    const plannedCount = Object.keys(plannedTasksMap).length;
    const totalPlannedMinutes = Object.keys(plannedTasksMap).reduce((sum, id) => {
        const t = tasks.find(x => x.id === id);
        return sum + (t?.estimatedMinutes || 0);
    }, 0);

    const maxDaily = overloadInfo?.maxDaily || 8;
    const maxMinutes = overloadInfo?.maxDailyMinutes || 480;
    const isOverloaded = plannedCount > maxDaily;
    const isTimeOverloaded = totalPlannedMinutes > maxMinutes;

    const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    const activeTask = tasks.find((t) => t.id === activeId);

    // Timeline slots (30-min increments from 7am to 8pm)
    const timeSlotsList: { hour: number; minute: number }[] = [];
    for (let h = 7; h <= 20; h++) {
        timeSlotsList.push({ hour: h, minute: 0 });
        timeSlotsList.push({ hour: h, minute: 30 });
    }

    const formatTime = (isoString?: string | null) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Stack spacing={3}>
                {/* Header / Nav */}
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
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
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        >
                            Today
                        </Button>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<InboxIcon />}
                            onClick={() => setInboxOpen(true)}
                        >
                            Inbox ({(backlogTasks.length + thisWeekTasks.length)})
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => savePlan(false)}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Plan'}
                        </Button>
                    </Stack>
                </Stack>

                {/* Overload warnings */}
                {isOverloaded && (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        ⚠️ {plannedCount}/{maxDaily} tasks — you&apos;re overcommitting!
                    </Alert>
                )}
                {isTimeOverloaded && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        ⏰ {formatMinutes(totalPlannedMinutes)} planned vs {formatMinutes(maxMinutes)} max
                    </Alert>
                )}

                {/* Split Screen Layout */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '350px 1fr' },
                        gap: 3,
                        alignItems: 'start'
                    }}
                >
                    {/* Left: Day Plan Bucket */}
                    <DroppableList
                        id="planned"
                        title="Day Plan Bucket"
                        subtitle="Tasks to do today (drag to calendar)"
                        tasks={bucketTasks}
                        isPlanning={true}
                        emptyContent={
                            <Stack spacing={2} alignItems="center">
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    Your day plan is empty.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<InboxIcon />}
                                    onClick={() => setInboxOpen(true)}
                                >
                                    Open Inbox to add tasks
                                </Button>
                            </Stack>
                        }
                    />

                    {/* Right: Calendar Timeline */}
                    <Card
                        sx={{
                            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                            minHeight: 600,
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={600}>Timeline</Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    endIcon={<AccessTimeIcon />}
                                    onClick={handleAutoSchedule}
                                    disabled={isScheduling}
                                >
                                    {isScheduling ? 'Scheduling...' : 'Auto-Schedule My Day ✨'}
                                </Button>
                            </Box>

                            {isEventsLoading ? (
                                <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /></Box>
                            ) : (
                                <Stack spacing={0}>
                                    {timeSlotsList.map(({ hour, minute }) => {
                                        const hourStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                        const slotId = `timeline-slot-${hourStr}`;

                                        // Find calendar events for this slot
                                        const slotEvents = events.filter((e) => {
                                            const start = e.start?.dateTime;
                                            if (!start) return false;
                                            const d = new Date(start);
                                            return d.getHours() === hour && (minute === 0 ? d.getMinutes() < 30 : d.getMinutes() >= 30);
                                        });

                                        // Find timeblocked tasks for this slot
                                        const slotTasks = timeblockedTasks.filter((t) => {
                                            const start = plannedTasksMap[t.id]?.timeSlotStart;
                                            if (!start) return false;
                                            const d = new Date(start);
                                            return d.getHours() === hour && (minute === 0 ? d.getMinutes() < 30 : d.getMinutes() >= 30);
                                        });

                                        return (
                                            <TimeSlot
                                                key={slotId}
                                                id={slotId}
                                                hourStr={hourStr}
                                                isHalfHour={minute === 30}
                                                events={slotEvents}
                                                tasks={slotTasks}
                                                taskMap={plannedTasksMap}
                                                formatTime={formatTime}
                                                onUpdateDuration={updateTaskDuration}
                                            />
                                        );
                                    })}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Stack>

            {/* Inbox Drawer */}
            <Drawer
                anchor="left"
                open={inboxOpen}
                onClose={() => setInboxOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 400,
                        p: 3,
                        background: (theme) => theme.palette.background.default,
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                    }
                }}
            >
                <Typography variant="h5" fontWeight={600} mb={3}>Inbox</Typography>
                <Stack spacing={4}>
                    <DroppableList
                        id="this-week"
                        title="This Week"
                        subtitle="Short Term Priorities"
                        tasks={thisWeekTasks}
                        isPlanning={false}
                    />
                    <DroppableList
                        id="backlog"
                        title="Backlog"
                        subtitle="Long Term / Someday"
                        tasks={backlogTasks}
                        isPlanning={false}
                    />
                </Stack>
            </Drawer>

            <DragOverlay>
                {activeId && activeTask ? (
                    <div style={{ opacity: 0.8, transform: 'scale(1.05)' }}>
                        <TaskCard task={activeTask} compact />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Sub-components

function TimeSlot({
    id,
    hourStr,
    isHalfHour,
    events,
    tasks,
    taskMap,
    formatTime,
    onUpdateDuration
}: {
    id: string;
    hourStr: string;
    isHalfHour: boolean;
    events: CalendarEvent[];
    tasks: Task[];
    taskMap: Record<string, PlannedTaskData>;
    formatTime: (s?: string | null) => string;
    onUpdateDuration: (taskId: string, mins: number) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                minHeight: isHalfHour ? 40 : 70,
                borderBottom: isHalfHour ? '1px solid rgba(255,255,255,0.04)' : '1px dashed rgba(255,255,255,0.02)',
                background: isOver ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                transition: 'background 0.2s'
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ pt: 1, textAlign: 'right', pr: 2 }}
            >
                {hourStr}
            </Typography>
            <Box sx={{ py: 1, pl: 1, pr: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>

                {/* Google Calendar Events */}
                {events.map((event) => (
                    <Box
                        key={event.id}
                        sx={{
                            p: 1.5,
                            borderRadius: 1,
                            background: `${event.calendarColor || '#1E88E5'}15`,
                            borderLeft: `3px solid ${event.calendarColor || '#1E88E5'}`,
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={500}>{event.summary}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatTime(event.start?.dateTime)} - {formatTime(event.end?.dateTime)}
                            </Typography>
                        </Stack>
                    </Box>
                ))}

                {/* Timeblocked Tasks */}
                {tasks.map((task) => {
                    const durationMins = Math.round((new Date(taskMap[task.id].timeSlotEnd!).getTime() - new Date(taskMap[task.id].timeSlotStart!).getTime()) / 60000);
                    return (
                        <Box key={task.id} sx={{ position: 'relative' }}>
                            <DraggableTaskCard task={task} compact disableSwipe />
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, ml: 1 }}>
                                <Typography variant="caption" sx={{ color: 'primary.main' }}>
                                    ⏱️ {formatTime(taskMap[task.id].timeSlotStart)} - {formatTime(taskMap[task.id].timeSlotEnd)} ({durationMins}m)
                                </Typography>
                                <Button size="small" variant="text" sx={{ minWidth: 0, p: 0.5, fontSize: '0.7rem' }} onClick={() => onUpdateDuration(task.id, -15)}>-15m</Button>
                                <Button size="small" variant="text" sx={{ minWidth: 0, p: 0.5, fontSize: '0.7rem' }} onClick={() => onUpdateDuration(task.id, 15)}>+15m</Button>
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

function DroppableList({
    id,
    title,
    subtitle,
    tasks,
    isPlanning,
    emptyContent,
}: {
    id: string;
    title: string;
    subtitle?: string;
    tasks: Task[];
    isPlanning: boolean;
    emptyContent?: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Card
            ref={setNodeRef}
            sx={{
                background: (theme) => isOver
                    ? 'rgba(108, 99, 255, 0.1)'
                    : theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                border: (theme) => isOver
                    ? '1px dashed rgba(108, 99, 255, 0.5)'
                    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                transition: 'all 0.2s',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <List dense disablePadding sx={{ flex: 1 }}>
                    {tasks.map((task) => (
                        <Box key={task.id} sx={{ mb: 1.5 }}>
                            <DraggableTaskCard task={task} compact disableSwipe />
                        </Box>
                    ))}
                    {tasks.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6, opacity: 0.5 }}>
                            {emptyContent ? (
                                emptyContent
                            ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {isPlanning ? 'Drag tasks here to plan your day.' : 'Empty list.'}
                                </Typography>
                            )}
                        </Box>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
