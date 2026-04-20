'use client';

import { createTheme } from '@mui/material/styles';

const FONT_FAMILY =
    '"Google Sans Flex", "Google Sans", "Roboto", var(--font-sans), "Helvetica", "Arial", sans-serif';

const sharedTypography = {
    fontFamily: FONT_FAMILY,
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

export const darkTheme = createTheme({
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

/** Neo-brutalism: heavy black borders, yellow accent, punchy flat design */
const neoBrutalTypography = {
    fontFamily: FONT_FAMILY,
    h1: { fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.25rem' },
    h5: { fontWeight: 700, fontSize: '1.1rem' },
    h6: { fontWeight: 700, fontSize: '1rem' },
    button: { textTransform: 'none' as const, fontWeight: 700 },
};

/** Neo-brutalism: flat, bold, black-bordered — no gradients, no blur */
export const luxuryMinimalTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FFE566',
            light: '#FFF0A0',
            dark: '#F0C800',
            contrastText: '#000000',
        },
        secondary: {
            main: '#FF6B6B',
            light: '#FF9B9B',
            dark: '#CC4444',
            contrastText: '#000000',
        },
        background: {
            default: '#FAFAF7',
            paper: '#FFFFFF',
        },
        error: { main: '#FF3333' },
        warning: { main: '#FF9900' },
        info: { main: '#0066FF' },
        success: { main: '#00CC66' },
        text: {
            primary: '#000000',
            secondary: '#444444',
        },
        divider: '#000000',
    },
    typography: neoBrutalTypography,
    shape: { borderRadius: 4 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    border: '2px solid #000000',
                    boxShadow: '3px 3px 0px #000000',
                    minHeight: 44,
                    '&:active': {
                        transform: 'translate(2px, 2px)',
                        boxShadow: '1px 1px 0px #000000',
                    },
                },
                contained: {
                    backgroundColor: '#FFE566',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#FFF0A0',
                        boxShadow: '4px 4px 0px #000000',
                    },
                },
                outlined: {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#FFE566',
                        color: '#000000',
                        boxShadow: '4px 4px 0px #000000',
                    },
                },
                text: {
                    border: 'none',
                    boxShadow: 'none',
                    color: '#000000',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)', boxShadow: 'none' },
                    '&:active': { transform: 'none', boxShadow: 'none' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    borderRadius: 4,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 4,
                    border: '1.5px solid #000000',
                    color: '#000000',
                },
                colorPrimary: {
                    backgroundColor: '#FFE566',
                    color: '#000000',
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
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: 0,
                    backgroundColor: '#000000',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    backgroundColor: '#FFE566',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#FFF0A0',
                        boxShadow: '6px 6px 0px #000000',
                    },
                    '&:active': {
                        transform: 'translate(2px, 2px)',
                        boxShadow: '2px 2px 0px #000000',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    textTransform: 'none' as const,
                    minHeight: 44,
                    border: '2px solid #000000 !important',
                    '&.Mui-selected': {
                        backgroundColor: '#FFE566',
                        color: '#000000',
                        '&:hover': { backgroundColor: '#FFF0A0' },
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    '&.Mui-selected': {
                        backgroundColor: '#FFE566',
                        color: '#000000',
                        '& .MuiListItemIcon-root': { color: '#000000' },
                        '&:hover': { backgroundColor: '#FFF0A0' },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FAFAF7',
                    color: '#000000',
                    boxShadow: 'none',
                    borderBottom: '2px solid #000000',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    borderRight: '2px solid #000000',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: 'rgba(0, 0, 0, 0.15)' },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#000000',
                    '&:hover': { backgroundColor: 'rgba(255, 229, 102, 0.35)' },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#000000',
                    fontWeight: 700,
                    textDecorationColor: '#000000',
                    '&:hover': { color: '#000000', textDecorationColor: '#000000' },
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
