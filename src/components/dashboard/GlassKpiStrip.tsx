'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { glassBand } from '@/components/dashboard/dashboardTokens';

export interface GlassKpiItem {
    label: string;
    value: string | number;
    accent?: string;
}

export function GlassKpiStrip({ items }: { items: GlassKpiItem[] }) {
    return (
        <Box
            sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                background: glassBand.navy,
                py: { xs: 3, md: 4 },
                px: { xs: 2, md: 3 },
                mb: 3,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '-40%',
                    right: '-8%',
                    width: { xs: 220, md: 320 },
                    height: { xs: 220, md: 320 },
                    borderRadius: '50%',
                    background: glassBand.blobTeal,
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-35%',
                    left: '-5%',
                    width: { xs: 180, md: 260 },
                    height: { xs: 180, md: 260 },
                    borderRadius: '50%',
                    background: glassBand.blobBlue,
                    filter: 'blur(72px)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                    gap: 2,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {items.map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            borderRadius: 2.5,
                            p: 2.5,
                            background: glassBand.glassBg,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: `1px solid ${glassBand.glassBorder}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: glassBand.glassMuted,
                                fontWeight: 500,
                                fontSize: '0.8125rem',
                                mb: 1,
                            }}
                        >
                            {item.label}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: item.accent || glassBand.glassText,
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                            }}
                        >
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
