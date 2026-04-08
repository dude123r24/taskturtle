'use client';

import { createTheme } from '@mui/material/styles';

const sharedTypography = {
    fontFamily: 'var(--font-sans), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
                minHeight: 44,
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
            secondary: '#B5B7CC',
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
                    minHeight: 44,
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

/** Filko-inspired cream canvas, purple primary, gold secondary; does not alter other themes */
const luxuryTypography = {
    fontFamily: 'var(--font-sans), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' },
    button: { textTransform: 'none' as const, fontWeight: 600 },
};

/** Task management dashboard (Figma-style): warm cream canvas, soft purple accents */
export const luxuryMinimalTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#7568C0',
            light: '#9B90D4',
            dark: '#5A4D9E',
        },
        secondary: {
            main: '#C9A227',
            light: '#E6B325',
            dark: '#9A7B1A',
        },
        background: {
            default: '#FDFBF7',
            paper: '#FFFFFF',
        },
        error: { main: '#C53030' },
        warning: { main: '#D69E2E' },
        info: { main: '#553C9A' },
        success: { main: '#2F855A' },
        text: {
            primary: '#1A1A1A',
            secondary: '#717171',
        },
        divider: 'rgba(26, 26, 26, 0.08)',
    },
    typography: luxuryTypography,
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 22px',
                    minHeight: 44,
                },
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(117, 104, 192, 0.26)',
                    '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(117, 104, 192, 0.34)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(26, 26, 26, 0.06)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: 3,
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
                    boxShadow: '0 4px 14px 0 rgba(117, 104, 192, 0.3)',
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none' as const,
                    minHeight: 44,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(117, 104, 192, 0.14)',
                        color: '#5A4D9E',
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(117, 104, 192, 0.14)',
                        color: '#5A4D9E',
                        '& .MuiListItemIcon-root': {
                            color: '#5A4D9E',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(253, 251, 247, 0.92)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: '#1A1A1A',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(26, 26, 26, 0.06)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid rgba(26, 26, 26, 0.08)',
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
