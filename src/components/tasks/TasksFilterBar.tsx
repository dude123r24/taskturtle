'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { EisenhowerQuadrant, TaskHorizon } from '@/store/taskStore';

export interface TasksFilterBarProps {
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

const toggleSelected = {
    '&.Mui-selected': {
        bgcolor: 'rgba(117, 104, 192, 0.16) !important',
        color: 'primary.dark',
    },
} as const;

export function TasksFilterBar({
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
}: TasksFilterBarProps) {
    const theme = useTheme();

    const shell = {
        display: 'inline-flex',
        alignItems: 'stretch',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 100,
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    } as const;

    const horizonToggleSx = {
        px: 2,
        py: 1,
        textTransform: 'none' as const,
        fontWeight: 600,
        fontSize: '0.8125rem',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Search + quadrant filters + timeframe */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: { lg: 'center' },
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <TextField
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 999,
                            bgcolor: theme.palette.background.paper,
                            pl: 1,
                            '& fieldset': {
                                borderColor: theme.palette.divider,
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(117, 104, 192, 0.35)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                    sx={{
                        flex: 1,
                        minWidth: { xs: '100%', sm: 260, lg: 320 },
                        maxWidth: { lg: 480 },
                    }}
                />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box sx={shell}>
                        <ToggleButtonGroup
                            value={quadrantFilter}
                            exclusive
                            onChange={(_, val: EisenhowerQuadrant | 'ALL' | null) => val != null && onQuadrantChange(val)}
                            sx={{
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 'none',
                                    borderRadius: 0,
                                    px: 1.5,
                                    py: 1,
                                    minWidth: 44,
                                    ...toggleSelected,
                                },
                                '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                    borderLeft: '1px solid',
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            <Tooltip title="All quadrants">
                                <ToggleButton value="ALL">
                                    All
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Do First">
                                <ToggleButton value="DO_FIRST">
                                    <FiberManualRecordIcon sx={{ color: '#E53935', fontSize: 22 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Schedule">
                                <ToggleButton value="SCHEDULE">
                                    <CalendarMonthIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Delegate">
                                <ToggleButton value="DELEGATE">
                                    <GroupsIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Eliminate">
                                <ToggleButton value="ELIMINATE">
                                    <DeleteOutlineIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={shell}>
                        <ToggleButtonGroup
                            value={horizonFilter}
                            exclusive
                            onChange={(_, val: TaskHorizon | 'ALL' | null) => val != null && onHorizonChange(val)}
                            sx={{
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 'none',
                                    borderRadius: 0,
                                    ...horizonToggleSx,
                                    ...toggleSelected,
                                },
                                '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                    borderLeft: '1px solid',
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            <ToggleButton value="ALL">
                                All
                            </ToggleButton>
                            <ToggleButton value="SHORT_TERM">
                                This Week
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
            </Box>

            {/* Status tabs — purple underline, counts */}
            <Tabs
                value={statusTab}
                onChange={(_, v) => onStatusTabChange(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    minHeight: 42,
                    '& .MuiTabs-indicator': { height: 3 },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        minHeight: 42,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 700,
                        },
                    },
                }}
            >
                <Tab label={`Active (${activeCount})`} />
                <Tab label={`Done (${doneCount})`} />
                <Tab label={`All (${allCount})`} />
            </Tabs>
        </Box>
    );
}
