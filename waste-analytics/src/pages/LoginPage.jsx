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

// ─── Permanently dark — no dependency on the global theme toggle ──────────────

const DARK = {
    bg:          'linear-gradient(160deg, #1a0808 0%, #2d1010 60%, #1a0808 100%)',
    cardBg:      'rgba(255,255,255,0.05)',
    cardBorder:  '1px solid rgba(255,255,255,0.1)',
    text:        'white',
    muted:       'rgba(255,255,255,0.5)',
    divider:     'rgba(255,255,255,0.08)',
    inputSx: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2, color: 'white',
            backgroundColor: 'rgba(255,255,255,0.06)',
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#e8b84b' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
    },
};

// ─── LoginPage ────────────────────────────────────────────────────────────────
const LoginPage = () => {
    const navigate = useNavigate();
    const { loginAsGuest, adminLogin, adminSignup } = useAuth();

    const [tab, setTab]           = useState(0);
    const [guestName, setGuestName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw]     = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleGuestLogin = () => {
        setError('');
        loginAsGuest(guestName.trim() || 'Student');
        navigate('/5s-system/awareness');
    };

    const handleAdminLogin = () => {
        setError('');
        if (!username.trim() || !password) { setError('Please fill in both fields.'); return; }
        setLoading(true);
        const result = adminLogin(username.trim(), password);
        setLoading(false);
        if (!result.ok) { setError(result.error); return; }
        navigate('/5s-system/dashboard');
    };

    const handleAdminSignup = () => {
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
            width: '100vw', height: '100vh',   // exactly one viewport — no scroll
            overflow: 'hidden',
            background: DARK.bg,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative',
        }}>
            {/* Decorative orbs */}
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

            {/* Back button */}
            <Button
                startIcon={<BackIcon />}
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute', top: 24, left: 24,
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600, textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' },
                }}
            >
                Back to Home
            </Button>

            {/* Logo + Title */}
            <Box sx={{ textAlign: 'center', mb: 3, zIndex: 1 }}>
                <Box
                    component="img" src="/cit logo 3.png" alt="CIT-U"
                    sx={{ width: 68, height: 68, objectFit: 'contain', mb: 1.5, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                />
                <Typography sx={{
                    fontWeight: 900, fontSize: '1.7rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5d78a 50%, #e8b84b 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    5S+ Waste Monitoring
                </Typography>
                <Typography sx={{ color: DARK.muted, fontSize: '0.88rem', mt: 0.4 }}>
                    Cebu Institute of Technology – University
                </Typography>
            </Box>

            {/* Main Card */}
            <Paper elevation={0} sx={{
                width: '100%', maxWidth: 460,
                background: DARK.cardBg,
                border: DARK.cardBorder,
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                zIndex: 1,
            }}>
                <Box sx={{ height: 4, background: 'linear-gradient(90deg, #7b1113 0%, #e8b84b 100%)' }} />

                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: DARK.text, mb: 0.4 }}>
                        Welcome! 👋
                    </Typography>
                    <Typography sx={{ color: DARK.muted, fontSize: '0.88rem', mb: 2.5 }}>
                        Choose how you'd like to access the system.
                    </Typography>

                    {/* Guest card */}
                    <Paper onClick={() => { setTab(0); setError(''); }} sx={{
                        p: 2, mb: 1.5, borderRadius: '16px', cursor: 'pointer',
                        background: tab === 0 ? 'rgba(232,184,75,0.1)' : 'rgba(255,255,255,0.04)',
                        border: tab === 0 ? '2px solid #e8b84b' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#e8b84b' },
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <SchoolIcon sx={{ color: 'white', fontSize: 21 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: DARK.text }}>Continue as Guest</Typography>
                                <Typography sx={{ fontSize: '0.76rem', color: DARK.muted }}>Students — Awareness, Survey & Quiz</Typography>
                            </Box>
                            <Chip label="Student" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(232,184,75,0.15)', color: '#c9a84c', fontWeight: 700, fontSize: '0.7rem' }} />
                        </Box>
                    </Paper>

                    {/* Admin card */}
                    <Paper onClick={() => { setTab(1); setError(''); }} sx={{
                        p: 2, mb: 2.5, borderRadius: '16px', cursor: 'pointer',
                        background: (tab === 1 || tab === 2) ? 'rgba(123,17,19,0.15)' : 'rgba(255,255,255,0.04)',
                        border: (tab === 1 || tab === 2) ? '2px solid #7b1113' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#7b1113' },
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <AdminIcon sx={{ color: 'white', fontSize: 21 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: DARK.text }}>Admin Access</Typography>
                                <Typography sx={{ fontSize: '0.76rem', color: DARK.muted }}>Office Staff — Full system access</Typography>
                            </Box>
                            <Chip label="Admin" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(123,17,19,0.12)', color: '#f5a0a0', fontWeight: 700, fontSize: '0.7rem' }} />
                        </Box>
                    </Paper>

                    {/* Guest form */}
                    {tab === 0 && (
                        <Box>
                            <TextField
                                fullWidth label="Your Name (Optional)"
                                value={guestName} onChange={e => setGuestName(e.target.value)}
                                placeholder="e.g. Juan Dela Cruz"
                                sx={{ ...DARK.inputSx, mb: 2 }}
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                                onKeyDown={e => e.key === 'Enter' && handleGuestLogin()}
                            />
                            <Button fullWidth variant="contained" size="large" onClick={handleGuestLogin} sx={{
                                background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                                color: '#3e0a0b', fontWeight: 800, fontSize: '1rem',
                                borderRadius: '14px', py: 1.4,
                                boxShadow: '0 8px 24px rgba(232,184,75,0.35)',
                                '&:hover': { background: 'linear-gradient(135deg, #c9a84c 0%, #a88a3a 100%)', transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(232,184,75,0.45)' },
                                transition: 'all 0.3s ease', textTransform: 'none',
                            }}>
                                Enter as Guest 🎓
                            </Button>
                        </Box>
                    )}

                    {/* Admin forms */}
                    {(tab === 1 || tab === 2) && (
                        <Box>
                            <Tabs
                                value={tab === 1 ? 0 : 1}
                                onChange={(_, v) => { setTab(v === 0 ? 1 : 2); setError(''); }}
                                sx={{
                                    mb: 2,
                                    '& .MuiTabs-indicator': { bgcolor: '#7b1113' },
                                    '& .MuiTab-root': { color: DARK.muted, fontWeight: 600, textTransform: 'none' },
                                    '& .Mui-selected': { color: '#e8b84b !important' },
                                }}
                            >
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>

                            {error && <Alert severity="error" sx={{ mb: 1.5, borderRadius: '12px' }}>{error}</Alert>}

                            <TextField
                                fullWidth label="Username" value={username}
                                onChange={e => { setUsername(e.target.value); setError(''); }}
                                sx={{ ...DARK.inputSx, mb: 1.5 }}
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                            />
                            <TextField
                                fullWidth label="Password" type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                sx={{ ...DARK.inputSx, mb: 2 }}
                                onKeyDown={e => e.key === 'Enter' && (tab === 1 ? handleAdminLogin() : handleAdminSignup())}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPw(p => !p)} edge="end" size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
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
                                    color: 'white', fontWeight: 800, fontSize: '1rem',
                                    borderRadius: '14px', py: 1.4,
                                    boxShadow: '0 8px 24px rgba(123,17,19,0.35)',
                                    '&:hover': { background: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)', transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(123,17,19,0.45)' },
                                    transition: 'all 0.3s ease', textTransform: 'none',
                                }}
                            >
                                {tab === 1 ? 'Login as Admin' : 'Create Account'}
                            </Button>

                            {tab === 2 && (
                                <Typography sx={{ fontSize: '0.74rem', color: DARK.muted, mt: 1.2, textAlign: 'center' }}>
                                    Your credentials will be stored securely on this device.
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Divider sx={{ my: 2.5, borderColor: DARK.divider }} />
                    <Typography sx={{ textAlign: 'center', fontSize: '0.76rem', color: DARK.muted }}>
                        CIT-U 5S+ Waste Monitoring System · Environmental Management Office
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
