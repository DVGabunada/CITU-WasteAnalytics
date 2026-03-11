import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent,
    Chip, Button, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
    NavigateBefore as PrevIcon,
    NavigateNext as NextIcon,
    Checklist as SortIcon,
    GridView as SetIcon,
    Star as ShineIcon,
    Assignment as StandardizeIcon,
    Autorenew as SustainIcon,
    AddCircleOutline as PlusIcon,
    Lightbulb as TipIcon,
    School as SchoolIcon,
    KeyboardArrowUp as ArrowUpIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import MascotBubble from '../components/MascotBubble';
import { triviaData } from '../data/triviaData';

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, { threshold: 0.1, ...options });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
};

// ─── Bin Guide ────────────────────────────────────────────────────────────────

const bins = [
    {
        color: '#c62828', bg: 'linear-gradient(135deg, #fce4ec 0%, #f48fb1 100%)',
        label: 'GREEN BIN', subtitle: 'Biodegradable',
        emoji: '🍃',
        items: ['Food scraps & leftovers', 'Fruit & vegetable peels', 'Garden waste & leaves', 'Coffee grounds / tea bags', 'Paper towels (soiled)'],
        tip: 'Biodegradable waste can be composted! Ask your office about composting programs.',
    },
    {
        color: '#0288d1', bg: 'linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)',
        label: 'BLUE BIN', subtitle: 'Recyclable',
        emoji: '♻️',
        items: ['Clean paper & cardboard', 'Plastic bottles & containers', 'Glass bottles & jars', 'Metal cans & foil', 'Magazines & newspapers'],
        tip: 'Rinse containers before placing in the blue bin — contaminated recyclables get rejected!',
    },
    {
        color: '#616161', bg: 'linear-gradient(135deg, #cfd8dc 0%, #b0bec5 100%)',
        label: 'BLACK BIN', subtitle: 'Residual',
        emoji: '🗑️',
        items: ['Soiled food packaging', 'Used tissues & napkins', 'Broken ceramics / glass', 'Composite materials', 'Used school supplies'],
        tip: 'Residual waste goes to landfill. The less you put here, the better!',
    },
    {
        color: '#f44336', bg: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)',
        label: 'RED BIN', subtitle: 'Hazardous / Special',
        emoji: '⚠️',
        items: ['Batteries & electronics', 'Expired chemicals', 'Lab / medical waste', 'Fluorescent bulbs', 'Ink cartridges / toners'],
        tip: 'Never mix hazardous waste with regular trash! Contact the safety office for proper disposal.',
    },
];

// ─── 5S+ Pillars (for explainer) ─────────────────────────────────────────────

const pillars = [
    {
        label: 'SORT', tagline: 'Seiri', icon: SortIcon, color: '#e53935', bg: '#ffcdd2',
        description: 'Remove unnecessary items. Only keep what is needed for daily operations. Ask: "Do I need this today?"',
        campus: '🏫 Campus example: Remove expired documents, unused equipment, and clutter from office desks.',
    },
    {
        label: 'SET IN ORDER', tagline: 'Seiton', icon: SetIcon, color: '#1565c0', bg: '#bbdefb',
        description: 'Organize materials so everything has a labeled, designated place. A place for everything, everything in its place.',
        campus: '🏫 Campus example: Label storage shelves, arrange waste bins clearly, put supplies in fixed locations.',
    },
    {
        label: 'SHINE', tagline: 'Seiso', icon: ShineIcon, color: '#f57f17', bg: '#fff9c4',
        description: 'Keep the workplace clean. Regular cleaning prevents buildup and reveals hidden problems early.',
        campus: '🏫 Campus example: Daily desk wipe-downs, weekly bin cleaning, regular classroom sweeping schedules.',
    },
    {
        label: 'STANDARDIZE', tagline: 'Seiketsu', icon: StandardizeIcon, color: '#6a1b9a', bg: '#e1bee7',
        description: 'Create and follow uniform procedures. Make the first 3S practices into daily routines with clear SOPs.',
        campus: '🏫 Campus example: Post waste segregation guides on every bin. Use consistent bin colors university-wide.',
    },
    {
        label: 'SUSTAIN', tagline: 'Shitsuke', icon: SustainIcon, color: '#e8b84b', bg: '#fff8e1',
        description: 'Maintain discipline and commitment. Turn 5S practices into habits through training, monitoring, and accountability.',
        campus: '🏫 Campus example: Monthly 5S audits, orientation for new staff/students, this monitoring system!',
    },
    {
        label: 'PLUS (+)', tagline: 'Safety & Eco', icon: PlusIcon, color: '#00695c', bg: '#b2dfdb',
        description: 'Extend 5S beyond cleanliness — include safety, environmental management, and waste reduction goals.',
        campus: '🏫 Campus example: Proper hazardous waste disposal, energy-saving practices, monthly waste reporting.',
    },
];

