import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Chip, Divider,
} from '@mui/material';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import {
    TipsAndUpdates as InsightIcon,
    TrendingUp, TrendingDown, TrendingFlat,
    Warning as WarnIcon,
    CheckCircle as OkIcon,
    Business as OfficeIcon,
    Recycling as RecycleIcon,
    CalendarToday as CalIcon,
    EmojiObjects as BulbIcon,
    QueryStats as ForecastIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import { getTransactions } from '../data/dataStore';
import { format, sub, parseISO } from 'date-fns';

// ── Constants ─────────────────────────────────────────────────────────────────
const MAROON = '#a01518';
const GOLD   = '#e8b84b';

// ── Maths ─────────────────────────────────────────────────────────────────────
const fmt = (n) => Number(Number(n).toFixed(2));

const linReg = (pts) => {
    const n = pts.length;
    if (n < 2) return { slope: 0, intercept: pts[0]?.y ?? 0 };
    const sX = pts.reduce((s,p) => s+p.x, 0), sY = pts.reduce((s,p) => s+p.y, 0);
    const sXY = pts.reduce((s,p) => s+p.x*p.y, 0), sX2 = pts.reduce((s,p) => s+p.x*p.x, 0);
    const slope = (n*sXY - sX*sY) / (n*sX2 - sX*sX);
    return { slope, intercept: (sY - slope*sX)/n };
};

const buildMonthly = (rows, months) => {
    const map = {};
    for (let i = months-1; i >= 0; i--) {
        const key = format(sub(new Date(), { months: i }), 'yyyy-MM');
        map[key] = 0;
    }
    rows.forEach(({ date, weight }) => {
        const key = date?.slice(0,7);
        if (key in map) map[key] = fmt(map[key] + (weight||0));
    });
    return map;
};

const buildForecast = (monthlyMap, future = 6) => {
    const entries = Object.entries(monthlyMap);
    const pts = entries.map(([,y],x) => ({ x, y }));
    const { slope, intercept } = linReg(pts);
    const n = entries.length;
    const hist = entries.map(([key, actual]) => ({
        label: format(new Date(key+'-01'), 'MMM yy'), actual, forecast: null,
    }));
    const last = new Date(entries[entries.length-1][0]+'-01');
    for (let i = 1; i <= future; i++) {
        const d = new Date(last);
        d.setMonth(d.getMonth()+i);
        hist.push({ label: format(d,'MMM yy'), actual: null, forecast: Math.max(0, fmt(intercept+slope*(n-1+i))) });
    }
    return hist;
};

const buildCatMap  = (rows) => { const m={}; rows.forEach(({category,weight}) => { m[category]=(m[category]||0)+(weight||0); }); return m; };
const buildOffMap  = (rows) => { const m={}; rows.forEach(({officeName,weight}) => { m[officeName]=(m[officeName]||0)+(weight||0); }); return m; };
const buildDow     = (rows) => {
    const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const c=Array(7).fill(0), t=Array(7).fill(0);
    rows.forEach(({date,weight}) => { if(!date) return; const d=parseISO(date).getDay(); c[d]++; t[d]+=weight||0; });
    return labels.map((l,i) => ({ day:l, avg: c[i]>0 ? fmt(t[i]/c[i]) : 0 }));
};

// ── Recommendation rules ──────────────────────────────────────────────────────
const makeRecs = (rows, monthlyMap) => {
    const recs = [];
    const months = Object.values(monthlyMap);
    const total  = rows.reduce((s,r)=>s+(r.weight||0), 0);
    if (!total || months.length < 2) return recs;

    const catMap = buildCatMap(rows);
    const offMap = buildOffMap(rows);
    const dow    = buildDow(rows);

    const { slope } = linReg(months.map((y,x)=>({x,y})));
    const pct = months[0]>0 ? (slope/months[0])*100 : 0;

    if (pct > 3)       recs.push({ type:'danger',  icon:TrendingUp,   title:'Waste Rising',           stat:`+${pct.toFixed(1)}%/mo`,   action:'Launch an awareness drive and stricter segregation audit across all offices.' });
    else if (pct < -3) recs.push({ type:'success', icon:TrendingDown, title:'Waste Declining',         stat:`${pct.toFixed(1)}%/mo`,   action:'Recognise top-performing offices and replicate their practices.' });
    else               recs.push({ type:'info',    icon:TrendingFlat, title:'Waste Volume Stable',     stat:'Flat trend',              action:'Introduce reduction targets or a waste-challenge programme to drive the trend down.' });

    const topOff = Object.entries(offMap).sort((a,b)=>b[1]-a[1])[0];
    if (topOff) {
        const p = ((topOff[1]/total)*100).toFixed(1);
        recs.push({ type: p>20?'danger':'warning', icon:OfficeIcon, title:`Top Producer: ${topOff[0]}`, stat:`${p}% of total waste`, action:'Schedule a targeted 5S audit and waste-reduction workshop for this office.' });
    }

    const recyclable = Object.entries(catMap).filter(([k])=>k.toLowerCase().includes('recyclable')).reduce((s,[,v])=>s+v,0);
    const rPct = ((recyclable/total)*100).toFixed(1);
    if (rPct < 20)      recs.push({ type:'danger',  icon:RecycleIcon, title:'Low Recycling Rate', stat:`${rPct}% recyclable`, action:'Install labelled recycling bins and run a short staff segregation training.' });
    else if (rPct > 40) recs.push({ type:'success', icon:RecycleIcon, title:'Great Recycling Rate', stat:`${rPct}% recyclable`, action:'Maintain by keeping bins labelled and recognising compliant offices quarterly.' });
    else                recs.push({ type:'warning', icon:RecycleIcon, title:'Recycling Could Improve', stat:`${rPct}% recyclable`, action:'Add collection points for paper, plastic, and metal in high-traffic areas.' });

    const haz = catMap['Hazardous / Special'] || 0;
    const hPct = ((haz/total)*100).toFixed(1);
    if (hPct > 5) recs.push({ type:'danger', icon:WarnIcon, title:'Elevated Hazardous Waste', stat:`${hPct}% of total`, action:'Verify RA 6969 compliance and coordinate with a licensed hazardous waste hauler.' });

    const bio = catMap['Biodegradable'] || 0;
    const bPct = ((bio/total)*100).toFixed(1);
    if (bPct > 25) recs.push({ type:'info', icon:BulbIcon, title:'Composting Opportunity', stat:`${bPct}% biodegradable`, action:'A campus composting programme could divert this from landfill and create organic fertiliser.' });

    const peak = [...dow].sort((a,b)=>b.avg-a.avg)[0];
    if (peak) recs.push({ type:'info', icon:CalIcon, title:`Peak Day: ${peak.day}days`, stat:`${peak.avg} kg avg`, action:'Ensure collection schedules and bin capacity account for this weekly spike.' });

    const avgOff = fmt(total/Object.keys(offMap).length);
    const highOff = Object.entries(offMap).filter(([,v])=>v>avgOff*1.5);
    if (highOff.length > 1) recs.push({ type:'warning', icon:OfficeIcon, title:`${highOff.length} Offices Above Average`, stat:`>${avgOff} kg each`, action:`${highOff.map(([n])=>n).join(', ')} — schedule focused waste audits.` });

    return recs.sort((a,b) => { const o={danger:0,warning:1,info:2,success:3}; return o[a.type]-o[b.type]; });
};

// ── Type styling ──────────────────────────────────────────────────────────────
const TYPE = {
    danger:  { border: '#f44336', bg: '#fff5f5', bgDark: 'rgba(244,67,54,0.08)',  chip: '#f44336', chipBg: '#fdecea',  chipBgDark: 'rgba(244,67,54,0.18)',  label: 'Action Required' },
    warning: { border: '#ff9800', bg: '#fffbf0', bgDark: 'rgba(255,152,0,0.08)',  chip: '#f57c00', chipBg: '#fff3e0',  chipBgDark: 'rgba(255,152,0,0.18)',  label: 'Attention'       },
    success: { border: '#4caf50', bg: '#f4fbf4', bgDark: 'rgba(76,175,80,0.08)',  chip: '#2e7d32', chipBg: '#e8f5e9',  chipBgDark: 'rgba(76,175,80,0.18)',  label: 'Well Done'       },
    info:    { border: '#2196f3', bg: '#f1f8ff', bgDark: 'rgba(33,150,243,0.08)', chip: '#1565c0', chipBg: '#e3f2fd',  chipBgDark: 'rgba(33,150,243,0.18)', label: 'Insight'         },
};

// ── Recommendation card ───────────────────────────────────────────────────────
const RecCard = ({ rec, darkMode }) => {
    const t   = TYPE[rec.type] || TYPE.info;
    const Icon = rec.icon;
    const textMain   = darkMode ? '#f0f0f0'          : '#1a1a1a';
    const textAction = darkMode ? 'rgba(240,240,240,0.7)' : '#444';

    return (
        <Paper elevation={0} sx={{
            display: 'flex', gap: 0, overflow: 'hidden', borderRadius: '16px',
            background: darkMode ? t.bgDark : t.bg,
            border: darkMode ? `1px solid ${t.border}30` : `1px solid ${t.border}25`,
            transition: 'transform 0.18s, box-shadow 0.18s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 24px ${t.border}25` },
        }}>
            {/* Left accent bar */}
            <Box sx={{ width: 5, flexShrink: 0, background: t.border, borderRadius: '16px 0 0 16px' }} />

            <Box sx={{ flex: 1, p: 2.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                {/* Icon */}
                <Box sx={{ width: 48, height: 48, borderRadius: '13px', flexShrink: 0, background: darkMode ? t.chipBgDark : `${t.border}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon sx={{ color: t.border, fontSize: 24 }} />
                </Box>

                {/* Text */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: textMain, lineHeight: 1.2 }}>
                            {rec.title}
                        </Typography>
                        <Chip label={rec.stat} size="small" sx={{ bgcolor: darkMode ? t.chipBgDark : t.chipBg, color: t.chip, fontWeight: 700, fontSize: '0.7rem', height: 20, border: `1px solid ${t.border}30` }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.82rem', color: textAction, lineHeight: 1.5 }}>
                        💡 {rec.action}
                    </Typography>
                </Box>

                {/* Label chip */}
                <Chip label={t.label} size="small" sx={{ flexShrink: 0, bgcolor: darkMode ? t.chipBgDark : t.chipBg, color: t.chip, fontWeight: 600, fontSize: '0.68rem', display: { xs: 'none', sm: 'flex' } }} />
            </Box>
        </Paper>
    );
};

// ── Chart tooltip ─────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label, darkMode }) => {
    if (!active || !payload?.length) return null;
    const bg    = darkMode ? '#1e1e2e' : '#fff';
    const color = darkMode ? '#f0f0f0' : '#1a1a1a';
    const sub   = darkMode ? 'rgba(240,240,240,0.6)' : '#555';
    return (
        <Box sx={{ background: bg, border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)', borderRadius:'12px', p:1.5, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', minWidth:140 }}>
            <Typography sx={{ fontWeight:700, fontSize:'0.83rem', mb:0.5, color }}>{label}</Typography>
            {payload.filter(p=>p.value!=null).map((p,i)=>(
                <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1, mb:0.2 }}>
                    <Box sx={{ width:9, height:9, borderRadius:'50%', bgcolor:p.color, flexShrink:0 }} />
                    <Typography sx={{ fontSize:'0.78rem', color:sub }}>{p.name}: <strong style={{color}}>{p.value} kg</strong></Typography>
                </Box>
            ))}
        </Box>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Insights = () => {
    const [rows, setRows] = useState([]);
    const pt = usePageTheme();
    const { darkMode } = pt;

    useEffect(() => { setRows(getTransactions()); }, []);

    const monthlyMap   = useMemo(() => buildMonthly(rows, 12), [rows]);
    const forecastData = useMemo(() => buildForecast(monthlyMap, 6), [monthlyMap]);
    const recs         = useMemo(() => makeRecs(rows, monthlyMap), [rows, monthlyMap]);

    const forecastNext = forecastData.find(d => d.forecast !== null);
    const forecastVal  = forecastNext?.forecast ?? 0;

    const byType = (t) => recs.filter(r => r.type === t).length;
    const pillars = [
        { label: `${byType('danger')} Action Required`, color: '#f44336', bg: '#fdecea', bgD: 'rgba(244,67,54,0.15)' },
        { label: `${byType('warning')} Watch Points`,   color: '#f57c00', bg: '#fff3e0', bgD: 'rgba(255,152,0,0.15)' },
        { label: `${byType('success')} Positives`,      color: '#2e7d32', bg: '#e8f5e9', bgD: 'rgba(76,175,80,0.15)' },
        { label: `Forecast: ${forecastVal} kg`,         color: '#1565c0', bg: '#e3f2fd', bgD: 'rgba(33,150,243,0.15)' },
    ];

    const axisColor = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)';
    const gridColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const cardBg    = darkMode ? 'rgba(255,255,255,0.04)' : '#fff';
    const cardBord  = darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)';
    const titleColor = darkMode ? '#f0f0f0' : '#1a1a1a';
    const subColor   = darkMode ? 'rgba(240,240,240,0.6)' : '#555';

    return (
        <Box sx={{ p:{ xs:2, sm:3, md:4 }, background:pt.pageBg, minHeight:'100vh', position:'relative',
            '&::before':{ content:'""', position:'absolute', top:0, left:0, right:0, height:'260px', background:pt.pageBeforeBg, zIndex:0 },
        }}>
            <Box sx={{ position:'relative', zIndex:1, maxWidth:'1100px', mx:'auto' }}>

                {/* ── Header ── */}
                <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3 }}>
                    <Box sx={{ width:48, height:48, borderRadius:'14px', background:`linear-gradient(135deg, ${MAROON}, ${GOLD})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${MAROON}40` }}>
                        <InsightIcon sx={{ color:'white', fontSize:26 }} />
                    </Box>
                    <Box>
                        <Typography variant="h2" sx={{ fontWeight:900, fontSize:{ xs:'2rem', md:'2.6rem' }, background:pt.titleGradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-1.5px', lineHeight:1 }}>
                            AI Insights
                        </Typography>
                        <Typography sx={{ color:subColor, fontSize:'0.88rem', fontWeight:500, mt:0.3 }}>
                            Pattern analysis · Forecasting · Recommendations
                        </Typography>
                    </Box>
                </Box>

                {/* ── Summary Pills ── */}
                <Box sx={{ display:'flex', gap:1.2, mb:4, flexWrap:'wrap' }}>
                    {pillars.map((p,i) => (
                        <Box key={i} sx={{ px:1.6, py:0.7, borderRadius:'20px', bgcolor: darkMode?p.bgD:p.bg, border:`1px solid ${p.color}30`, display:'flex', alignItems:'center', gap:0.6 }}>
                            <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:p.color }} />
                            <Typography sx={{ fontSize:'0.78rem', fontWeight:700, color:p.color }}>{p.label}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* ── Forecast Chart ── */}
                <Paper elevation={0} sx={{ p:{ xs:2.5, md:3.5 }, mb:4, borderRadius:'20px', background:cardBg, border:cardBord, boxShadow: darkMode?'none':'0 4px 20px rgba(0,0,0,0.07)', position:'relative', overflow:'hidden',
                    '&::before':{ content:'""', position:'absolute', top:0, left:0, right:0, height:'4px', background:`linear-gradient(90deg, ${GOLD}, ${MAROON})` },
                }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:0.5 }}>
                        <ForecastIcon sx={{ color:GOLD, fontSize:22 }} />
                        <Typography sx={{ fontWeight:800, fontSize:'1.05rem', color:titleColor }}>Waste Volume Forecast</Typography>
                    </Box>
                    <Typography sx={{ fontSize:'0.8rem', color:subColor, mb:2.5 }}>
                        12-month history + 6-month linear regression forecast
                        {forecastVal > 0 && <> · <strong style={{ color: GOLD }}>{forecastVal} kg predicted next month</strong></>}
                    </Typography>

                    <ResponsiveContainer width="100%" height={360}>
                        <AreaChart data={forecastData} margin={{ top:10, right:24, left:12, bottom:6 }}>
                            <defs>
                                <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={MAROON} stopOpacity={0.35} />
                                    <stop offset="95%" stopColor={MAROON} stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={GOLD} stopOpacity={0.28} />
                                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="label" tick={{ fill:axisColor, fontSize:12 }} tickMargin={8} />
                            <YAxis tick={{ fill:axisColor, fontSize:12 }} unit=" kg" width={75} />
                            <Tooltip content={<ChartTip darkMode={darkMode} />} />
                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize:13, paddingTop:10 }} />
                            <ReferenceLine x={forecastData.find(d=>d.forecast!==null)?.label} stroke={GOLD} strokeDasharray="5 3" strokeWidth={1.5}
                                label={{ value:'Forecast →', fill:GOLD, fontSize:10, position:'insideTopLeft' }} />
                            <Area type="monotone" dataKey="actual"   name="Actual"   stroke={MAROON} fill="url(#aG)" strokeWidth={2.5} dot={{ r:3 }} activeDot={{ r:6 }} connectNulls={false} />
                            <Area type="monotone" dataKey="forecast" name="Forecast" stroke={GOLD}   fill="url(#fG)" strokeWidth={2.5} strokeDasharray="7 4" dot={{ r:3, fill:GOLD }} activeDot={{ r:6 }} connectNulls={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                {/* ── Recommendations ── */}
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:2.5 }}>
                    <BulbIcon sx={{ color:GOLD, fontSize:24 }} />
                    <Typography sx={{ fontWeight:800, fontSize:'1.1rem', color:titleColor }}>Smart Recommendations</Typography>
                    <Chip label={`${recs.length} insights`} size="small" sx={{ bgcolor: darkMode?'rgba(232,184,75,0.15)':'#fff8e1', color:MAROON, fontWeight:700, border:`1px solid ${GOLD}40` }} />
                </Box>

                <Box sx={{ display:'flex', flexDirection:'column', gap:1.8 }}>
                    {recs.length === 0 ? (
                        <Typography sx={{ color:subColor, textAlign:'center', py:5 }}>
                            Enter waste records to generate recommendations.
                        </Typography>
                    ) : recs.map((rec, i) => <RecCard key={i} rec={rec} darkMode={darkMode} />)}
                </Box>

                <Divider sx={{ my:4, borderColor: darkMode?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)' }} />
                <Typography sx={{ fontSize:'0.74rem', color:subColor, textAlign:'center' }}>
                    Generated from your waste data using pattern analysis · RA 9003 · 5S+ Methodology
                </Typography>

            </Box>
        </Box>
    );
};

export default Insights;
