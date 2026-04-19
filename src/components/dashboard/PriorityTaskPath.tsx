'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlagIcon from '@mui/icons-material/Flag';
import type { Task } from '@/store/taskStore';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';
import { QUADRANT_LABELS as QUADRANT_META } from '@/lib/utils';
import { tasksDeepLinks } from '@/lib/taskDeepLinks';

function formatDue(due?: string) {
    if (!due) return '';
    const d = new Date(due);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Meta line next to quadrant chip: due only (chip already shows quadrant), or description / latest update. */
function buildPriorityMetaText(task: Task): string | null {
    if (task.description?.trim()) return task.description.trim();
    if (task.updates?.length) return task.updates[0].content;
    const due = formatDue(task.dueDate);
    if (due) return `Due ${due}`;
    return null;
}

function metaTextIsMultilineClamped(task: Task): boolean {
    return !!(task.description?.trim() || task.updates?.length);
}

export type PrioritySection = {
    id: string;
    title: string;
    subtitle: string;
    tasks: Task[];
    filterHref: string;
};

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function isActive(t: Task) {
    return t.status !== 'DONE' && t.status !== 'ARCHIVED';
}

/**
 * Ordered buckets: overdue → due today → Do first → Chase → Schedule (deduped).
 */
export function buildPriorityPathSections(tasks: Task[]): PrioritySection[] {
    const day = todayStr();
    const seen = new Set<string>();

    const take = (list: Task[]) => {
        const out: Task[] = [];
        for (const t of list) {
            if (!seen.has(t.id)) {
                seen.add(t.id);
                out.push(t);
            }
        }
        return out;
    };

    const overdue = take(
        tasks.filter((t) => isActive(t) && t.dueDate && t.dueDate.split('T')[0] < day)
    );
    const dueToday = take(
        tasks.filter((t) => isActive(t) && t.dueDate && t.dueDate.startsWith(day))
    );
    const doFirst = take(tasks.filter((t) => isActive(t) && t.quadrant === 'DO_FIRST'));
    const chase = take(tasks.filter((t) => isActive(t) && t.isChase));
    const schedule = take(tasks.filter((t) => isActive(t) && t.quadrant === 'SCHEDULE'));

    const sections: PrioritySection[] = [
        {
            id: 'overdue',
            title: 'Overdue',
            subtitle: 'Past due date',
            tasks: overdue,
            filterHref: tasksDeepLinks.overdue,
        },
        {
            id: 'dueToday',
            title: 'Due today',
            subtitle: 'Due by end of day',
            tasks: dueToday,
            filterHref: tasksDeepLinks.dueToday,
        },
        {
            id: 'doFirst',
            title: 'Do first',
            subtitle: 'Urgent & important',
            tasks: doFirst,
            filterHref: tasksDeepLinks.doFirst,
        },
        {
            id: 'chase',
            title: 'Chase',
            subtitle: 'Needs follow-up',
            tasks: chase,
            filterHref: tasksDeepLinks.chase,
        },
        {
            id: 'schedule',
            title: 'Schedule',
            subtitle: 'Important, not urgent',
            tasks: schedule,
            filterHref: tasksDeepLinks.schedule,
        },
    ];

    return sections.filter((s) => s.tasks.length > 0);
}

interface PriorityTaskPathProps {
    tasks: Task[];
    onComplete: (id: string) => void;
    onSelect: (task: Task) => void;
}

export function PriorityTaskPath({ tasks, onComplete, onSelect }: PriorityTaskPathProps) {
    const theme = useTheme();
    const isLuxury = useLuxuryDashboard();
    const sections = buildPriorityPathSections(tasks);
    const borderSubtle =
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(26, 26, 26, 0.08)';

    const panelSx = isLuxury
        ? frostedLuxury.panel
        : {
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
          };

    const scrollRegionSx = {
        maxHeight: { xs: 380, sm: 440, md: 520 },
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const,
        pr: 0.5,
        mr: -0.5,
        minHeight: 0,
        WebkitOverflowScrolling: 'touch' as const,
    };

    if (sections.length === 0) {
        return (
            <Box sx={{ borderRadius: 3, p: { xs: 2, md: 3 }, ...panelSx, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, flexShrink: 0 }}>
                    <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" color="text.primary">
                        Priority path
                    </Typography>
                    <Button component={Link} href={tasksDeepLinks.all} variant="outlined" size="small" sx={{ fontWeight: 700 }}>
                        View all tasks
                    </Button>
                </Box>
                <Box sx={scrollRegionSx}>
                    <Typography color="text.secondary" fontWeight={500}>
                        Nothing in your priority queues right now. Add tasks or open the full list.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ borderRadius: 3, p: { xs: 2, md: 3 }, ...panelSx, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2.5,
                    flexShrink: 0,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em" color="text.primary">
                        Priority path
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Overdue first, then today, Do first, Chase, and Schedule.
                    </Typography>
                </Box>
                <Button component={Link} href={tasksDeepLinks.all} variant="contained" size="medium" sx={{ fontWeight: 700, borderRadius: 2 }}>
                    View all tasks
                </Button>
            </Box>

            <Box sx={scrollRegionSx}>
                <StackSections
                    sections={sections}
                    isLuxury={isLuxury}
                    borderSubtle={borderSubtle}
                    onComplete={onComplete}
                    onSelect={onSelect}
                />
            </Box>
        </Box>
    );
}

function StackSections({
    sections,
    isLuxury,
    borderSubtle,
    onComplete,
    onSelect,
}: {
    sections: PrioritySection[];
    isLuxury: boolean;
    borderSubtle: string;
    onComplete: (id: string) => void;
    onSelect: (task: Task) => void;
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {sections.map((section) => (
                <Box key={section.id}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 1.5,
                            pb: 1,
                            borderBottom: `1px solid ${borderSubtle}`,
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
                                {section.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                                {section.subtitle}
                            </Typography>
                        </Box>
                        <Typography
                            component={Link}
                            href={section.filterHref}
                            variant="caption"
                            sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Open in Tasks
                        </Typography>
                    </Box>
                    <Box sx={{ position: 'relative', pl: { xs: 3.5, sm: 4 } }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 15,
                                top: 12,
                                bottom: 12,
                                width: 2,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                opacity: 0.2,
                            }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 1.75 } }}>
                            {section.tasks.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    isLuxury={isLuxury}
                                    borderSubtle={borderSubtle}
                                    onComplete={onComplete}
                                    onSelect={onSelect}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

function TaskRow({
    task,
    isLuxury,
    borderSubtle,
    onComplete,
    onSelect,
}: {
    task: Task;
    isLuxury: boolean;
    borderSubtle: string;
    onComplete: (id: string) => void;
    onSelect: (task: Task) => void;
}) {
    return (
        <Box sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
                sx={{
                    position: 'absolute',
                    left: -26,
                    top: 4,
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '2px solid',
                    borderColor: task.isChase ? 'secondary.main' : 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {task.isChase ? (
                    <FlagIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                ) : (
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: 0.5,
                            bgcolor: 'primary.main',
                        }}
                    />
                )}
            </Box>
            <Box
                onClick={() => onSelect(task)}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(task);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Task: ${task.title}`}
                sx={{
                    flex: 1,
                    minWidth: 0,
                    p: { xs: 2, md: 1.75 },
                    borderRadius: 2,
                    borderLeft: `6px solid ${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}`,
                    cursor: 'pointer',
                    transition: 'background 0.18s, box-shadow 0.18s',
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                    ...(isLuxury
                        ? {
                              ...frostedLuxury.panelDense,
                              backgroundColor: `${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}0A`,
                              '&:hover': {
                                  backgroundColor: `${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}14`,
                                  boxShadow: '0 6px 20px rgba(48, 32, 90, 0.08)',
                              },
                          }
                        : {
                              bgcolor: `${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}0A`,
                              border: `1px solid ${borderSubtle}`,
                              borderLeft: `6px solid ${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}`,
                              '&:hover': { bgcolor: `${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}14` },
                          }),
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{
                        color: 'text.primary',
                        letterSpacing: '-0.02em',
                        width: '100%',
                        lineHeight: 1.35,
                        fontSize: { xs: '1.02rem', md: '1rem' },
                    }}
                >
                    {task.title}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 1,
                        rowGap: 0.75,
                    }}
                >
                    <Chip
                        label={QUADRANT_META[task.quadrant]?.label || 'Backlog'}
                        size="small"
                        sx={{
                            height: 22,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            bgcolor: `${QUADRANT_META[task.quadrant]?.color || '#9E9E9E'}18`,
                            color: QUADRANT_META[task.quadrant]?.color || '#9E9E9E',
                            flexShrink: 0,
                        }}
                    />
                    {task.isChase && (
                        <Chip
                            label="Chase"
                            size="small"
                            sx={{
                                height: 22,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: 'rgba(201, 162, 39, 0.2)',
                                color: 'secondary.dark',
                                flexShrink: 0,
                            }}
                        />
                    )}
                    {buildPriorityMetaText(task) && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.55,
                                minWidth: 0,
                                flex: '1 1 120px',
                                whiteSpace: metaTextIsMultilineClamped(task) ? undefined : 'nowrap',
                                ...(metaTextIsMultilineClamped(task) && {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }),
                            }}
                        >
                            {buildPriorityMetaText(task)}
                        </Typography>
                    )}
                </Box>
            </Box>
            <IconButton
                aria-label={`Mark ${task.title} as done`}
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task.id);
                }}
                sx={{
                    mt: { xs: 0.5, md: 0.75 },
                    minWidth: 48,
                    minHeight: 48,
                    color: 'text.secondary',
                    '&:hover': { color: 'success.main' },
                }}
            >
                <CheckCircleOutlineIcon sx={{ fontSize: { xs: '1.35rem', md: '1.25rem' } }} />
            </IconButton>
        </Box>
    );
}
