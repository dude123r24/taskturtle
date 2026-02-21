'use client';

import { createTheme } from '@mui/material/styles';

const sharedTypography = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 500, fontSize: '1.1rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    button: { textTransform: 'none' as const, fontWeight: 600 },
};

const sharedShape = {
    borderRadius: 12,
};

const sharedComponents = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '8px 20px',
            },
            contained: {
                boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            },
        },
    },
};

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C63FF',
            light: '#9D97FF',
            dark: '#4A42CC',
        },
        secondary: {
            main: '#FF6584',
            light: '#FF8FA3',
            dark: '#CC4E69',
        },
        background: {
            default: '#0F0E17',
            paper: '#1A1929',
        },
        error: { main: '#E53935' },
        warning: { main: '#FB8C00' },
        info: { main: '#1E88E5' },
        success: { main: '#43A047' },
        text: {
            primary: '#FFFFFE',
            secondary: '#A7A9BE',
        },
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
        ...sharedComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 14px 0 rgba(108, 99, 255, 0.39)',
                },
            },
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#5046E5',
            light: '#7C74FF',
            dark: '#3730A3',
        },
        secondary: {
            main: '#E8456B',
            light: '#FF6584',
            dark: '#BE3455',
        },
        background: {
            default: '#F5F5FA',
            paper: '#FFFFFF',
        },
        error: { main: '#D32F2F' },
        warning: { main: '#ED6C02' },
        info: { main: '#1565C0' },
        success: { main: '#2E7D32' },
        text: {
            primary: '#1A1A2E',
            secondary: '#64648B',
        },
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
        ...sharedComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 14px 0 rgba(80, 70, 229, 0.25)',
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
