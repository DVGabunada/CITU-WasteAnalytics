import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, TextField,
    Paper, InputAdornment, Alert,
} from '@mui/material';
import {
    Person as PersonIcon,
    School as SchoolIcon,
    Badge as BadgeIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// ─── Permanently dark — no dependency on the global theme toggle ──────────────
const DARK = {
    bg:         'linear-gradient(160deg, #1a0808 0%, #2d1010 60%, #1a0808 100%)',
    cardBg:     'rgba(255,255,255,0.05)',
    cardBorder: '1px solid rgba(255,255,255,0.1)',
    text:       'white',
    muted:      'rgba(255,255,255,0.5)',
    divider:    'rgba(255,255,255,0.08)',
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

// ─── Student ID auto-formatter (XX-XXXX-XXX) ──────────────────────────────────
const formatStudentId = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 2)  return digits;
    if (digits.length <= 6)  return `${digits.slice(0,2)}-${digits.slice(2)}`;
    return `${digits.slice(0,2)}-${digits.slice(2,6)}-${digits.slice(6)}`;
};

// ─── LoginPage ────────────────────────────────────────────────────────────────
const LoginPage = () => {
    const navigate = useNavigate();
    const { loginAsGuest } = useAuth();

    const [studentEmail, setStudentEmail] = useState('');
    const [studentId, setStudentId]       = useState('');
    const [studentError, setStudentError] = useState('');

    const handleStudentLogin = () => {
        setStudentError('');
        if (!studentEmail.trim()) {
            setStudentError('Please enter your institutional email.'); return;
        }
        if (!studentEmail.trim().toLowerCase().endsWith('@cit.edu')) {
            setStudentError('Email must be a CIT-U institutional email (@cit.edu).'); return;
        }
        if (!/^\d{2}-\d{4}-\d{3}$/.test(studentId)) {
            setStudentError('Student ID must follow the format XX-XXXX-XXX (e.g. 22-1234-567).'); return;
        }
        loginAsGuest(studentEmail.trim(), studentId);
        navigate('/5s-system/awareness');
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
                    {/* Header with icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                            background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(232,184,75,0.35)',
                        }}>
                            <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: DARK.text, lineHeight: 1.2 }}>
                                Student Access
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: DARK.muted }}>
                                Awareness, Survey &amp; Quiz
                            </Typography>
                        </Box>
                    </Box>

                    {studentError && (
                        <Alert severity="error" sx={{ mb: 1.5, borderRadius: '12px', fontSize: '0.82rem' }}>
                            {studentError}
                        </Alert>
                    )}

                    {/* Institutional email */}
                    <TextField
                        fullWidth
                        label="Institutional Email"
                        type="email"
                        placeholder="e.g. juan.delacruz@cit.edu"
                        value={studentEmail}
                        onChange={e => { setStudentEmail(e.target.value); setStudentError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
                        sx={{ ...DARK.inputSx, mb: 1.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><PersonIcon /></InputAdornment>
                            ),
                        }}
                    />

                    {/* Student ID */}
                    <TextField
                        fullWidth
                        label="Student ID"
                        placeholder="XX-XXXX-XXX"
                        value={studentId}
                        onChange={e => { setStudentId(formatStudentId(e.target.value)); setStudentError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
                        inputProps={{ maxLength: 11 }}
                        sx={{ ...DARK.inputSx, mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><BadgeIcon /></InputAdornment>
                            ),
                        }}
                        helperText={
                            <Typography component="span" sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                                Format: XX-XXXX-XXX (e.g. 22-1234-567)
                            </Typography>
                        }
                    />

                    <Button
                        fullWidth variant="contained" size="large"
                        onClick={handleStudentLogin}
                        sx={{
                            background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                            color: '#3e0a0b', fontWeight: 800, fontSize: '1rem',
                            borderRadius: '14px', py: 1.4,
                            boxShadow: '0 8px 24px rgba(232,184,75,0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #c9a84c 0%, #a88a3a 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(232,184,75,0.45)',
                            },
                            transition: 'all 0.3s ease', textTransform: 'none', mt: 0.5,
                        }}
                    >
                        Continue 🎓
                    </Button>

                    <Typography sx={{ textAlign: 'center', fontSize: '0.76rem', color: DARK.muted, mt: 2.5 }}>
                        CIT-U 5S+ Waste Monitoring System · Environmental Management Office
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
