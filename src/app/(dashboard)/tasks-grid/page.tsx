'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTaskStore, type EisenhowerQuadrant, type TaskHorizon } from '@/store/taskStore';
import { TaskGridFilterBar, type StatusFilter } from '@/components/tasks/TaskGridFilterBar';
import TaskGridView from '@/components/tasks/TaskGridView';

const QUADRANT_PARAM_VALUES: EisenhowerQuadrant[] = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE', 'UNASSIGNED'];

function parseQuadrantParam(value: string | null): EisenhowerQuadrant | 'ALL' {
    if (value && (QUADRANT_PARAM_VALUES as readonly string[]).includes(value)) {
        return value as EisenhowerQuadrant;
    }
    return 'ALL';
}

function TasksGridContent() {
    const searchParams = useSearchParams();
    const { tasks, isLoading, fetchTasks } = useTaskStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ACTIVE');
    const [quadrantFilter, setQuadrantFilter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
    const [horizonFilter, setHorizonFilter] = useState<TaskHorizon | 'ALL'>('ALL');

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
                <Box>
                    <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
                        Task Grid
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Click any cell to edit · Click category chip to move ·
                        <CheckCircleOutlineIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /> to complete
                    </Typography>
                </Box>
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

            {isLoading ? (
                <Stack spacing={1}>
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 1 }} />
                    ))}
                </Stack>
            ) : (
                <TaskGridView
                    tasks={filteredTasks}
                    onClearFilters={() => {
                        setSearch('');
                        setStatusFilter('ACTIVE');
                        setQuadrantFilter('ALL');
                        setHorizonFilter('ALL');
                    }}
                />
            )}
        </Stack>
    );
}

function TasksGridFallback() {
    return (
        <Stack spacing={3}>
            <Skeleton variant="text" width={200} height={44} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
            <Stack spacing={1}>
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 1 }} />
                ))}
            </Stack>
        </Stack>
    );
}

export default function TasksGridPage() {
    return (
        <Suspense fallback={<TasksGridFallback />}>
            <TasksGridContent />
        </Suspense>
    );
}
