import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Paper, Radio, RadioGroup,
    FormControlLabel, TextField, Chip, LinearProgress,
    Divider, Alert,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as WrongIcon,
    EmojiEvents as TrophyIcon,
    Replay as RetryIcon,
    ArrowForward as NextIcon,
    Home as HomeIcon,
    Quiz as QuizIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';

// ─── Quiz Data (10 questions — easy, for elementary to college) ────────────────
const QUESTIONS = [
    {
        id: 1, type: 'mc',
        question: 'What does the first "S" in 5S stand for?',
        choices: ['Sort', 'Shine', 'Sustain', 'Standardize'],
        answer: 'Sort',
        hint: 'It means to remove unnecessary items from the workplace.',
    },
    {
        id: 2, type: 'fill',
        question: 'The second S in 5S stands for "Set in _____", which means organizing items so everything has a proper place.',
        answer: 'Order',
        hint: 'Think about keeping things tidy and arranged.',
    },
    {
        id: 3, type: 'id',
        question: 'What is the Japanese term for the 3rd S (Shine) in 5S?',
        answer: 'Seiso',
        hint: 'It starts with the letter S and means cleanliness.',
    },
    {
        id: 4, type: 'mc',
        question: 'Which colored bin should you use for leftover food and vegetable peels?',
        choices: ['Green bin', 'Blue bin', 'Black bin', 'Red bin'],
        answer: 'Green bin',
        hint: 'Biodegradable waste goes in the bin that represents nature.',
    },
    {
        id: 5, type: 'fill',
        question: 'The 5S+ system adds Safety and _____ to the original 5S framework.',
        answer: 'Environment',
        hint: 'It is related to protecting our surroundings and nature.',
    },
    {
        id: 6, type: 'mc',
        question: 'Which of these items should go in the BLUE (Recyclable) bin?',
        choices: ['Empty plastic bottles', 'Banana peels', 'Broken glass', 'Used syringes'],
        answer: 'Empty plastic bottles',
        hint: 'Recyclable means the item can be processed and reused.',
    },
    {
        id: 7, type: 'id',
        question: 'In 5S, what do you call the practice of following rules and maintaining good habits long-term — the 5th S?',
        answer: 'Sustain',
        hint: 'It is also called Shitsuke in Japanese and is the last S.',
    },
    {
        id: 8, type: 'mc',
        question: 'What does the "Standardize" step in 5S help us do?',
        choices: [
            'Create rules so everyone keeps the workplace organized the same way',
            'Throw away old equipment',
            'Add more storage shelves',
            'Buy new cleaning supplies',
        ],
        answer: 'Create rules so everyone keeps the workplace organized the same way',
        hint: 'Think about consistency and having the same procedures for everyone.',
    },
    {
        id: 9, type: 'fill',
        question: 'Waste that can cause harm to people and the environment, like old batteries or chemicals, is called _____ waste.',
        answer: 'Hazardous',
        hint: 'This type of waste has a warning symbol ⚠️.',
    },
    {
        id: 10, type: 'mc',
        question: 'Why is proper waste segregation important in school?',
        choices: [
            'It keeps the school clean, safe, and eco-friendly',
            "It makes the janitor's job harder",
            'It is only required by law',
            'It does not matter as long as trash is disposed',
        ],
        answer: 'It keeps the school clean, safe, and eco-friendly',
        hint: 'Think about the benefits for everyone in the school community.',
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalize = str => str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

const getScore = (answers) =>
    QUESTIONS.reduce((acc, q) => {
        const given = answers[q.id] || '';
        return acc + (normalize(given) === normalize(q.answer) ? 1 : 0);
    }, 0);

const getGrade = (score) => {
    if (score === 10) return { label: 'Perfect! 🏆', color: '#e8b84b' };
    if (score >= 8) return { label: 'Excellent! 🌟', color: '#43a047' };
    if (score >= 6) return { label: 'Good Job! 👍', color: '#0288d1' };
    if (score >= 4) return { label: 'Keep Trying! 💪', color: '#fb8c00' };
    return { label: 'Study More! 📚', color: '#e53935' };
};

const typeLabel = { mc: 'Multiple Choice', fill: 'Fill in the Blank', id: 'Identification' };
const typeColor = { mc: '#7b1113', fill: '#e8b84b', id: '#0288d1' };

// ─── QuizPage ─────────────────────────────────────────────────────────────────
const QuizPage = () => {
    const navigate = useNavigate();
    const pt = usePageTheme();
    const { darkMode } = pt;

    const [current, setCurrent] = useState(0);   // question index
    const [answers, setAnswers] = useState({});   // { [q.id]: string }
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [inputVal, setInputVal] = useState('');

    const q = QUESTIONS[current];
    const progress = ((current + (submitted ? 1 : 0)) / QUESTIONS.length) * 100;
    const isLast = current === QUESTIONS.length - 1;

    // Reset input when question changes
    useEffect(() => {
        setInputVal(answers[q.id] || '');
        setSubmitted(false);
    }, [current]);

    const handleAnswer = (val) => setInputVal(val);

    const handleSubmitAnswer = () => {
        if (!inputVal.trim()) return;
        setAnswers(prev => ({ ...prev, [q.id]: inputVal.trim() }));
        setSubmitted(true);
    };

    const handleNext = () => {
        if (isLast) {
            setShowResult(true);
        } else {
            setCurrent(c => c + 1);
        }
    };

    const handleRetry = () => {
        setCurrent(0);
        setAnswers({});
        setSubmitted(false);
        setShowResult(false);
        setInputVal('');
    };

    const score = getScore(answers);
    const grade = getGrade(score);

    const isCorrect = submitted && normalize(answers[q.id] || '') === normalize(q.answer);

    // ── RESULT SCREEN ─────────────────────────────────────────────────────────
    if (showResult) {
        return (
            <Box sx={{ minHeight: '100vh', background: pt.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 6 }}>
                <Paper elevation={0} sx={{
                    maxWidth: 560, width: '100%', p: 5, borderRadius: '28px', textAlign: 'center',
                    background: pt.paperBg, backdropFilter: pt.paperBackdropFilter,
                    border: pt.paperBorder, boxShadow: pt.paperShadow,
                }}>
                    <TrophyIcon sx={{ fontSize: 80, color: grade.color, mb: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 900, color: grade.color, mb: 1 }}>
                        {grade.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', color: pt.bodyTextColor, mb: 1 }}>
                        You scored
                    </Typography>
                    <Typography sx={{ fontSize: '4rem', fontWeight: 900, background: pt.titleGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, mb: 1 }}>
                        {score}/{QUESTIONS.length}
                    </Typography>
                    <LinearProgress
                        variant="determinate" value={(score / QUESTIONS.length) * 100}
                        sx={{
                            height: 12, borderRadius: 6, mb: 3,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : '#fce4ec',
                            '& .MuiLinearProgress-bar': { bgcolor: grade.color, borderRadius: 6 },
                        }}
                    />

                    {/* Per-question review */}
                    <Box sx={{ textAlign: 'left', mb: 4, maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                        {QUESTIONS.map((ques, i) => {
                            const given = answers[ques.id] || '—';
                            const correct = normalize(given) === normalize(ques.answer);
                            return (
                                <Box key={ques.id} sx={{
                                    display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start',
                                    p: 1.5, borderRadius: '12px',
                                    bgcolor: correct
                                        ? (darkMode ? 'rgba(67,160,71,0.12)' : '#f1f8e9')
                                        : (darkMode ? 'rgba(229,57,53,0.12)' : '#fff3f3'),
                                    border: `1px solid ${correct ? (darkMode ? 'rgba(67,160,71,0.3)' : '#c8e6c9') : (darkMode ? 'rgba(229,57,53,0.3)' : '#ffcdd2')}`,
                                }}>
                                    {correct ? <CheckIcon sx={{ color: '#43a047', mt: 0.2, flexShrink: 0 }} /> : <WrongIcon sx={{ color: '#e53935', mt: 0.2, flexShrink: 0 }} />}
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: pt.bodyTextColor }}>
                                            Q{i + 1}: {ques.question.length > 60 ? ques.question.slice(0, 60) + '…' : ques.question}
                                        </Typography>
                                        {!correct && (
                                            <Typography sx={{ fontSize: '0.78rem', color: '#43a047', mt: 0.3 }}>
                                                ✓ Answer: <b>{ques.answer}</b>
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            startIcon={<RetryIcon />} variant="outlined"
                            onClick={handleRetry}
                            sx={{ borderRadius: '14px', borderColor: '#7b1113', color: '#7b1113', fontWeight: 700, px: 3 }}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/5s-system/awareness')}
                            sx={{
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                fontWeight: 700, px: 3,
                            }}
                        >
                            Back to Awareness
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    // ── QUESTION SCREEN ───────────────────────────────────────────────────────
    return (
        <Box sx={{ minHeight: '100vh', background: pt.pageBg, px: { xs: 2, md: 4 }, py: 6 }}>
            <Box sx={{ maxWidth: 680, mx: 'auto' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <QuizIcon sx={{ fontSize: 36, color: '#e8b84b' }} />
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 900,
                            background: pt.titleGradient,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            5S+ Knowledge Quiz
                        </Typography>
                        <Typography sx={{ color: pt.subtitleColor, fontSize: '0.9rem' }}>
                            Test your knowledge on 5S+ and waste management!
                        </Typography>
                    </Box>
                </Box>

                {/* Progress bar */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                        <Typography sx={{ fontSize: '0.82rem', color: pt.secondaryTextColor, fontWeight: 600 }}>
                            Question {current + 1} of {QUESTIONS.length}
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#e8b84b', fontWeight: 700 }}>
                            {Object.keys(answers).length} answered
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate" value={progress}
                        sx={{
                            height: 8, borderRadius: 4,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : '#fce4ec',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #7b1113 0%, #e8b84b 100%)',
                                borderRadius: 4,
                            },
                        }}
                    />
                </Box>

                {/* Question card */}
                <Paper elevation={0} sx={{
                    p: { xs: 3, md: 4 }, borderRadius: '24px',
                    background: pt.paperBg, backdropFilter: pt.paperBackdropFilter,
                    border: pt.paperBorder, boxShadow: pt.paperShadow,
                    position: 'relative', overflow: 'hidden',
                    '&::before': {
                        content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                        height: 4, background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)',
                    },
                }}>
                    {/* Type badge */}
                    <Chip
                        label={typeLabel[q.type]}
                        size="small"
                        sx={{ bgcolor: `${typeColor[q.type]}20`, color: typeColor[q.type], fontWeight: 700, mb: 2, fontSize: '0.75rem' }}
                    />

                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: pt.sectionTitleColor, mb: 3, lineHeight: 1.6 }}>
                        {q.question}
                    </Typography>

                    {/* ── Multiple choice ── */}
                    {q.type === 'mc' && (
                        <RadioGroup value={inputVal} onChange={e => handleAnswer(e.target.value)}>
                            {q.choices.map((choice) => {
                                let borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0';
                                let bgColor = 'transparent';
                                if (submitted) {
                                    if (choice === q.answer) { borderColor = '#43a047'; bgColor = darkMode ? 'rgba(67,160,71,0.12)' : '#f1f8e9'; }
                                    else if (choice === inputVal) { borderColor = '#e53935'; bgColor = darkMode ? 'rgba(229,57,53,0.12)' : '#fff3f3'; }
                                } else if (choice === inputVal) {
                                    borderColor = '#7b1113';
                                }
                                return (
                                    <FormControlLabel
                                        key={choice} value={choice}
                                        disabled={submitted}
                                        control={
                                            <Radio sx={{ '&.Mui-checked': { color: '#7b1113' }, color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }} />
                                        }
                                        label={<Typography sx={{ color: pt.bodyTextColor, fontWeight: choice === inputVal ? 700 : 400 }}>{choice}</Typography>}
                                        sx={{
                                            m: 0, mb: 1, p: 1.5, borderRadius: '12px',
                                            border: `1.5px solid ${borderColor}`,
                                            bgcolor: bgColor,
                                            transition: 'all 0.2s ease',
                                        }}
                                    />
                                );
                            })}
                        </RadioGroup>
                    )}

                    {/* ── Fill in the Blank / Identification ── */}
                    {(q.type === 'fill' || q.type === 'id') && (
                        <TextField
                            fullWidth
                            placeholder={q.type === 'fill' ? 'Type your answer here…' : 'Identify the term…'}
                            value={inputVal}
                            onChange={e => handleAnswer(e.target.value)}
                            disabled={submitted}
                            onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmitAnswer()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    color: pt.bodyTextColor,
                                    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'white',
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
                                },
                                '& .MuiInputBase-input': { color: pt.bodyTextColor },
                            }}
                        />
                    )}

                    {/* Feedback after submit */}
                    {submitted && (
                        <Alert
                            severity={isCorrect ? 'success' : 'error'}
                            icon={isCorrect ? <CheckIcon /> : <WrongIcon />}
                            sx={{ mt: 2, borderRadius: '12px' }}
                        >
                            {isCorrect
                                ? `Correct! 🎉 Great job!`
                                : `Not quite. The correct answer is: "${q.answer}" — ${q.hint}`
                            }
                        </Alert>
                    )}
                </Paper>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/5s-system/awareness')}
                        startIcon={<HomeIcon />}
                        sx={{ borderRadius: '14px', borderColor: darkMode ? 'rgba(255,255,255,0.2)' : '#e0e0e0', color: pt.secondaryTextColor, fontWeight: 600 }}
                    >
                        Exit Quiz
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!submitted ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmitAnswer}
                                disabled={!inputVal.trim()}
                                sx={{
                                    borderRadius: '14px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #e8b84b 0%, #c9a84c 100%)',
                                    color: '#3e0a0b', px: 4,
                                    '&:hover': { background: 'linear-gradient(135deg, #c9a84c 0%, #a88a3a 100%)' },
                                }}
                            >
                                Submit Answer
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<NextIcon />}
                                sx={{
                                    borderRadius: '14px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                    color: 'white', px: 4,
                                    '&:hover': { background: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)' },
                                }}
                            >
                                {isLast ? 'See Results' : 'Next Question'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default QuizPage;
