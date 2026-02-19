'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface Settings {
    maxDailyTasks: number;
    maxWeeklyTasks: number;
    maxDailyMinutes: number;
    defaultView: string;
    calendarSyncEnabled: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        maxDailyTasks: 8,
        maxWeeklyTasks: 25,
        maxDailyMinutes: 480,
        defaultView: 'matrix',
        calendarSyncEnabled: true,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch { /* graceful degradation */ }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setShowSuccess(true);
            }
        } catch { /* error handling */ }
        setIsSaving(false);
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
                Settings
            </Typography>

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
                    </Stack>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card
                sx={{
                    background: 'rgba(26, 25, 41, 0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Google Calendar
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.calendarSyncEnabled}
                                onChange={(e) =>
                                    setSettings({ ...settings, calendarSyncEnabled: e.target.checked })
                                }
                            />
                        }
                        label="Enable calendar sync"
                    />
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        When enabled, your Google Calendar events will be shown on the dashboard and calendar page.
                    </Typography>
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

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                    Settings saved successfully!
                </Alert>
            </Snackbar>
        </Stack>
    );
}
