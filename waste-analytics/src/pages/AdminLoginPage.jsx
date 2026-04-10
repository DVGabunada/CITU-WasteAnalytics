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

// ─── Permanently dark palette ─────────────────────────────────────────────────
const DARK = {
    bg:         'linear-gradient(160deg, #0a0a14 0%, #11112a 60%, #0a0a14 100%)',
    cardBg:     'rgba(255,255,255,0.05)',
    cardBorder: '1px solid rgba(255,255,255,0.1)',
    text:       'white',
    muted:      'rgba(255,255,255,0.5)',
    divider:    'rgba(255,255,255,0.08)',
    accent:     '#5b8dee',
    accentDark: '#3a6bd4',
    inputSx: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2, color: 'white',
            backgroundColor: 'rgba(255,255,255,0.06)',
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#5b8dee' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5b8dee' },
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
    },
};

// ─── AdminLoginPage ───────────────────────────────────────────────────────────
const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { adminLogin, adminSignup } = useAuth();

    const [tab, setTab]       = useState(0); // 0 = Login, 1 = Sign Up
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
        // adminSignupAsAdmin always sets admin: true
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
            {/* Decorative orbs */}
            <Box sx={{
                position: 'absolute', top: '8%', right: '12%',
                width: 380, height: 380,
                background: 'radial-gradient(circle, rgba(91,141,238,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute', bottom: '10%', left: '6%',
                width: 300, height: 300,
                background: 'radial-gradient(circle, rgba(91,141,238,0.08) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            {/* Logo + Title */}
            <Box sx={{ textAlign: 'center', mb: 3, zIndex: 1 }}>
                <Box sx={{
                    width: 68, height: 68, borderRadius: '20px', mx: 'auto', mb: 1.5,
                    background: 'linear-gradient(135deg, #3a6bd4 0%, #5b8dee 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(91,141,238,0.35)',
                }}>
                    <ShieldIcon sx={{ color: 'white', fontSize: 36 }} />
                </Box>
                <Typography sx={{
                    fontWeight: 900, fontSize: '1.7rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #a0bfff 50%, #5b8dee 100%)',
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
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                zIndex: 1,
            }}>
                {/* Top accent bar */}
                <Box sx={{ height: 4, background: 'linear-gradient(90deg, #3a6bd4 0%, #5b8dee 50%, #a0bfff 100%)' }} />

                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    {/* Restricted notice */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5,
                        p: 1.4, borderRadius: '12px',
                        background: 'rgba(91,141,238,0.08)',
                        border: '1px solid rgba(91,141,238,0.2)',
                    }}>
                        <AdminIcon sx={{ color: '#5b8dee', fontSize: 20, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                            <strong style={{ color: '#5b8dee' }}>Restricted access.</strong> This portal is for authorized administrators only.
                        </Typography>
                    </Box>

                    {/* Login / Sign Up tabs */}
                    <Tabs
                        value={tab}
                        onChange={(_, v) => { setTab(v); setError(''); }}
                        sx={{
                            mb: 2.5,
                            '& .MuiTabs-indicator': { bgcolor: '#5b8dee' },
                            '& .MuiTab-root': { color: DARK.muted, fontWeight: 600, textTransform: 'none' },
                            '& .Mui-selected': { color: '#5b8dee !important' },
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
                            New accounts are automatically granted <strong style={{ color: '#5b8dee' }}>admin privileges</strong>. Only share this URL with authorized staff.
                        </Typography>
                    )}

                    <Button
                        fullWidth variant="contained" size="large"
                        disabled={loading}
                        onClick={tab === 0 ? handleLogin : handleSignup}
                        sx={{
                            background: 'linear-gradient(135deg, #3a6bd4 0%, #5b8dee 100%)',
                            color: 'white', fontWeight: 800, fontSize: '1rem',
                            borderRadius: '14px', py: 1.4,
                            boxShadow: '0 8px 24px rgba(91,141,238,0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2e5ab8 0%, #4a7de0 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(91,141,238,0.45)',
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
