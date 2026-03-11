import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Grid, Card, CardContent, Chip, Divider,
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
    Spa as EcoIcon,
    Login as LoginIcon,
} from '@mui/icons-material';

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, { threshold: 0.12, ...options });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const pillars = [
    {
        label: 'SORT', tagline: 'Seiri', icon: SortIcon, step: '01',
        description: 'Remove unnecessary items from the workspace. Keep only what is needed for daily operations and tag everything else for removal.',
        accent: '#e8b84b', iconBg: 'linear-gradient(135deg, #b71c1c 0%, #7b1113 100%)',
    },
    {
        label: 'SET IN ORDER', tagline: 'Seiton', icon: SetIcon, step: '02',
        description: 'Organize and arrange materials so everything has a designated, clearly labeled place that can be found and returned to quickly.',
        accent: '#f5d78a', iconBg: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)',
    },
    {
        label: 'SHINE', tagline: 'Seiso', icon: ShineIcon, step: '03',
        description: 'Clean and maintain the entire workplace daily. Inspect equipment regularly and eliminate all sources of dirt and contamination.',
        accent: '#e8b84b', iconBg: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
    },
    {
        label: 'STANDARDIZE', tagline: 'Seiketsu', icon: StandardizeIcon, step: '04',
        description: 'Establish uniform procedures, visual cues, and schedules so all team members follow the same consistent 5S practices every day.',
        accent: '#f5d78a', iconBg: 'linear-gradient(135deg, #5a0d0f 0%, #3e0a0b 100%)',
    },
    {
        label: 'SUSTAIN', tagline: 'Shitsuke', icon: SustainIcon, step: '05',
        description: 'Build 5S habits through continuous training, audits, and accountability. Sustain discipline to maintain standards long-term.',
        accent: '#e8b84b', iconBg: 'linear-gradient(135deg, #c9a84c 0%, #e8b84b 100%)',
    },
    {
        label: 'SAFETY + ECO', tagline: 'Plus (+)', icon: PlusIcon, step: '+',
        description: 'Extend 5S with workplace safety protocols and environmental stewardship — reducing waste, carbon footprint, and health risks.',
        accent: '#f5d78a', iconBg: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
    },
];

const modules = [
    {
        title: 'Waste Monitoring Dashboard',
        description: 'Real-time waste analytics, KPIs, trend charts, and office-level reporting in one comprehensive view.',
        path: '/5s-system/dashboard',
        gradient: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)',
        lightGradient: 'rgba(123,17,19,0.08)', border: 'rgba(123,17,19,0.3)',
        emoji: '📊', tag: 'Admin Only',
    },
    {
        title: 'Awareness & Education',
        description: 'Learn proper waste segregation, explore the 5S+ framework, and discover eco-friendly practices and sustainability tips.',
        path: '/5s-system/awareness',
        gradient: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
        lightGradient: 'rgba(160,21,24,0.08)', border: 'rgba(160,21,24,0.3)',
        emoji: '📚', tag: 'All Users',
    },
    {
        title: 'Waste Reduction Survey',
        description: 'Share your feedback, report challenges, and help shape a better waste management system across all CIT-U departments.',
        path: '/5s-system/survey',
        gradient: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
        lightGradient: 'rgba(232,184,75,0.08)', border: 'rgba(232,184,75,0.3)',
        emoji: '📝', tag: 'All Users',
    },
];

const wasteCategories = [
    { label: 'Biodegradable', sub: 'Food scraps, leaves, paper', color: '#43a047', bg: 'rgba(67,160,71,0.12)', border: 'rgba(67,160,71,0.25)', emoji: '🍃' },
    { label: 'Recyclable', sub: 'Plastic, glass, metal', color: '#0288d1', bg: 'rgba(2,136,209,0.12)', border: 'rgba(2,136,209,0.25)', emoji: '♻️' },
    { label: 'Residual', sub: 'Non-recyclable waste', color: '#9e9e9e', bg: 'rgba(158,158,158,0.12)', border: 'rgba(158,158,158,0.25)', emoji: '🗑️' },
    { label: 'Hazardous', sub: 'Chemicals, batteries', color: '#f44336', bg: 'rgba(244,67,54,0.12)', border: 'rgba(244,67,54,0.25)', emoji: '⚠️' },
];

