'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Settings {
    maxDailyTasks: number;
    maxWeeklyTasks: number;
    maxDailyMinutes: number;
    defaultView: string;
    calendarSyncEnabled: boolean;
    autoClearArchivedEnabled: boolean;
    autoClearArchivedDays: number;
}

interface CalendarAccount {
    id: string;
    googleEmail: string;
    calendarId: string;
    calendarName: string;
    color: string;
    enabled: boolean;
    createdAt: string;
}

const CALENDAR_COLORS = [
    '#4285F4', '#EA4335', '#FBBC04', '#34A853',
    '#FF6D01', '#46BDC6', '#7B1FA2', '#C2185B',
];

function SettingsContent() {
    const searchParams = useSearchParams();
    const [settings, setSettings] = useState<Settings>({
        maxDailyTasks: 8,
        maxWeeklyTasks: 25,
        maxDailyMinutes: 480,
        defaultView: 'matrix',
        calendarSyncEnabled: true,
        autoClearArchivedEnabled: true,
        autoClearArchivedDays: 30,
    });
    const [calendarAccounts, setCalendarAccounts] = useState<CalendarAccount[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newCalName, setNewCalName] = useState('');
    const [newCalColor, setNewCalColor] = useState('#4285F4');
    const [isAddingCalendar, setIsAddingCalendar] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchCalendarAccounts();

        // Check for calendar add success/error from OAuth callback redirect
        if (searchParams.get('calendarAdded')) {
            setShowSuccess(true);
            fetchCalendarAccounts();
        }
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) setSettings(await res.json());
        } catch { /* graceful */ }
    };

    const fetchCalendarAccounts = async () => {
        try {
            const res = await fetch('/api/calendar/accounts');
            if (res.ok) setCalendarAccounts(await res.json());
        } catch { /* graceful */ }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) setShowSuccess(true);
        } catch { /* error */ }
        setIsSaving(false);
    };

    const addCalendar = async () => {
        if (!newCalName.trim()) return;
        setIsAddingCalendar(true);
        try {
            const res = await fetch('/api/calendar/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calendarName: newCalName, color: newCalColor }),
            });
            if (res.ok) {
                const { authUrl } = await res.json();
                window.location.href = authUrl; // Redirect to Google OAuth
            }
        } catch { /* error */ }
        setIsAddingCalendar(false);
    };

    const toggleCalendar = async (accountId: string, enabled: boolean) => {
        try {
            await fetch('/api/calendar/accounts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, enabled }),
            });
            setCalendarAccounts((prev) =>
                prev.map((a) => (a.id === accountId ? { ...a, enabled } : a))
            );
        } catch { /* error */ }
    };

    const removeCalendar = async (accountId: string) => {
        try {
            await fetch(`/api/calendar/accounts?accountId=${accountId}`, {
                method: 'DELETE',
            });
            setCalendarAccounts((prev) => prev.filter((a) => a.id !== accountId));
        } catch { /* error */ }
    };

    const handleExport = (format: 'json' | 'csv') => {
        window.open(`/api/tasks/export?format=${format}`, '_blank');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            let tasks: any[] = [];

            try {
                if (file.name.endsWith('.json')) {
                    tasks = JSON.parse(content).tasks || JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    const lines = content.split('\n');
                    const headers = lines[0].split(',').map(h => h.trim());
                    tasks = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const task: any = {};
                        headers.forEach((h, i) => {
                            if (values[i]) task[h.toLowerCase()] = values[i].replace(/^"|"$/g, '');
                        });
                        return task;
                    }).filter(t => Object.keys(t).length > 0);
                }

                const response = await fetch('/api/tasks/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    setShowSuccess(true);
                } else {
                    const data = await response.json();
                    alert(`Import failed: ${data.error}`);
                }
            } catch (error) {
                console.error('Import failed', error);
                alert('Import failed. Check file format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
                Settings
            </Typography>

            {/* Calendar Accounts */}
            <Card
                sx={{
                    background: 'rgba(26, 25, 41, 0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <SyncIcon sx={{ color: '#4285F4' }} />
                            <Typography variant="h6" fontWeight={600}>
                                Connected Calendars
                            </Typography>
                        </Stack>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setNewCalName('');
                                setNewCalColor('#4285F4');
                                setAddDialogOpen(true);
                            }}
                        >
                            Add Calendar
                        </Button>
                    </Stack>

                    {calendarAccounts.length === 0 ? (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            No calendars connected yet. Click &quot;Add Calendar&quot; to connect a
                            Google account. You can add multiple accounts (work, personal, etc.)
                        </Alert>
                    ) : (
                        <Stack spacing={1}>
                            {calendarAccounts.map((account) => (
                                <Box
                                    key={account.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${account.color}33`,
                                        borderLeft: `4px solid ${account.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {account.calendarName}
                                            </Typography>
                                            <Chip
                                                label={account.googleEmail}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </Stack>
                                    </Box>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={account.enabled}
                                                onChange={(e) =>
                                                    toggleCalendar(account.id, e.target.checked)
                                                }
                                                size="small"
                                            />
                                        }
                                        label=""
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removeCalendar(account.id)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Card>

            {/* Task Limits */}
            <Card
                sx={{
                    background: 'rgba(26, 25, 41, 0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Task Limits
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Set maximum task limits to get warnings when you&apos;re overcommitting.
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            label="Max daily tasks"
                            type="number"
                            value={settings.maxDailyTasks}
                            onChange={(e) =>
                                setSettings({ ...settings, maxDailyTasks: parseInt(e.target.value) || 0 })
                            }
                            inputProps={{ min: 1, max: 50 }}
                            helperText="You'll see a warning when you exceed this"
                            fullWidth
                        />
                        <TextField
                            label="Max weekly tasks"
                            type="number"
                            value={settings.maxWeeklyTasks}
                            onChange={(e) =>
                                setSettings({ ...settings, maxWeeklyTasks: parseInt(e.target.value) || 0 })
                            }
                            inputProps={{ min: 1, max: 200 }}
                            fullWidth
                        />
                        <TextField
                            label="Max daily minutes"
                            type="number"
                            value={settings.maxDailyMinutes}
                            onChange={(e) =>
                                setSettings({ ...settings, maxDailyMinutes: parseInt(e.target.value) || 0 })
                            }
                            inputProps={{ min: 60, max: 1440, step: 30 }}
                            helperText={`Currently set to ${Math.round(settings.maxDailyMinutes / 60)} hours`}
                            fullWidth
                        />

                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <Typography variant="subtitle1" fontWeight={500} mb={1}>
                                Auto-Archiving
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Tasks in the Eliminate quadrant are automatically archived after 7 days. Configure how long archived tasks are kept before being permanently deleted.
                            </Typography>
                            <Stack spacing={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.autoClearArchivedEnabled}
                                            onChange={(e) =>
                                                setSettings({ ...settings, autoClearArchivedEnabled: e.target.checked })
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="Permanently delete old archived tasks"
                                />
                                {settings.autoClearArchivedEnabled && (
                                    <TextField
                                        label="Keep archived tasks for (days)"
                                        type="number"
                                        size="small"
                                        value={settings.autoClearArchivedDays}
                                        onChange={(e) =>
                                            setSettings({ ...settings, autoClearArchivedDays: parseInt(e.target.value) || 0 })
                                        }
                                        inputProps={{ min: 1, max: 365 }}
                                        fullWidth
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card
                sx={{
                    background: 'rgba(26, 25, 41, 0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Data Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Export your tasks for backup or import from another tool.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={() => handleExport('csv')}
                        >
                            Export as CSV
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => handleExport('json')}
                        >
                            Export as JSON
                        </Button>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                        >
                            Import Tasks
                            <input
                                type="file"
                                hidden
                                accept=".json,.csv"
                                onChange={handleImport}
                            />
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Button
                variant="contained"
                size="large"
                onClick={saveSettings}
                disabled={isSaving}
                sx={{ alignSelf: 'flex-start' }}
            >
                {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>

            {/* Add Calendar Dialog */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Connect Google Calendar</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Calendar name"
                            placeholder="e.g. Work, Personal, Freelance"
                            value={newCalName}
                            onChange={(e) => setNewCalName(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        <Box>
                            <Typography variant="caption" color="text.secondary" mb={1} display="block">
                                Color
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {CALENDAR_COLORS.map((c) => (
                                    <Box
                                        key={c}
                                        onClick={() => setNewCalColor(c)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: c,
                                            cursor: 'pointer',
                                            border: newCalColor === c
                                                ? '3px solid white'
                                                : '3px solid transparent',
                                            transition: 'border 0.2s',
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                        <Alert severity="info" sx={{ borderRadius: 2, mt: 1 }}>
                            You&apos;ll be redirected to Google to sign in with the account
                            whose calendar you want to connect.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={addCalendar}
                        disabled={!newCalName.trim() || isAddingCalendar}
                    >
                        {isAddingCalendar ? 'Redirecting...' : 'Connect with Google'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {searchParams.get('calendarAdded')
                        ? 'Calendar connected successfully!'
                        : 'Settings saved successfully!'}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<Typography>Loading settings...</Typography>}>
            <SettingsContent />
        </Suspense>
    );
}
