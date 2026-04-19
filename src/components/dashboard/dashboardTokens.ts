/** Zenso-style glass band (used on dashboard KPI strip in non-brutal themes) */
export const glassBand = {
    navy: '#0B1945',
    blobTeal: 'rgba(45, 212, 191, 0.45)',
    blobBlue: 'rgba(59, 130, 246, 0.45)',
    glassBg: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    glassText: 'rgba(255, 255, 255, 0.92)',
    glassMuted: 'rgba(255, 255, 255, 0.62)',
} as const;

/** Neo-brutalism dashboard background config */
export const luxuryDashboardBg = {
    image: '',
    artOpacity: 0,
    washOpacity: 0,
} as const;

/** Neo-brutalism panels: heavy black borders + offset shadow */
export const frostedLuxury = {
    panel: {
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        boxShadow: '4px 4px 0px #000000',
    },
    panelDense: {
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        boxShadow: '3px 3px 0px #000000',
    },
    tile: {
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        boxShadow: '2px 2px 0px #000000',
    },
} as const;
