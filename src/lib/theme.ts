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
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'radial-gradient(circle at 15% 50%, rgba(0, 122, 255, 0.12), transparent 50%), radial-gradient(circle at 85% 30%, rgba(88, 86, 214, 0.12), transparent 50%), radial-gradient(circle at 50% 80%, rgba(52, 199, 89, 0.1), transparent 50%), #F2F2F7',
                    backgroundAttachment: 'fixed',
                },
            },
        },
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

// Phase 6 Custom Themes

export const raspberryTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#DB2955', // Raspberry
            light: '#E5567A',
            dark: '#A31C3C',
        },
        secondary: {
            main: '#B98389', // Muted pink
            light: '#D4A8AE',
            dark: '#926167',
        },
        background: {
            default: '#54494B', // Dark greyish-brown
            paper: '#423A3C',
        },
        error: { main: '#DB2955' },
        warning: { main: '#B98389' },
        info: { main: '#7E8287' },
        success: { main: '#9DA39A' }, // Light Sage/Grey
        text: {
            primary: '#FFFFFF',
            secondary: '#E0E0E0',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
        ...sharedComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#423A3C',
                    border: '1px solid #7E8287',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#423A3C',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                ...sharedComponents.MuiButton.styleOverrides,
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(219, 41, 85, 0.39)',
                },
            },
        },
    },
});

export const midnightVioletTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#82204A', // Plum/Magenta
            light: '#A83264',
            dark: '#5C1431',
        },
        secondary: {
            main: '#558C8C', // Teal
            light: '#76AAAA',
            dark: '#386363',
        },
        background: {
            default: '#231123', // Very dark violet
            paper: '#331B33',
        },
        error: { main: '#E8456B' },
        warning: { main: '#E8DB7D' }, // Pale yellow
        info: { main: '#558C8C' },
        success: { main: '#68B36B' },
        text: {
            primary: '#EFF7FF', // Light blue/white
            secondary: '#A6BCCD',
        },
        divider: 'rgba(239, 247, 255, 0.12)',
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
        ...sharedComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#331B33',
                    border: '1px solid rgba(85, 140, 140, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#331B33',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                ...sharedComponents.MuiButton.styleOverrides,
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(130, 32, 74, 0.39)',
                },
            },
        },
    },
});

export const dubaiGoldTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#D4AF37', // Gold
            light: '#F3E5AB',
            dark: '#AA8C2C',
        },
        secondary: {
            main: '#C0C0C0', // Silver
            light: '#E0E0E0',
            dark: '#808080',
        },
        background: {
            default: '#0A0A0A', // Almost black
            paper: '#141414',
        },
        error: { main: '#CF6679' },
        warning: { main: '#D4AF37' },
        info: { main: '#64B5F6' },
        success: { main: '#81C784' },
        text: {
            primary: '#FFFFFF',
            secondary: '#B3B3B3',
        },
        divider: 'rgba(212, 175, 55, 0.2)',
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: {
        ...sharedComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#141414',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#141414',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                ...sharedComponents.MuiButton.styleOverrides,
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.25)',
                    color: '#0A0A0A', // Dark text on gold buttons
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                ...sharedComponents.MuiChip.styleOverrides,
                filled: {
                    boxShadow: '0 1px 3px rgba(212, 175, 55, 0.1)',
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
