import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, Grid, TextField,
    RadioGroup, FormControlLabel, Radio, FormControl,
    FormLabel, Divider, Chip, Rating, Tab, Tabs,
    Card, CardContent, LinearProgress, Snackbar, Alert,
} from '@mui/material';
import {
    Send as SendIcon,
    CheckCircle as CheckIcon,
    QuestionAnswer as SurveyIcon,
    BarChart as ResultsIcon,
    EmojiObjects as TipIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import { useAuth } from '../context/AuthContext';
import MascotBubble from '../components/MascotBubble';
import { addSurveyResponse, getSurveyResponses } from '../data/surveyStore';

// ─── Question definitions ─────────────────────────────────────────────────

const SEGREGATION_OPTIONS = [
    { value: 'always', label: 'Always' },
    { value: 'often', label: 'Often' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'never', label: 'Never' },
];

const CHALLENGE_OPTIONS = [
    { value: 'bins', label: 'Not enough labeled bins' },
    { value: 'knowledge', label: 'Unsure what goes where' },
    { value: 'time', label: 'No time to segregate' },
    { value: 'habit', label: 'Old habits / not a priority' },
    { value: 'enforcement', label: 'Lack of policy enforcement' },
    { value: 'other', label: 'Other' },
];

const ROLE_OPTIONS = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty / Instructor' },
    { value: 'staff', label: 'Administrative Staff' },
    { value: 'maintenance', label: 'Maintenance / Custodial' },
    { value: 'prefer_not', label: 'Prefer not to say' },
];

// ─── Helper ────────────────────────────────────────────────────────────────

const countBy = (arr, key, val) => arr.filter(r => r[key] === val).length;
const pct = (n, total) => total === 0 ? 0 : Math.round((n / total) * 100);

// ─── ResultsTab ───────────────────────────────────────────────────────────

