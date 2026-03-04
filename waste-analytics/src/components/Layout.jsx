import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
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
    ArrowBack as BackIcon,
    AdminPanelSettings as AdminIcon,
    BarChart as MonitorIcon,
    NotificationsActive as EngageIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
} from '@mui/icons-material';

const drawerWidth = 272;

// ─── Nav structure ────────────────────────────────────────────────────────────
const navGroups = [
    {
        label: 'Monitoring',
        icon: MonitorIcon,
        color: '#e8b84b',
        items: [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/5s-system/dashboard' },
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

// ─── Component ────────────────────────────────────────────────────────────────
const Layout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useThemeMode();

    // CIT-U maroon/gold sidebar palette
    const sidebarBg = darkMode
        ? 'linear-gradient(180deg, #1a0808 0%, #2d1010 100%)'
        : 'linear-gradient(180deg, #5a0d0f 0%, #7b1113 100%)';
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
                        '&:hover': { bgcolor: sidebarHover, color: '#fce4ec' },
                        gap: 1.5, py: 1,
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
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(232,184,75,0.15)',
                                                        '&:hover': { bgcolor: 'rgba(232,184,75,0.22)' },
                                                        '& .MuiListItemIcon-root': { color: sidebarGold },
                                                        '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 700 },
                                                    },
                                                    '&:not(.Mui-selected)': {
                                                        '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,0.35)' },
                                                        '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.6)' },
                                                        '&:hover': {
                                                            bgcolor: sidebarHover,
                                                            '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,0.7)' },
                                                            '& .MuiListItemText-primary': { color: 'white' },
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
                    component="img" src="/Sprite Mascot.png" alt="Eco"
                    sx={{
                        width: 40, height: 40, objectFit: 'contain',
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
