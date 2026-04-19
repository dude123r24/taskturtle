'use client';

import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { useTaskStore, type EisenhowerQuadrant, type Task } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';
import { QUADRANT_ICONS } from '@/lib/quadrantIcons';

const QUADRANT_ORDER: EisenhowerQuadrant[] = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE', 'UNASSIGNED'];

export default function QuadrantCellRenderer(props: CustomCellRendererProps<Task>) {
    const { patchTask } = useTaskStore();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const task = props.data;
    const quadrant = task?.quadrant ?? 'UNASSIGNED';
    const meta = QUADRANT_LABELS[quadrant];
    const Icon = QUADRANT_ICONS[quadrant];

    const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchor(e.currentTarget);
    }, []);

    const handleSelect = useCallback(async (q: EisenhowerQuadrant) => {
        setAnchor(null);
        if (task && q !== quadrant) {
            await patchTask(task.id, { quadrant: q });
        }
    }, [task, quadrant, patchTask]);

    return (
        <>
            <Tooltip title={meta.label} placement="top">
                <Box
                    onClick={handleOpen}
                    aria-label={`Category: ${meta.label}. Click to change.`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(e as any); }}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: `${meta.color}18` }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
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
                PaperProps={{
                    sx: { borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 180, mt: 0.5 },
                }}
            >
                <List dense disablePadding role="listbox" aria-label="Select category" sx={{ py: 0.5 }}>
                    {QUADRANT_ORDER.map((q) => {
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
                                    '&.Mui-selected': { bgcolor: `${m.color}15` },
                                    '&:hover': { bgcolor: `${m.color}18` },
                                }}
                            >
                                <QIcon sx={{ fontSize: 16, color: m.color, mr: 1.5, flexShrink: 0 }} />
                                <ListItemText
                                    primary={m.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.85rem',
                                        fontWeight: selected ? 600 : 400,
                                        color: selected ? m.color : 'text.primary',
                                    }}
                                />
                                {selected && <CheckIcon sx={{ fontSize: 16, color: m.color, ml: 1 }} />}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Popover>
        </>
    );
}
