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
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
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

    const toggleSelected = {
        '&.Mui-selected': {
            bgcolor: `${theme.palette.primary.main} !important`,
            color: '#000000 !important',
        },
        '&.Mui-selected:hover': {
            bgcolor: `${theme.palette.primary.main} !important`,
        },
    } as const;

    const shell = {
        display: 'inline-flex',
        alignItems: 'stretch',
        border: '2px solid #000000',
        borderRadius: '4px',
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        boxShadow: '3px 3px 0px #000000',
    } as const;

    const horizonToggleSx = {
        px: 2,
        py: 1,
        minHeight: 44,
        textTransform: 'none' as const,
        fontWeight: 700,
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
                    aria-label="Search tasks"
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
                            borderRadius: '4px',
                            bgcolor: theme.palette.background.paper,
                            pl: 1,
                            boxShadow: '3px 3px 0px #000000',
                            transition: 'box-shadow 0.15s ease',
                            '& fieldset': {
                                borderColor: '#000000',
                                borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                                borderColor: '#000000 !important',
                                borderWidth: '2px !important',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#000000 !important',
                                borderWidth: '2px !important',
                            },
                            '&.Mui-focused': {
                                boxShadow: '4px 4px 0px #000000',
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
                            aria-label="Filter by quadrant"
                            onChange={(_, val: EisenhowerQuadrant | 'ALL' | null) => val != null && onQuadrantChange(val)}
                            sx={{
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 'none',
                                    borderRadius: 0,
                                    px: 1.5,
                                    py: 1,
                                    minWidth: 44,
                                    minHeight: 44,
                                    ...toggleSelected,
                                },
                                '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                    borderLeft: '1px solid #000000',
                                },
                            }}
                        >
                            <Tooltip title="All quadrants">
                                <ToggleButton value="ALL" aria-label="All quadrants">
                                    <ViewListIcon sx={{ fontSize: 22 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Do First">
                                <ToggleButton value="DO_FIRST" aria-label="Do First quadrant">
                                    <FiberManualRecordIcon sx={{ color: '#E53935', fontSize: 22 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Schedule">
                                <ToggleButton value="SCHEDULE" aria-label="Schedule quadrant">
                                    <CalendarMonthIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Delegate">
                                <ToggleButton value="DELEGATE" aria-label="Delegate quadrant">
                                    <GroupsIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Eliminate">
                                <ToggleButton value="ELIMINATE" aria-label="Eliminate quadrant">
                                    <DeleteOutlineIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                                </ToggleButton>
                            </Tooltip>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={shell}>
                        <ToggleButtonGroup
                            value={horizonFilter}
                            exclusive
                            aria-label="Filter by time horizon"
                            onChange={(_, val: TaskHorizon | 'ALL' | null) => val != null && onHorizonChange(val)}
                            sx={{
                                '& .MuiToggleButtonGroup-grouped': {
                                    border: 'none',
                                    borderRadius: 0,
                                    ...horizonToggleSx,
                                    ...toggleSelected,
                                },
                                '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                                    borderLeft: '1px solid #000000',
                                },
                            }}
                        >
                            <ToggleButton value="ALL" aria-label="All time horizons">
                                All time
                            </ToggleButton>
                            <ToggleButton value="SHORT_TERM" aria-label="This week">
                                <CalendarViewWeekIcon sx={{ fontSize: 18, mr: 0.75 }} />
                                This week
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
                aria-label="Filter tasks by status"
                sx={{
                    minHeight: 44,
                    '& .MuiTabs-indicator': {
                        height: 3,
                        backgroundColor: '#000000',
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        minHeight: 44,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: '#000000',
                            fontWeight: 800,
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
