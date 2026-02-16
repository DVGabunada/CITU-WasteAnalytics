import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Input as InputIcon,
    Timeline as TimelineIcon,
    BarChart as BarChartIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const Layout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Data Entry', icon: <InputIcon />, path: '/data-entry' },
        // { text: 'Office Comparison', icon: <BarChartIcon />, path: '/office-comparison' },
        // { text: 'Trends', icon: <TimelineIcon />, path: '/trends' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2, gap: 1 }}>
                <DeleteIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    WasteAnalytics
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>A</Avatar>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Admin User</Typography>
                    <Typography variant="caption" color="text.secondary">University Admin</Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.02)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 0, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
