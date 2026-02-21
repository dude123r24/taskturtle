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

export const googleTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1A73E8',   // Google Blue (active)
            light: '#4285F4',
            dark: '#1557B0',
        },
        secondary: {
            main: '#EA4335',   // Google Red
            light: '#F28B82',
            dark: '#C5221F',
        },
        background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
        },
        error: { main: '#EA4335' },
        warning: { main: '#F9AB00' },
        info: { main: '#4285F4' },
        success: { main: '#34A853' },
        text: {
            primary: '#202124',
            secondary: '#5F6368',
        },
        divider: '#DADCE0',
    },
    typography: {
        ...sharedTypography,
        fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none' as const, fontWeight: 500 },
    },
    shape: { borderRadius: 8 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    padding: '8px 24px',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px rgba(60,64,67,0.15)',
                    },
                },
                outlined: {
                    borderColor: '#DADCE0',
                    '&:hover': {
                        backgroundColor: '#F1F3F4',
                        borderColor: '#DADCE0',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: 16,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid #DADCE0',
                    boxShadow: 'none',
                    borderRadius: 8,
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
                    boxShadow: '0 2px 4px rgba(60,64,67,0.3), 0 2px 8px rgba(60,64,67,0.15)',
                    borderRadius: 16,
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    textTransform: 'none' as const,
                    '&.Mui-selected': {
                        backgroundColor: '#E8F0FE',
                        color: '#1A73E8',
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    '&.Mui-selected': {
                        backgroundColor: '#E8F0FE',
                        color: '#1A73E8',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#202124',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid #DADCE0',
                },
            },
        },
    },
});

export const appleTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#007AFF',   // Apple Blue
            light: '#409CFF',
            dark: '#0062CC',
        },
        secondary: {
            main: '#5856D6',   // Apple Purple
            light: '#7A79E0',
            dark: '#3634A3',
        },
        background: {
            default: '#F2F2F7', // Apple system gray 6
            paper: 'rgba(255, 255, 255, 0.72)',
        },
        error: { main: '#FF3B30' },    // Apple Red
        warning: { main: '#FF9500' },  // Apple Orange
        info: { main: '#5AC8FA' },     // Apple Teal
        success: { main: '#34C759' },  // Apple Green
        text: {
            primary: '#1C1C1E',
            secondary: '#8E8E93',
        },
        divider: 'rgba(60, 60, 67, 0.12)',
    },
    typography: {
        ...sharedTypography,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Arial", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
        h3: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em' },
        h4: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
        h5: { fontWeight: 600, fontSize: '1.1rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: '-0.01em' },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 20px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                        opacity: 0.88,
                    },
                },
                outlined: {
                    borderColor: 'rgba(60, 60, 67, 0.18)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 122, 255, 0.06)',
                        borderColor: '#007AFF',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: 8,
                    backdropFilter: 'blur(20px)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(60, 60, 67, 0.08)',
                    boxShadow: '0 0.5px 0 rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                    borderRadius: 16,
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none' as const,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 122, 255, 0.12)',
                        color: '#007AFF',
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 122, 255, 0.12)',
                        color: '#007AFF',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(242, 242, 247, 0.72)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    color: '#1C1C1E',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(242, 242, 247, 0.82)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderRight: '1px solid rgba(60, 60, 67, 0.08)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 14,
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
