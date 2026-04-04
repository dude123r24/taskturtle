'use client';

import { useThemeMode } from '@/components/ThemeContext';

export function useLuxuryDashboard() {
    return useThemeMode().resolvedMode === 'luxury';
}
