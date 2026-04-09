'use client';

import { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import type { ColDef, CellValueChangedEvent, RowClassParams, RowStyle, ICellRendererParams } from 'ag-grid-community';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { type Task, type EisenhowerQuadrant, useTaskStore } from '@/store/taskStore';
import { QUADRANT_LABELS, formatMinutes } from '@/lib/utils';
import QuadrantCellRenderer from './grid/QuadrantCellRenderer';
import StatusCellRenderer from './grid/StatusCellRenderer';
import ActionsCellRenderer from './grid/ActionsCellRenderer';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const QUADRANT_ORDER: Record<EisenhowerQuadrant, number> = {
    DO_FIRST: 0,
    SCHEDULE: 1,
    DELEGATE: 2,
    ELIMINATE: 3,
    UNASSIGNED: 4,
};

function quadrantComparator(a: EisenhowerQuadrant, b: EisenhowerQuadrant) {
    return QUADRANT_ORDER[a] - QUADRANT_ORDER[b];
}

/** Mobile-only title cell: shows task title + due date + time estimate stacked */
function MobileTitleCellRenderer(props: ICellRendererParams<Task>) {
    const task = props.data;
    if (!task) return null;

    const isDone = task.status === 'DONE';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;
    const hasMeta = task.dueDate || task.estimatedMinutes;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 0.75, gap: 0.25, width: '100%' }}>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: task.quadrant === 'DO_FIRST' ? 600 : 400,
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.5 : 1,
                    lineHeight: 1.35,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {task.title}
            </Typography>
            {hasMeta && (
                <Stack direction="row" spacing={1.5}>
                    {task.dueDate && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: isOverdue ? 'error.main' : 'text.secondary',
                                fontWeight: isOverdue ? 600 : 400,
                            }}
                        >
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                    )}
                    {task.estimatedMinutes != null && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatMinutes(task.estimatedMinutes)}
                        </Typography>
                    )}
                    {task.isChase && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <GpsFixedIcon sx={{ fontSize: 12, color: 'error.main' }} />
                            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>Chase</Typography>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}

interface TaskGridViewProps {
    tasks: Task[];
    onClearFilters?: () => void;
}

