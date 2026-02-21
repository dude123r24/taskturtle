'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/lib/theme';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    resolvedMode: 'light' | 'dark';
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
        const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            setModeState(saved);
        }
        setMounted(true);
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    const resolvedMode: 'light' | 'dark' = mode === 'system'
        ? (prefersDark ? 'dark' : 'light')
        : mode;

    const theme = useMemo(
        () => (resolvedMode === 'dark' ? darkTheme : lightTheme),
        [resolvedMode]
    );

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
