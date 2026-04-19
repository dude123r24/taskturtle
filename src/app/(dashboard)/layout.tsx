'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Z } from '@/lib/zIndex';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { serverSignOut } from '@/lib/authActions';
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
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useTaskStore } from '@/store/taskStore';
import QuickAddDialog from '@/components/tasks/QuickAddDialog';
import CommandPalette from '@/components/layout/CommandPalette';
import ShareModal from '@/components/ShareModal';
import { useThemeMode } from '@/components/ThemeContext';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { getPageTitle, getBottomNavValue } from '@/lib/navConfig';
import { isPlatformAdmin } from '@/lib/taskDeepLinks';

const DRAWER_WIDTH = 260;

const GOOGLE_ICON_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#4285F4', '#EA4335', '#34A853'];

const PRIMARY_NAV = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Tasks', icon: <ChecklistIcon />, href: '/tasks' },
    { label: 'Task Grid', icon: <TableChartIcon />, href: '/tasks-grid' },
    { label: 'Planner', icon: <ViewTimelineIcon />, href: '/planner' },
    { label: 'Focus', icon: <CenterFocusStrongIcon />, href: '/focus' },
] as const;

const MORE_NAV = [
    { label: 'AI Assistant', icon: <SmartToyIcon />, href: '/chat' },
    { label: 'Features', icon: <LightbulbOutlinedIcon />, href: '/features' },
] as const;

