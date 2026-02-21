'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useTaskStore } from '@/store/taskStore';
import QuickAddDialog from '@/components/tasks/QuickAddDialog';
import CommandPalette from '@/components/layout/CommandPalette';
import { useThemeMode } from '@/components/ThemeContext';

const DRAWER_WIDTH = 240;

// Google RGBY colors for sidebar icons
const GOOGLE_ICON_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#4285F4', '#EA4335', '#34A853'];

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Tasks', icon: <ChecklistIcon />, href: '/tasks' },
    { label: 'Planner', icon: <ViewTimelineIcon />, href: '/planner' },
    { label: 'Calendar', icon: <CalendarMonthIcon />, href: '/calendar' },
    { label: 'Focus', icon: <CenterFocusStrongIcon />, href: '/focus' },
    { label: 'AI Assistant', icon: <SmartToyIcon />, href: '/chat' },
    { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
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
    const { resolvedMode } = useThemeMode();
    const isGoogle = resolvedMode === 'google';

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {isGoogle ? (
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        <Box component="span" sx={{ color: '#4285F4' }}>T</Box>
                        <Box component="span" sx={{ color: '#EA4335' }}>a</Box>
                        <Box component="span" sx={{ color: '#FBBC05' }}>s</Box>
                        <Box component="span" sx={{ color: '#4285F4' }}>k</Box>
                        <Box component="span" sx={{ color: '#34A853' }}>T</Box>
                        <Box component="span" sx={{ color: '#EA4335' }}>u</Box>
                        <Box component="span" sx={{ color: '#4285F4' }}>r</Box>
                        <Box component="span" sx={{ color: '#FBBC05' }}>t</Box>
                        <Box component="span" sx={{ color: '#34A853' }}>l</Box>
                        <Box component="span" sx={{ color: '#EA4335' }}>e</Box>
                    </Typography>
                ) : (
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        TaskTurtle
                    </Typography>
                )}
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />
            <List sx={{ flex: 1, px: 1, pt: 1 }}>
                {NAV_ITEMS.map((item, index) => (
                    <ListItem key={item.href} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            selected={pathname === item.href}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: (theme) => `${theme.palette.primary.main}15`,
                                    color: isGoogle ? GOOGLE_ICON_COLORS[index] : 'primary.main',
                                    '& .MuiListItemIcon-root': {
                                        color: isGoogle ? GOOGLE_ICON_COLORS[index] : 'primary.main',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: (theme) => `${theme.palette.primary.main}14`,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: isGoogle ? GOOGLE_ICON_COLORS[index] : undefined }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: pathname === item.href ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                {session?.user?.email === 'sanghviamit@gmail.com' && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            href="/admin"
                            selected={pathname === '/admin'}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(251, 140, 0, 0.15)',
                                    color: '#FB8C00',
                                    '& .MuiListItemIcon-root': {
                                        color: '#FB8C00',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(251, 140, 0, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Admin"
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: pathname === '/admin' ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
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
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
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
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
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
                    ml: { md: `${DRAWER_WIDTH}px` },
                    width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 14, 23, 0.8)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                    }}
                >
                    {/* Google 4-color strip */}
                    {isGoogle && (
                        <Box sx={{ display: 'flex', height: 4 }}>
                            <Box sx={{ flex: 1, bgcolor: '#4285F4' }} />
                            <Box sx={{ flex: 1, bgcolor: '#EA4335' }} />
                            <Box sx={{ flex: 1, bgcolor: '#FBBC05' }} />
                            <Box sx={{ flex: 1, bgcolor: '#34A853' }} />
                        </Box>
                    )}
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" noWrap component="div">
                                {NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Dashboard'}
                            </Typography>
                        </Box>
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

            {/* Command Palette */}
            <CommandPalette />
        </Box>
    );
}
