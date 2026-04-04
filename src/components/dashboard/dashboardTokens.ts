/** Zenso-style glass band (used on dashboard KPI strip) */
export const glassBand = {
    navy: '#0B1945',
    blobTeal: 'rgba(45, 212, 191, 0.45)',
    blobBlue: 'rgba(59, 130, 246, 0.45)',
    glassBg: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    glassText: 'rgba(255, 255, 255, 0.92)',
    glassMuted: 'rgba(255, 255, 255, 0.62)',
} as const;

/**
 * Full-bleed art for luxury dashboard. Tune wash/opacity for readability vs glass clarity.
 * Swap `image` for your own asset under /public if desired.
 */
export const luxuryDashboardBg = {
    image: '/dashboard-luxury-bg.svg',
    /** Opacity of the artwork layer (0–1) */
    artOpacity: 1,
    /** Extra cream veil over art: higher = calmer text, less visible blur through panels */
    washOpacity: 0.36,
} as const;

/** Frosted panels on top of luxury background (backdrop blur needs busy artwork behind) */
export const frostedLuxury = {
    panel: {
        backgroundColor: 'rgba(255, 252, 247, 0.38)',
        backdropFilter: 'blur(22px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.15)',
        border: '1px solid rgba(255, 255, 255, 0.72)',
        boxShadow: '0 4px 24px rgba(30, 20, 60, 0.06), 0 1px 0 rgba(255, 255, 255, 0.5) inset',
    },
    panelDense: {
        backgroundColor: 'rgba(255, 252, 247, 0.48)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: '0 2px 12px rgba(30, 20, 60, 0.05)',
    },
    tile: {
        backgroundColor: 'rgba(255, 255, 255, 0.34)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.55)',
        boxShadow: '0 4px 16px rgba(48, 32, 90, 0.07)',
    },
} as const;
