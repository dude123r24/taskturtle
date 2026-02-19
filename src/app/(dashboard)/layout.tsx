'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { useTaskStore } from '@/store/taskStore';
import QuickAddDialog from '@/components/tasks/QuickAddDialog';

const DRAWER_WIDTH = 240;

const navItems = [
    { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
    { label: 'Tasks', href: '/tasks', icon: <ChecklistIcon /> },
    { label: 'Planner', href: '/planner', icon: <ViewTimelineIcon /> },
    { label: 'Calendar', href: '/calendar', icon: <CalendarMonthIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { quickAddOpen, setQuickAddOpen } = useTaskStore();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    TaskTurtle
                </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <List sx={{ flex: 1, px: 1, pt: 1 }}>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.href}
                        component={Link}
                        href={item.href}
                        selected={pathname === item.href}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'rgba(108, 99, 255, 0.15)',
                                color: '#6C63FF',
                                '& .MuiListItemIcon-root': { color: '#6C63FF' },
                            },
                            '&:hover': {
                                bgcolor: 'rgba(108, 99, 255, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: 'background.paper',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: 'background.paper',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(15, 14, 23, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                            {navItems.find((n) => n.href === pathname)?.label || 'Dashboard'}
                        </Typography>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Avatar
                                src={session?.user?.image || undefined}
                                alt={session?.user?.name || 'User'}
                                sx={{ width: 32, height: 32 }}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2" color="text.secondary">
                                    {session?.user?.email}
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 3 },
                        maxWidth: 1400,
                        width: '100%',
                        mx: 'auto',
                    }}
                    className="page-enter"
                >
                    {children}
                </Box>
            </Box>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="Quick add task"
                onClick={() => setQuickAddOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1200,
                }}
            >
                <AddIcon />
            </Fab>

            {/* Quick Add Dialog */}
            <QuickAddDialog
                open={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
            />
        </Box>
    );
}
