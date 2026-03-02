import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
} from '@mui/material';
import {
    Checklist as SortIcon,
    GridView as SetIcon,
    Star as ShineIcon,
    Assignment as StandardizeIcon,
    Autorenew as SustainIcon,
    AddCircleOutline as PlusIcon,
    BarChart as DashboardIcon,
    QuestionAnswer as SurveyIcon,
    MenuBook as AwarenessIcon,
    ArrowForward as ArrowIcon,
    School as SchoolIcon,
    Spa as EcoIcon,
} from '@mui/icons-material';

// ─── 5S+ Pillar Data ─────────────────────────────────────────────────────────

const pillars = [
    {
        label: 'SORT',
        tagline: 'Seiri',
        icon: SortIcon,
        description: 'Remove unnecessary items from the workspace. Keep only what is needed for daily operations.',
        color: '#e53935',
        bg: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)',
        border: '#ef9a9a',
    },
    {
        label: 'SET IN ORDER',
        tagline: 'Seiton',
        icon: SetIcon,
        description: 'Organize materials so everything has a designated place and can be found quickly.',
        color: '#1565c0',
        bg: 'linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)',
        border: '#90caf9',
    },
    {
        label: 'SHINE',
        tagline: 'Seiso',
        icon: ShineIcon,
        description: 'Clean and maintain the workplace. Inspect equipment and eliminate sources of contamination.',
        color: '#f57f17',
        bg: 'linear-gradient(135deg, #fff9c4 0%, #fff176 100%)',
        border: '#fff176',
    },
    {
        label: 'STANDARDIZE',
        tagline: 'Seiketsu',
        icon: StandardizeIcon,
        description: 'Establish uniform procedures and schedules to maintain the first three S principles.',
        color: '#6a1b9a',
        bg: 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)',
        border: '#ce93d8',
    },
    {
        label: 'SUSTAIN',
        tagline: 'Shitsuke',
        icon: SustainIcon,
        description: 'Continuously monitor, train, and enforce discipline to maintain 5S standards long-term.',
        color: '#2e7d32',
        bg: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
        border: '#a5d6a7',
    },
    {
        label: 'PLUS (+)',
        tagline: 'Safety & Eco',
        icon: PlusIcon,
        description: 'Safety, environmental management, and waste reduction — extending 5S beyond cleanliness.',
        color: '#00695c',
        bg: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)',
        border: '#80cbc4',
    },
];

// ─── Module Cards ─────────────────────────────────────────────────────────────

