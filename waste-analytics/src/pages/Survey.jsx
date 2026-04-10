import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Button, Grid, TextField,
    RadioGroup, FormControlLabel, Radio, FormControl,
    FormLabel, Divider, Chip, Rating, Tab, Tabs,
    LinearProgress, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import {
    Send as SendIcon,
    CheckCircle as CheckIcon,
    QuestionAnswer as SurveyIcon,
    BarChart as ResultsIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import { useAuth } from '../context/AuthContext';
import MascotBubble from '../components/MascotBubble';
import { submitSurvey, getSurveyTotals } from '../api/api';

// ─── Question definitions ─────────────────────────────────────────────────────

const SEGREGATION_OPTIONS = [
    { value: 'always',    label: 'Always' },
    { value: 'often',     label: 'Often' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'rarely',    label: 'Rarely' },
    { value: 'never',     label: 'Never' },
];

const CHALLENGE_OPTIONS = [
    { value: 'bins',        label: 'Not enough labeled bins' },
    { value: 'knowledge',   label: 'Unsure what goes where' },
    { value: 'time',        label: 'No time to segregate' },
    { value: 'habit',       label: 'Old habits / not a priority' },
    { value: 'enforcement', label: 'Lack of policy enforcement' },
    { value: 'other',       label: 'Other' },
];

const ROLE_OPTIONS = [
    { value: 'student',     label: 'Student' },
    { value: 'faculty',     label: 'Faculty / Instructor' },
    { value: 'staff',       label: 'Administrative Staff' },
    { value: 'maintenance', label: 'Maintenance / Custodial' },
    { value: 'prefer_not',  label: 'Prefer not to say' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Case-insensitive key lookup in an object.
 * The backend stores answer values with inconsistent casing
 * (e.g. "Always" vs "always", "No time to segregate" vs the code "time").
 * We match either by the exact option value OR by the option label, both case-insensitively.
 */
const ciGet = (obj, ...candidates) => {
    if (!obj || typeof obj !== 'object') return 0;
    const lower = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
    );
    for (const c of candidates) {
        const found = lower[c.toLowerCase()];
        if (found !== undefined) return found;
    }
    return 0;
};

/**
 * Compute average awareness from the q3 count map.
 * Backend stores { "2": 1, "3": 2, "4": 1 } — sum weighted, divide by total.
 */
const computeAvgAwareness = (q3Map) => {
    if (!q3Map || typeof q3Map !== 'object') return '0.0';
    let sum = 0, cnt = 0;
    for (const [k, v] of Object.entries(q3Map)) {
        const num = Number(k);
        if (!isNaN(num)) { sum += num * v; cnt += v; }
    }
    return cnt === 0 ? '0.0' : (sum / cnt).toFixed(1);
};

const pct = (n, total) => (total === 0 ? 0 : Math.round((n / total) * 100));

// ─── ResultsTab ───────────────────────────────────────────────────────────────

const ResultsTab = ({ totals, loading, error, onRefresh }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                <CircularProgress sx={{ color: '#7b1113' }} />
                <Typography color="text.secondary">Loading results from server…</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>⚠️</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Could not load results
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, fontSize: '0.9rem' }}>
                    {error}
                </Typography>
                <Button
                    variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh}
                    sx={{ borderRadius: '12px', borderColor: '#7b1113', color: '#7b1113' }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    const total = totals?.totalResponses ?? 0;
    const counts = totals?.counts || {};

    if (!totals || total === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>📭</Typography>
                <Typography variant="h6" color="text.secondary">No survey responses yet.</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>Be the first to submit a response!</Typography>
            </Box>
        );
    }

    // Q2 — segregation frequency (keys may be mixed-case, match by value OR label)
    const q2 = counts.q2 || {};
    // Q3 — awareness average computed from count map { "2": 1, "3": 2, "4": 1 }
    const q3 = counts.q3 || {};
    const avgAwareness = computeAvgAwareness(q3);
    // Q4 — challenge counts (keys are full label strings from the frontend)
    const q4 = counts.q4 || {};
    // Suggestions array
    const suggestions = totals?.q5Responses || [];

    // Always-segregate: try value 'always' and label 'Always'
    const alwaysCount = ciGet(q2, 'always', 'Always');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Summary KPIs */}
            <Grid container spacing={3}>
                {[
                    { label: 'Total Responses',  value: total,                           emoji: '📋', color: '#7b1113' },
                    { label: 'Avg. Awareness',   value: `${avgAwareness}/5`,             emoji: '⭐', color: '#f57f17' },
                    { label: 'Always Segregate', value: `${pct(alwaysCount, total)}%`,   emoji: '♻️', color: '#0288d1' },
                ].map(kpi => (
                    <Grid key={kpi.label} size={{ xs: 12, sm: 4 }}>
                        <Paper sx={{
                            p: 3, borderRadius: '20px', textAlign: 'center',
                            boxShadow: '0 6px 24px rgba(46,125,50,0.1)',
                            border: `2px solid ${kpi.color}20`,
                        }}>
                            <Typography sx={{ fontSize: '2rem' }}>{kpi.emoji}</Typography>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{kpi.label}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Q2: Segregation frequency breakdown */}
            <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 3 }}>
                    ♻️ Segregation Frequency Breakdown
                </Typography>
                {SEGREGATION_OPTIONS.map(opt => {
                    // Match by short value ('always') AND display label ('Always')
                    const n = ciGet(q2, opt.value, opt.label);
                    const p = pct(n, total);
                    return (
                        <Box key={opt.value} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{n} ({p}%)</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate" value={p}
                                sx={{
                                    height: 10, borderRadius: 5,
                                    bgcolor: 'rgba(46,125,50,0.1)',
                                    '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#a01518' },
                                }}
                            />
                        </Box>
                    );
                })}
            </Paper>

            {/* Q4: Top challenges — backend stores full label strings as keys */}
            <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 3 }}>
                    ⚠️ Top Reported Challenges
                </Typography>
                {CHALLENGE_OPTIONS.map(opt => {
                    // Match by short value ('bins') AND full label ('Not enough labeled bins')
                    const n = ciGet(q4, opt.value, opt.label);
                    const p = pct(n, total);
                    return (
                        <Box key={opt.value} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{n} ({p}%)</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate" value={p}
                                sx={{
                                    height: 10, borderRadius: 5,
                                    bgcolor: 'rgba(2,136,209,0.1)',
                                    '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#0288d1' },
                                }}
                            />
                        </Box>
                    );
                })}
            </Paper>

            {/* Q5: Recent suggestions from backend */}
            {suggestions.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 2 }}>
                        💡 Recent Suggestions
                    </Typography>
                    {suggestions.slice(-5).reverse().map((s, i) => (
                        <Box key={i} sx={{
                            p: 2, borderRadius: '12px', bgcolor: '#fce4ec',
                            border: '1px solid #f8bbd0', mb: 1.5,
                        }}>
                            <Typography variant="body2" sx={{ color: '#7b1113', fontStyle: 'italic' }}>
                                "{s.answer}"
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Survey = () => {
    const [tab, setTab]       = useState(0);
    const [step, setStep]     = useState('intro'); // 'intro' | 'form' | 'done'
    const [submitting, setSubmitting] = useState(false);

    // Results state
    const [totals, setTotals]         = useState(null);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [resultsError, setResultsError]     = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // Snackbars
    const [snackbar, setSnackbar]   = useState({ open: false, msg: '', sev: 'success' });

    const pt = usePageTheme();
    const { darkMode } = pt;
    const { isGuest } = useAuth();

    const [form, setForm] = useState({
        role:            '',
        segregationFreq: '',
        awarenessLevel:  3,
        challenge:       '',
        suggestion:      '',
    });

    // ── Fetch results (called on mount and when Results tab opens) ─────────────
    const fetchResults = useCallback(async () => {
        setResultsLoading(true);
        setResultsError('');
        try {
            const data = await getSurveyTotals();
            setTotals(data);
            setTotalCount(data?.totalResponses ?? 0);
        } catch (err) {
            setResultsError(err.message || 'Network error. Is the backend running?');
        } finally {
            setResultsLoading(false);
        }
    }, []);

    // Fetch total count on mount (for the chip in the header)
    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    // Re-fetch when switching to Results tab
    const handleTabChange = (_, v) => {
        setTab(v);
        if (v === 1) fetchResults();
    };

    const handleChange = (field) => (e) =>
        setForm(f => ({ ...f, [field]: e.target.value }));

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.segregationFreq || !form.challenge) return;

        setSubmitting(true);
        try {
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
            await submitSurvey({
                date: today,
                q1:   form.role            || '',
                q2:   form.segregationFreq || '',
                q3:   String(form.awarenessLevel),
                q4:   form.challenge        || '',
                q5:   form.suggestion       || '',
            });

            // Refresh totals in background so the chip count updates
            fetchResults();

            setStep('done');
            setSnackbar({ open: true, msg: 'Survey submitted successfully! Thank you 🌱', sev: 'success' });
        } catch (err) {
            setSnackbar({ open: true, msg: `Submission failed: ${err.message}`, sev: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const mascotMessages = {
        intro: "Help me improve waste management at CIT-U! This quick survey takes less than 2 minutes. 🌱",
        form:  "There are no wrong answers — just be honest! Your feedback drives real change. 💪",
        done:  "Thank you so much! Your response helps us build a greener campus. 🎉",
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, background: pt.pageBg, minHeight: '100vh', position: 'relative' }}>
            {/* Floating mascot */}
            <MascotBubble message={mascotMessages[step]} variant="corner" size={100} />

            <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box>
                            <Typography variant="h2" sx={{
                                fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' },
                                background: darkMode
                                    ? 'linear-gradient(135deg, #ffffff 0%, #ce93d8 50%, #ab47bc 100%)'
                                    : 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #ab47bc 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                letterSpacing: '-1px',
                            }}>
                                Waste Reduction Survey
                            </Typography>
                            <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.55)' : '#6a1b9a', fontWeight: 500, mt: 0.5 }}>
                                Help shape a better waste management system at CIT-U
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={<SurveyIcon />}
                        label={`${totalCount} response${totalCount !== 1 ? 's' : ''} collected`}
                        sx={{ mt: 2, bgcolor: pt.chipBg, color: pt.chipColor, fontWeight: 600, border: pt.chipBorder, boxShadow: pt.chipShadow, backdropFilter: pt.chipBackdropFilter, '& .MuiChip-icon': { color: pt.chipIconColor } }}
                    />
                </Box>

                {/* Tabs */}
                <Paper sx={{ borderRadius: '20px', overflow: 'hidden', mb: 3, boxShadow: pt.paperShadow, background: pt.paperBg, backdropFilter: pt.paperBackdropFilter, border: pt.paperBorder }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        sx={{
                            bgcolor: 'transparent',
                            '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem', color: pt.tabColor },
                            '& .MuiTab-root.Mui-selected': { color: pt.tabSelectedColor },
                            '& .MuiTabs-indicator': { bgcolor: pt.tabIndicatorColor, height: 3 },
                        }}
                    >
                        <Tab icon={<SurveyIcon fontSize="small" />} iconPosition="start" label="Take Survey" />
                        {!isGuest && (
                            <Tab icon={<ResultsIcon fontSize="small" />} iconPosition="start" label="View Results" />
                        )}
                    </Tabs>
                </Paper>

                {/* ── TAKE SURVEY TAB ── */}
                {tab === 0 && (
                    <>
                        {/* INTRO STEP */}
                        {step === 'intro' && (
                            <Paper sx={{
                                p: { xs: 3, md: 5 }, borderRadius: '24px',
                                boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(123,31,162,0.12)',
                                position: 'relative', overflow: 'hidden',
                                background: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
                                backdropFilter: darkMode ? 'blur(20px)' : 'none',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                '&::before': {
                                    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                    height: darkMode ? '3px' : '4px', background: 'linear-gradient(90deg, #ab47bc 0%, #7b1fa2 100%)',
                                },
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
                                    <Box component="img" src="/mascot think.png" alt="Eco"
                                        sx={{ width: 240, height: 240, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(67,160,71,0.3))' }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: darkMode ? '#e8f5e9' : '#4a148c', mb: 2 }}>
                                            👋 Hi there! I'm Eco.
                                        </Typography>
                                        <Typography sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#37474f', lineHeight: 1.8, mb: 3, fontSize: '1.05rem' }}>
                                            I need your help to improve waste management at CIT-U! This short survey covers
                                            your waste segregation habits, awareness of the 5S+ program, and challenges you face.
                                            Your honest feedback will be used to improve our system.
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                            {['~2 minutes', 'Anonymous', '5 questions'].map(tag => (
                                                <Chip key={tag} label={tag} size="small"
                                                    sx={{
                                                        bgcolor: darkMode ? 'rgba(206,147,216,0.15)' : '#f3e5f5',
                                                        color: darkMode ? '#ce93d8' : '#7b1fa2',
                                                        fontWeight: 700,
                                                        border: darkMode ? '1px solid rgba(206,147,216,0.3)' : 'none',
                                                    }} />
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained" size="large" endIcon={<SendIcon />}
                                            onClick={() => setStep('form')}
                                            sx={{
                                                background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
                                                borderRadius: '14px', px: 4, py: 1.5, fontWeight: 700,
                                                boxShadow: '0 8px 24px rgba(123,31,162,0.3)',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(123,31,162,0.4)' },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Start Survey
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        )}

                        {/* FORM STEP */}
                        {step === 'form' && (
                            <Paper
                                component="form" onSubmit={handleSubmit}
                                sx={{
                                    p: { xs: 3, md: 5 }, borderRadius: '24px',
                                    boxShadow: pt.paperShadow, position: 'relative', overflow: 'hidden',
                                    background: pt.paperBg, backdropFilter: pt.paperBackdropFilter, border: pt.paperBorder,
                                    '&::before': {
                                        content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                        height: darkMode ? '3px' : '4px', background: 'linear-gradient(90deg, #ab47bc 0%, #7b1fa2 100%)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

                                    {/* Q1: Role */}
                                    <FormControl component="fieldset">
                                        <FormLabel sx={{ fontWeight: 800, color: pt.formLabelColor, fontSize: '1.1rem', mb: 1.5 }}>
                                            1. What is your role at CIT-U? (Optional)
                                        </FormLabel>
                                        <RadioGroup row value={form.role} onChange={handleChange('role')} sx={{ gap: 1, flexWrap: 'wrap' }}>
                                            {ROLE_OPTIONS.map(opt => (
                                                <FormControlLabel key={opt.value} value={opt.value} control={
                                                    <Radio sx={{ '&.Mui-checked': { color: pt.radioCheckedColor }, color: pt.radioColor }} />
                                                } label={<Typography sx={{ color: pt.radioLabelColor }}>{opt.label}</Typography>} />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                    <Divider sx={pt.dividerSx} />

                                    {/* Q2: Segregation frequency */}
                                    <FormControl component="fieldset" required>
                                        <FormLabel sx={{ fontWeight: 800, color: pt.formLabelColor, fontSize: '1.1rem', mb: 1.5 }}>
                                            2. How often do you properly segregate waste? *
                                        </FormLabel>
                                        <RadioGroup value={form.segregationFreq} onChange={handleChange('segregationFreq')}>
                                            {SEGREGATION_OPTIONS.map(opt => (
                                                <FormControlLabel key={opt.value} value={opt.value} control={
                                                    <Radio sx={{ '&.Mui-checked': { color: '#e8b84b' }, color: pt.radioColor }} />
                                                } label={<Typography sx={{ color: pt.radioLabelColor }}>{opt.label}</Typography>} />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                    <Divider sx={pt.dividerSx} />

                                    {/* Q3: Awareness level */}
                                    <FormControl component="fieldset">
                                        <FormLabel sx={{ fontWeight: 800, color: pt.formLabelColor, fontSize: '1.1rem', mb: 2 }}>
                                            3. How aware are you of the 5S+ program and its goals?
                                        </FormLabel>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Rating
                                                value={form.awarenessLevel}
                                                onChange={(_, v) => setForm(f => ({ ...f, awarenessLevel: v || 1 }))}
                                                size="large"
                                                sx={{ '& .MuiRating-iconFilled': { color: '#ffeb3b' }, '& .MuiRating-iconEmpty': { color: pt.ratingEmptyColor } }}
                                            />
                                            <Typography sx={{ color: pt.ratingLabelColor, fontWeight: 600 }}>
                                                {['', 'Not aware', 'Slightly aware', 'Somewhat aware', 'Mostly aware', 'Fully aware'][form.awarenessLevel]}
                                            </Typography>
                                        </Box>
                                    </FormControl>

                                    <Divider sx={pt.dividerSx} />

                                    {/* Q4: Main challenge */}
                                    <FormControl component="fieldset" required>
                                        <FormLabel sx={{ fontWeight: 800, color: pt.formLabelColor, fontSize: '1.1rem', mb: 1.5 }}>
                                            4. What is your biggest challenge in waste segregation? *
                                        </FormLabel>
                                        <RadioGroup value={form.challenge} onChange={handleChange('challenge')}>
                                            {CHALLENGE_OPTIONS.map(opt => (
                                                <FormControlLabel key={opt.value} value={opt.value} control={
                                                    <Radio sx={{ '&.Mui-checked': { color: '#ffb74d' }, color: pt.radioColor }} />
                                                } label={<Typography sx={{ color: pt.radioLabelColor }}>{opt.label}</Typography>} />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                    <Divider sx={pt.dividerSx} />

                                    {/* Q5: Suggestions */}
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, color: pt.formLabelColor, fontSize: '1.1rem', mb: 1.5 }}>
                                            5. Any suggestions to improve waste management at CIT-U? (Optional)
                                        </Typography>
                                        <TextField
                                            fullWidth multiline rows={4}
                                            placeholder="Your ideas, suggestions, or concerns..."
                                            value={form.suggestion}
                                            onChange={handleChange('suggestion')}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3, color: pt.textFieldColor,
                                                    '& fieldset': { borderColor: pt.textFieldBorderColor },
                                                    '&:hover fieldset': { borderColor: pt.textFieldHoverBorderColor },
                                                    '&.Mui-focused fieldset': { borderColor: pt.textFieldFocusedBorderColor },
                                                },
                                                '& .MuiInputBase-input::placeholder': { color: pt.textFieldPlaceholderColor, opacity: 1 },
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined" onClick={() => setStep('intro')}
                                            sx={{ borderRadius: '14px', borderColor: '#7b1fa2', color: '#7b1fa2', px: 3 }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit" variant="contained" size="large"
                                            disabled={submitting}
                                            endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
                                                borderRadius: '14px', px: 6, py: 1.5, fontWeight: 700,
                                                boxShadow: '0 8px 24px rgba(123,31,162,0.3)',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(123,31,162,0.4)' },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {submitting ? 'Submitting…' : 'Submit Survey'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        )}

                        {/* DONE STEP */}
                        {step === 'done' && (
                            <Paper sx={{
                                p: { xs: 3, md: 6 }, borderRadius: '24px', textAlign: 'center',
                                boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(46,125,50,0.15)',
                                background: darkMode ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #fce4ec 0%, #fce4ec 100%)',
                                backdropFilter: darkMode ? 'blur(20px)' : 'none',
                                border: darkMode ? '1px solid rgba(232,184,75,0.2)' : '2px solid #f8bbd0',
                            }}>
                                <Box component="img" src="/mascot think.png" alt="Eco"
                                    sx={{ width: 260, height: 260, objectFit: 'contain', filter: 'drop-shadow(0 12px 32px rgba(67,160,71,0.3))', mb: 2 }}
                                />
                                <CheckIcon sx={{ fontSize: 64, color: darkMode ? '#e8b84b' : '#7b1113', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 900, color: darkMode ? '#fce4ec' : '#3e0a0b', mb: 2 }}>
                                    Thank you for your response! 🎉
                                </Typography>
                                <Typography sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#7b1113', fontSize: '1.1rem', mb: 4, maxWidth: 480, mx: 'auto' }}>
                                    Your feedback is valuable and will be used to improve waste management practices across CIT-U.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setStep('intro');
                                            setForm({ role: '', segregationFreq: '', awarenessLevel: 3, challenge: '', suggestion: '' });
                                        }}
                                        sx={{ borderRadius: '14px', borderColor: '#7b1113', color: '#7b1113', px: 4 }}
                                    >
                                        Submit Another
                                    </Button>
                                    {!isGuest && (
                                        <Button
                                            variant="contained"
                                            onClick={() => { setTab(1); fetchResults(); }}
                                            sx={{ borderRadius: '14px', background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)', px: 4 }}
                                        >
                                            View Results
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        )}
                    </>
                )}

                {/* ── RESULTS TAB ── */}
                {tab === 1 && (
                    <ResultsTab
                        totals={totals}
                        loading={resultsLoading}
                        error={resultsError}
                        onRefresh={fetchResults}
                    />
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.sev} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Survey;
