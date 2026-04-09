'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import type { EisenhowerQuadrant, TaskHorizon } from '@/store/taskStore';

export type StatusFilter = 'ALL' | 'ACTIVE' | 'DONE';

export interface TaskGridFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: StatusFilter;
    onStatusChange: (value: StatusFilter) => void;
    quadrantFilter: EisenhowerQuadrant | 'ALL';
    onQuadrantChange: (value: EisenhowerQuadrant | 'ALL') => void;
    horizonFilter: TaskHorizon | 'ALL';
    onHorizonChange: (value: TaskHorizon | 'ALL') => void;
    activeCount: number;
    doneCount: number;
}

export function TaskGridFilterBar({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    quadrantFilter,
    onQuadrantChange,
    horizonFilter,
    onHorizonChange,
    activeCount,
    doneCount,
}: TaskGridFilterBarProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const pillSx = {
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 100,
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
        flexShrink: 0,
    } as const;

    const btnBase = {
        border: 'none',
        borderRadius: 0,
        minHeight: 40,
        textTransform: 'none' as const,
        fontSize: '0.8125rem',
        px: 1.5,
        minWidth: 40,
        '&.Mui-selected': {
            bgcolor: `${theme.palette.primary.main}18 !important`,
            color: 'primary.main',
            fontWeight: 700,
        },
        '&:not(:first-of-type)': {
            borderLeft: `1px solid ${theme.palette.divider}`,
        },
    };

    const handleQuadrant = (_: React.MouseEvent, val: EisenhowerQuadrant | null) => {
        onQuadrantChange(val ?? 'ALL');
    };
    const handleHorizon = (_: React.MouseEvent, val: TaskHorizon | null) => {
        onHorizonChange(val ?? 'ALL');
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
                        '&:hover fieldset': { borderColor: `${theme.palette.primary.main}60` },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                }}
                sx={{ width: '100%', maxWidth: 480 }}
            />

            {/* Single unified filter row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25 }}>

                {/* Status: Active | Done (deselect = all) */}
                <Box sx={pillSx}>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        aria-label="Filter by status"
                        onChange={(_, val: StatusFilter | null) => val != null && onStatusChange(val)}
                        sx={{ '& .MuiToggleButtonGroup-grouped': { ...btnBase, px: 1.25, minWidth: 40 } }}
                    >
                        <Tooltip title={`Active (${activeCount})`}>
                            <ToggleButton value="ACTIVE" aria-label={`Active tasks (${activeCount})`}>
                                <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title={`Done (${doneCount})`}>
                            <ToggleButton value="DONE" aria-label={`Done tasks (${doneCount})`}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="All tasks">
                            <ToggleButton value="ALL" aria-label="All tasks">
                                <DensityMediumIcon sx={{ fontSize: 18 }} />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ my: 0.5, display: { xs: 'none', sm: 'block' } }} />

                {/* Quadrant icons (deselect = all categories) */}
                <Box sx={pillSx}>
                    <ToggleButtonGroup
                        value={quadrantFilter === 'ALL' ? null : quadrantFilter}
                        exclusive
                        aria-label="Filter by category"
                        onChange={handleQuadrant}
                        sx={{ '& .MuiToggleButtonGroup-grouped': { ...btnBase, px: 1.25 } }}
                    >
                        <Tooltip title="Do First — urgent & important">
                            <ToggleButton value="DO_FIRST" aria-label="Do First">
                                <FiberManualRecordIcon sx={{ color: '#E53935', fontSize: 18 }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Schedule — important, not urgent">
                            <ToggleButton value="SCHEDULE" aria-label="Schedule">
                                <CalendarMonthIcon sx={{ fontSize: 18, color: '#1E88E5' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Delegate — urgent, not important">
                            <ToggleButton value="DELEGATE" aria-label="Delegate">
                                <GroupsIcon sx={{ fontSize: 18, color: '#FB8C00' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Eliminate — neither urgent nor important">
                            <ToggleButton value="ELIMINATE" aria-label="Eliminate">
                                <DeleteOutlineIcon sx={{ fontSize: 18, color: '#757575' }} />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Backlog — not yet prioritised">
                            <ToggleButton value="UNASSIGNED" aria-label="Backlog">
                                <ListAltIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ my: 0.5, display: { xs: 'none', sm: 'block' } }} />

                {/* Horizon: This Week toggle (off = all time) */}
                <Box sx={pillSx}>
                    <ToggleButtonGroup
                        value={horizonFilter === 'ALL' ? null : horizonFilter}
                        exclusive
                        aria-label="Filter by time horizon"
                        onChange={handleHorizon}
                        sx={{ '& .MuiToggleButtonGroup-grouped': { ...btnBase, px: 1.75, gap: 0.75 } }}
                    >
                        <Tooltip title="Short-term tasks only">
                            <ToggleButton value="SHORT_TERM" aria-label="This Week">
                                <DateRangeIcon sx={{ fontSize: 16 }} />
                                This Week
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}