// ─── Animated Wave Background component ──────────────────────────────────────
const WaveBg = ({ opacity = 0.55 }) => (
    <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
    }}>
        {/* Wave 1 — slow, large, deep maroon */}
        <Box component="svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
            sx={{
                position: 'absolute', bottom: 0, left: 0, width: '200%', height: '45%',
                opacity,
                animation: 'wave1 18s linear infinite',
                '@keyframes wave1': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            }}>
            <path d="M0,160 C180,260 360,60 540,160 C720,260 900,60 1080,160 C1260,260 1440,60 1440,160 L1440,320 L0,320 Z"
                fill="rgba(160,21,24,0.65)" />
        </Box>

        {/* Wave 2 — medium speed, gold */}
        <Box component="svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
            sx={{
                position: 'absolute', bottom: 0, left: 0, width: '200%', height: '35%',
                opacity: opacity * 0.85,
                animation: 'wave2 12s linear infinite reverse',
                '@keyframes wave2': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            }}>
            <path d="M0,192 C120,130 240,250 360,192 C480,130 600,250 720,192 C840,130 960,250 1080,192 C1200,130 1320,250 1440,192 L1440,320 L0,320 Z"
                fill="rgba(232,184,75,0.45)" />
        </Box>

        {/* Wave 3 — fastest, dark maroon front */}
        <Box component="svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
            sx={{
                position: 'absolute', bottom: 0, left: 0, width: '200%', height: '22%',
                opacity: opacity * 0.75,
                animation: 'wave3 8s linear infinite',
                '@keyframes wave3': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            }}>
            <path d="M0,224 C90,180 180,270 270,224 C360,178 450,270 540,224 C630,178 720,270 810,224 C900,178 990,270 1080,224 C1170,178 1260,270 1350,224 L1440,224 L1440,320 L0,320 Z"
                fill="rgba(90,13,15,0.75)" />
        </Box>
    </Box>
);

