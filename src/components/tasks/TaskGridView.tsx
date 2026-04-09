'use client';

import { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import type { ColDef, CellValueChangedEvent, RowClassParams, RowStyle } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
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

interface TaskGridViewProps {
    tasks: Task[];
}

export default function TaskGridView({ tasks }: TaskGridViewProps) {
    const theme = useTheme();
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
    const colDefs = useMemo(() => [
        {
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
        },
        {
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
        },
        {
            field: 'quadrant',
            headerName: 'Category',
            width: 160,
            minWidth: 140,
            cellRenderer: QuadrantCellRenderer,
            comparator: quadrantComparator,
            cellStyle: { display: 'flex', alignItems: 'center', padding: '0 12px' },
            sort: 'asc',
        },
        {
            field: 'estimatedMinutes',
            headerName: 'Time',
            width: 90,
            minWidth: 70,
            editable: true,
            valueFormatter: (p) => formatMinutes(p.value),
            cellStyle: { display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, fontSize: '0.85rem' },
        },
        {
            field: 'dueDate',
            headerName: 'Due',
            width: 130,
            minWidth: 100,
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
        {
            headerName: '',
            width: 84,
            minWidth: 84,
            maxWidth: 84,
            cellRenderer: ActionsCellRenderer,
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            cellStyle: { padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any,
        },
    ] as ColDef<Task>[], [theme, patchTask]);

    const bgColor = isDark ? '#0F0E17' : '#FAFAFA';
    const borderColor = isDark ? '#2A2A3A' : '#E0E0E0';
    const headerBg = isDark ? '#161525' : '#F5F5F7';
    const fontFamily = theme.typography.fontFamily ?? 'system-ui, sans-serif';

    const agThemeVars = {
        '--ag-background-color': bgColor,
        '--ag-odd-row-background-color': bgColor,
        '--ag-header-background-color': headerBg,
        '--ag-border-color': borderColor,
        '--ag-row-border-color': borderColor,
        '--ag-font-family': fontFamily,
        '--ag-font-size': '14px',
        '--ag-row-height': '72px',
        '--ag-header-height': '44px',
        '--ag-cell-horizontal-padding': '12px',
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
            <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1" fontStyle="italic" sx={{ opacity: 0.6 }}>
                    No tasks match your filters.
                </Typography>
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
                '& .ag-root-wrapper': { borderRadius: '8px !important', border: 'none !important' },
                '& .ag-header': { borderBottom: `1px solid ${borderColor}` },
                '& .ag-row': { borderBottom: `1px solid ${borderColor}` },
                '& .ag-cell-inline-editing': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    borderRadius: 1,
                },
                // Prevent AG Grid from overriding our left-border row style
                '& .ag-row:focus': { outline: 'none' },
                '& .ag-cell': { overflow: 'visible' },
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
                suppressCellFocus={false}
                enableCellTextSelection={true}
                stopEditingWhenCellsLoseFocus={true}
                defaultColDef={{
                    sortable: true,
                    filter: false,
                    resizable: true,
                    suppressMovable: false,
                }}
                animateRows={true}
                suppressRowClickSelection={true}
                getRowId={(params) => params.data.id}
            />
        </Box>
    );
}
