import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, TextField, Tab, Tabs,
    Paper, InputAdornment, IconButton, Alert,
} from '@mui/material';
import {
    Visibility, VisibilityOff,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    Lock as LockIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// ─── Permanently dark maroon palette ─────────────────────────────────────────
const DARK = {
    bg:         'linear-gradient(160deg, #0d0204 0%, #1a0406 40%, #2b0608 70%, #0d0204 100%)',
    cardBg:     'rgba(255,255,255,0.04)',
    cardBorder: '1px solid rgba(232,184,75,0.15)',
    text:       'white',
    muted:      'rgba(255,255,255,0.5)',
    divider:    'rgba(255,255,255,0.08)',
    accent:     '#e8b84b',       // gold
    accentDark: '#a01518',       // maroon
    inputSx: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2, color: 'white',
            backgroundColor: 'rgba(255,255,255,0.05)',
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#e8b84b' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
    },
};

// ─── AdminLoginPage ───────────────────────────────────────────────────────────
const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { adminLogin, adminSignup } = useAuth();

    const [tab, setTab]           = useState(0); // 0 = Login, 1 = Sign Up
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw]     = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!username.trim() || !password) { setError('Please fill in both fields.'); return; }
        setLoading(true);
        const result = await adminLogin(username.trim(), password);
        setLoading(false);
        if (!result.ok) { setError(result.error); return; }
        navigate('/5s-system/dashboard');
    };

    const handleSignup = async () => {
        setError('');
        if (!username.trim() || !password) { setError('Please fill in both fields.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        const result = await adminSignup(username.trim(), password, true);
        setLoading(false);
        if (!result.ok) { setError(result.error); return; }
        navigate('/5s-system/dashboard');
    };

    return (
        <Box sx={{
            width: '100vw', height: '100vh',
            overflow: 'hidden',
            background: DARK.bg,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative',
        }}>
            {/* Decorative orbs — maroon glow */}
            <Box sx={{
                position: 'absolute', top: '8%', right: '12%',
                width: 420, height: 420,
                background: 'radial-gradient(circle, rgba(160,21,24,0.22) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute', bottom: '10%', left: '6%',
                width: 320, height: 320,
                background: 'radial-gradient(circle, rgba(123,17,19,0.16) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Gold accent orb */}
            <Box sx={{
                position: 'absolute', top: '20%', left: '8%',
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            {/* Logo + Title */}
            <Box sx={{ textAlign: 'center', mb: 3, zIndex: 1 }}>
                <Box sx={{
                    width: 68, height: 68, borderRadius: '20px', mx: 'auto', mb: 1.5,
                    background: 'linear-gradient(135deg, #7b1113 0%, #a01518 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(160,21,24,0.5)',
                }}>
                    <ShieldIcon sx={{ color: '#e8b84b', fontSize: 36 }} />
                </Box>
                <Typography sx={{
                    fontWeight: 900, fontSize: '1.7rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5d080 50%, #e8b84b 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    Admin Portal
                </Typography>
                <Typography sx={{ color: DARK.muted, fontSize: '0.88rem', mt: 0.4 }}>
                    CIT-U 5S+ Waste Monitoring System
                </Typography>
            </Box>

            {/* Main Card */}
            <Paper elevation={0} sx={{
                width: '100%', maxWidth: 440,
                background: DARK.cardBg,
                border: DARK.cardBorder,
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,184,75,0.08)',
                overflow: 'hidden',
                zIndex: 1,
            }}>
                {/* Top accent bar — maroon → gold */}
                <Box sx={{ height: 4, background: 'linear-gradient(90deg, #7b1113 0%, #a01518 50%, #e8b84b 100%)' }} />

                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    {/* Restricted notice */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5,
                        p: 1.4, borderRadius: '12px',
                        background: 'rgba(160,21,24,0.12)',
                        border: '1px solid rgba(232,184,75,0.18)',
                    }}>
                        <AdminIcon sx={{ color: '#e8b84b', fontSize: 20, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                            <strong style={{ color: '#e8b84b' }}>Restricted access.</strong> This portal is for authorized administrators only.
                        </Typography>
                    </Box>

                    {/* Login / Sign Up tabs */}
                    <Tabs
                        value={tab}
                        onChange={(_, v) => { setTab(v); setError(''); }}
                        sx={{
                            mb: 2.5,
                            '& .MuiTabs-indicator': { bgcolor: '#e8b84b' },
                            '& .MuiTab-root': { color: DARK.muted, fontWeight: 600, textTransform: 'none' },
                            '& .Mui-selected': { color: '#e8b84b !important' },
                        }}
                    >
                        <Tab label="Login" />
                        <Tab label="Register Account" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.82rem' }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={e => { setUsername(e.target.value); setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && (tab === 0 ? handleLogin() : handleSignup())}
                        sx={{ ...DARK.inputSx, mb: 1.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><PersonIcon /></InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && (tab === 0 ? handleLogin() : handleSignup())}
                        sx={{ ...DARK.inputSx, mb: tab === 1 ? 1 : 2.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><LockIcon /></InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPw(p => !p)}
                                        edge="end" size="small"
                                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        {showPw ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {tab === 1 && (
                        <Typography sx={{ fontSize: '0.74rem', color: DARK.muted, mb: 2, lineHeight: 1.5 }}>
                            New accounts are automatically granted <strong style={{ color: '#e8b84b' }}>admin privileges</strong>. Only share this URL with authorized staff.
                        </Typography>
                    )}

                    <Button
                        fullWidth variant="contained" size="large"
                        disabled={loading}
                        onClick={tab === 0 ? handleLogin : handleSignup}
                        sx={{
                            background: 'linear-gradient(135deg, #7b1113 0%, #a01518 100%)',
                            color: '#e8b84b', fontWeight: 800, fontSize: '1rem',
                            borderRadius: '14px', py: 1.4,
                            boxShadow: '0 8px 24px rgba(123,17,19,0.45)',
                            border: '1px solid rgba(232,184,75,0.2)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #a01518 0%, #c62828 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(123,17,19,0.55)',
                            },
                            transition: 'all 0.3s ease', textTransform: 'none',
                        }}
                    >
                        {loading ? 'Please wait…' : tab === 0 ? 'Sign In as Admin 🔐' : 'Create Admin Account 🛡️'}
                    </Button>

                    <Typography sx={{ textAlign: 'center', fontSize: '0.73rem', color: DARK.muted, mt: 2.5 }}>
                        CIT-U 5S+ Waste Monitoring System · Environmental Management Office
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminLoginPage;
