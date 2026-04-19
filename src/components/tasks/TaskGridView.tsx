'use client';

import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import CheckIcon from '@mui/icons-material/Check';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTaskStore, type Task, type EisenhowerQuadrant } from '@/store/taskStore';
import { QUADRANT_LABELS, formatMinutes } from '@/lib/utils';
import { QUADRANT_ICONS } from '@/lib/quadrantIcons';

type SortKey = 'title' | 'quadrant' | 'isChase' | 'estimatedMinutes' | 'dueDate';
type SortDir = 'asc' | 'desc';

const QUADRANT_ORDER: Record<EisenhowerQuadrant, number> = {
    DO_FIRST: 0, SCHEDULE: 1, DELEGATE: 2, ELIMINATE: 3, UNASSIGNED: 4,
};

const ALL_QUADRANTS: EisenhowerQuadrant[] = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE', 'UNASSIGNED'];

function formatDate(iso?: string | null) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
}

function isOverdue(task: Task) {
    return !!(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE');
}

// ─── Status toggle ─────────────────────────────────────────────────────────
function StatusCell({ task }: { task: Task }) {
    const { patchTask } = useTaskStore();
    const isDone = task.status === 'DONE';

    const toggle = useCallback(async (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        await patchTask(task.id, { status: isDone ? 'TODO' : 'DONE' });
    }, [task.id, isDone, patchTask]);

    return (
        <Box
            onClick={toggle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } }}
            role="checkbox"
            aria-checked={isDone}
            aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
            tabIndex={0}
            sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', minWidth: 44, minHeight: 44,
                color: isDone ? 'success.main' : 'text.disabled',
                '&:hover': { color: isDone ? 'success.dark' : 'text.secondary' },
                transition: 'color 0.15s',
                '&:focus-visible': { outline: '2px solid #000', outlineOffset: -2 },
            }}
        >
            {isDone
                ? <CheckCircleIcon sx={{ fontSize: 20 }} />
                : <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
        </Box>
    );
}

