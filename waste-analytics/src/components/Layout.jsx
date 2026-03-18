import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Drawer,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Input as InputIcon,
    TableRows as TableRowsIcon,
    QuestionAnswer as SurveyIcon,
    MenuBook as AwarenessIcon,
    Quiz as QuizModeIcon,
    ArrowBack as BackIcon,
    AdminPanelSettings as AdminIcon,
    BarChart as MonitorIcon,
    NotificationsActive as EngageIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Logout as LogoutIcon,
    Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const drawerWidth = 272;

// ─── Admin nav groups ─────────────────────────────────────────────────────────
const adminNavGroups = [
    {
        label: 'Management',
        icon: MonitorIcon,
        color: '#e8b84b',
        items: [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/5s-system/dashboard' },
            { text: 'Monitoring', icon: <AnalyticsIcon />, path: '/5s-system/monitoring' },
        ],
    },
    {
        label: 'Admin',
        icon: AdminIcon,
        color: '#f5a0a0',
        items: [
            { text: 'Data Entry', icon: <InputIcon />, path: '/5s-system/data-entry' },
            { text: 'Data Logs', icon: <TableRowsIcon />, path: '/5s-system/data-logs' },
        ],
    },
    {
        label: 'Engage',
        icon: EngageIcon,
        color: '#fce4ec',
        items: [
            { text: 'Survey', icon: <SurveyIcon />, path: '/5s-system/survey' },
            { text: 'Awareness', icon: <AwarenessIcon />, path: '/5s-system/awareness' },
        ],
    },
];

