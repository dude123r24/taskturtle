'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { luxuryDashboardBg } from '@/components/dashboard/dashboardTokens';

interface DashboardLuxuryCanvasProps {
    children: ReactNode;
}

/**
 * Breaks out of layout horizontal padding, paints full-width art + optional cream wash,
 * then restores content inset so panels align with the rest of the app.
 */
export function DashboardLuxuryCanvas({ children }: DashboardLuxuryCanvasProps) {
    const { image, artOpacity, washOpacity } = luxuryDashboardBg;

    return (
        <Box
            sx={{
                position: 'relative',
                mx: { xs: -2, md: -3 },
                px: { xs: 2, md: 3 },
                minHeight: { xs: '72vh', md: '78vh' },
            }}
        >
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: { xs: 'scroll', md: 'fixed' },
                    opacity: artOpacity,
                }}
            />
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    bgcolor: `rgba(253, 251, 247, ${washOpacity})`,
                    pointerEvents: 'none',
                }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
        </Box>
    );
}
