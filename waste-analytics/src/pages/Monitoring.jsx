import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Grid, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';
import {
    Analytics as AnalyticsIcon,
    TrendingUp as TrendingUpIcon,
    Delete as WasteIcon,
    Business as OfficeIcon,
    CalendarToday as CalendarIcon,
    EmojiNature as EcoIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import { getTransactions } from '../data/dataStore';
import { format, parseISO, sub } from 'date-fns';

// ── Palette ───────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
    Biodegradable: '#4caf50',
    Recyclable:    '#2196f3',
    Residual:      '#9c27b0',
    Hazardous:     '#f44336',
    Special:       '#ff9800',
};

const CHART_GOLD   = '#e8b84b';
const CHART_MAROON = '#a01518';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => Number(n.toFixed(2));

const buildCategoryTotals = (rows) => {
    const map = {};
    rows.forEach(({ category, weight }) => { map[category] = (map[category] || 0) + (weight || 0); });
    return Object.entries(map)
        .map(([name, value]) => ({ name, value: fmt(value) }))
        .sort((a, b) => b.value - a.value);
};

const buildMonthlyTrend = (rows, months = 12) => {
    const map = {};
    for (let i = months - 1; i >= 0; i--) {
        const d = sub(new Date(), { months: i });
        const key = format(d, 'yyyy-MM');
        map[key] = {
            month: format(d, 'MMM yy'), total: 0,
            ...Object.fromEntries(Object.keys(CATEGORY_COLORS).map(c => [c, 0])),
        };
    }
    rows.forEach(({ date, category, weight }) => {
        if (!date) return;
        const key = date.slice(0, 7);
        if (!map[key]) return;
        map[key].total = fmt(map[key].total + (weight || 0));
        if (CATEGORY_COLORS[category]) map[key][category] = fmt((map[key][category] || 0) + (weight || 0));
    });
    return Object.values(map);
};

const buildWeeklyAvg = (rows) => {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    const totals = Array(7).fill(0);
    rows.forEach(({ date, weight }) => {
        if (!date) return;
        const dow = parseISO(date).getDay();
        counts[dow]++;
        totals[dow] += weight || 0;
    });
    return counts.map((c, i) => ({ day: labels[i], avg: c > 0 ? fmt(totals[i] / c) : 0 }));
};

const buildCategoryByMonth = (rows) =>
    buildMonthlyTrend(rows, 6).map(m => ({
        month: m.month,
        ...Object.fromEntries(Object.keys(CATEGORY_COLORS).map(c => [c, m[c] || 0])),
    }));

