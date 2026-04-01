import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Typography, IconButton, TextField, Paper, InputAdornment,
    CircularProgress, Fade, Tooltip,
} from '@mui/material';
import {
    SmartToy as BotIcon,
    Close as CloseIcon,
    Send as SendIcon,
    DeleteOutline as ClearIcon,
    AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { getTransactions } from '../data/dataStore';
import { format } from 'date-fns';

// ── Config ────────────────────────────────────────────────────────────────────
const SEALION_KEY = import.meta.env.VITE_SEALION_API_KEY ?? '';
const SEALION_URL = 'https://api.sea-lion.ai/v1/chat/completions';
const MODEL       = 'aisingapore/Gemma-SEA-LION-v4-27B-IT';

// ── Live data context ─────────────────────────────────────────────────────────
const buildDataContext = () => {
    try {
        const rows = getTransactions();
        if (!rows.length) return 'No waste data recorded yet.';
        const total = rows.reduce((s, r) => s + (r.weight || 0), 0).toFixed(1);
        const catMap = {}, offMap = {};
        rows.forEach(r => {
            catMap[r.category]   = (catMap[r.category]   || 0) + (r.weight || 0);
            offMap[r.officeName] = (offMap[r.officeName] || 0) + (r.weight || 0);
        });
        const topCat    = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
        const topOffice = Object.entries(offMap).sort((a, b) => b[1] - a[1])[0];
        const thisMonth = format(new Date(), 'yyyy-MM');
        const monthKg   = rows.filter(r => r.date?.startsWith(thisMonth)).reduce((s, r) => s + (r.weight || 0), 0).toFixed(1);
        return `Total: ${total} kg (${rows.length} entries) | This month: ${monthKg} kg | Top category: ${topCat?.[0] ?? 'N/A'} | Top office: ${topOffice?.[0] ?? 'N/A'} | Offices tracked: ${Object.keys(offMap).length}`;
    } catch {
        return 'No waste data available.';
    }
};

const buildSystemMsg = () => ({
    role: 'system',
    content: `You are EcoBot, the AI waste management assistant for CIT-U's 5S+ Waste Monitoring System (Cebu Institute of Technology – University, Philippines). Help with: proper waste disposal, 5S methodology, RA 9003 and RA 6969 compliance, and waste data interpretation. Be concise and friendly. Use bullet points for lists.\n\nLive data summary: ${buildDataContext()}`,
});

// ── Typing dots ───────────────────────────────────────────────────────────────
const TypingDots = () => (
    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', py: 0.5 }}>
        {[0, 1, 2].map(i => (
            <Box key={i} sx={{
                width: 7, height: 7, borderRadius: '50%', bgcolor: '#e8b84b', opacity: 0.8,
                animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s`,
                '@keyframes bounce': {
                    '0%,80%,100%': { transform: 'scale(0.7)', opacity: 0.5 },
                    '40%': { transform: 'scale(1.1)', opacity: 1 },
                },
            }} />
        ))}
    </Box>
);

// ── Lightweight markdown renderer ────────────────────────────────────────────
const renderMarkdown = (text) => {
    return text.split('\n').map((line, li) => {
        // Bullet point
        const isBullet = /^[-*]\s/.test(line);
        const content  = isBullet ? line.replace(/^[-*]\s/, '') : line;

        // Inline bold/italic parsing
        const parts = [];
        const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
        let last = 0, match;
        while ((match = regex.exec(content)) !== null) {
            if (match.index > last) parts.push(content.slice(last, match.index));
            if (match[1] !== undefined) parts.push(<strong key={match.index}>{match[1]}</strong>);
            else if (match[2] !== undefined) parts.push(<em key={match.index}>{match[2]}</em>);
            last = match.index + match[0].length;
        }
        if (last < content.length) parts.push(content.slice(last));

        return (
            <Box key={li} component={isBullet ? 'div' : 'div'}
                sx={{ display: 'flex', gap: isBullet ? '6px' : 0, mb: line === '' ? 0.6 : 0.1 }}>
                {isBullet && <Box component="span" sx={{ color: '#e8b84b', flexShrink: 0, fontWeight: 700 }}>•</Box>}
                <Box component="span">{parts.length ? parts : content}</Box>
            </Box>
        );
    });
};

// ── Message bubble ────────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
    const isBot = msg.role !== 'user';
    return (
        <Box sx={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', mb: 1.5 }}>
            {isBot && (
                <Box sx={{ width: 30, height: 30, borderRadius: '50%', mr: 1, flexShrink: 0, background: 'linear-gradient(135deg,#a01518,#e8b84b)', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                    <BotIcon sx={{ fontSize: 16, color: 'white' }} />
                </Box>
            )}
            <Box sx={{
                maxWidth: '80%',
                background: isBot ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#a01518 0%,#7b1113 100%)',
                color: 'white', borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                px: 1.8, py: 1.2, fontSize: '0.85rem', lineHeight: 1.65,
                boxShadow: isBot ? 'none' : '0 4px 14px rgba(160,21,24,0.4)',
                border: isBot ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
                {msg.typing ? <TypingDots /> : (isBot ? renderMarkdown(msg.content) : msg.content)}
            </Box>
        </Box>
    );
};

// ── Suggested prompts ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
    'What does the waste data tell us?',
    'How to improve our recycling rate?',
    'Tips to reduce residual waste',
    'What is RA 9003?',
    'Which office needs improvement?',
];

const GREETING = {
    role: 'bot',
    content: `Hi! I'm EcoBot 🌱, your CIT-U waste management assistant.\n\nAsk me about waste disposal, your current data trends, 5S tips, or environmental compliance!`,
};

// ── Main component ────────────────────────────────────────────────────────────
const AIChatbot = () => {
    const [open, setOpen]         = useState(false);
    const [input, setInput]       = useState('');
    const [messages, setMessages] = useState([GREETING]);
    const [loading, setLoading]   = useState(false);
    const [history, setHistory]   = useState([]); // [{role:'user'|'assistant', content:'...'}]
    const bottomRef               = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const sendMessage = async (text) => {
        const userText = (text || input).trim();
        if (!userText) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setLoading(true);
        setMessages(prev => [...prev, { role: 'bot', typing: true, id: 'typing' }]);

        try {
            if (!SEALION_KEY) throw new Error('NO_KEY');

            const res = await fetch(SEALION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SEALION_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        buildSystemMsg(),
                        ...history.slice(-10),
                        { role: 'user', content: userText },
                    ],
                    temperature: 0.7,
                    max_completion_tokens: 500,
                }),
            });

            if (!res.ok) {
                if (res.status === 429) throw new Error('RATE_LIMIT');
                throw new Error(`API error: ${res.status}`);
            }

            const data  = await res.json();
            const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';

            setHistory(prev => [
                ...prev,
                { role: 'user',      content: userText },
                { role: 'assistant', content: reply    },
            ]);
            setMessages(prev => prev.filter(m => m.id !== 'typing').concat({ role: 'bot', content: reply }));

        } catch (err) {
            const fallback =
                err.message === 'NO_KEY'
                    ? `⚠️ Sea-Lion API key not set.\n\n1. Get a free key at sea-lion.ai\n2. Add VITE_SEALION_API_KEY=your_key to your .env file\n3. Restart the dev server`
                : err.message === 'RATE_LIMIT'
                    ? `⏳ Rate limit reached — please wait a moment and try again.`
                    : `Sorry, I couldn't reach the AI. (${err.message})`;
            setMessages(prev => prev.filter(m => m.id !== 'typing').concat({ role: 'bot', content: fallback }));
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => { setMessages([GREETING]); setHistory([]); };

    return (
        <>
            {/* Floating button */}
            <Fade in={!open}>
                <Box sx={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1300 }}>
                    <Tooltip title="Ask EcoBot" placement="left">
                        <Box onClick={() => setOpen(true)} sx={{
                            width: 60, height: 60, borderRadius: '50%', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #a01518 0%, #e8b84b 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 24px rgba(160,21,24,0.5)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)', boxShadow: '0 10px 32px rgba(160,21,24,0.6)' },
                            animation: 'pulse 3s infinite',
                            '@keyframes pulse': {
                                '0%,100%': { boxShadow: '0 6px 24px rgba(160,21,24,0.5)' },
                                '50%':     { boxShadow: '0 6px 32px rgba(232,184,75,0.6)' },
                            },
                        }}>
                            <BotIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                    </Tooltip>
                </Box>
            </Fade>

            {/* Chat panel */}
            <Fade in={open}>
                <Paper elevation={0} sx={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 1300,
                    width: { xs: 'calc(100vw - 32px)', sm: 380 }, height: 540,
                    borderRadius: '24px', background: 'rgba(18,8,8,0.96)',
                    backdropFilter: 'blur(24px)', border: '1px solid rgba(232,184,75,0.25)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    {/* Header */}
                    <Box sx={{ px: 2.5, py: 1.8, background: 'linear-gradient(135deg,#7b1113 0%,#a01518 100%)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BotIcon sx={{ color: '#e8b84b', fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', lineHeight: 1.2 }}>EcoBot</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4caf50' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>AI Waste Assistant · Online</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={clearChat} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#e8b84b' } }}>
                                <ClearIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                        flex: 1, overflowY: 'auto', px: 2, py: 1.5, display: 'flex', flexDirection: 'column',
                        '&::-webkit-scrollbar': { width: 4 },
                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
                    }}>
                        {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

                        {messages.length === 1 && (
                            <Box sx={{ mt: 1 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', mb: 1 }}>Try asking:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                    {SUGGESTIONS.map((s, i) => (
                                        <Box key={i} onClick={() => sendMessage(s)} sx={{
                                            px: 1.4, py: 0.6, borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem',
                                            bgcolor: 'rgba(232,184,75,0.1)', color: '#e8b84b',
                                            border: '1px solid rgba(232,184,75,0.25)',
                                            transition: 'all 0.15s ease',
                                            '&:hover': { bgcolor: 'rgba(232,184,75,0.2)', borderColor: '#e8b84b' },
                                        }}>
                                            {s}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                        <div ref={bottomRef} />
                    </Box>

                    {/* Powered by */}
                    <Box sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <SparkleIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>Powered by Sea-Lion · AI Singapore</Typography>
                    </Box>

                    {/* Input */}
                    <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
                        <TextField
                            fullWidth size="small"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && sendMessage()}
                            placeholder="Ask about waste management…"
                            disabled={loading} multiline maxRows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '16px', fontSize: '0.85rem',
                                    bgcolor: 'rgba(255,255,255,0.07)', color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                                    '&:hover fieldset': { borderColor: 'rgba(232,184,75,0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: '#e8b84b' },
                                },
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => sendMessage()}
                                            disabled={!input.trim() || loading}
                                            size="small"
                                            sx={{
                                                width: 32, height: 32, borderRadius: '10px', color: 'white',
                                                background: input.trim() && !loading ? 'linear-gradient(135deg,#a01518,#e8b84b)' : 'rgba(255,255,255,0.08)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': { transform: 'scale(1.05)' },
                                            }}
                                        >
                                            {loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SendIcon sx={{ fontSize: 14 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default AIChatbot;