// ─── Waste Reduction Tips ─────────────────────────────────────────────────────

const tips = [
    { emoji: '📄', tip: 'Print double-sided to cut paper waste by up to 50%.' },
    { emoji: '🍱', tip: 'Bring a reusable lunch box to avoid single-use plastic packaging.' },
    { emoji: '💧', tip: 'Use a refillable water bottle instead of buying bottled water daily.' },
    { emoji: '🖨️', tip: 'Review documents digitally before printing — avoid unnecessary copies.' },
    { emoji: '🔋', tip: 'Dispose of batteries and e-waste in the designated RED BIN only.' },
    { emoji: '🧴', tip: 'Rinse plastic containers before recycling — contamination ruins whole batches.' },
    { emoji: '📦', tip: 'Reuse cardboard boxes for storage before sending to the blue bin.' },
    { emoji: '🌱', tip: 'Start or join a composting initiative for canteen food waste.' },
    { emoji: '✏️', tip: 'Use pens and pencils until they run out — avoid discarding prematurely.' },
    { emoji: '💡', tip: 'Report broken or leaking chemicals to the safety office immediately.' },
    { emoji: '🛍️', tip: 'Bring reusable eco bags when shopping — avoid accepting single-use plastic bags.' },
    { emoji: '🔌', tip: 'Unplug chargers and devices when not in use to cut energy waste and extend equipment life.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const Awareness = () => {
    const [triviaIdx, setTriviaIdx] = useState(0);
    const [triviaAnimating, setTriviaAnimating] = useState(false);
    const pt = usePageTheme();
    const { darkMode } = pt;

    const [binsRef, binsInView] = useInView();
    const [triviaRef, triviaInView] = useInView();
    const [pillarsRef, pillarsInView] = useInView();
    const [tipsRef, tipsInView] = useInView();

    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const changeTrivia = (dir) => {
        setTriviaAnimating(true);
        setTimeout(() => {
            setTriviaIdx(i => (i + dir + triviaData.length) % triviaData.length);
            setTriviaAnimating(false);
        }, 200);
    };

    // auto-rotate trivia
    useEffect(() => {
        const t = setInterval(() => changeTrivia(1), 8000);
        return () => clearInterval(t);
    }, []);

    const currentTrivia = triviaData[triviaIdx];

    return (
        <>
            <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: { xs: 6, md: 10 }, background: pt.pageBg, minHeight: '100vh' }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

                    {/* Header */}
                    <Box sx={{ mb: { xs: 10, md: 14 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>

                            <Box>
                                <Typography variant="h2" sx={{
                                    fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' },
                                    background: darkMode
                                        ? 'linear-gradient(135deg, #ffffff 0%, #f5d78a 50%, #e8b84b 100%)'
                                        : 'linear-gradient(135deg, #5a0d0f 0%, #7b1113 50%, #a01518 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    letterSpacing: '-1px',
                                }}>
                                    Awareness & Education
                                </Typography>
                                <Typography variant="body1" sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                                    Learn about waste segregation, 5S+, and how to make a difference
                                </Typography>
                            </Box>
                        </Box>
                        <Chip icon={<SchoolIcon />} label="Educational Resource Center"
                            sx={{ mt: 2, ...pt.chipSx }} />
                    </Box>

                    {/* ── SECTION 1: WASTE BIN GUIDE ── */}
                    <Box sx={{ mb: { xs: 16, md: 22 } }}>
                        <Box sx={{
                            opacity: binsInView ? 1 : 0,
                            transform: binsInView ? 'translateY(0)' : 'translateY(36px)',
                            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                            display: 'flex', alignItems: 'center', gap: 2, mb: 4,
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: pt.sectionTitleColor }}>
                                Waste Segregation Guide
                            </Typography>
                        </Box>
                        <Typography sx={{
                            opacity: binsInView ? 1 : 0,
                            transform: binsInView ? 'translateY(0)' : 'translateY(24px)',
                            transition: 'opacity 0.7s ease 0.08s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s',
                            color: pt.secondaryTextColor, mb: 4, fontSize: '1.05rem', maxWidth: 700,
                        }}>
                            Use the right bin for each type of waste. Proper segregation keeps recyclables clean and hazardous materials safe.
                        </Typography>

                        <Grid container spacing={3} ref={binsRef}>
                            {bins.map((bin, i) => (
                                <Grid key={bin.label} size={{ xs: 12, sm: 6, xl: 3 }}>
                                    <Box sx={{
                                        opacity: binsInView ? 1 : 0,
                                        transform: binsInView ? 'translateY(0)' : 'translateY(50px)',
                                        transition: `opacity 0.65s ease ${0.1 * i}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${0.1 * i}s`,
                                    }}>
                                        <Card sx={{
                                            height: '100%', borderRadius: '24px',
                                            border: `2px solid ${bin.color}40`,
                                            boxShadow: `0 8px 32px ${bin.color}${darkMode ? '15' : '20'}`,
                                            background: pt.cardBg,
                                            backdropFilter: pt.cardBackdropFilter,
                                            transition: 'all 0.3s ease',
                                            '&:hover': { transform: 'translateY(-8px)', boxShadow: `0 20px 48px ${bin.color}30` },
                                            animation: `cardIn 0.5s ease-out ${i * 0.1}s backwards`,
                                            '@keyframes cardIn': {
                                                from: { opacity: 0, transform: 'translateY(20px)' },
                                                to: { opacity: 1, transform: 'translateY(0)' },
                                            },
                                        }}>
                                            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {/* Bin header */}
                                                <Box sx={{
                                                    background: bin.bg, p: 4, borderRadius: '22px 22px 0 0',
                                                    display: 'flex', alignItems: 'center', gap: 2,
                                                }}>
                                                    <Typography sx={{ fontSize: '3rem' }}>{bin.emoji}</Typography>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: bin.color, letterSpacing: '1px' }}>
                                                            {bin.label}
                                                        </Typography>
                                                        <Typography sx={{ fontWeight: 700, color: bin.color, fontSize: '1.1rem' }}>
                                                            {bin.subtitle}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ p: 3.5, flex: 1 }}>
                                                    {bin.items.map(item => (
                                                        <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                                            <Box sx={{
                                                                width: 8, height: 8, borderRadius: '50%',
                                                                bgcolor: bin.color, flexShrink: 0, mt: '6px',
                                                            }} />
                                                            <Typography variant="body2" sx={{ color: pt.bodyTextColor, lineHeight: 1.7, fontSize: '0.95rem' }}>
                                                                {item}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>

                                                {/* Tip */}
                                                <Box sx={{
                                                    m: 2.5, p: 2.5, borderRadius: '12px',
                                                    bgcolor: `${bin.color}10`, border: `1px solid ${bin.color}25`,
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                                        <TipIcon sx={{ color: bin.color, fontSize: 18, flexShrink: 0, mt: '2px' }} />
                                                        <Typography variant="body2" sx={{ color: bin.color, fontWeight: 600, lineHeight: 1.6 }}>
                                                            {bin.tip}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* ── SECTION 2: TRIVIA CARDS ── */}
                    <Box sx={{ mb: { xs: 16, md: 22 } }} ref={triviaRef}>
                        <Typography variant="h4" sx={{
                            fontWeight: 900, color: pt.sectionTitleColor, mb: 2,
                            opacity: triviaInView ? 1 : 0,
                            transform: triviaInView ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                        }}>
                            Did You Know?
                        </Typography>
                        <Typography sx={{
                            color: pt.secondaryTextColor, mb: 4, fontSize: '1.05rem',
                            opacity: triviaInView ? 1 : 0,
                            transform: triviaInView ? 'translateY(0)' : 'translateY(24px)',
                            transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s',
                        }}>
                            Eco shares a new fact with you every few seconds!
                        </Typography>

                        <Box sx={{
                            opacity: triviaInView ? 1 : 0,
                            transform: triviaInView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
                            transition: 'opacity 0.75s ease 0.18s, transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.18s',
                        }}>
                            <Paper sx={{
                                borderRadius: '28px', overflow: 'hidden',
                                boxShadow: pt.cardShadow,
                                background: pt.cardBg,
                                backdropFilter: pt.cardBackdropFilter,
                                border: pt.cardBorder,
                            }}>
                                <Box sx={{
                                    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                                    minHeight: 420,
                                }}>
                                    {/* Mascot side */}
                                    <Box sx={{
                                        width: { xs: '100%', md: 340 }, bgcolor: currentTrivia.color + '25',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', p: 5, gap: 2,
                                        borderRight: { md: `4px solid ${currentTrivia.color}40` },
                                        transition: 'background 0.5s ease, border-color 0.5s ease',
                                    }}>
                                        <Box
                                            component="img" src="/mascot think.png" alt="Eco"
                                            sx={{
                                                width: 220, height: 220, objectFit: 'contain',
                                                filter: `drop-shadow(0 8px 24px ${currentTrivia.color}40)`,
                                                animation: 'mascotBob 3s ease-in-out infinite',
                                                '@keyframes mascotBob': {
                                                    '0%,100%': { transform: 'translateY(0)' },
                                                    '50%': { transform: 'translateY(-8px)' },
                                                },
                                            }}
                                        />
                                        <Chip
                                            label={currentTrivia.category}
                                            sx={{ bgcolor: currentTrivia.color, color: 'white', fontWeight: 700, fontSize: '0.85rem' }}
                                        />
                                    </Box>

                                    {/* Trivia content */}
                                    <Box sx={{ flex: 1, p: { xs: 4, md: 7 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{
                                            fontSize: '3rem', mb: 2,
                                            opacity: triviaAnimating ? 0 : 1,
                                            transition: 'opacity 0.2s ease',
                                        }}>
                                            {currentTrivia.icon}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: { xs: '1.25rem', md: '1.55rem' }, fontWeight: 700,
                                            color: pt.sectionTitleColor, lineHeight: 1.75,
                                            opacity: triviaAnimating ? 0 : 1, transition: 'opacity 0.2s ease',
                                        }}>
                                            {currentTrivia.fact}
                                        </Typography>

                                        {/* Navigation */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
                                            <IconButton onClick={() => changeTrivia(-1)}
                                                sx={{ bgcolor: pt.iconButtonBg, '&:hover': { bgcolor: pt.iconButtonHoverBg }, color: pt.iconButtonColor }}>
                                                <PrevIcon />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ color: pt.secondaryTextColor, fontWeight: 600 }}>
                                                {triviaIdx + 1} / {triviaData.length}
                                            </Typography>
                                            <IconButton onClick={() => changeTrivia(1)}
                                                sx={{ bgcolor: pt.iconButtonBg, '&:hover': { bgcolor: pt.iconButtonHoverBg }, color: pt.iconButtonColor }}>
                                                <NextIcon />
                                            </IconButton>
                                            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                                {triviaData.map((_, i) => (
                                                    <Box key={i} onClick={() => setTriviaIdx(i)} sx={{
                                                        width: i === triviaIdx ? 24 : 8, height: 8, borderRadius: '4px',
                                                        bgcolor: i === triviaIdx ? currentTrivia.color : pt.dotColor,
                                                        transition: 'all 0.3s ease', cursor: 'pointer',
                                                    }} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box> {/* end reveal wrapper */}
                    </Box>

                    {/* ── SECTION 3: 5S+ EXPLAINER ── */}
                    <Box sx={{ mb: { xs: 16, md: 22 } }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 900, color: pt.sectionTitleColor, mb: 2,
                            opacity: pillarsInView ? 1 : 0,
                            transform: pillarsInView ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                        }}>
                            Understanding the 5S+ Framework
                        </Typography>
                        <Typography sx={{
                            color: pt.secondaryTextColor, mb: 4, fontSize: '1.05rem', maxWidth: 700,
                            opacity: pillarsInView ? 1 : 0,
                            transform: pillarsInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s',
                        }}>
                            The 5S+ program is CIT-U's systematic approach to workplace organization, cleanliness, and environmental responsibility.
                        </Typography>

                        <Grid container spacing={3} ref={pillarsRef}>
                            {pillars.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <Grid key={p.label} size={{ xs: 12, md: 6 }}>
                                        <Box sx={{
                                            opacity: pillarsInView ? 1 : 0,
                                            transform: pillarsInView ? 'translateY(0)' : 'translateY(48px)',
                                            transition: `opacity 0.65s ease ${0.08 * i}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${0.08 * i}s`,
                                        }}>
                                            <Card sx={{
                                                borderRadius: '20px', height: '100%',
                                                border: `2px solid ${p.color}25`,
                                                boxShadow: `0 6px 24px ${p.color}15`,
                                                background: pt.cardBg,
                                                backdropFilter: pt.cardBackdropFilter,
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 16px 40px ${p.color}30` },
                                            }}>
                                                <CardContent sx={{ p: 4.5, position: 'relative' }}>
                                                    {/* Step number badge */}
                                                    <Box sx={{
                                                        position: 'absolute', top: 20, right: 20,
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        bgcolor: `${p.color}15`, border: `2px solid ${p.color}30`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: p.color }}>
                                                            {String(i + 1).padStart(2, '0')}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
                                                        <Box sx={{
                                                            width: 60, height: 60, borderRadius: '16px',
                                                            bgcolor: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            boxShadow: `0 6px 16px ${p.color}25`,
                                                        }}>
                                                            <Icon sx={{ color: p.color, fontSize: 32 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#90a4ae', letterSpacing: '1.5px', textTransform: 'uppercase', mb: 0.3 }}>
                                                                Step {i + 1}
                                                            </Typography>
                                                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: p.color, letterSpacing: '1px' }}>
                                                                {p.label}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#90a4ae', fontStyle: 'italic' }}>
                                                                {p.tagline}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography sx={{ color: pt.bodyTextColor, lineHeight: 1.8, mb: 2.5, fontSize: '1rem' }}>
                                                        {p.description}
                                                    </Typography>
                                                    <Box sx={{
                                                        p: 3, borderRadius: '12px',
                                                        bgcolor: `${p.color}08`, border: `1px solid ${p.color}20`,
                                                    }}>
                                                        <Typography variant="body2" sx={{ color: p.color, fontWeight: 600, lineHeight: 1.7, fontSize: '0.95rem' }}>
                                                            {p.campus}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>

                    {/* ── SECTION 4: QUICK TIPS ── */}
                    <Box sx={{ mb: { xs: 10, md: 14 } }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 900, color: pt.sectionTitleColor, mb: 2,
                            opacity: tipsInView ? 1 : 0,
                            transform: tipsInView ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                        }}>
                            Waste Reduction Tips
                        </Typography>
                        <Typography sx={{
                            color: pt.secondaryTextColor, mb: 4, fontSize: '1.05rem',
                            opacity: tipsInView ? 1 : 0,
                            transform: tipsInView ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.7s ease 0.08s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s',
                        }}>
                            Small actions make a big difference. Try implementing these in your daily routine!
                        </Typography>

                        <Grid container spacing={2} ref={tipsRef}>
                            {tips.map((t, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Box sx={{
                                        opacity: tipsInView ? 1 : 0,
                                        transform: tipsInView ? 'translateY(0)' : 'translateY(40px)',
                                        transition: `opacity 0.6s ease ${0.06 * i}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.06 * i}s`,
                                        height: '100%',
                                    }}>
                                        <Paper sx={{
                                            p: 3.5, borderRadius: '20px', height: '100%',
                                            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
                                            background: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
                                            backdropFilter: darkMode ? 'blur(12px)' : 'none',
                                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(123,17,19,0.08)',
                                            display: 'flex', flexDirection: 'column', gap: 1.5,
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: darkMode ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(123,17,19,0.12)',
                                                border: darkMode ? '1px solid rgba(232,184,75,0.2)' : '1px solid rgba(123,17,19,0.18)',
                                            },
                                        }}>
                                            <Typography sx={{ fontSize: '2.2rem' }}>{t.emoji}</Typography>
                                            <Typography sx={{ color: pt.bodyTextColor, fontWeight: 500, lineHeight: 1.7, fontSize: '1rem' }}>
                                                {t.tip}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* ── BACK TO TOP ── */}
            <Box
                onClick={scrollToTop}
                sx={{
                    position: 'fixed', bottom: 36, right: 36, zIndex: 999,
                    display: 'flex', alignItems: 'center', gap: 1,
                    background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                    color: 'white',
                    px: 2.5, py: 1.4,
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 28px rgba(123,17,19,0.45)',
                    border: '1px solid rgba(232,184,75,0.3)',
                    opacity: showTop ? 1 : 0,
                    transform: showTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
                    pointerEvents: showTop ? 'auto' : 'none',
                    transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #c62828 0%, #a01518 100%)',
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: '0 14px 36px rgba(123,17,19,0.55)',
                    },
                }}
            >
                <ArrowUpIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px' }}>
                    Back to Top
                </Typography>
            </Box>
        </>
    );
};

export default Awareness;
