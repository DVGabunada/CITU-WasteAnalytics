import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, TextField, Tab, Tabs,
    Paper, InputAdornment, IconButton, Alert, Divider, Chip,
} from '@mui/material';
import {
    Visibility, VisibilityOff, Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    School as SchoolIcon,
    Lock as LockIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

// ─── LoginPage ─────────────────────────────────────────────────────────────────
const LoginPage = () => {
    const navigate = useNavigate();
    const { loginAsGuest, adminLogin, adminSignup } = useAuth();
    const { darkMode } = useThemeMode();

    // Tabs: 0 = Guest, 1 = Admin Login, 2 = Admin Signup
    const [tab, setTab] = useState(0);
    const [guestName, setGuestName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const bg = darkMode
        ? 'linear-gradient(160deg, #1a0808 0%, #2d1010 60%, #1a0808 100%)'
        : 'linear-gradient(160deg, #fff8f8 0%, #fce4ec 60%, #fff8f8 100%)';

    const cardBg = darkMode ? 'rgba(255,255,255,0.05)' : 'white';
    const cardBorder = darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(123,17,19,0.08)';
    const textColor = darkMode ? 'white' : '#1a0808';
    const mutedColor = darkMode ? 'rgba(255,255,255,0.5)' : '#757575';

    const inputSx = darkMode
        ? {
            '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white', backgroundColor: 'rgba(255,255,255,0.06)' },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#e8b84b' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
        }
        : {
            '& .MuiOutlinedInput-root': { borderRadius: 2, color: '#212121' },
            '& .MuiInputLabel-root': { color: '#616161' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#7b1113' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7b1113' },
        };

    const handleGuestLogin = () => {
        setError('');
        const name = guestName.trim() || 'Student';
        loginAsGuest(name);
        navigate('/5s-system/awareness');
    };

    const handleAdminLogin = async () => {
        setError('');
        if (!username.trim() || !password) { setError('Please fill in both fields.'); return; }
        setLoading(true);
        const result = adminLogin(username.trim(), password);
        setLoading(false);
        if (!result.ok) { setError(result.error); return; }
        navigate('/5s-system/dashboard');
    };

    const handleAdminSignup = async () => {
        setError('');
        if (!username.trim() || !password) { setError('Please fill in both fields.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        const result = adminSignup(username.trim(), password);
        setLoading(false);
        if (!result.ok) { setError(result.error); return; }
        navigate('/5s-system/dashboard');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: bg,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            px: 2, py: 4,
            position: 'relative',
        }}>
            {/* Animated orb bg */}
            <Box sx={{
                position: 'absolute', top: '10%', right: '10%',
                width: 350, height: 350,
                background: 'radial-gradient(circle, rgba(232,184,75,0.1) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute', bottom: '15%', left: '8%',
                width: 280, height: 280,
                background: 'radial-gradient(circle, rgba(123,17,19,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            {/* Back to landing */}
            <Button
                startIcon={<BackIcon />}
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute', top: 24, left: 24,
                    color: darkMode ? 'rgba(255,255,255,0.6)' : '#7b1113',
                    fontWeight: 600, textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(123,17,19,0.06)' },
                }}
            >
                Back to Home
            </Button>

            {/* CIT-U Logo + Header */}
            <Box sx={{ textAlign: 'center', mb: 4, zIndex: 1 }}>
                <Box
                    component="img"
                    src="/cit logo 3.png"
                    alt="CIT-U"
                    sx={{ width: 72, height: 72, objectFit: 'contain', mb: 2, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
                />
                <Typography sx={{
                    fontWeight: 900, fontSize: '1.8rem',
                    background: darkMode
                        ? 'linear-gradient(135deg, #ffffff 0%, #f5d78a 50%, #e8b84b 100%)'
                        : 'linear-gradient(135deg, #5a0d0f 0%, #7b1113 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    5S+ Waste Monitoring
                </Typography>
                <Typography sx={{ color: mutedColor, fontSize: '0.9rem', mt: 0.5 }}>
                    Cebu Institute of Technology – University
                </Typography>
            </Box>

            {/* Main Card */}
            <Paper elevation={0} sx={{
                width: '100%', maxWidth: 460,
                background: cardBg,
                border: cardBorder,
                borderRadius: '24px',
                backdropFilter: darkMode ? 'blur(20px)' : 'none',
                boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(123,17,19,0.12)',
                overflow: 'hidden',
                zIndex: 1,
            }}>
                {/* Top accent bar */}
                <Box sx={{ height: 4, background: 'linear-gradient(90deg, #7b1113 0%, #e8b84b 100%)' }} />

                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: textColor, mb: 0.5 }}>
                        Welcome! 👋
                    </Typography>
                    <Typography sx={{ color: mutedColor, fontSize: '0.9rem', mb: 3 }}>
                        Choose how you'd like to access the system.
                    </Typography>

                    {/* ── GUEST CARD ── */}
                    <Paper
                        onClick={() => { setTab(0); setError(''); }}
                        sx={{
                            p: 2.5, mb: 2, borderRadius: '16px', cursor: 'pointer',
                            background: tab === 0
                                ? darkMode ? 'rgba(232,184,75,0.1)' : '#fff8f8'
                                : darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa',
                            border: tab === 0
                                ? '2px solid #e8b84b'
                                : `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#e8b84b' },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <SchoolIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: textColor }}>
                                    Continue as Guest
                                </Typography>
                                <Typography sx={{ fontSize: '0.78rem', color: mutedColor }}>
                                    Students — Awareness, Survey & Quiz
                                </Typography>
                            </Box>
                            <Chip
                                label="Student"
                                size="small"
                                sx={{ ml: 'auto', bgcolor: 'rgba(232,184,75,0.15)', color: '#c9a84c', fontWeight: 700, fontSize: '0.7rem' }}
                            />
                        </Box>
                    </Paper>

                    {/* ── ADMIN CARD ── */}
                    <Paper
                        onClick={() => { setTab(1); setError(''); }}
                        sx={{
                            p: 2.5, mb: 3, borderRadius: '16px', cursor: 'pointer',
                            background: tab === 1 || tab === 2
                                ? darkMode ? 'rgba(123,17,19,0.15)' : '#fff8f8'
                                : darkMode ? 'rgba(255,255,255,0.04)' : '#fafafa',
                            border: (tab === 1 || tab === 2)
                                ? '2px solid #7b1113'
                                : `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#7b1113' },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <AdminIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: textColor }}>
                                    Admin Access
                                </Typography>
                                <Typography sx={{ fontSize: '0.78rem', color: mutedColor }}>
                                    Office Staff — Full system access
                                </Typography>
                            </Box>
                            <Chip
                                label="Admin"
                                size="small"
                                sx={{ ml: 'auto', bgcolor: 'rgba(123,17,19,0.12)', color: '#a01518', fontWeight: 700, fontSize: '0.7rem' }}
                            />
                        </Box>
                    </Paper>

                    {/* ── GUEST FORM ─────────────────────────────────────── */}
                    {tab === 0 && (
                        <Box>
                            <TextField
                                fullWidth label="Your Name (Optional)"
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                placeholder="e.g. Juan Dela Cruz"
                                sx={{ ...inputSx, mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#bdbdbd' }} />
                                        </InputAdornment>
                                    )
                                }}
                                onKeyDown={e => e.key === 'Enter' && handleGuestLogin()}
                            />
                            <Button
                                fullWidth variant="contained" size="large"
                                onClick={handleGuestLogin}
                                sx={{
                                    background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                                    color: '#3e0a0b', fontWeight: 800, fontSize: '1.05rem',
                                    borderRadius: '14px', py: 1.5,
                                    boxShadow: '0 8px 24px rgba(232,184,75,0.35)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #c9a84c 0%, #a88a3a 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(232,184,75,0.45)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Enter as Guest 🎓
                            </Button>
                        </Box>
                    )}

                    {/* ── ADMIN FORMS ────────────────────────────────────── */}
                    {(tab === 1 || tab === 2) && (
                        <Box>
                            {/* Login / Signup tab switcher */}
                            <Tabs
                                value={tab === 1 ? 0 : 1}
                                onChange={(_, v) => { setTab(v === 0 ? 1 : 2); setError(''); }}
                                sx={{
                                    mb: 2.5,
                                    '& .MuiTabs-indicator': { bgcolor: '#7b1113' },
                                    '& .MuiTab-root': { color: mutedColor, fontWeight: 600, textTransform: 'none' },
                                    '& .Mui-selected': { color: '#7b1113 !important' },
                                }}
                            >
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>
                            )}

                            <TextField
                                fullWidth label="Username" value={username}
                                onChange={e => { setUsername(e.target.value); setError(''); }}
                                sx={{ ...inputSx, mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#bdbdbd' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                fullWidth label="Password" type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                sx={{ ...inputSx, mb: 2.5 }}
                                onKeyDown={e => e.key === 'Enter' && (tab === 1 ? handleAdminLogin() : handleAdminSignup())}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#bdbdbd' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPw(p => !p)} edge="end" size="small"
                                                sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : '#9e9e9e' }}>
                                                {showPw ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth variant="contained" size="large"
                                disabled={loading}
                                onClick={tab === 1 ? handleAdminLogin : handleAdminSignup}
                                sx={{
                                    background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                    color: 'white', fontWeight: 800, fontSize: '1.05rem',
                                    borderRadius: '14px', py: 1.5,
                                    boxShadow: '0 8px 24px rgba(123,17,19,0.35)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(123,17,19,0.45)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {tab === 1 ? 'Login as Admin' : 'Create Account'}
                            </Button>

                            {tab === 2 && (
                                <Typography sx={{ fontSize: '0.75rem', color: mutedColor, mt: 1.5, textAlign: 'center' }}>
                                    Your credentials will be stored securely on this device.
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Divider sx={{ my: 3, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(123,17,19,0.08)' }} />
                    <Typography sx={{ textAlign: 'center', fontSize: '0.78rem', color: mutedColor }}>
                        CIT-U 5S+ Waste Monitoring System · Environmental Management Office
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
