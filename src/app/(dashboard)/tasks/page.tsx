'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestoreIcon from '@mui/icons-material/Restore';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import { useTaskStore, type EisenhowerQuadrant, type TaskHorizon, type Task } from '@/store/taskStore';
import EisenhowerMatrix from '@/components/tasks/EisenhowerMatrix';
import { TaskGridFilterBar, type StatusFilter } from '@/components/tasks/TaskGridFilterBar';

const QUADRANT_PARAM_VALUES: EisenhowerQuadrant[] = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE', 'UNASSIGNED'];

function parseQuadrantParam(value: string | null): EisenhowerQuadrant | 'ALL' {
    if (value && (QUADRANT_PARAM_VALUES as readonly string[]).includes(value)) {
        return value as EisenhowerQuadrant;
    }
    return 'ALL';
}

function RecycleBinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const theme = useTheme();
    const { tasks, patchTask, deleteTask } = useTaskStore();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [emptyBinConfirmOpen, setEmptyBinConfirmOpen] = useState(false);

    const archivedTasks = tasks
        .filter((t) => t.status === 'ARCHIVED')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const handleRestore = async (task: Task) => {
        setLoadingId(task.id);
        await patchTask(task.id, { status: 'TODO' });
        setLoadingId(null);
    };

    const handlePermanentDelete = async (task: Task) => {
        setLoadingId(task.id);
        await deleteTask(task.id, true);
        setLoadingId(null);
    };

    const handleEmptyBin = async () => {
        setEmptyBinConfirmOpen(false);
        await Promise.all(archivedTasks.map(t => deleteTask(t.id, true)));
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                aria-labelledby="recycle-bin-title"
                aria-modal="true"
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <DialogTitle
                    id="recycle-bin-title"
                    sx={{ fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon /> Recycle Bin
                    </Box>
                    {archivedTasks.length > 0 && (
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => setEmptyBinConfirmOpen(true)}
                        >
                            Empty Bin
                        </Button>
                    )}
                </DialogTitle>
                <DialogContent>
                    {archivedTasks.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                            <DeleteOutlineIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                The recycle bin is empty.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            {archivedTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.error.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Tooltip title={task.title} placement="top-start">
                                            <Typography variant="body1" fontWeight={500} noWrap sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
                                                {task.title}
                                            </Typography>
                                        </Tooltip>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            Deleted: {new Date(task.archivedAt || task.updatedAt).toLocaleDateString()}
                                            {' • '}
                                            Auto-deletes in {Math.max(0, 400 - Math.floor((Date.now() - new Date(task.archivedAt || task.updatedAt).getTime()) / (1000 * 60 * 60 * 24)))} days
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button
                                            size="small"
                                            startIcon={loadingId === task.id ? <CircularProgress size={14} /> : <RestoreIcon />}
                                            onClick={() => handleRestore(task)}
                                            disabled={loadingId === task.id}
                                            sx={{ color: 'success.main', minHeight: 44 }}
                                        >
                                            Restore
                                        </Button>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handlePermanentDelete(task)}
                                            disabled={loadingId === task.id}
                                            aria-label={`Permanently delete "${task.title}"`}
                                            sx={{ minWidth: 44, minHeight: 44 }}
                                        >
                                            {loadingId === task.id ? (
                                                <CircularProgress size={16} color="error" />
                                            ) : (
                                                <DeleteIcon fontSize="small" />
                                            )}
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

            {/* Empty bin confirmation */}
            <Dialog
                open={emptyBinConfirmOpen}
                onClose={() => setEmptyBinConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
                aria-labelledby="empty-bin-confirm-title"
                aria-modal="true"
            >
                <DialogTitle id="empty-bin-confirm-title" sx={{ fontWeight: 600 }}>
                    Empty recycle bin?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        All {archivedTasks.length} archived task{archivedTasks.length !== 1 ? 's' : ''} will be permanently deleted. This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEmptyBinConfirmOpen(false)} color="inherit" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleEmptyBin} color="error" variant="contained">
                        Empty Bin
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const SAMPLE_TASKS: { title: string; quadrant: EisenhowerQuadrant }[] = [
    { title: 'Schedule a meeting', quadrant: 'DO_FIRST' },
    { title: 'Pay bills', quadrant: 'SCHEDULE' },
    { title: 'Reply to low-priority emails', quadrant: 'DELEGATE' },
    { title: 'Browse social media', quadrant: 'ELIMINATE' },
];

function StepDots({ total, current }: { total: number; current: number }) {
    return (
        <Stack direction="row" spacing={0.75} justifyContent="center" aria-label={`Step ${current + 1} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        width: i === current ? 20 : 8,
                        height: 8,
                        borderRadius: 100,
                        bgcolor: i === current ? 'primary.main' : 'action.disabled',
                        transition: 'width 0.2s ease, background-color 0.2s ease',
                    }}
                />
            ))}
        </Stack>
    );
}

function OnboardingWalkthroughDialog({
    open,
    onComplete,
}: {
    open: boolean;
    onComplete: () => void;
}) {
    const [step, setStep] = useState(0);
    const steps = [
        { title: 'Welcome to the Eisenhower Matrix', body: 'We\'ve added a few sample tasks in each quadrant. Drag tasks between quadrants to reprioritize.' },
        { title: 'Do First', body: 'Urgent & important. Drop tasks here when they need immediate attention.' },
        { title: 'Schedule', body: 'Important but not urgent. Plan these for later so they don\'t become last-minute fires.' },
        { title: 'You\'re all set', body: 'Use the + button or Cmd+N to add tasks. Drag to reorder. Click "Focus" on a Do First task to start a Pomodoro.' },
    ];

    const handleClose = () => {
        setStep(0);
        onComplete();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="onboarding-title"
            aria-modal="true"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                },
            }}
        >
            <DialogTitle id="onboarding-title" sx={{ fontWeight: 700, pb: 0 }}>
                {steps[step].title}
            </DialogTitle>
            <DialogContent>
                <Typography color="text.secondary" sx={{ pt: 1 }}>
                    {steps[step].body}
                </Typography>
            </DialogContent>
            <Stack spacing={2} sx={{ px: 3, pb: 2 }}>
                <StepDots total={steps.length} current={step} />
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        color="inherit"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                    >
                        Back
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button variant="contained" onClick={() => setStep((s) => s + 1)}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={handleClose}>
                            Got it
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Dialog>
    );
}

function TasksPageContent() {
    const searchParams = useSearchParams();
    const { tasks, isLoading, fetchTasks, createTask } = useTaskStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ACTIVE');
    const [quadrantFilter, setQuadrantFilter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
    const [horizonFilter, setHorizonFilter] = useState<TaskHorizon | 'ALL'>('ALL');
    const [recycleBinOpen, setRecycleBinOpen] = useState(false);
    const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(false);
    const [onboardingChecked, setOnboardingChecked] = useState(false);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'done') setStatusFilter('DONE');
        else if (status === 'all') setStatusFilter('ALL');
        else setStatusFilter('ACTIVE');

        setQuadrantFilter(parseQuadrantParam(searchParams.get('quadrant')));
    }, [searchParams]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // First-login onboarding: create sample tasks and show walkthrough
    useEffect(() => {
        if (isLoading || onboardingChecked || tasks.length > 0) return;

        const runOnboarding = async () => {
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) return;
                const settings = await res.json();
                if (settings.onboardingCompletedAt) {
                    setOnboardingChecked(true);
                    return;
                }
                for (const sample of SAMPLE_TASKS) {
                    await createTask({
                        title: sample.title,
                        quadrant: sample.quadrant,
                        horizon: 'SHORT_TERM',
                    });
                }
                setOnboardingDialogOpen(true);
                setOnboardingChecked(true);
            } catch {
                setOnboardingChecked(true);
            }
        };

        runOnboarding();
    }, [isLoading, tasks.length, onboardingChecked, createTask]);

    const handleOnboardingComplete = async () => {
        setOnboardingDialogOpen(false);
        try {
            await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ onboardingCompletedAt: new Date().toISOString() }),
            });
        } catch { /* ignore */ }
    };

    const filteredTasks = useMemo(() => tasks.filter((t) => {
        if (t.status === 'ARCHIVED') return false;
        if (statusFilter === 'ACTIVE' && t.status === 'DONE') return false;
        if (statusFilter === 'DONE' && t.status !== 'DONE') return false;
        if (quadrantFilter !== 'ALL' && t.quadrant !== quadrantFilter) return false;
        if (horizonFilter !== 'ALL' && t.horizon !== horizonFilter) return false;
        if (search) {
            const s = search.toLowerCase();
            return t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s);
        }
        return true;
    }), [tasks, statusFilter, quadrantFilter, horizonFilter, search]);

    const activeCount = useMemo(
        () => tasks.filter((t) => t.status !== 'DONE' && t.status !== 'ARCHIVED').length,
        [tasks]
    );
    const doneCount = useMemo(() => tasks.filter((t) => t.status === 'DONE').length, [tasks]);

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    letterSpacing="-0.02em"
                    sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
                >
                    All Tasks
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        component={Link}
                        href="/planner"
                        variant="outlined"
                        color="primary"
                        startIcon={<ViewTimelineIcon />}
                        size="medium"
                        sx={{ borderRadius: 100, px: 2.5, fontWeight: 600 }}
                    >
                        Plan timeline
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => setRecycleBinOpen(true)}
                        size="medium"
                        sx={{ borderRadius: 100, px: 2.5, fontWeight: 600 }}
                    >
                        Recycle bin
                    </Button>
                </Stack>
            </Stack>

            <TaskGridFilterBar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                quadrantFilter={quadrantFilter}
                onQuadrantChange={setQuadrantFilter}
                horizonFilter={horizonFilter}
                onHorizonChange={setHorizonFilter}
                activeCount={activeCount}
                doneCount={doneCount}
            />

            <Box sx={{ mt: 1 }}>
                <EisenhowerMatrix tasks={filteredTasks} />
            </Box>

            <RecycleBinDialog open={recycleBinOpen} onClose={() => setRecycleBinOpen(false)} />
            <OnboardingWalkthroughDialog
                open={onboardingDialogOpen}
                onComplete={handleOnboardingComplete}
            />
        </Stack>
    );
}

function TasksPageFallback() {
    return (
        <Stack spacing={3}>
            <Skeleton variant="text" width={220} height={44} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={420} sx={{ borderRadius: 2 }} />
        </Stack>
    );
}

export default function TasksPage() {
    return (
        <Suspense fallback={<TasksPageFallback />}>
            <TasksPageContent />
        </Suspense>
    );
}
