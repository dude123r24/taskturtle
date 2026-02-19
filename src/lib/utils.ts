import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

export const QUADRANT_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    DO_FIRST: { label: 'Do First', color: '#E53935', icon: '🔴' },
    SCHEDULE: { label: 'Schedule', color: '#1E88E5', icon: '📅' },
    DELEGATE: { label: 'Delegate', color: '#FB8C00', icon: '👥' },
    ELIMINATE: { label: 'Eliminate', color: '#757575', icon: '🗑️' },
};

export const HORIZON_LABELS: Record<string, string> = {
    SHORT_TERM: 'This Week',
    LONG_TERM: 'Backlog',
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    TODO: { label: 'To Do', color: '#9E9E9E' },
    IN_PROGRESS: { label: 'In Progress', color: '#1E88E5' },
    DONE: { label: 'Done', color: '#43A047' },
    ARCHIVED: { label: 'Archived', color: '#757575' },
};
