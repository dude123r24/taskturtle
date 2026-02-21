'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CalendarEvent {
    id: string;
    calendarName: string;
    calendarColor: string;
    summary: string;
    isDuplicate: boolean;
    description?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [selectedDate]);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/calendar/events?date=${selectedDate}&hideDuplicates=true`);
            if (res.ok) {
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            }
        } catch { /* graceful degradation */ }
        setIsLoading(false);
    };

    const navigateDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const formatTime = (dateTime?: string) => {
        if (!dateTime) return '';
        return new Date(dateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDuration = (start?: string, end?: string) => {
        if (!start || !end) return null;
        const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
        const hours = Math.floor(diff / 60);
        const mins = Math.round(diff % 60);
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    );

    // Build hour blocks (8am - 8pm)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
        <Stack spacing={3}>
            {/* Date navigation */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigateDate(-1)}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={600}>
                    {dateLabel}
                </Typography>
                <IconButton onClick={() => navigateDate(1)}>
                    <ChevronRightIcon />
                </IconButton>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TodayIcon />}
                    onClick={goToToday}
                >
                    Today
                </Button>
            </Stack>

            {isLoading ? (
                <Stack spacing={1}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    ))}
                </Stack>
            ) : (
                <Stack spacing={0}>
                    {/* Timeline */}
                    {hours.map((hour) => {
                        const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                        const hourEvents = events.filter((e) => {
                            const start = e.start?.dateTime;
                            if (!start) return false;
                            const h = new Date(start).getHours();
                            return h === hour;
                        });

                        return (
                            <Box
                                key={hour}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px 1fr',
                                    minHeight: 60,
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ pt: 0.5, textAlign: 'right', pr: 2 }}
                                >
                                    {hourStr}
                                </Typography>
                                <Box sx={{ py: 0.5, pl: 1 }}>
                                    {hourEvents.map((event) => (
                                        <Card
                                            key={event.id}
                                            sx={{
                                                mb: 0.5,
                                                background: `${event.calendarColor || '#1E88E5'}15`,
                                                border: `1px solid ${event.calendarColor || '#1E88E5'}33`,
                                                borderLeft: `3px solid ${event.calendarColor || '#1E88E5'}`,
                                            }}
                                        >
                                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {event.summary}
                                                        </Typography>
                                                        {event.description && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {event.description.substring(0, 80)}
                                                            </Typography>
                                                        )}
                                                        {event.calendarName && (
                                                            <Typography variant="caption" sx={{ color: event.calendarColor || 'text.secondary' }}>
                                                                📅 {event.calendarName}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Chip
                                                            icon={<AccessTimeIcon sx={{ fontSize: '0.8rem !important' }} />}
                                                            label={`${formatTime(event.start?.dateTime)} - ${formatTime(event.end?.dateTime)}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.65rem' }}
                                                        />
                                                        {getDuration(event.start?.dateTime, event.end?.dateTime) && (
                                                            <Chip
                                                                label={getDuration(event.start?.dateTime, event.end?.dateTime)}
                                                                size="small"
                                                                sx={{ fontSize: '0.65rem', bgcolor: 'rgba(30,136,229,0.15)' }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        );
                    })}

                    {events.length === 0 && (
                        <Card
                            sx={{
                                mt: 2,
                                background: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 25, 41, 0.6)' : 'rgba(255,255,255,0.8)',
                                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                                textAlign: 'center',
                            }}
                        >
                            <CardContent sx={{ py: 6 }}>
                                <CalendarTodayIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body1" color="text.secondary">
                                    No events for this day
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Sign in with Google to see your calendar events
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Stack>
            )}
        </Stack>
    );
}
