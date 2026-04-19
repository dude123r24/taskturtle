'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { glassBand } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';

export interface GlassKpiItem {
    label: string;
    value: string | number;
    accent?: string;
    /** In-app route (tasks filters, features, etc.) */
    href?: string
}

export function GlassKpiStrip({ items }: { items: GlassKpiItem[] }) {
    const theme = useTheme();
    const isLuxury = useLuxuryDashboard();
    const isDark = theme.palette.mode === 'dark';

    const embedded = isLuxury
        ? {
              position: 'relative' as const,
              borderRadius: 1,
              overflow: 'visible',
              ...frostedLuxury.panel,
              py: { xs: 2.5, md: 3 },
              px: { xs: 2, md: 2.5 },
              mb: 0,
          }
        : {
              position: 'relative' as const,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              py: { xs: 2.5, md: 3 },
              px: { xs: 2, md: 2.5 },
              mb: 0,
              backgroundImage:
                  isDark
                      ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`
                      : undefined,
          };

    const labelColor = 'text.secondary';
    const valueColorDefault = 'text.primary';

    return (
        <Box sx={embedded}>
            {!isLuxury && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        borderRadius: '12px 12px 0 0',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.55,
                    }}
                />
            )}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: items.length <= 2 ? `repeat(${items.length}, 1fr)` : '1fr 1fr',
                        sm: items.length <= 2 ? `repeat(${items.length}, 1fr)` : 'repeat(2, 1fr)',
                        md: `repeat(${items.length}, minmax(0, 1fr))`,
                    },
                    gap: 2,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {items.map((item) => {
                    const inner = (
                        <>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: labelColor,
                                    fontWeight: 600,
                                    fontSize: '0.8125rem',
                                    mb: 0.75,
                                }}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: item.accent || valueColorDefault,
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    fontSize: { xs: '1.45rem', md: '1.85rem' },
                                }}
                            >
                                {item.value}
                            </Typography>
                        </>
                    );

                    const tileSx = {
                        borderRadius: 2.5,
                        p: 2,
                        ...(isLuxury
                            ? frostedLuxury.tile
                            : {
                                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                                  border: `1px solid ${theme.palette.divider}`,
                              }),
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        ...(item.href
                            ? {
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                  display: 'block',
                                  color: 'inherit',
                                  '&:hover': isLuxury
                                      ? { transform: 'translate(-1px, -1px)', boxShadow: '5px 5px 0px #000000' }
                                      : { transform: 'translateY(-1px)', boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.35)' : '0 6px 20px rgba(0,0,0,0.07)' },
                              }
                            : {}),
                    };

                    return item.href ? (
                        <Box key={item.label} component={Link} href={item.href} sx={tileSx}>
                            {inner}
                        </Box>
                    ) : (
                        <Box key={item.label} sx={tileSx}>
                            {inner}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
