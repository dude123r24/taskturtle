'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { frostedLuxury } from '@/components/dashboard/dashboardTokens';
import { useLuxuryDashboard } from '@/components/dashboard/useLuxuryDashboard';

interface DashboardHeroProps {
    greetingName: string;
    completedThisWeek: number;
}

export function DashboardHero({ greetingName, completedThisWeek }: DashboardHeroProps) {
    const isLuxury = useLuxuryDashboard();

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 3,
                ...(isLuxury
                    ? frostedLuxury.panel
                    : {
                        bgcolor: 'rgba(255, 252, 247, 0.95)',
                        border: '1px solid rgba(26, 26, 26, 0.06)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    }),
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'text.primary',
                    mb: 1,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                }}
            >
                Hello, {greetingName}
            </Typography>
            <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mb: 3, maxWidth: 420, lineHeight: 1.6 }}
            >
                {completedThisWeek > 0
                    ? `You completed ${completedThisWeek} task${completedThisWeek === 1 ? '' : 's'} this week. Keep your priorities in view.`
                    : 'Your analytics and priorities live here. Start by capturing what matters most.'}
            </Typography>
            <Button
                component={Link}
                href="/tasks"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2, px: 3, py: 1.25, fontWeight: 700 }}
            >
                View tasks
            </Button>
        </Box>
    );
}