const modules = [
    {
        title: 'Waste Monitoring Dashboard',
        description: 'View real-time waste analytics, KPIs, trends by category, and office-level reporting.',
        icon: DashboardIcon,
        path: '/5s-system/dashboard',
        gradient: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
        emoji: '📊',
    },
    {
        title: 'Awareness & Education',
        description: 'Learn proper waste segregation, explore the 5S+ framework, and discover trivia about sustainability.',
        icon: AwarenessIcon,
        path: '/5s-system/awareness',
        gradient: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
        emoji: '📚',
    },
    {
        title: 'Waste Reduction Survey',
        description: 'Share your feedback, report challenges, and help shape a better waste management system at CIT-U.',
        icon: SurveyIcon,
        path: '/5s-system/survey',
        gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
        emoji: '📝',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LandingPage = () => {
    const navigate = useNavigate();
    const [mascotMsg, setMascotMsg] = useState(0);

    const mascotMessages = [
        "Welcome to CIT-U's 5S+ Waste Monitoring System! 🌱",
        "Together we can make CIT-U cleaner and greener! ♻️",
        "Proper segregation starts with YOU. Let's learn together!",
        "Did you know? Recycling one bottle saves 6 hours of light! 💡",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMascotMsg(m => (m + 1) % mascotMessages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', overflowX: 'hidden', bgcolor: '#0a1628' }}>

            {/* ── HERO SECTION ─────────────────────────────────────────── */}
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(160deg, #0a1628 0%, #0d3b2e 40%, #1b5e20 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    px: { xs: 2, md: 6 },
                    py: 8,
                }}
            >
                {/* Animated background orbs */}
                <Box sx={{
                    position: 'absolute', top: '10%', left: '5%',
                    width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(67,160,71,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'pulse 6s ease-in-out infinite',
                    '@keyframes pulse': { '0%,100%': { transform: 'scale(1)', opacity: 0.5 }, '50%': { transform: 'scale(1.2)', opacity: 1 } },
                }} />
                <Box sx={{
                    position: 'absolute', bottom: '10%', right: '5%',
                    width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(2,136,209,0.1) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'pulse 8s ease-in-out infinite reverse',
                }} />
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 800, height: 800,
                    background: 'radial-gradient(circle, rgba(46,125,50,0.05) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />

                {/* Top badge */}
                <Chip
                    icon={<SchoolIcon sx={{ color: '#a5d6a7 !important' }} />}
                    label="Cebu Institute of Technology – University"
                    sx={{
                        mb: 3, bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#a5d6a7', fontWeight: 600,
                        border: '1px solid rgba(165,214,167,0.3)',
                        fontSize: '0.85rem',
                        backdropFilter: 'blur(10px)',
                    }}
                />

                <Grid container spacing={6} alignItems="center" justifyContent="center" sx={{ maxWidth: 1200, width: '100%', zIndex: 1 }}>

                    {/* LEFT: Text Content */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    color: '#69f0ae',
                                    fontWeight: 700,
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    mb: 2,
                                }}
                            >
                                ⭐ 5S+ Program
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.8rem', md: '4.5rem', lg: '5.5rem' },
                                    lineHeight: 1.05,
                                    color: 'white',
                                    mb: 1,
                                }}
                            >
                                Waste
                                <Box component="span" sx={{
                                    display: 'block',
                                    background: 'linear-gradient(135deg, #69f0ae 0%, #43a047 50%, #a5d6a7 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    Monitoring
                                </Box>
                                <Box component="span" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '2rem', md: '3.5rem' } }}>
                                    & Awareness
                                </Box>
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.65)',
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    mt: 3, mb: 5,
                                    maxWidth: 560,
                                    lineHeight: 1.8,
                                    mx: { xs: 'auto', md: 0 },
                                }}
                            >
                                A sustainability platform for monitoring waste generation, promoting proper segregation, and building environmental awareness across all offices and departments.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowIcon />}
                                    onClick={() => navigate('/5s-system/dashboard')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
                                        color: 'white',
                                        px: 4, py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 32px rgba(67,160,71,0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                                            boxShadow: '0 12px 40px rgba(67,160,71,0.5)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Enter System
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/5s-system/awareness')}
                                    sx={{
                                        borderColor: 'rgba(165,214,167,0.5)',
                                        color: '#a5d6a7',
                                        px: 4, py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            borderColor: '#a5d6a7',
                                            bgcolor: 'rgba(165,214,167,0.08)',
                                        },
                                    }}
                                >
                                    Learn 5S+
                                </Button>
                            </Box>

                            {/* Stats row */}
                            <Box sx={{
                                display: 'flex', gap: 4, mt: 6,
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                flexWrap: 'wrap',
                            }}>
                                {[
                                    { value: '4', label: 'Waste Categories' },
                                    { value: '5S+', label: 'Framework Pillars' },
                                    { value: '100%', label: 'Sustainability Focus' },
                                ].map(stat => (
                                    <Box key={stat.label} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#69f0ae' }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT: Mascot */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            {/* Rotating speech bubble */}
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(165,214,167,0.3)',
                                borderRadius: '20px 20px 4px 20px',
                                p: 2.5, px: 3,
                                maxWidth: 300,
                                textAlign: 'center',
                                animation: 'fadeSlide 0.5s ease',
                                '@keyframes fadeSlide': {
                                    from: { opacity: 0, transform: 'translateY(-8px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}>
                                <Typography sx={{ color: '#e8f5e9', fontWeight: 600, fontSize: '1rem' }}>
                                    {mascotMessages[mascotMsg]}
                                </Typography>
                            </Box>

                            {/* Mascot image */}
                            <Box
                                component="img"
                                src="/Sprite Mascot.png"
                                alt="Eco Mascot"
                                sx={{
                                    width: { xs: 240, md: 340 },
                                    height: { xs: 240, md: 340 },
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 20px 40px rgba(67,160,71,0.4))',
                                    animation: 'heroFloat 4s ease-in-out infinite',
                                    '@keyframes heroFloat': {
                                        '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
                                        '50%': { transform: 'translateY(-16px) rotate(2deg)' },
                                    },
                                }}
                            />

                            {/* Mascot name badge */}
                            <Chip
                                icon={<EcoIcon sx={{ color: '#43a047 !important' }} />}
                                label="Eco — Your Sustainability Guide"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    color: '#a5d6a7', fontWeight: 600,
                                    border: '1px solid rgba(165,214,167,0.25)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Scroll indicator */}
                <Box sx={{
                    position: 'absolute', bottom: 32,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                        '0%,100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(8px)' },
                    },
                }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Scroll to explore
                    </Typography>
                    <Box sx={{ color: 'rgba(165,214,167,0.6)', fontSize: '1.5rem' }}>↓</Box>
                </Box>
            </Box>

            {/* ── 5S+ PILLARS SECTION ─────────────────────────────────── */}
            <Box sx={{
                background: 'linear-gradient(180deg, #0d2818 0%, #0a1f14 100%)',
                py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 },
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip
                            label="Framework"
                            sx={{ bgcolor: 'rgba(67,160,71,0.2)', color: '#69f0ae', fontWeight: 700, mb: 2, letterSpacing: '2px' }}
                        />
                        <Typography variant="h2" sx={{
                            color: 'white', fontWeight: 900,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}>
                            The{' '}
                            <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #69f0ae 0%, #43a047 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                5S+ Framework
                            </Box>
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', mt: 2, fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
                            A proven methodology for workplace organization, cleanliness, and sustainability
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {pillars.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <Grid key={p.label} size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Card
                                        sx={{
                                            background: 'rgba(255,255,255,0.04)',
                                            backdropFilter: 'blur(20px)',
                                            border: `1px solid rgba(255,255,255,0.08)`,
                                            borderRadius: '24px',
                                            p: 1,
                                            height: '100%',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            animation: `cardIn 0.6s ease-out ${i * 0.1}s backwards`,
                                            '@keyframes cardIn': {
                                                from: { opacity: 0, transform: 'translateY(30px)' },
                                                to: { opacity: 1, transform: 'translateY(0)' },
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-12px)',
                                                border: `1px solid ${p.border}40`,
                                                boxShadow: `0 20px 60px ${p.color}25`,
                                                background: 'rgba(255,255,255,0.07)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{
                                                width: 60, height: 60, borderRadius: '18px',
                                                background: p.bg,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mb: 2.5,
                                                boxShadow: `0 8px 24px ${p.color}30`,
                                            }}>
                                                <Icon sx={{ color: p.color, fontSize: 32 }} />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                                <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: 'white', letterSpacing: '1px' }}>
                                                    {p.label}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                                                    {p.tagline}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                                {p.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Box>

            {/* ── MODULES SECTION ─────────────────────────────────────── */}
            <Box sx={{
                background: 'linear-gradient(180deg, #0a1f14 0%, #061410 100%)',
                py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 },
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip
                            label="System Modules"
                            sx={{ bgcolor: 'rgba(2,136,209,0.2)', color: '#81d4fa', fontWeight: 700, mb: 2, letterSpacing: '2px' }}
                        />
                        <Typography variant="h2" sx={{
                            color: 'white', fontWeight: 900,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}>
                            Everything You Need to{' '}
                            <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #81d4fa 0%, #0288d1 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                Act Now
                            </Box>
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', mt: 2, fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
                            Three integrated modules to monitor, educate, and improve waste management at CIT-U
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {modules.map((mod, i) => {
                            const Icon = mod.icon;
                            return (
                                <Grid key={mod.title} size={{ xs: 12, md: 4 }}>
                                    <Card
                                        onClick={() => navigate(mod.path)}
                                        sx={{
                                            background: 'rgba(255,255,255,0.04)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '28px',
                                            cursor: 'pointer',
                                            height: '100%',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            animation: `cardIn 0.6s ease-out ${i * 0.15}s backwards`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-16px) scale(1.02)',
                                                boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute', top: 0, left: 0, right: 0,
                                                height: '5px',
                                                background: mod.gradient,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{
                                                width: 72, height: 72, borderRadius: '22px',
                                                background: mod.gradient,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mb: 3,
                                                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                                                fontSize: '2rem',
                                            }}>
                                                {mod.emoji}
                                            </Box>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: 'white', mb: 1.5 }}>
                                                {mod.title}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.8, mb: 3 }}>
                                                {mod.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#69f0ae', fontWeight: 700, fontSize: '0.9rem' }}>
                                                <Typography sx={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
                                                    Open Module
                                                </Typography>
                                                <ArrowIcon sx={{ fontSize: 18 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Box>

            {/* ── WASTE CATEGORIES QUICK GUIDE ────────────────────────── */}
            <Box sx={{
                background: '#061410',
                py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 },
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', mb: 4 }}>
                        Quick Reference — Waste Segregation Colors
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Biodegradable', color: '#43a047', bg: 'rgba(67,160,71,0.15)', emoji: '🍃' },
                            { label: 'Recyclable', color: '#0288d1', bg: 'rgba(2,136,209,0.15)', emoji: '♻️' },
                            { label: 'Residual', color: '#757575', bg: 'rgba(117,117,117,0.15)', emoji: '🗑️' },
                            { label: 'Hazardous', color: '#f44336', bg: 'rgba(244,67,54,0.15)', emoji: '⚠️' },
                        ].map(cat => (
                            <Box key={cat.label} sx={{
                                bgcolor: cat.bg,
                                border: `1px solid ${cat.color}40`,
                                borderRadius: '16px',
                                px: 3, py: 2,
                                display: 'flex', alignItems: 'center', gap: 1.5,
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}>
                                <Typography sx={{ fontSize: '1.5rem' }}>{cat.emoji}</Typography>
                                <Typography sx={{ color: cat.color, fontWeight: 700, fontSize: '0.95rem' }}>{cat.label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* ── FOOTER ─────────────────────────────────────────────── */}
            <Box sx={{
                background: '#040d09',
                py: 5, px: { xs: 2, md: 6 },
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Box
                            component="img"
                            src="/Sprite Mascot.png"
                            alt="Eco"
                            sx={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(67,160,71,0.3))' }}
                        />
                        <Typography sx={{ color: '#69f0ae', fontWeight: 900, fontSize: '1.2rem' }}>
                            5S+ Waste Monitoring System
                        </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                        Cebu Institute of Technology – University · Environmental Management Office
                    </Typography>
                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
                        Building a cleaner, greener, and more sustainable campus — one step at a time.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LandingPage;