const ResultsTab = ({ responses }) => {
    const total = responses.length;

    if (total === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>📭</Typography>
                <Typography variant="h6" color="text.secondary">No survey responses yet.</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>Be the first to submit a response!</Typography>
            </Box>
        );
    }

    const avgAwareness = (responses.reduce((acc, r) => acc + (Number(r.awarenessLevel) || 0), 0) / total).toFixed(1);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Summary KPIs */}
            <Grid container spacing={3}>
                {[
                    { label: 'Total Responses', value: total, emoji: '📋', color: '#7b1113' },
                    { label: 'Avg. Awareness Score', value: `${avgAwareness}/5`, emoji: '⭐', color: '#f57f17' },
                    { label: 'Always Segregate', value: `${pct(countBy(responses, 'segregationFreq', 'always'), total)}%`, emoji: '♻️', color: '#0288d1' },
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

            {/* Segregation breakdown */}
            <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 3 }}>
                    ♻️ Segregation Frequency Breakdown
                </Typography>
                {SEGREGATION_OPTIONS.map(opt => {
                    const n = countBy(responses, 'segregationFreq', opt.value);
                    const p = pct(n, total);
                    return (
                        <Box key={opt.value} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{n} ({p}%)</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={p}
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

            {/* Top challenges */}
            <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 3 }}>
                    ⚠️ Top Reported Challenges
                </Typography>
                {CHALLENGE_OPTIONS.map(opt => {
                    const n = responses.filter(r => r.challenge === opt.value).length;
                    const p = pct(n, total);
                    return (
                        <Box key={opt.value} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                                <Typography variant="body2" color="text.secondary">{n} ({p}%)</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={p}
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

            {/* Recent suggestions */}
            {responses.some(r => r.suggestion) && (
                <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 6px 24px rgba(46,125,50,0.1)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#7b1113', mb: 2 }}>
                        💡 Recent Suggestions
                    </Typography>
                    {responses.filter(r => r.suggestion).slice(-5).reverse().map((r, i) => (
                        <Box key={i} sx={{
                            p: 2, borderRadius: '12px', bgcolor: '#fce4ec',
                            border: '1px solid #f8bbd0', mb: 1.5,
                        }}>
                            <Typography variant="body2" sx={{ color: '#7b1113', fontStyle: 'italic' }}>
                                "{r.suggestion}"
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {r.role || 'Anonymous'} · {new Date(r.submittedAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────

const Survey = () => {
    const [tab, setTab] = useState(0);
    const [step, setStep] = useState('intro'); // 'intro' | 'form' | 'done'
    const [responses, setResponses] = useState([]);
    const [snackbar, setSnackbar] = useState(false);
    const pt = usePageTheme();
    const { darkMode } = pt;
    const { isGuest } = useAuth();

    const [form, setForm] = useState({
        segregationFreq: '',
        awarenessLevel: 3,
        challenge: '',
        suggestion: '',
        role: '',
    });

    useEffect(() => {
        setResponses(getSurveyResponses());
    }, []);

    const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.segregationFreq || !form.challenge) return;
        const updated = addSurveyResponse(form);
        setResponses(updated);
        setStep('done');
        setSnackbar(true);
    };

    const mascotMessages = {
        intro: "Help me improve waste management at CIT-U! This quick survey takes less than 2 minutes. 🌱",
        form: "There are no wrong answers — just be honest! Your feedback drives real change. 💪",
        done: "Thank you so much! Your response helps us build a greener campus. 🎉",
    };

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 }, background: pt.pageBg, minHeight: '100vh', position: 'relative',
        }}>
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
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '-1px',
                            }}
                            >
                                Waste Reduction Survey
                            </Typography>
                            <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255,255,255,0.55)' : '#6a1b9a', fontWeight: 500, mt: 0.5 }}>
                                Help shape a better waste management system at CIT-U
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={<SurveyIcon />}
                        label={`${responses.length} response${responses.length !== 1 ? 's' : ''} collected`}
                        sx={{ mt: 2, bgcolor: pt.chipBg, color: pt.chipColor, fontWeight: 600, border: pt.chipBorder, boxShadow: pt.chipShadow, backdropFilter: pt.chipBackdropFilter, '& .MuiChip-icon': { color: pt.chipIconColor } }}
                    />
                </Box>

                {/* Tabs */}
                <Paper sx={{ borderRadius: '20px', overflow: 'hidden', mb: 3, boxShadow: pt.paperShadow, background: pt.paperBg, backdropFilter: pt.paperBackdropFilter, border: pt.paperBorder }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
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
                                    <Box
                                        component="img" src="/Sprite Mascot.png" alt="Eco"
                                        sx={{ width: 160, height: 160, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(67,160,71,0.3))' }}
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
                                            variant="contained" size="large"
                                            endIcon={<SendIcon />}
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
                                    boxShadow: pt.paperShadow,
                                    position: 'relative', overflow: 'hidden',
                                    background: pt.paperBg,
                                    backdropFilter: pt.paperBackdropFilter,
                                    border: pt.paperBorder,
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
                                                    borderRadius: 3,
                                                    color: pt.textFieldColor,
                                                    '& fieldset': { borderColor: pt.textFieldBorderColor },
                                                    '&:hover fieldset': { borderColor: pt.textFieldHoverBorderColor },
                                                    '&.Mui-focused fieldset': { borderColor: pt.textFieldFocusedBorderColor },
                                                },
                                                '& .MuiInputBase-input::placeholder': {
                                                    color: pt.textFieldPlaceholderColor,
                                                    opacity: 1,
                                                },
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
                                            type="submit" variant="contained" size="large" endIcon={<SendIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
                                                borderRadius: '14px', px: 6, py: 1.5, fontWeight: 700,
                                                boxShadow: '0 8px 24px rgba(123,31,162,0.3)',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(123,31,162,0.4)' },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Submit Survey
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
                                <Box
                                    component="img" src="/Sprite Mascot.png" alt="Eco"
                                    sx={{ width: 180, height: 180, objectFit: 'contain', filter: 'drop-shadow(0 12px 32px rgba(67,160,71,0.3))', mb: 2 }}
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
                                        variant="outlined" onClick={() => { setStep('intro'); setForm({ segregationFreq: '', awarenessLevel: 3, challenge: '', suggestion: '', role: '' }); }}
                                        sx={{ borderRadius: '14px', borderColor: '#7b1113', color: '#7b1113', px: 4 }}
                                    >
                                        Submit Another
                                    </Button>
                                    <Button
                                        variant="contained" onClick={() => setTab(1)}
                                        sx={{ borderRadius: '14px', background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)', px: 4 }}
                                    >
                                        View Results
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </>
                )}

                {/* ── RESULTS TAB ── */}
                {tab === 1 && <ResultsTab responses={responses} />}
            </Box>

            <Snackbar open={snackbar} autoHideDuration={4000} onClose={() => setSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Survey submitted successfully! Thank you 🌱
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Survey;