export default function TaskGridView({ tasks, onClearFilters }: TaskGridViewProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { patchTask } = useTaskStore();
    const isDark = theme.palette.mode === 'dark';
    const gridRef = useRef<AgGridReact<Task>>(null);

    const getRowStyle = useCallback((params: RowClassParams<Task>): RowStyle => {
        const q = params.data?.quadrant ?? 'UNASSIGNED';
        const color = QUADRANT_LABELS[q].color;
        return {
            borderLeft: `4px solid ${color}`,
            background: `${color}10`,
        };
    }, []);

    const onCellValueChanged = useCallback(async (event: CellValueChangedEvent<Task>) => {
        if (!event.data) return;
        const field = event.colDef.field as keyof Task;
        if (!field || event.newValue === event.oldValue) return;

        if (field === 'title') {
            await patchTask(event.data.id, { title: event.newValue });
        } else if (field === 'estimatedMinutes') {
            const mins = parseInt(event.newValue, 10);
            await patchTask(event.data.id, { estimatedMinutes: isNaN(mins) ? undefined : mins });
        } else if (field === 'dueDate') {
            await patchTask(event.data.id, { dueDate: event.newValue || undefined });
        }
    }, [patchTask]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const colDefs = useMemo((): ColDef<Task>[] => {
        const statusCol: ColDef<Task> = {
            field: 'status',
            headerName: '',
            width: 52,
            minWidth: 52,
            maxWidth: 52,
            cellRenderer: StatusCellRenderer,
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            cellStyle: { padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any,
        };

        const titleCol: ColDef<Task> = isMobile
            ? {
                field: 'title',
                headerName: 'Task',
                flex: 1,
                minWidth: 140,
                editable: false,
                sortable: true,
                cellRenderer: MobileTitleCellRenderer,
                cellStyle: { display: 'flex', alignItems: 'center', padding: '4px 12px' } as any,
            }
            : {
                field: 'title',
                headerName: 'Task',
                flex: 1,
                minWidth: 180,
                editable: true,
                cellStyle: (params) => ({
                    fontWeight: params.data?.quadrant === 'DO_FIRST' ? '600' : '400',
                    textDecoration: params.data?.status === 'DONE' ? 'line-through' : 'none',
                    opacity: params.data?.status === 'DONE' ? '0.5' : '1',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'text',
                }),
            };

        const quadrantCol: ColDef<Task> = {
            field: 'quadrant',
            headerName: 'Cat.',
            width: isMobile ? 60 : 80,
            minWidth: isMobile ? 60 : 80,
            cellRenderer: QuadrantCellRenderer,
            comparator: quadrantComparator,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' },
            sort: 'asc',
        };

        const actionsCol: ColDef<Task> = {
            headerName: '',
            width: isMobile ? 96 : 84,
            minWidth: isMobile ? 96 : 84,
            maxWidth: isMobile ? 96 : 84,
            cellRenderer: ActionsCellRenderer,
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            cellStyle: { padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any,
        };

        if (isMobile) {
            return [statusCol, titleCol, quadrantCol, actionsCol];
        }

        return [
            statusCol,
            titleCol,
            quadrantCol,
            {
                field: 'isChase',
                headerName: 'Chase',
                width: 90,
                minWidth: 90,
                sortable: true,
                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cellRenderer: (params: ICellRendererParams<Task>) => {
                    if (!params.data?.isChase) return null;
                    return (
                        <Tooltip title="Chase">
                            <GpsFixedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                        </Tooltip>
                    );
                },
                comparator: (a: boolean, b: boolean) => (a === b ? 0 : a ? -1 : 1),
            },
            {
                field: 'estimatedMinutes',
                headerName: 'Time',
                width: 90,
                minWidth: 90,
                editable: true,
                valueFormatter: (p) => formatMinutes(p.value),
                cellStyle: { display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, fontSize: '0.85rem' },
            },
            {
                field: 'dueDate',
                headerName: 'Due',
                width: 130,
                minWidth: 130,
                editable: true,
                valueFormatter: (p) => {
                    if (!p.value) return '—';
                    try { return new Date(p.value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
                    catch { return p.value; }
                },
                cellStyle: (params) => {
                    const isOverdue = params.value && new Date(params.value) < new Date() && params.data?.status !== 'DONE';
                    return {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
                        fontWeight: isOverdue ? '600' : '400',
                    };
                },
            },
            actionsCol,
        ];
    }, [isMobile, theme, patchTask]);

    const rowHeight = isMobile ? 64 : 88;

    const bgColor = theme.palette.background.default;
    const borderColor = theme.palette.divider;
    const headerBg = theme.palette.background.paper;
    const fontFamily = theme.typography.fontFamily ?? 'system-ui, sans-serif';

    const agThemeVars = {
        '--ag-background-color': bgColor,
        '--ag-odd-row-background-color': bgColor,
        '--ag-header-background-color': headerBg,
        '--ag-border-color': borderColor,
        '--ag-row-border-color': borderColor,
        '--ag-font-family': fontFamily,
        '--ag-font-size': '14px',
        '--ag-row-height': `${rowHeight}px`,
        '--ag-header-height': isMobile ? '40px' : '44px',
        '--ag-cell-horizontal-padding': isMobile ? '8px' : '12px',
        '--ag-row-hover-color': isDark ? 'rgba(108,99,255,0.06)' : 'rgba(80,70,229,0.04)',
        '--ag-selected-row-background-color': isDark ? 'rgba(108,99,255,0.1)' : 'rgba(80,70,229,0.07)',
        '--ag-header-foreground-color': isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
        '--ag-foreground-color': theme.palette.text.primary,
        '--ag-secondary-foreground-color': theme.palette.text.secondary,
        '--ag-input-focus-border-color': theme.palette.primary.main,
        '--ag-range-selection-border-color': theme.palette.primary.main,
    } as React.CSSProperties;

    if (tasks.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                <FilterAltOffIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    No tasks match your filters.
                </Typography>
                {onClearFilters && (
                    <Button variant="outlined" size="small" onClick={onClearFilters} sx={{ mt: 0.5 }}>
                        Clear filters
                    </Button>
                )}
            </Box>
        );
    }

    return (
        <Box
            className="ag-theme-alpine"
            style={agThemeVars}
            sx={{
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${borderColor}`,
                // Allow vertical pan on touch without triggering row selection
                touchAction: 'pan-y',
                '& .ag-root-wrapper': { borderRadius: '8px !important', border: 'none !important' },
                '& .ag-header': { borderBottom: `1px solid ${borderColor}` },
                '& .ag-row': { borderBottom: `1px solid ${borderColor}` },
                '& .ag-cell-inline-editing': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    borderRadius: 1,
                },
                // Visible focus ring for keyboard navigation
                '& .ag-row:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '-2px' },
                '& .ag-row:focus:not(:focus-visible)': { outline: 'none' },
                // Prevent AG Grid's nested wrappers from clipping cell renderer content
                '& .ag-cell': { overflow: 'visible' },
                '& .ag-cell-wrapper': { overflow: 'visible', height: '100%' },
                '& .ag-react-container': { overflow: 'visible', height: '100%', width: '100%', display: 'flex', alignItems: 'center' },
            }}
        >
            <AgGridReact<Task>
                ref={gridRef}
                rowData={tasks}
                columnDefs={colDefs}
                getRowStyle={getRowStyle}
                onCellValueChanged={onCellValueChanged}
                domLayout="autoHeight"
                rowSelection="single"
                // Suppress accidental cell focus on mobile touch
                suppressCellFocus={isMobile}
                enableCellTextSelection={!isMobile}
                stopEditingWhenCellsLoseFocus={true}
                defaultColDef={{
                    sortable: true,
                    filter: false,
                    resizable: !isMobile,
                    suppressMovable: isMobile,
                }}
                animateRows={true}
                suppressRowClickSelection={true}
                getRowId={(params) => params.data.id}
            />
        </Box>
    );
}