// ── Custom tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, darkMode }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box sx={{
            background: darkMode ? '#1e1e2e' : 'white',
            border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px', p: 1.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)', minWidth: 160,
        }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', mb: 0.5, color: darkMode ? 'white' : '#1a1a2e' }}>{label}</Typography>
            {payload.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: p.color || p.fill, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {p.name}: <strong>{p.value} kg</strong>
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

// ── KPI stat card ─────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, unit, color, darkMode }) => (
    <Paper elevation={0} sx={{
        p: 2.5, borderRadius: '18px', height: '100%',
        background: darkMode ? 'rgba(255,255,255,0.04)' : 'white',
        border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', gap: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 28px rgba(0,0,0,0.1)',
        },
    }}>
        <Box sx={{
            width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
            background: `${color}20`, border: `1.5px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Icon sx={{ color, fontSize: 26 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1.15, color: darkMode ? 'white' : '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
                {unit && <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary', ml: 0.5 }}>{unit}</Typography>}
            </Typography>
        </Box>
    </Paper>
);

// ── Chart card ────────────────────────────────────────────────────────────────

const ChartCard = ({ title, subtitle, children, darkMode }) => (
    <Paper elevation={0} sx={{
        p: { xs: 2.5, md: 3.5 }, borderRadius: '20px',
        background: darkMode ? 'rgba(255,255,255,0.04)' : 'white',
        border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)',
        },
    }}>
        <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: darkMode ? 'white' : '#1a1a2e' }}>{title}</Typography>
            {subtitle && (
                <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mt: 0.4 }}>{subtitle}</Typography>
            )}
        </Box>
        {children}
    </Paper>
);

// ── Main ──────────────────────────────────────────────────────────────────────

// Every chart uses this height — large enough to read comfortably
const CHART_H = 440;

const Monitoring = () => {
    const [rows, setRows]   = useState([]);
    const [range, setRange] = useState('12');
    const pt = usePageTheme();
    const { darkMode } = pt;

    useEffect(() => { setRows(getTransactions()); }, []);

    const filtered = useMemo(() => {
        if (range === 'all') return rows;
        const cutoff = format(sub(new Date(), { months: Number(range) }), 'yyyy-MM-dd');
        return rows.filter(r => (r.date || '') >= cutoff);
    }, [rows, range]);

    const nMonths = range === 'all' ? 24 : Number(range);

    const categoryTotals = useMemo(() => buildCategoryTotals(filtered), [filtered]);
    const monthlyTrend   = useMemo(() => buildMonthlyTrend(filtered, nMonths), [filtered, nMonths]);
    const weeklyAvg      = useMemo(() => buildWeeklyAvg(filtered), [filtered]);
    const catByMonth     = useMemo(() => buildCategoryByMonth(filtered), [filtered]);

    const totalWeight   = useMemo(() => fmt(filtered.reduce((s, r) => s + (r.weight || 0), 0)), [filtered]);
    const totalEntries  = filtered.length;
    const topCategory   = categoryTotals[0]?.name ?? '—';
    const topOffice     = useMemo(() => {
        const map = {};
        filtered.forEach(r => { map[r.officeName] = (map[r.officeName] || 0) + (r.weight || 0); });
        return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    }, [filtered]);
    const avgPerEntry   = totalEntries > 0 ? fmt(totalWeight / totalEntries) : 0;
    const uniqueOffices = new Set(filtered.map(r => r.officeName)).size;

    const axisColor = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    const gridColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 }, background: pt.pageBg, minHeight: '100vh', position: 'relative',
            '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: pt.pageBeforeBg, zIndex: 0 },
        }}>
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1400px', mx: 'auto' }}>

                {/* ── Header ── */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Box>
                        <Typography variant="h2" sx={{
                            fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' },
                            background: pt.titleGradient, WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1.5px',
                        }}>
                            Waste Monitoring
                        </Typography>
                        <Typography sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                            In-depth analytics and trends — unique insights beyond the Dashboard overview.
                        </Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 170 }}>
                        <InputLabel sx={{ fontSize: '0.88rem' }}>Time Range</InputLabel>
                        <Select value={range} label="Time Range" onChange={e => setRange(e.target.value)}
                            sx={{ borderRadius: '12px', fontSize: '0.88rem' }}>
                            <MenuItem value="3">Last 3 months</MenuItem>
                            <MenuItem value="6">Last 6 months</MenuItem>
                            <MenuItem value="12">Last 12 months</MenuItem>
                            <MenuItem value="all">All time</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* ── KPI Cards ── */}
                <Grid
                    container spacing={2.5} sx={{ mb: 5 }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                    {[
                        { icon: WasteIcon,      label: 'Total Waste Collected', value: totalWeight.toLocaleString(), unit: 'kg',  color: CHART_MAROON },
                        { icon: TrendingUpIcon, label: 'Total Entries',          value: totalEntries.toLocaleString(), unit: null, color: '#2196f3'    },
                        { icon: OfficeIcon,     label: 'Active Offices',          value: uniqueOffices,               unit: null,  color: '#9c27b0'    },
                        { icon: CalendarIcon,   label: 'Avg. Weight / Entry',     value: avgPerEntry,                 unit: 'kg',  color: '#ff9800'    },
                        { icon: EcoIcon,        label: 'Top Waste Category',      value: topCategory,                 unit: null,  color: '#4caf50'    },
                        { icon: AnalyticsIcon,  label: 'Top Waste Office',        value: topOffice,                   unit: null,  color: CHART_GOLD   },
                    ].map((s, i) => (
                        <Grid key={i} item xs={12} sm={6} md={4}>
                            <StatCard {...s} darkMode={darkMode} />
                        </Grid>
                    ))}
                </Grid>

                {/* ── Chart 1: Monthly Waste Trend — full width ── */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    sx={{ mb: 4 }}
                >
                    <ChartCard
                        title="Monthly Waste Trend"
                        subtitle={`Total kg collected per month — last ${nMonths} months`}
                        darkMode={darkMode}
                    >
                        <ResponsiveContainer width="100%" height={CHART_H}>
                            <AreaChart data={monthlyTrend} margin={{ top: 12, right: 28, left: 12, bottom: 8 }}>
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor={CHART_MAROON} stopOpacity={0.38} />
                                        <stop offset="95%" stopColor={CHART_MAROON} stopOpacity={0.03} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 13 }} tickMargin={8} />
                                <YAxis tick={{ fill: axisColor, fontSize: 13 }} unit=" kg" width={80} />
                                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                                <Area type="monotone" dataKey="total" name="Total" stroke={CHART_MAROON}
                                    fill="url(#areaGrad)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

                {/* ── Chart 2: Category Breakdown by Month (stacked bar) — full width ── */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    sx={{ mb: 4 }}
                >
                    <ChartCard
                        title="Category Breakdown by Month"
                        subtitle="Last 6 months — kg per waste type, stacked"
                        darkMode={darkMode}
                    >
                        <ResponsiveContainer width="100%" height={CHART_H}>
                            <BarChart data={catByMonth} margin={{ top: 12, right: 28, left: 12, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 13 }} tickMargin={8} />
                                <YAxis tick={{ fill: axisColor, fontSize: 13 }} unit=" kg" width={80} />
                                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                                <Legend iconType="circle" iconSize={12} wrapperStyle={{ fontSize: 14, paddingTop: 16 }} />
                                {Object.entries(CATEGORY_COLORS).map(([cat, color], i, arr) => (
                                    <Bar key={cat} dataKey={cat} name={cat} stackId="a" fill={color}
                                        radius={i === arr.length - 1 ? [5, 5, 0, 0] : [0, 0, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

                {/* ── Chart 3: Category Trends (multi-line) — full width ── */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    sx={{ mb: 4 }}
                >
                    <ChartCard
                        title="Category Trends Over Time"
                        subtitle="Monthly kg per waste type — one line per category"
                        darkMode={darkMode}
                    >
                        <ResponsiveContainer width="100%" height={CHART_H}>
                            <LineChart data={monthlyTrend} margin={{ top: 12, right: 28, left: 12, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 13 }} tickMargin={8} />
                                <YAxis tick={{ fill: axisColor, fontSize: 13 }} unit=" kg" width={80} />
                                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                                <Legend iconType="circle" iconSize={12} wrapperStyle={{ fontSize: 14, paddingTop: 16 }} />
                                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                                    <Line key={cat} type="monotone" dataKey={cat} stroke={color}
                                        strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

                {/* ── Chart 4: Avg. by Day of Week — full width ── */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    sx={{ mb: 2 }}
                >
                    <ChartCard
                        title="Average Waste by Day of Week"
                        subtitle="Average kg collected per day — shows which weekdays generate the most waste"
                        darkMode={darkMode}
                    >
                        <ResponsiveContainer width="100%" height={CHART_H}>
                            <BarChart data={weeklyAvg} margin={{ top: 28, right: 28, left: 12, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 14 }} tickMargin={10} />
                                <YAxis tick={{ fill: axisColor, fontSize: 13 }} unit=" kg" width={80} />
                                <Tooltip formatter={(v) => [`${v} kg`, 'Avg. weight']} />
                                <Bar dataKey="avg" name="Avg. kg" fill={CHART_GOLD} radius={[10, 10, 0, 0]} maxBarSize={90}>
                                    <LabelList
                                        dataKey="avg"
                                        position="top"
                                        style={{ fontSize: 13, fill: axisColor, fontWeight: 700 }}
                                        formatter={(v) => `${v} kg`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

            </Box>
        </Box>
    );
};

export default Monitoring;
