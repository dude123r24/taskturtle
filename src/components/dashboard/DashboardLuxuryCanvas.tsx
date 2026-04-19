'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface DashboardLuxuryCanvasProps {
    children: ReactNode;
}

export function DashboardLuxuryCanvas({ children }: DashboardLuxuryCanvasProps) {
    return (
        <Box
            sx={{
                position: 'relative',
                mx: { xs: -2, md: -3 },
                px: { xs: 2, md: 3 },
                minHeight: { xs: '72vh', md: '78vh' },
                bgcolor: 'background.default',
            }}
        >
            {children}
        </Box>
    );
}
