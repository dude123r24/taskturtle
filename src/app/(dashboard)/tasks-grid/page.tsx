'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useTaskStore, type EisenhowerQuadrant, type TaskHorizon } from '@/store/taskStore';
import { TasksFilterBar } from '@/components/tasks/TasksFilterBar';
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
    const [statusTab, setStatusTab] = useState(0);
    const [quadrantFilter, setQuadrantFilter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
    const [horizonFilter, setHorizonFilter] = useState<TaskHorizon | 'ALL'>('ALL');
    const [dueScope, setDueScope] = useState<'ALL' | 'overdue' | 'today'>('ALL');
    const [chaseOnly, setChaseOnly] = useState(false);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'done') setStatusTab(1);
        else if (status === 'all') setStatusTab(2);
        else setStatusTab(0);

        const due = searchParams.get('due');
        if (due === 'overdue' || due === 'today') setDueScope(due);
        else setDueScope('ALL');

        const chase = searchParams.get('chase');
        setChaseOnly(chase === '1' || chase === 'true');

        setQuadrantFilter(parseQuadrantParam(searchParams.get('quadrant')));
    }, [searchParams]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredTasks = useMemo(() => tasks.filter((t) => {
        if (t.status === 'ARCHIVED') return false;

        if (dueScope === 'overdue') {
            if (!t.dueDate || t.dueDate.split('T')[0] >= todayStr) return false;
        }
        if (dueScope === 'today') {
            if (!t.dueDate || !t.dueDate.startsWith(todayStr)) return false;
        }
        if (chaseOnly && !t.isChase) return false;

        if (statusTab === 0 && t.status === 'DONE') return false;
        if (statusTab === 1 && t.status !== 'DONE') return false;

        if (quadrantFilter !== 'ALL' && t.quadrant !== quadrantFilter) return false;
        if (horizonFilter !== 'ALL' && t.horizon !== horizonFilter) return false;

        if (search) {
            const s = search.toLowerCase();
            return t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s);
        }

        return true;
    }), [tasks, dueScope, todayStr, chaseOnly, statusTab, quadrantFilter, horizonFilter, search]);

    const activeCount = useMemo(
        () => tasks.filter((t) => t.status !== 'DONE' && t.status !== 'ARCHIVED').length,
        [tasks]
    );
    const doneCount = useMemo(() => tasks.filter((t) => t.status === 'DONE').length, [tasks]);
    const allCount = useMemo(() => tasks.filter((t) => t.status !== 'ARCHIVED').length, [tasks]);

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Box>
                    <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
                        Task Grid
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                        Click any cell to edit · Click category chip to move · ✓ to complete
                    </Typography>
                </Box>
            </Stack>

            <TasksFilterBar
                search={search}
                onSearchChange={setSearch}
                quadrantFilter={quadrantFilter}
                onQuadrantChange={setQuadrantFilter}
                horizonFilter={horizonFilter}
                onHorizonChange={setHorizonFilter}
                statusTab={statusTab}
                onStatusTabChange={setStatusTab}
                activeCount={activeCount}
                doneCount={doneCount}
                allCount={allCount}
            />

            {isLoading ? (
                <Stack spacing={1}>
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 1 }} />
                    ))}
                </Stack>
            ) : (
                <TaskGridView tasks={filteredTasks} />
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