// ─── Section wrapper with scroll-reveal ──────────────────────────────────────
const RevealSection = ({ children, delay = 0, sx = {} }) => {
    const [ref, inView] = useInView();
    return (
        <Box ref={ref} sx={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(48px)',
            transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
            ...sx,
        }}>
            {children}
        </Box>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────

const LandingPage = () => {
    const navigate = useNavigate();
    const [mascotMsg, setMascotMsg] = useState(0);
    const mascotMessages = [
        "Welcome to CIT-U's 5S+ Waste Monitoring System! 🌱",
        "Together we can make CIT-U cleaner and greener! ♻️",
        "Proper segregation starts with YOU. Let's learn!",
        "Did you know? Recycling saves energy and resources! 💡",
    ];
    useEffect(() => {
        const t = setInterval(() => setMascotMsg(m => (m + 1) % mascotMessages.length), 4000);
        return () => clearInterval(t);
    }, []);

    const [pillarsRef, pillarsInView] = useInView();
    const [modulesRef, modulesInView] = useInView();
    const [guideRef, guideInView] = useInView();

    return (
        <Box sx={{ minHeight: '100vh', overflowX: 'hidden', bgcolor: '#0f0505' }}>

            {/* ══════════════ HERO ══════════════ */}
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(150deg, #0f0505 0%, #1e0808 35%, #2d1010 70%, #1e0808 100%)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                px: { xs: 2, md: 6 }, py: 8,
            }}>
                {/* Animated grid mesh */}
                <Box sx={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(232,184,75,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.035) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                {/* Ambient orbs */}
                {[
                    { top: '-8%', left: '-6%', w: 620, h: 620, c: 'rgba(232,184,75,0.07)', delay: '0s' },
                    { top: '40%', right: '-10%', w: 700, h: 700, c: 'rgba(123,17,19,0.16)', delay: '2s' },
                    { bottom: '-12%', left: '32%', w: 520, h: 520, c: 'rgba(232,184,75,0.05)', delay: '4s' },
                ].map((o, i) => (
                    <Box key={i} sx={{
                        position: 'absolute', ...o, borderRadius: '50%', pointerEvents: 'none',
                        background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
                        animation: `orbPulse ${6 + i * 1.5}s ease-in-out infinite`,
                        animationDelay: o.delay,
                        '@keyframes orbPulse': {
                            '0%,100%': { transform: 'scale(1)', opacity: 0.7 },
                            '50%': { transform: 'scale(1.18)', opacity: 1 },
                        },
                    }} />
                ))}

                {/* Animated waves at the bottom of hero */}
                <WaveBg opacity={0.6} />

                {/* CIT-U pill badge */}
                <Box sx={{
                    mb: 5, zIndex: 2,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(232,184,75,0.3)', borderRadius: '50px',
                    px: 3, py: 1.2,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    animation: 'fadeDown 0.8s ease backwards',
                    '@keyframes fadeDown': {
                        from: { opacity: 0, transform: 'translateY(-16px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}>
                    <Box component="img" src="/cit logo 3.png" alt="CIT-U"
                        sx={{ width: 30, height: 30, objectFit: 'contain' }} />
                    <Typography sx={{ color: '#f5d78a', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px' }}>
                        Cebu Institute of Technology – University
                    </Typography>
                </Box>

                <Grid container spacing={6} alignItems="center" justifyContent="center"
                    sx={{ maxWidth: 1280, width: '100%', zIndex: 2 }}>

                    {/* LEFT */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            textAlign: { xs: 'center', md: 'left' }, animation: 'heroLeft 1s ease backwards', animationDelay: '0.2s',
                            '@keyframes heroLeft': { from: { opacity: 0, transform: 'translateX(-40px)' }, to: { opacity: 1, transform: 'translateX(0)' } }
                        }}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3,
                                bgcolor: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.2)',
                                borderRadius: '8px', px: 2, py: 0.7
                            }}>
                                <Box sx={{
                                    width: 8, height: 8, borderRadius: '50%', bgcolor: '#e8b84b',
                                    animation: 'blink 1.5s ease-in-out infinite',
                                    '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } }
                                }} />
                                <Typography sx={{ color: '#e8b84b', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    5S+ Program · Environmental Management
                                </Typography>
                            </Box>

                            <Typography sx={{
                                fontWeight: 900, lineHeight: 1.05, mb: 3,
                                fontSize: { xs: '3rem', sm: '4rem', md: '4.8rem', lg: '5.5rem' }
                            }}>
                                <Box component="span" sx={{ color: 'white', display: 'block' }}>Waste</Box>
                                <Box component="span" sx={{
                                    display: 'block',
                                    background: 'linear-gradient(135deg, #f5d78a 0%, #e8b84b 40%, #c9a84c 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>Monitoring</Box>
                                <Box component="span" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontSize: '70%' }}>
                                    & Awareness
                                </Box>
                            </Typography>

                            <Typography sx={{
                                color: 'rgba(255,255,255,0.6)', fontSize: { xs: '1.05rem', md: '1.2rem' },
                                lineHeight: 1.85, mb: 5, maxWidth: 520, mx: { xs: 'auto', md: 0 }
                            }}>
                                A university-wide sustainability platform for tracking waste generation, promoting proper segregation, and building a culture of environmental responsibility at CIT-U.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 6 }}>
                                <Button variant="contained" size="large" startIcon={<LoginIcon />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                        color: 'white', px: 4.5, py: 1.8,
                                        fontSize: '1.05rem', fontWeight: 800, borderRadius: '14px',
                                        boxShadow: '0 8px 40px rgba(123,17,19,0.5)',
                                        '&:hover': { background: 'linear-gradient(135deg, #c62828 0%, #a01518 100%)', transform: 'translateY(-3px)', boxShadow: '0 16px 48px rgba(123,17,19,0.6)' },
                                        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                                    }}>
                                    Login / Sign Up
                                </Button>
                                <Button variant="outlined" size="large"
                                    onClick={() => navigate('/5s-system/awareness')}
                                    sx={{
                                        borderColor: 'rgba(232,184,75,0.45)', color: '#e8b84b',
                                        px: 4, py: 1.8, fontSize: '1.05rem', fontWeight: 700,
                                        borderRadius: '14px', backdropFilter: 'blur(10px)',
                                        '&:hover': { borderColor: '#e8b84b', bgcolor: 'rgba(232,184,75,0.08)', transform: 'translateY(-2px)' },
                                        transition: 'all 0.3s ease',
                                    }}>
                                    Explore 5S+
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                                {[
                                    { value: '4', label: 'Waste Categories' },
                                    { value: '5S+', label: 'Framework Pillars' },
                                    { value: '100%', label: 'Sustainability Focus' },
                                ].map((s, i) => (
                                    <Box key={i} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{
                                            fontSize: { xs: '2rem', md: '2.4rem' }, fontWeight: 900,
                                            background: 'linear-gradient(135deg, #f5d78a, #e8b84b)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                                        }}>
                                            {s.value}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700,
                                            letterSpacing: '1.5px', textTransform: 'uppercase'
                                        }}>
                                            {s.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5,
                            animation: 'heroRight 1s ease backwards', animationDelay: '0.4s',
                            '@keyframes heroRight': { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'translateX(0)' } }
                        }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(232,184,75,0.3)',
                                borderRadius: '20px 20px 4px 20px',
                                p: 2.5, px: 3.5, maxWidth: 320, textAlign: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                animation: 'bubbleFade 0.5s ease',
                                '@keyframes bubbleFade': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                            }}>
                                <Typography sx={{ color: '#fce4ec', fontWeight: 600, fontSize: '1rem', lineHeight: 1.6 }}>
                                    {mascotMessages[mascotMsg]}
                                </Typography>
                            </Box>

                            <Box component="img" src="/citmascot.png" alt="Eco Mascot" sx={{
                                width: { xs: 280, sm: 360, md: 440 }, height: { xs: 280, sm: 360, md: 440 },
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 24px 48px rgba(123,17,19,0.55))',
                                animation: 'heroFloat 4s ease-in-out infinite',
                                '@keyframes heroFloat': {
                                    '0%,100%': { transform: 'translateY(0) rotate(-1.5deg)' },
                                    '50%': { transform: 'translateY(-18px) rotate(1.5deg)' },
                                },
                            }} />

                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1.2,
                                bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(232,184,75,0.2)', borderRadius: '50px',
                                px: 2.5, py: 1,
                            }}>
                                <EcoIcon sx={{ color: '#e8b84b', fontSize: 18 }} />
                                <Typography sx={{ color: '#f5d78a', fontWeight: 700, fontSize: '0.88rem' }}>
                                    Eco — Your Sustainability Guide
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Scroll cue */}
                <Box sx={{
                    position: 'absolute', bottom: 28, zIndex: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8,
                    animation: 'scrollBounce 2s ease-in-out infinite',
                    '@keyframes scrollBounce': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(8px)' } },
                }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                        Scroll to explore
                    </Typography>
                    <Typography sx={{ color: 'rgba(232,184,75,0.5)', fontSize: '1.3rem' }}>↓</Typography>
                </Box>
            </Box>

            {/* ══════════════ 5S+ PILLARS ══════════════ */}
            <Box sx={{
                background: 'linear-gradient(180deg, #0f0505 0%, #1a0808 50%, #0f0505 100%)',
                py: { xs: 10, md: 16 }, px: { xs: 2, md: 6 },
                borderTop: '1px solid rgba(255,255,255,0.04)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Moving background waves */}
                <WaveBg opacity={0.5} />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{
                        position: 'absolute',
                        width: 4 + (i % 3) * 3,
                        height: 4 + (i % 3) * 3,
                        borderRadius: '50%',
                        bgcolor: i % 2 === 0 ? 'rgba(232,184,75,0.4)' : 'rgba(160,21,24,0.4)',
                        top: `${15 + i * 14}%`,
                        left: `${8 + i * 15}%`,
                        animation: `floatParticle ${5 + i}s ease-in-out infinite`,
                        animationDelay: `${i * 0.7}s`,
                        '@keyframes floatParticle': {
                            '0%,100%': { transform: 'translateY(0) scale(1)', opacity: 0.6 },
                            '50%': { transform: 'translateY(-20px) scale(1.3)', opacity: 1 },
                        },
                    }} />
                ))}

                <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    {/* Section header */}
                    <RevealSection>
                        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
                            <Chip label="The Framework" sx={{
                                bgcolor: 'rgba(232,184,75,0.12)', color: '#e8b84b',
                                fontWeight: 800, mb: 3, px: 2, letterSpacing: '2px',
                                border: '1px solid rgba(232,184,75,0.2)',
                            }} />
                            <Typography sx={{
                                fontWeight: 900, color: 'white', mb: 2,
                                fontSize: { xs: '2.4rem', md: '3.6rem' }, lineHeight: 1.1
                            }}>
                                The{' '}
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #f5d78a 0%, #e8b84b 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>5S+ Framework</Box>
                            </Typography>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.5)', fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 640, mx: 'auto', lineHeight: 1.8
                            }}>
                                A proven Japanese methodology for building cleaner, safer, and more productive workplaces — now extended with Safety and Environmental awareness.
                            </Typography>
                        </Box>
                    </RevealSection>

                    {/* Pillars grid */}
                    <Box ref={pillarsRef}>
                        <Grid container spacing={3}>
                            {pillars.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <Grid key={p.label} size={{ xs: 12, sm: 6, lg: 4 }}>
                                        <Box sx={{
                                            opacity: pillarsInView ? 1 : 0,
                                            transform: pillarsInView ? 'translateY(0)' : 'translateY(56px)',
                                            transition: `opacity 0.7s ease ${0.08 * i}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.08 * i}s`,
                                        }}>
                                            <Card sx={{
                                                height: '100%', borderRadius: '20px',
                                                background: 'rgba(255,255,255,0.03)',
                                                backdropFilter: 'blur(24px)',
                                                border: '1px solid rgba(255,255,255,0.07)',
                                                position: 'relative', overflow: 'hidden',
                                                transition: 'all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    border: '1px solid rgba(232,184,75,0.3)',
                                                    background: 'rgba(255,255,255,0.06)',
                                                    boxShadow: '0 28px 72px rgba(0,0,0,0.45)',
                                                },
                                            }}>
                                                <Box sx={{ height: 3, background: p.iconBg }} />
                                                <CardContent sx={{ p: 4 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                                                        <Box sx={{
                                                            width: 58, height: 58, borderRadius: '16px',
                                                            background: p.iconBg,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                                        }}>
                                                            <Icon sx={{ color: 'white', fontSize: 28 }} />
                                                        </Box>
                                                        <Typography sx={{
                                                            fontSize: '3rem', fontWeight: 900, lineHeight: 1,
                                                            color: 'rgba(255,255,255,0.06)', userSelect: 'none'
                                                        }}>
                                                            {p.step}
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: p.accent, letterSpacing: '1px', mb: 0.5 }}>
                                                        {p.label}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', fontWeight: 600, mb: 2, letterSpacing: '0.5px' }}>
                                                        ({p.tagline})
                                                    </Typography>
                                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.98rem', lineHeight: 1.85 }}>
                                                        {p.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* ══════════════ MODULES ══════════════ */}
            <Box sx={{
                background: 'linear-gradient(180deg, #0f0505 0%, #1a0808 100%)',
                py: { xs: 10, md: 16 }, px: { xs: 2, md: 6 },
                borderTop: '1px solid rgba(255,255,255,0.04)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Waves pointing upward (flipped) */}
                <Box sx={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
                }}>
                    <Box component="svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
                        sx={{
                            position: 'absolute', top: 0, left: 0, width: '200%', height: '35%',
                            opacity: 0.13, transform: 'scaleY(-1)',
                            animation: 'wave1 14s linear infinite reverse',
                            '@keyframes wave1': {
                                '0%': { transform: 'translateX(0) scaleY(-1)' },
                                '100%': { transform: 'translateX(-50%) scaleY(-1)' },
                            },
                        }}>
                        <path d="M0,160 C180,260 360,60 540,160 C720,260 900,60 1080,160 C1260,260 1440,60 1440,160 L1440,320 L0,320 Z"
                            fill="rgba(232,184,75,0.2)" />
                    </Box>
                    <Box component="svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
                        sx={{
                            position: 'absolute', bottom: 0, left: 0, width: '200%', height: '30%',
                            opacity: 0.12,
                            animation: 'wave2 10s linear infinite',
                        }}>
                        <path d="M0,192 C120,130 240,250 360,192 C480,130 600,250 720,192 C840,130 960,250 1080,192 C1200,130 1320,250 1440,192 L1440,320 L0,320 Z"
                            fill="rgba(123,17,19,0.5)" />
                    </Box>
                </Box>

                <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    <RevealSection>
                        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
                            <Chip label="System Modules" sx={{
                                bgcolor: 'rgba(123,17,19,0.2)', color: '#f5a0a0',
                                fontWeight: 800, mb: 3, px: 2, letterSpacing: '2px',
                                border: '1px solid rgba(123,17,19,0.3)',
                            }} />
                            <Typography sx={{
                                fontWeight: 900, color: 'white', mb: 2,
                                fontSize: { xs: '2.4rem', md: '3.6rem' }, lineHeight: 1.1
                            }}>
                                Everything You Need to{' '}
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #f5d78a 0%, #e8b84b 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>Take Action</Box>
                            </Typography>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.5)', fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 600, mx: 'auto', lineHeight: 1.8
                            }}>
                                Three powerful, integrated modules to monitor, educate, and improve waste management across all CIT-U offices and departments.
                            </Typography>
                        </Box>
                    </RevealSection>

                    <Box ref={modulesRef}>
                        <Grid container spacing={4}>
                            {modules.map((mod, i) => (
                                <Grid key={mod.title} size={{ xs: 12, md: 4 }}>
                                    <Box sx={{
                                        opacity: modulesInView ? 1 : 0,
                                        transform: modulesInView ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.96)',
                                        transition: `opacity 0.7s ease ${0.12 * i}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.12 * i}s`,
                                    }}>
                                        <Card onClick={() => navigate(mod.path)} sx={{
                                            height: '100%', borderRadius: '24px', cursor: 'pointer',
                                            background: 'rgba(255,255,255,0.03)',
                                            backdropFilter: 'blur(24px)',
                                            border: `1px solid ${mod.border}`,
                                            position: 'relative', overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
                                            '&::before': {
                                                content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                                height: '4px', background: mod.gradient,
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-14px) scale(1.02)',
                                                boxShadow: `0 32px 80px rgba(0,0,0,0.4)`,
                                                border: `1px solid ${mod.border.replace('0.3', '0.6')}`,
                                                background: mod.lightGradient,
                                            },
                                        }}>
                                            <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                                                    <Box sx={{
                                                        width: 68, height: 68, borderRadius: '20px',
                                                        background: mod.gradient,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                                                        fontSize: '2rem',
                                                    }}>{mod.emoji}</Box>
                                                    <Chip label={mod.tag} size="small" sx={{
                                                        bgcolor: mod.lightGradient,
                                                        color: mod.tag === 'Admin Only' ? '#f5a0a0' : '#f5d78a',
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                        border: `1px solid ${mod.border}`,
                                                    }} />
                                                </Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: 'white', mb: 1.5, lineHeight: 1.3 }}>
                                                    {mod.title}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, mb: 3.5 }}>
                                                    {mod.description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e8b84b', fontWeight: 800, fontSize: '0.9rem' }}>
                                                    Open Module <ArrowIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* ══════════════ WASTE GUIDE ══════════════ */}
            <Box sx={{
                background: '#0a0303', py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 },
                borderTop: '1px solid rgba(255,255,255,0.04)',
                position: 'relative', overflow: 'hidden',
            }}>
                <WaveBg opacity={0.45} />
                <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    <RevealSection>
                        <Typography sx={{
                            textAlign: 'center', color: 'rgba(255,255,255,0.35)',
                            fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px',
                            textTransform: 'uppercase', mb: 6
                        }}>
                            Quick Reference — Waste Segregation Guide
                        </Typography>
                    </RevealSection>
                    <Box ref={guideRef}>
                        <Grid container spacing={3} justifyContent="center">
                            {wasteCategories.map((cat, i) => (
                                <Grid key={cat.label} size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Box sx={{
                                        opacity: guideInView ? 1 : 0,
                                        transform: guideInView ? 'translateY(0)' : 'translateY(40px)',
                                        transition: `opacity 0.65s ease ${0.1 * i}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${0.1 * i}s`,
                                    }}>
                                        <Box sx={{
                                            bgcolor: cat.bg, border: `1px solid ${cat.border}`,
                                            borderRadius: '20px', p: 3.5, textAlign: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                                            '&:hover': { transform: 'translateY(-6px) scale(1.04)', boxShadow: `0 16px 40px ${cat.border}` },
                                        }}>
                                            <Typography sx={{ fontSize: '2.8rem', mb: 1.5 }}>{cat.emoji}</Typography>
                                            <Typography sx={{ color: cat.color, fontWeight: 800, fontSize: '1.05rem', mb: 0.5 }}>
                                                {cat.label}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                                {cat.sub}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* ══════════════ FOOTER ══════════════ */}
            <Box sx={{ background: '#060101', py: 6, px: { xs: 2, md: 6 }, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ maxWidth: 1280, mx: 'auto', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2.5 }}>
                        <Box component="img" src="/cit logo 3.png" alt="CIT-U"
                            sx={{ width: 40, height: 40, objectFit: 'contain', opacity: 0.85 }} />
                        <Typography sx={{ color: '#e8b84b', fontWeight: 900, fontSize: '1.3rem' }}>
                            5S+ Waste Monitoring System
                        </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', mb: 0.5 }}>
                        Cebu Institute of Technology – University · Environmental Management Office
                    </Typography>
                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        Building a cleaner, greener, and more sustainable campus — one step at a time.
                    </Typography>
                </Box>
            </Box>

        </Box>
    );
};

export default LandingPage;
