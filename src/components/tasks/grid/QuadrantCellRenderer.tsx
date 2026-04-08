'use client';

import { useState, useCallback } from 'react';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { useTaskStore, type EisenhowerQuadrant, type Task } from '@/store/taskStore';
import { QUADRANT_LABELS } from '@/lib/utils';

const QUADRANT_ORDER: EisenhowerQuadrant[] = ['DO_FIRST', 'SCHEDULE', 'DELEGATE', 'ELIMINATE', 'UNASSIGNED'];

export default function QuadrantCellRenderer(props: CustomCellRendererProps<Task>) {
    const { patchTask } = useTaskStore();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const task = props.data;
    const quadrant = task?.quadrant ?? 'UNASSIGNED';
    const meta = QUADRANT_LABELS[quadrant];

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
            <Chip
                label={`${meta.icon} ${meta.label}`}
                size="small"
                onClick={handleOpen}
                aria-label={`Quadrant: ${meta.label}. Click to change.`}
                sx={{
                    bgcolor: `${meta.color}20`,
                    color: meta.color,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: `1px solid ${meta.color}40`,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: `${meta.color}35` },
                }}
            />
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
                <List dense disablePadding sx={{ py: 0.5 }}>
                    {QUADRANT_ORDER.map((q) => {
                        const m = QUADRANT_LABELS[q];
                        const selected = q === quadrant;
                        return (
                            <ListItemButton
                                key={q}
                                onClick={() => handleSelect(q)}
                                selected={selected}
                                sx={{
                                    px: 2,
                                    py: 0.75,
                                    '&.Mui-selected': { bgcolor: `${m.color}15` },
                                    '&:hover': { bgcolor: `${m.color}18` },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: m.color,
                                        mr: 1.5,
                                        flexShrink: 0,
                                    }}
                                />
                                <ListItemText
                                    primary={`${m.icon} ${m.label}`}
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
