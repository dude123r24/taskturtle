'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import ViewTimelineRoundedIcon from '@mui/icons-material/ViewTimelineRounded';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

const TILES = [
    {
        href: '/tasks',
        label: 'Tasks',
        subtitle: 'Matrix & list',
        Icon: ChecklistRoundedIcon,
        bg: '#FFFFFF',
        border: 'rgba(26, 26, 26, 0.08)',
        iconColor: '#7568C0',
    },
    {
        href: '/planner',
        label: 'Planner',
        subtitle: 'Day plan',
        Icon: ViewTimelineRoundedIcon,
        bg: 'rgba(201, 162, 39, 0.14)',
        border: 'rgba(201, 162, 39, 0.28)',
        iconColor: '#9A7B1A',
    },
    {
        href: '/focus',
        label: 'Focus',
        subtitle: 'Deep work',
        Icon: CenterFocusStrongRoundedIcon,
        bg: 'rgba(117, 104, 192, 0.12)',
        border: 'rgba(117, 104, 192, 0.22)',
        iconColor: '#5A4D9E',
    },
] as const;

export function ShortcutTiles() {
    const isLuxury = useLuxuryDashboard();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: { xs: '100%', md: 200 },
                flexShrink: 0,
            }}
        >
            {TILES.map((tile) => (
                <Box
                    key={tile.href}
                    component={Link}
                    href={tile.href}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 2.5,
                        borderRadius: 3,
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                        minHeight: 120,
                        ...(isLuxury
                            ? {
                                ...frostedLuxury.tile,
                                backgroundColor:
                                    tile.href === '/tasks'
                                        ? 'rgba(255, 255, 255, 0.42)'
                                        : tile.href === '/planner'
                                            ? 'rgba(245, 225, 160, 0.38)'
                                            : 'rgba(200, 180, 245, 0.35)',
                                border: `1px solid ${tile.border}`,
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 12px 32px rgba(48, 32, 90, 0.12)',
                                },
                            }
                            : {
                                bgcolor: tile.bg,
                                border: `1px solid ${tile.border}`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                                },
                            }),
                    }}
                >
                    <tile.Icon sx={{ fontSize: 36, color: tile.iconColor, mb: 1.5 }} />
                    <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em">
                        {tile.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {tile.subtitle}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
