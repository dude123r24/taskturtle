'use client';

import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { OverloadInfo } from '@/components/dashboard/types';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

interface DashboardBannersProps {
    showWelcome: boolean;
    onDismissWelcome: () => void;
    overload: OverloadInfo | null;
}

export function DashboardBanners({ showWelcome, onDismissWelcome, overload }: DashboardBannersProps) {
    const isLuxury = useLuxuryDashboard();
    const theme = useTheme();

    const glassBanner = isLuxury
        ? {
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            border: `1px solid ${alpha(theme.palette.common.white, 0.65)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.dark, 0.06)}`,
        }
        : {};

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {showWelcome && (
                <Box
                    sx={{
                        borderRadius: 2,
                        p: 2.5,
                        ...(isLuxury
                            ? glassBanner
                            : {
                                border: '1px solid rgba(107, 70, 193, 0.2)',
                                bgcolor: 'rgba(107, 70, 193, 0.06)',
                            }),
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="overline"
                            sx={{ fontWeight: 800, letterSpacing: '0.12em', color: 'primary.main', display: 'block', mb: 0.5 }}
                        >
                            Welcome
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                            Priority dashboard
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            See priorities, today&apos;s plan, and insights in one calm view. Dismiss anytime.
                        </Typography>
                    </Box>
                    <IconButton size="small" aria-label="Dismiss" onClick={onDismissWelcome} sx={{ mt: -0.5 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            {overload?.isOverloaded && (
                <Box
                    sx={{
                        borderRadius: 2,
                        p: 2.5,
                        ...(isLuxury
                            ? {
                                ...glassBanner,
                                backgroundColor: alpha(theme.palette.warning.light, 0.45),
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
                            }
                            : {
                                border: '1px solid rgba(214, 158, 46, 0.35)',
                                bgcolor: 'rgba(214, 158, 46, 0.08)',
                            }),
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-start',
                    }}
                >
                    <WarningAmberIcon sx={{ color: 'warning.dark', mt: 0.25 }} />
                    <Box>
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.1em', color: 'warning.dark' }}>
                            Capacity
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, fontWeight: 500, lineHeight: 1.6 }}>
                            You have {overload.taskCount} tasks planned for today (max: {overload.maxDaily}). Consider
                            deferring some to stay focused.
                        </Typography>
                    </Box>
                </Box>
            )}

            {overload?.isTimeOverloaded && (
                <Box
                    sx={{
                        borderRadius: 2,
                        p: 2.5,
                        ...(isLuxury
                            ? {
                                ...glassBanner,
                                backgroundColor: alpha(theme.palette.error.light, 0.48),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
                            }
                            : {
                                border: '1px solid rgba(197, 48, 48, 0.3)',
                                bgcolor: 'rgba(197, 48, 48, 0.06)',
                            }),
                    }}
                >
                    <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.1em', color: 'error.main' }}>
                        Time budget
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, fontWeight: 500, lineHeight: 1.6 }}>
                        Today&apos;s tasks total {Math.round(overload.totalMinutes / 60)}h (max:{' '}
                        {Math.round(overload.maxDailyMinutes / 60)}h). You&apos;re overcommitted.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
