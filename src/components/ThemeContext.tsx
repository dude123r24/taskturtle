'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme, googleTheme, raspberryTheme, midnightVioletTheme, dubaiGoldTheme, luxuryMinimalTheme } from '@/lib/theme';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ThemeMode = 'light' | 'dark' | 'system' | 'google' | 'raspberry' | 'midnight' | 'dubai' | 'luxury';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    resolvedMode: 'light' | 'dark' | 'google' | 'raspberry' | 'midnight' | 'dubai' | 'luxury';
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'dark',
    setMode: () => { },
    resolvedMode: 'dark',
});

export const useThemeMode = () => useContext(ThemeContext);

const STORAGE_KEY = 'taskturtle-theme-mode';

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('dark');
    const [mounted, setMounted] = useState(false);
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });

    // Load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | 'apple' | null;
        if (saved === 'apple') {
            setModeState('luxury');
            localStorage.setItem(STORAGE_KEY, 'luxury');
        } else if (saved && ['light', 'dark', 'system', 'google', 'raspberry', 'midnight', 'dubai', 'luxury'].includes(saved)) {
            setModeState(saved);
        }
        setMounted(true);
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    const resolvedMode: 'light' | 'dark' | 'google' | 'raspberry' | 'midnight' | 'dubai' | 'luxury' = mode === 'google'
        ? 'google'
        : mode === 'raspberry'
                ? 'raspberry'
                : mode === 'midnight'
                    ? 'midnight'
                    : mode === 'dubai'
                        ? 'dubai'
                        : mode === 'luxury'
                            ? 'luxury'
                            : mode === 'system'
                                ? (prefersDark ? 'dark' : 'light')
                                : mode as 'light' | 'dark';

    const theme = useMemo(() => {
        switch (resolvedMode) {
            case 'google': return googleTheme;
            case 'raspberry': return raspberryTheme;
            case 'midnight': return midnightVioletTheme;
            case 'dubai': return dubaiGoldTheme;
            case 'luxury': return luxuryMinimalTheme;
            case 'light': return lightTheme;
            default: return darkTheme;
        }
    }, [resolvedMode]);

    // Prevent flash of wrong theme on initial load
    if (!mounted) {
        return (
            <MuiThemeProvider theme={darkTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        );
    }

    return (
        <ThemeContext.Provider value={{ mode, setMode, resolvedMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}
