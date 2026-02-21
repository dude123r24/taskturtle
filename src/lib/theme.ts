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
            main: '#4285F4',   // Google Blue
            light: '#669DF6',
            dark: '#1A73E8',
        },
        secondary: {
            main: '#EA4335',   // Google Red
            light: '#F28B82',
            dark: '#C5221F',
        },
        background: {
            default: '#F8F9FA', // Google's light gray
            paper: '#FFFFFF',
        },
        error: { main: '#EA4335' },   // Google Red
        warning: { main: '#FBBC05' }, // Google Yellow
        info: { main: '#4285F4' },    // Google Blue
        success: { main: '#34A853' }, // Google Green
        text: {
            primary: '#202124',   // Google's near-black
            secondary: '#5F6368', // Google's medium gray
        },
        divider: '#DADCE0',
    },
    typography: {
        ...sharedTypography,
        fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    padding: '8px 24px',
                    textTransform: 'none' as const,
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
                    '&:hover': {
                        boxShadow: '0 2px 6px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.10)',
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
                    boxShadow: '0 1px 2px rgba(60,64,67,0.1), 0 1px 3px rgba(60,64,67,0.08)',
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
                    boxShadow: '0 2px 6px rgba(66,133,244,0.3)',
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    textTransform: 'none' as const,
                },
            },
        },
    },
});

// Keep backwards compat — default to dark
export const theme = darkTheme;
