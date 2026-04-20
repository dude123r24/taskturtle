'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, googleTheme, raspberryTheme, midnightVioletTheme, luxuryMinimalTheme } from '@/lib/theme';

export type ThemeMode = 'dark' | 'google' | 'raspberry' | 'midnight' | 'luxury';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    resolvedMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'luxury',
    setMode: () => { },
    resolvedMode: 'luxury',
});

export const useThemeMode = () => useContext(ThemeContext);

const STORAGE_KEY = 'taskturtle-theme-mode';
const VALID_MODES: ThemeMode[] = ['dark', 'google', 'raspberry', 'midnight', 'luxury'];

// Old saved values get migrated to sensible replacements.
const LEGACY_MIGRATIONS: Record<string, ThemeMode> = {
    apple: 'luxury',
    light: 'luxury',
    system: 'luxury',
    dubai: 'dark',
};

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('luxury');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            setMounted(true);
            return;
        }
        if (LEGACY_MIGRATIONS[saved]) {
            const next = LEGACY_MIGRATIONS[saved];
            setModeState(next);
            localStorage.setItem(STORAGE_KEY, next);
        } else if ((VALID_MODES as string[]).includes(saved)) {
            setModeState(saved as ThemeMode);
        }
        setMounted(true);
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    const theme = useMemo(() => {
        switch (mode) {
            case 'google': return googleTheme;
            case 'raspberry': return raspberryTheme;
            case 'midnight': return midnightVioletTheme;
            case 'luxury': return luxuryMinimalTheme;
            case 'dark':
            default: return darkTheme;
        }
    }, [mode]);

    if (!mounted) {
        return (
            <MuiThemeProvider theme={luxuryMinimalTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        );
    }

    return (
        <ThemeContext.Provider value={{ mode, setMode, resolvedMode: mode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}