function routeSelected(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        }
    }, [status, router]);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreSheetOpen, setMoreSheetOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { quickAddOpen, setQuickAddOpen } = useTaskStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                setQuickAddOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setQuickAddOpen]);

    // Redeem pending invite token stored by login page
    useEffect(() => {
        if (status !== 'authenticated') return;
        const pendingToken = localStorage.getItem('pendingInviteToken');
        if (!pendingToken) return;
        localStorage.removeItem('pendingInviteToken');
        fetch(`/api/invite/${pendingToken}`, { method: 'POST' }).catch(() => {});
    }, [status]);
    const { resolvedMode } = useThemeMode();
    const isGoogle = resolvedMode === 'google';
    const isLuxury = resolvedMode === 'luxury';

    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const closeMore = useCallback(() => setMoreSheetOpen(false), []);

    const navButtonSx = useCallback(
        (href: string, googleColorIndex: number) => ({
            borderRadius: 2,
            mb: 0.5,
            ...(isGoogle
                ? {
                    '&.Mui-selected': {
                        bgcolor: (theme: { palette: { primary: { main: string } } }) => `${theme.palette.primary.main}15`,
                        color: GOOGLE_ICON_COLORS[googleColorIndex],
                        '& .MuiListItemIcon-root': {
                            color: GOOGLE_ICON_COLORS[googleColorIndex],
                        },
                    },
                    '&:hover': {
                        bgcolor: (theme: { palette: { primary: { main: string } } }) => `${theme.palette.primary.main}14`,
                    },
                }
                : isLuxury
                    ? {} // MuiListItemButton theme override handles yellow selected state
                    : {
                        '&.Mui-selected': {
                            bgcolor: (theme: { palette: { primary: { main: string } } }) => `${theme.palette.primary.main}15`,
                            color: 'primary.main',
                            '& .MuiListItemIcon-root': {
                                color: 'primary.main',
                            },
                        },
                        '&:hover': {
                            bgcolor: (theme: { palette: { primary: { main: string } } }) => `${theme.palette.primary.main}14`,
                        },
                    }),
        }),
        [isGoogle, isLuxury, pathname]
    );

    const brandBlock = useMemo(
        () => (
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1, minHeight: 56 }}>
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
                ) : isLuxury ? (
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', border: '2px solid', borderColor: 'text.primary', px: 1, py: 0.25, bgcolor: 'primary.main' }}>
                        TaskTurtle
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
        ),
        [isGoogle, isLuxury]
    );

    const renderNavList = (onNavigate?: () => void) => (
        <>
            <List sx={{ flex: 1, px: 1, pt: 1 }}>
                {PRIMARY_NAV.map((item, index) => (
                    <ListItem key={item.href} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            selected={routeSelected(pathname, item.href)}
                            onClick={onNavigate}
                            sx={navButtonSx(item.href, index)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 44,
                                    ...(isGoogle ? { color: GOOGLE_ICON_COLORS[index] } : {}),
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: routeSelected(pathname, item.href) ? 600 : 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Typography
                variant="overline"
                sx={{ px: 2.5, pt: 1.5, pb: 0.5, display: 'block', color: 'text.secondary', letterSpacing: '0.14em', fontWeight: 700 }}
            >
                More
            </Typography>
            <List sx={{ px: 1, pb: 1 }}>
                {MORE_NAV.map((item, index) => {
                    const gIdx = PRIMARY_NAV.length + index;
                    return (
                        <ListItem key={item.href} disablePadding>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                selected={routeSelected(pathname, item.href)}
                                onClick={onNavigate}
                                sx={navButtonSx(item.href, gIdx)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 44,
                                        ...(isGoogle ? { color: GOOGLE_ICON_COLORS[gIdx % GOOGLE_ICON_COLORS.length] } : {}),
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        fontWeight: routeSelected(pathname, item.href) ? 600 : 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                {isPlatformAdmin(session?.user?.email) && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            href="/admin"
                            selected={routeSelected(pathname, '/admin')}
                            onClick={onNavigate}
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
                            <ListItemIcon sx={{ minWidth: 44 }}>
                                <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Admin"
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: routeSelected(pathname, '/admin') ? 600 : 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </>
    );

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {brandBlock}
            <Divider sx={{ borderColor: 'divider' }} />
            {renderNavList(closeMobile)}
            <Divider sx={{ borderColor: 'divider', mt: 'auto' }} />
            <List sx={{ px: 1, py: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => { setShareOpen(true); closeMobile(); }}
                        sx={{ borderRadius: 2 }}
                        aria-label="Invite friends"
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <PersonAddAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Invite friends" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/settings" onClick={closeMobile} sx={{ borderRadius: 2 }}>
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Typography variant="caption" sx={{ px: 2, pb: 1.5, color: 'text.secondary', display: { xs: 'block', md: 'none' } }}>
                Tip: ⌘K / Ctrl+K for command palette
            </Typography>
        </Box>
    );

    const moreSheetContent = (
        <Box sx={{ px: 2, pt: 1, pb: 'calc(16px + env(safe-area-inset-bottom))' }} role="dialog" aria-modal="true" aria-label="More destinations">
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ px: 1, mb: 1, fontWeight: 700 }}>
                More
            </Typography>
            <List disablePadding>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        href="/tasks-grid"
                        onClick={closeMore}
                        selected={routeSelected(pathname, '/tasks-grid')}
                        sx={{ borderRadius: 2, py: 1.25 }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <TableChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Task Grid" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        href="/focus"
                        onClick={closeMore}
                        selected={routeSelected(pathname, '/focus')}
                        sx={{ borderRadius: 2, py: 1.25 }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <CenterFocusStrongIcon />
                        </ListItemIcon>
                        <ListItemText primary="Focus" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
                {MORE_NAV.map((item) => (
                    <ListItem key={item.href} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            onClick={closeMore}
                            selected={routeSelected(pathname, item.href)}
                            sx={{ borderRadius: 2, py: 1.25 }}
                        >
                            <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isPlatformAdmin(session?.user?.email) && (
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/admin" onClick={closeMore} sx={{ borderRadius: 2, py: 1.25 }}>
                            <ListItemIcon sx={{ minWidth: 44 }}>
                                <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Admin" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                )}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => { setShareOpen(true); closeMore(); }}
                        sx={{ borderRadius: 2, py: 1.25 }}
                        aria-label="Invite friends"
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <PersonAddAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Invite friends" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} href="/settings" onClick={closeMore} sx={{ borderRadius: 2, py: 1.25 }}>
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const handleBottomNav = (_: React.SyntheticEvent, value: string) => {
        if (value === '__more') {
            setMoreSheetOpen(true);
            return;
        }
        router.push(value);
    };

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: 'text.primary' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Skip to main content — visually hidden until focused */}
            <Box
                component="a"
                href="#main-content"
                sx={{
                    position: 'absolute',
                    top: -60,
                    left: 8,
                    zIndex: Z.skipLink,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:focus': { top: 8 },
                }}
            >
                Skip to main content
            </Box>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={closeMobile}
                aria-label="Navigation menu"
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                        pt: 'env(safe-area-inset-top)',
                        pb: 'env(safe-area-inset-bottom)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                        pt: 'env(safe-area-inset-top)',
                        pb: 'env(safe-area-inset-bottom)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                anchor="bottom"
                open={moreSheetOpen}
                onClose={closeMore}
                sx={{ display: { xs: 'block', md: 'none' }, zIndex: Z.bottomSheet }}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        maxHeight: '70vh',
                    },
                }}
            >
                {moreSheetContent}
            </Drawer>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    ml: { md: `${DRAWER_WIDTH}px` },
                    width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    pb: 'env(safe-area-inset-bottom)',
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: (theme) =>
                            isLuxury
                                ? 'rgba(253, 251, 247, 0.92)'
                                : theme.palette.mode === 'dark'
                                    ? 'rgba(15, 14, 23, 0.8)'
                                    : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                        boxShadow: 'none',
                        // Use explicit paddingTop (not shorthand pt) to bypass MUI spacing transform
                        paddingTop: 'env(safe-area-inset-top)',
                    }}
                >
                    {isGoogle && (
                        <Box sx={{ display: 'flex', height: 4 }}>
                            <Box sx={{ flex: 1, bgcolor: '#4285F4' }} />
                            <Box sx={{ flex: 1, bgcolor: '#EA4335' }} />
                            <Box sx={{ flex: 1, bgcolor: '#FBBC05' }} />
                            <Box sx={{ flex: 1, bgcolor: '#34A853' }} />
                        </Box>
                    )}
                    <Toolbar sx={{ minHeight: '56px !important' }}>
                        <IconButton
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open navigation menu"
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="h6" noWrap component="div">
                                {getPageTitle(pathname)}
                            </Typography>
                        </Box>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="User profile menu">
                            <Avatar
                                src={session?.user?.image || undefined}
                                alt={session?.user?.name || 'User'}
                                sx={{ width: 32, height: 32 }}
                            />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem disabled>
                                <Typography variant="body2" color="text.secondary">
                                    {session?.user?.email}
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem component={Link} href="/settings" onClick={() => setAnchorEl(null)}>
                                Settings
                            </MenuItem>
                            <Box component="form" action={serverSignOut} sx={{ m: 0 }}>
                                <MenuItem
                                    component="button"
                                    type="submit"
                                    onClick={() => setAnchorEl(null)}
                                    sx={{ width: '100%', border: 0, bgcolor: 'transparent', font: 'inherit', textAlign: 'left' }}
                                >
                                    Sign out
                                </MenuItem>
                            </Box>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Box
                    id="main-content"
                    component="main"
                    sx={{
                        flex: 1,
                        px: { xs: 2, md: 3 },
                        pt: { xs: 2, md: 3 },
                        pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', md: 3 },
                        maxWidth: 1200,
                        width: '100%',
                        mx: 'auto',
                    }}
                    className="page-enter"
                >
                    {children}
                </Box>
            </Box>

            <Paper
                square
                elevation={8}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: Z.bottomNav,
                    pb: 'env(safe-area-inset-bottom)',
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <BottomNavigation
                    value={getBottomNavValue(pathname)}
                    onChange={handleBottomNav}
                    showLabels
                    sx={{
                        bgcolor: 'background.paper',
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.75rem',
                            '&.Mui-selected': { fontSize: '0.75rem' },
                        },
                    }}
                >
                    <BottomNavigationAction label="Dashboard" value="/dashboard" icon={<DashboardIcon />} />
                    <BottomNavigationAction label="Tasks" value="/tasks" icon={<ChecklistIcon />} />
                    <BottomNavigationAction label="Planner" value="/planner" icon={<ViewTimelineIcon />} />
                    <BottomNavigationAction label="More" value="__more" icon={<MoreHorizIcon />} />
                </BottomNavigation>
            </Paper>

            <Fab
                color="primary"
                aria-label="Quick add task"
                onClick={() => setQuickAddOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: {
                        xs: 'calc(72px + env(safe-area-inset-bottom))',
                        md: 'calc(24px + env(safe-area-inset-bottom))',
                    },
                    right: 'calc(24px + env(safe-area-inset-right))',
                    zIndex: Z.fab,
                }}
            >
                <AddIcon />
            </Fab>

            <QuickAddDialog open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />

            <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

            <CommandPalette />
        </Box>
    );
}
