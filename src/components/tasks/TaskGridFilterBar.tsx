'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import type { EisenhowerQuadrant, TaskHorizon } from '@/store/taskStore';

export interface TaskGridFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    quadrantFilter: EisenhowerQuadrant | 'ALL';
    onQuadrantChange: (value: EisenhowerQuadrant | 'ALL') => void;
    horizonFilter: TaskHorizon | 'ALL';
    onHorizonChange: (value: TaskHorizon | 'ALL') => void;
    statusTab: number;
    onStatusTabChange: (value: number) => void;
    activeCount: number;
    doneCount: number;
    allCount: number;
}

const STATUS_VALUES = ['active', 'done', 'all'] as const;

export function TaskGridFilterBar({
    search,
    onSearchChange,
    quadrantFilter,
    onQuadrantChange,
    horizonFilter,
    onHorizonChange,
    statusTab,
    onStatusTabChange,
    activeCount,
    doneCount,
    allCount,
}: TaskGridFilterBarProps) {
    const theme = useTheme();

    const pillGroup = {
        display: 'inline-flex',
        alignItems: 'stretch',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 100,
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        flexShrink: 0,
    } as const;

    const toggleBaseSx = {
        border: 'none',
        borderRadius: 0,
        minHeight: 40,
        textTransform: 'none' as const,
        fontWeight: 500,
        fontSize: '0.8125rem',
        '&.Mui-selected': {
            bgcolor: 'rgba(117, 104, 192, 0.15) !important',
            color: 'primary.main',
            fontWeight: 700,
        },
        '&:not(:first-of-type)': {
            borderLeft: `1px solid ${theme.palette.divider}`,
        },
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Search */}
            <TextField
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: 999,
                        bgcolor: theme.palette.background.paper,
                        pl: 1,
                        '& fieldset': { borderColor: theme.palette.divider },
                        '&:hover fieldset': { borderColor: 'rgba(117, 104, 192, 0.35)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                }}
                sx={{ width: '100%', maxWidth: 480 }}
            />

            {/* Unified filter row */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                {/* Status: Active / Done / All */}
                <Box sx={pillGroup}>
                    <ToggleButtonGroup
                        value={STATUS_VALUES[statusTab]}
                        exclusive
                        aria-label="Filter by status"
                        onChange={(_, val: typeof STATUS_VALUES[number] | null) => {
                            if (val != null) onStatusTabChange(STATUS_VALUES.indexOf(val));
                        }}
                        sx={{ '& .MuiToggleButtonGroup-grouped': toggleBaseSx }}
                    >
                        <ToggleButton value="active" sx={{ px: 2 }}>
                            Active ({activeCount})
                        </ToggleButton>
                        <ToggleButton value="done" sx={{ px: 2 }}>
                            Done ({doneCount})
                        </ToggleButton>
                        <ToggleButton value="all" sx={{ px: 2 }}>
                            All ({allCount})
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Quadrant: All | 🔴 | 📅 | 👥 | 🗑️ | 📋 */}
                <Box sx={pillGroup}>
                    <ToggleButtonGroup
                        value={quadrantFilter}
                        exclusive
                        aria-label="Filter by quadrant"
                        onChange={(_, val: EisenhowerQuadrant | 'ALL' | null) => val != null && onQuadrantChange(val)}
                        sx={{ '& .MuiToggleButtonGroup-grouped': { ...toggleBaseSx, px: 1.25, minWidth: 40 } }}
                    >
                        <Tooltip title="All categories">
                            <ToggleButton value="ALL" aria-label="All categories" sx={{ px: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
                                All
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Do First">
                            <ToggleButton value="DO_FIRST" aria-label="Do First">
                                <FiberManualRecordIcon sx={{ color: '#E53935', fontSize: 18 }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Schedule">
                            <ToggleButton value="SCHEDULE" aria-label="Schedule">
                                <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Delegate">
                            <ToggleButton value="DELEGATE" aria-label="Delegate">
                                <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Eliminate">
                            <ToggleButton value="ELIMINATE" aria-label="Eliminate">
                                <DeleteOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Backlog">
                            <ToggleButton value="UNASSIGNED" aria-label="Backlog">
                                <ListAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                </Box>

                {/* Horizon: All | This Week */}
                <Box sx={pillGroup}>
                    <ToggleButtonGroup
                        value={horizonFilter}
                        exclusive
                        aria-label="Filter by time horizon"
                        onChange={(_, val: TaskHorizon | 'ALL' | null) => val != null && onHorizonChange(val)}
                        sx={{ '& .MuiToggleButtonGroup-grouped': { ...toggleBaseSx, px: 1.75 } }}
                    >
                        <ToggleButton value="ALL">All time</ToggleButton>
                        <ToggleButton value="SHORT_TERM">This Week</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}
