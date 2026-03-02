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
    Spa as EcoIcon,
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
        color: '#43a047',
        items: [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/5s-system/dashboard' },
        ],
    },
    {
        label: 'Admin',
        icon: AdminIcon,
        color: '#0288d1',
        items: [
            { text: 'Data Entry', icon: <InputIcon />, path: '/5s-system/data-entry' },
            { text: 'Data Logs', icon: <TableRowsIcon />, path: '/5s-system/data-logs' },
        ],
    },
    {
        label: 'Engage',
        icon: EngageIcon,
        color: '#7b1fa2',
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

    // Sidebar colours switch with darkMode
    const sidebarBg = darkMode ? '#0d1f0f' : '#1a3a22';
    const sidebarTag = darkMode ? '#69f0ae' : '#a5f3c4';
    const sidebarMuted = darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.55)';
    const sidebarHover = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)';
    const sidebarDivider = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)';

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleNav = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: sidebarBg }}>

            {/* Brand header */}
            <Box sx={{ px: 2.5, py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Box
                        component="img"
                        src="/Sprite Mascot.png"
                        alt="Eco"
                        sx={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(67,160,71,0.5))' }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: sidebarTag, lineHeight: 1.2 }}>
                            5S+ System
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: sidebarMuted, letterSpacing: '0.5px' }}>
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
                        '&:hover': { bgcolor: sidebarHover, color: '#a5d6a7' },
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
                                <Typography sx={
                                    {
                                        fontSize: '0.68rem', fontWeight: 800, color: group.color,
                                        letterSpacing: '1.5px', textTransform: 'uppercase'
                                    }
                                }>
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
                                                    '&.Mui-selected': {
                                                        bgcolor: `${group.color}22`,
                                                        '&:hover': { bgcolor: `${group.color}30` },
                                                        '& .MuiListItemIcon-root': { color: group.color },
                                                        '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 700 },
                                                    },
                                                    '&:not(.Mui-selected)': {
                                                        '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,0.35)' },
                                                        '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.6)' },
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255,255,255,0.05)',
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
                                                        bgcolor: group.color,
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
                        width: 44, height: 44, objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 10px rgba(67,160,71,0.4))',
                        animation: 'mascotBob 3s ease-in-out infinite',
                        '@keyframes mascotBob': {
                            '0%,100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-4px)' },
                        },
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5d6a7' }}>Eco</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: sidebarMuted }}>Your Sustainability Guide</Typography>
                </Box>

                {/* Dark / Light toggle */}
                <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="top">
                    <IconButton
                        onClick={toggleDarkMode}
                        size="small"
                        sx={{
                            bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
                            border: `1px solid ${darkMode ? 'rgba(105,240,174,0.3)' : 'rgba(255,255,255,0.3)'}`,
                            color: darkMode ? '#69f0ae' : '#ffeb3b',
                            '&:hover': { bgcolor: darkMode ? 'rgba(105,240,174,0.15)' : 'rgba(255,255,255,0.25)' },
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
                <Box sx={{
                    position: 'fixed', top: 12, left: 12, zIndex: 1300,
                }}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                            bgcolor: '#0d1f0f', color: '#69f0ae',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                            '&:hover': { bgcolor: '#1b3a1d' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
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
                            boxShadow: '4px 0 32px rgba(0,0,0,0.2)',
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