// ─── Quadrant selector ──────────────────────────────────────────────────────
function QuadrantCell({ task }: { task: Task }) {
    const { patchTask } = useTaskStore();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const quadrant = task.quadrant ?? 'UNASSIGNED';
    const meta = QUADRANT_LABELS[quadrant];
    const Icon = QUADRANT_ICONS[quadrant];

    const handleSelect = useCallback(async (q: EisenhowerQuadrant) => {
        setAnchor(null);
        if (q !== quadrant) await patchTask(task.id, { quadrant: q });
    }, [task.id, quadrant, patchTask]);

    return (
        <>
            <Tooltip title={`${meta.label} — click to change`} placement="top">
                <Box
                    onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setAnchor(e.currentTarget as HTMLElement); } }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Category: ${meta.label}. Click to change.`}
                    sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', p: 0.75, borderRadius: 1,
                        '&:hover': { bgcolor: `${meta.color}20` },
                        '&:focus-visible': { outline: '2px solid #000', outlineOffset: 2 },
                    }}
                >
                    <Icon sx={{ fontSize: 20, color: meta.color }} />
                </Box>
            </Tooltip>
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { borderRadius: 1, border: '2px solid #000', boxShadow: '3px 3px 0px #000', minWidth: 180, mt: 0.5 } }}
            >
                <List dense disablePadding role="listbox" sx={{ py: 0.5 }}>
                    {ALL_QUADRANTS.map((q) => {
                        const m = QUADRANT_LABELS[q];
                        const QIcon = QUADRANT_ICONS[q];
                        const selected = q === quadrant;
                        return (
                            <ListItemButton
                                key={q}
                                role="option"
                                aria-selected={selected}
                                onClick={() => handleSelect(q)}
                                selected={selected}
                                sx={{
                                    px: 2, py: 0.75,
                                    '&.Mui-selected': { bgcolor: '#FFE566', color: '#000' },
                                    '&:hover': { bgcolor: `${m.color}18` },
                                }}
                            >
                                <QIcon sx={{ fontSize: 16, color: selected ? '#000' : m.color, mr: 1.5, flexShrink: 0 }} />
                                <ListItemText
                                    primary={m.label}
                                    primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: selected ? 700 : 400 }}
                                />
                                {selected && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Popover>
        </>
    );
}

// ─── Actions (edit + archive) ──────────────────────────────────────────────
function ActionsCell({ task }: { task: Task }) {
    const { setEditingTask, deleteTask } = useTaskStore();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }} onClick={(e) => e.stopPropagation()}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}
                    aria-label="Edit task"
                    sx={{ minWidth: 44, minHeight: 44, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
                    aria-label="Archive task"
                    sx={{ minWidth: 44, minHeight: 44, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Box>
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
                aria-labelledby="del-confirm"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle id="del-confirm" sx={{ fontWeight: 700 }}>Archive task?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" variant="body2">
                        &ldquo;{task.title}&rdquo; will be moved to the archive.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit" autoFocus>Cancel</Button>
                    <Button onClick={async () => { setConfirmOpen(false); await deleteTask(task.id); }} color="error" variant="contained">
                        Archive
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ─── Sortable header cell ───────────────────────────────────────────────────
function SortCell({ label, sortId, current, dir, onSort }: {
    label: string; sortId: SortKey;
    current: SortKey; dir: SortDir;
    onSort: (k: SortKey) => void;
}) {
    return (
        <TableSortLabel
            active={current === sortId}
            direction={current === sortId ? dir : 'asc'}
            onClick={() => onSort(sortId)}
            sx={{ color: '#fff !important', '& .MuiTableSortLabel-icon': { color: '#fff !important', opacity: '0.7 !important' } }}
        >
            {label}
        </TableSortLabel>
    );
}

// ─── Main view ──────────────────────────────────────────────────────────────
interface TaskGridViewProps {
    tasks: Task[];
    onClearFilters?: () => void;
}

export default function TaskGridView({ tasks, onClearFilters }: TaskGridViewProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sortKey, setSortKey] = useState<SortKey>('quadrant');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setSortDir('asc'); }
    };

    const sorted = useMemo(() => [...tasks].sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
        else if (sortKey === 'quadrant') cmp = QUADRANT_ORDER[a.quadrant] - QUADRANT_ORDER[b.quadrant];
        else if (sortKey === 'isChase') cmp = (b.isChase ? 1 : 0) - (a.isChase ? 1 : 0);
        else if (sortKey === 'estimatedMinutes') cmp = (a.estimatedMinutes ?? 0) - (b.estimatedMinutes ?? 0);
        else if (sortKey === 'dueDate') {
            const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            cmp = da - db;
        }
        return sortDir === 'asc' ? cmp : -cmp;
    }), [tasks, sortKey, sortDir]);

    if (tasks.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                <FilterAltOffIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography variant="body1" sx={{ opacity: 0.7 }}>No tasks match your filters.</Typography>
                {onClearFilters && (
                    <Button variant="outlined" size="small" onClick={onClearFilters} sx={{ mt: 0.5 }}>
                        Clear filters
                    </Button>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ border: '2px solid #000', borderRadius: '4px', boxShadow: '4px 4px 0px #000', overflow: 'hidden', width: '100%' }}>
            <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#000000' }}>
                        <TableCell sx={{ width: 52, p: 0, border: 0 }} />
                        <TableCell sx={{ color: '#fff', fontWeight: 800, border: 0, fontSize: '0.875rem', py: 1.5 }}>
                            <SortCell label="Task" sortId="title" current={sortKey} dir={sortDir} onSort={handleSort} />
                        </TableCell>
                        <TableCell sx={{ width: 72, color: '#fff', fontWeight: 800, border: 0, fontSize: '0.875rem', py: 1.5 }}>
                            <SortCell label="↑" sortId="quadrant" current={sortKey} dir={sortDir} onSort={handleSort} />
                        </TableCell>
                        {!isMobile && (
                            <>
                                <TableCell sx={{ width: 90, color: '#fff', fontWeight: 800, border: 0, fontSize: '0.875rem', py: 1.5 }}>
                                    <SortCell label="Chase" sortId="isChase" current={sortKey} dir={sortDir} onSort={handleSort} />
                                </TableCell>
                                <TableCell sx={{ width: 90, color: '#fff', fontWeight: 800, border: 0, fontSize: '0.875rem', py: 1.5 }}>
                                    <SortCell label="Time" sortId="estimatedMinutes" current={sortKey} dir={sortDir} onSort={handleSort} />
                                </TableCell>
                                <TableCell sx={{ width: 140, color: '#fff', fontWeight: 800, border: 0, fontSize: '0.875rem', py: 1.5 }}>
                                    <SortCell label="Due" sortId="dueDate" current={sortKey} dir={sortDir} onSort={handleSort} />
                                </TableCell>
                            </>
                        )}
                        <TableCell sx={{ width: isMobile ? 96 : 84, border: 0 }} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((task, idx) => {
                        const q = task.quadrant ?? 'UNASSIGNED';
                        const color = QUADRANT_LABELS[q].color;
                        const isDone = task.status === 'DONE';
                        const overdueTask = isOverdue(task);
                        return (
                            <TableRow
                                key={task.id}
                                sx={{
                                    borderLeft: `4px solid ${color}`,
                                    bgcolor: `${color}12`,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: `${color}22` },
                                    borderBottom: idx < sorted.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                    transition: 'background-color 0.12s',
                                }}
                            >
                                <TableCell sx={{ p: 0, width: 52, border: 0 }}>
                                    <StatusCell task={task} />
                                </TableCell>
                                <TableCell sx={{ py: 1.5, pr: 1, border: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: q === 'DO_FIRST' ? 700 : 400,
                                            textDecoration: isDone ? 'line-through' : 'none',
                                            opacity: isDone ? 0.45 : 1,
                                            lineHeight: 1.4,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: isMobile ? 'normal' : 'nowrap',
                                            transition: 'opacity 0.2s ease',
                                        }}
                                    >
                                        {task.title}
                                    </Typography>
                                    {isMobile && (task.dueDate || task.estimatedMinutes != null || task.isChase) && (
                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                            {task.dueDate && (
                                                <Typography variant="caption" sx={{ color: overdueTask ? 'error.main' : 'text.secondary', fontWeight: overdueTask ? 600 : 400 }}>
                                                    {formatDate(task.dueDate)}
                                                </Typography>
                                            )}
                                            {task.estimatedMinutes != null && (
                                                <Typography variant="caption" color="text.secondary">{formatMinutes(task.estimatedMinutes)}</Typography>
                                            )}
                                            {task.isChase && (
                                                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>Chase</Typography>
                                            )}
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell sx={{ p: 0, width: 72, border: 0, textAlign: 'center' }}>
                                    <QuadrantCell task={task} />
                                </TableCell>
                                {!isMobile && (
                                    <>
                                        <TableCell sx={{ width: 90, py: 1.5, border: 0 }}>
                                            {task.isChase && (
                                                <Tooltip title="Chase">
                                                    <GpsFixedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ width: 90, py: 1.5, border: 0, color: 'text.secondary', fontSize: '0.85rem' }}>
                                            {task.estimatedMinutes != null ? formatMinutes(task.estimatedMinutes) : '—'}
                                        </TableCell>
                                        <TableCell sx={{
                                            width: 140, py: 1.5, border: 0,
                                            color: overdueTask ? 'error.main' : 'text.secondary',
                                            fontWeight: overdueTask ? 600 : 400,
                                            fontSize: '0.85rem',
                                        }}>
                                            {formatDate(task.dueDate)}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell sx={{ p: 0, width: isMobile ? 96 : 84, border: 0 }}>
                                    <ActionsCell task={task} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
}