// ─── Guest nav groups ─────────────────────────────────────────────────────────
const guestNavGroups = [
    {
        label: 'Learn & Engage',
        icon: EngageIcon,
        color: '#e8b84b',
        items: [
            { text: 'Awareness', icon: <AwarenessIcon />, path: '/5s-system/awareness' },
            { text: 'Survey', icon: <SurveyIcon />, path: '/5s-system/survey' },
            { text: '5S+ Quiz', icon: <QuizModeIcon />, path: '/5s-system/quiz' },
        ],
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Layout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin, isGuest, session, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useThemeMode();
    const navGroups = isAdmin ? adminNavGroups : guestNavGroups;

    // CIT-U maroon/gold sidebar palette
    const sidebarBg = darkMode
        ? 'linear-gradient(180deg, #220a0a 0%, #341414 100%)'
        : 'linear-gradient(180deg, #7b1113 0%, #a01518 100%)';
    const sidebarGold = '#e8b84b';
    const sidebarMuted = 'rgba(255,255,255,0.45)';
    const sidebarHover = 'rgba(255,255,255,0.08)';
    const sidebarDivider = 'rgba(255,255,255,0.1)';

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleNav = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: sidebarBg }}>

            {/* Brand header — CIT logo */}
            <Box sx={{ px: 2.5, py: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Box
                        component="img"
                        src="/cit logo 3.png"
                        alt="CIT-U Logo"
                        sx={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.88rem', color: sidebarGold, lineHeight: 1.1 }}>
                            5S+ System
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: sidebarMuted, letterSpacing: '0.5px', lineHeight: 1.3 }}>
                            CIT-U Waste Monitoring
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ borderColor: sidebarDivider }} />

            {/* Back to Home */}
            <Box sx={{ px: 2, pt: 2 }}>
                <ListItemButton
                    onClick={() => handleNav('/')}
                    sx={{
                        borderRadius: '12px', mb: 1,
                        color: sidebarMuted,
                        gap: 1.5, py: 1,
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&:hover': {
                            bgcolor: sidebarHover,
                            color: '#fce4ec',
                            transform: 'translateX(6px)',
                            '& svg': { transform: 'scale(1.2) rotate(-8deg)', transition: 'all 0.3s ease' },
                        },
                        '& svg': { transition: 'all 0.3s ease' },
                    }}
                >
                    <BackIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Back to Home</Typography>
                </ListItemButton>
            </Box>

            <Divider sx={{ borderColor: sidebarDivider, mx: 2 }} />

            {/* Nav groups */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
                {navGroups.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                        <Box key={group.label} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, mb: 1 }}>
                                <GroupIcon sx={{ fontSize: 14, color: group.color }} />
                                <Typography sx={{
                                    fontSize: '0.68rem', fontWeight: 800, color: group.color,
                                    letterSpacing: '1.5px', textTransform: 'uppercase'
                                }}>
                                    {group.label}
                                </Typography>
                            </Box>
                            <List disablePadding>
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemButton
                                                selected={isActive}
                                                onClick={() => handleNav(item.path)}
                                                sx={{
                                                    borderRadius: '12px',
                                                    py: 1,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    // Smooth spring-like pop on hover
                                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                    // Shimmer pseudo-element
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute', inset: 0,
                                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                                                        transform: 'translateX(-100%)',
                                                        transition: 'transform 0.5s ease',
                                                    },
                                                    '&:hover::after': {
                                                        transform: 'translateX(100%)',
                                                    },
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(232,184,75,0.15)',
                                                        boxShadow: '0 0 0 1px rgba(232,184,75,0.2) inset',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(232,184,75,0.22)',
                                                            transform: 'translateX(5px) scale(1.02)',
                                                        },
                                                        '& .MuiListItemIcon-root': { color: sidebarGold },
                                                        '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 700 },
                                                    },
                                                    '&:not(.Mui-selected)': {
                                                        '& .MuiListItemIcon-root': {
                                                            color: 'rgba(255,255,255,0.35)',
                                                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                        },
                                                        '& .MuiListItemText-primary': {
                                                            color: 'rgba(255,255,255,0.6)',
                                                            transition: 'all 0.25s ease',
                                                        },
                                                        '&:hover': {
                                                            bgcolor: sidebarHover,
                                                            transform: 'translateX(6px)',
                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                                            '& .MuiListItemIcon-root': {
                                                                color: sidebarGold,
                                                                transform: 'scale(1.25) rotate(-5deg)',
                                                            },
                                                            '& .MuiListItemText-primary': {
                                                                color: 'white',
                                                                transform: 'translateX(2px)',
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                {isActive && (
                                                    <Box sx={{
                                                        position: 'absolute', left: 0,
                                                        width: 3, height: '60%', borderRadius: '0 4px 4px 0',
                                                        bgcolor: sidebarGold,
                                                    }} />
                                                )}
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                    );
                })}
            </Box>

            <Divider sx={{ borderColor: sidebarDivider }} />

            {/* Mascot footer + dark mode toggle */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    component="img" src="/new mascot.png" alt="Eco"
                    sx={{
                        width: 64, height: 64, objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
                        animation: 'mascotBob 3s ease-in-out infinite',
                        '@keyframes mascotBob': {
                            '0%,100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-4px)' },
                        },
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: sidebarGold }}>Eco</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: sidebarMuted }}>Your Sustainability Guide</Typography>
                </Box>

                {/* Dark / Light toggle */}
                <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="top">
                    <IconButton
                        onClick={toggleDarkMode}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.08)',
                            border: `1px solid rgba(232,184,75,0.3)`,
                            color: darkMode ? '#e8b84b' : '#ffeb3b',
                            '&:hover': { bgcolor: 'rgba(232,184,75,0.15)' },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>

                {/* Logout */}
                <Tooltip title="Logout" placement="top">
                    <IconButton
                        onClick={() => { logout(); navigate('/login'); }}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,100,100,0.25)',
                            color: 'rgba(255,150,150,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,100,100,0.12)', color: '#ff8a80' },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Mobile hamburger */}
            {isMobile && (
                <Box sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1300 }}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            background: 'linear-gradient(135deg, #5a0d0f 0%, #7b1113 100%)',
                            color: '#e8b84b',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                            '&:hover': { background: 'linear-gradient(135deg, #7b1113 0%, #a01518 100%)' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
                            boxSizing: 'border-box', width: drawerWidth,
                            borderRight: 'none',
                            boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1, p: 0,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
