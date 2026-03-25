import { getTransactions } from '../data/dataStore';
import React, { useMemo, useState, useEffect } from 'react';
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Chip, Avatar } from '@mui/material';
import { sub, isAfter, parseISO, startOfDay, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { wasteCategories } from '../data/wasteCategories';
import WasteCategoryChart from '../components/Charts/WasteCategoryChart';
import WasteTrendChart from '../components/Charts/WasteTrendChart';
import TopOfficesChart from '../components/Charts/TopOfficesChart';
import MascotBubble from '../components/MascotBubble';
import { usePageTheme } from '../hooks/usePageTheme';
import {
    DeleteOutline,
    Recycling,
    TrendingUp,
    Business,
    CalendarToday,
    ArrowUpward
} from '@mui/icons-material';

const StatCard = ({ title, value, unit, icon: Icon, gradient, percentage, delay }) => (
    <Paper
        sx={{
            p: 3.5,
            borderRadius: '24px',
            background: gradient,
            border: 'none',
            boxShadow: '0 10px 40px rgba(46, 125, 50, 0.12)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden',
            animation: `slideUp 0.6s ease-out ${delay}s backwards`,
            '@keyframes slideUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
            },
            '&:hover': {
                transform: 'translateY(-12px) scale(1.02)',
                boxShadow: '0 20px 60px rgba(46, 125, 50, 0.2)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(40%, -40%)',
            },
        }}
    >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600,
                            mb: 1.5,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.7rem',
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: 'white',
                            letterSpacing: '-2px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'baseline'
                        }}
                    >
                        {value}
                        <Typography component="span" sx={{ fontSize: '1rem', ml: 0.5, opacity: 0.8 }}>{unit}</Typography>
                    </Typography>
                </Box>
                <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                    <Icon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                px: 1.5,
                py: 0.8,
                backdropFilter: 'blur(10px)',
                width: 'fit-content',
            }}>
                <ArrowUpward sx={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} />
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>
                    {percentage}% vs last period
                </Typography>
            </Box>
        </Box>
    </Paper>
);

const Dashboard = () => {
    const [period, setPeriod] = useState('month');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    // --- Data Processing ---
    const kpiData = useMemo(() => {
        let totalWaste = 0;
        let recyclableWaste = 0;
        const categoryMap = {};
        const officeMap = {};
        const dailyMap = {};

        // Filter Date Logic
        const today = startOfDay(new Date());
        let startDate;
        let filteredTransactions = [];

        if (period === 'today') {
            filteredTransactions = transactions.filter(t => {
                const tDate = parseISO(t.date);
                return isSameDay(tDate, new Date());
            });
        } else {
            if (period === 'week') {
                startDate = sub(today, { days: 7 });
            } else if (period === 'month') {
                startDate = sub(today, { days: 30 });
            } else if (period === 'year') {
                startDate = sub(today, { days: 365 });
            }

            filteredTransactions = transactions.filter(t => {
                const tDate = parseISO(t.date);
                // check if startDate is defined, otherwise return true (or handle logic)
                // Existing logic only handled week/month/year.
                return startDate ? isAfter(tDate, startDate) : true;
            });
        }

        filteredTransactions.forEach(t => {
            const weight = Number(t.weight);
            totalWaste += weight;

            if (!categoryMap[t.category]) categoryMap[t.category] = 0;
            categoryMap[t.category] += weight;

            const isRecyclable = t.category.toLowerCase().includes('recyclable');
            if (isRecyclable) recyclableWaste += weight;

            if (!officeMap[t.officeName]) officeMap[t.officeName] = 0;
            officeMap[t.officeName] += weight;

            if (!dailyMap[t.date]) dailyMap[t.date] = 0;
            dailyMap[t.date] += weight;
        });

        const categoryData = Object.keys(categoryMap).map(key => {
            const catDef = wasteCategories.find(c => c.name === key);
            return {
                name: key,
                value: Number(categoryMap[key].toFixed(1)),
                color: catDef ? catDef.color : '#999'
            };
        });

        const officeData = Object.keys(officeMap)
            .map(key => ({ name: key, value: Number(officeMap[key].toFixed(1)) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        const trendData = Object.keys(dailyMap)
            .sort()
            .map(key => ({ date: key, totalWeight: Number(dailyMap[key].toFixed(1)) }));

        return {
            totalWaste: totalWaste.toFixed(1),
            recyclableRate: totalWaste > 0 ? ((recyclableWaste / totalWaste) * 100).toFixed(1) : 0,
            categoryData,
            officeData,
            trendData,
            topOffice: officeData.length > 0 ? officeData[0] : { name: 'N/A', value: 0 }
        };
    }, [period, transactions]);

    const pt = usePageTheme();

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            background: pt.pageBg,
            minHeight: '100vh',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '300px',
                background: pt.pageBeforeBg,
                zIndex: 0,
            },
        }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                        <Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    background: pt.titleGradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    letterSpacing: '-2px',
                                }}
                            >
                                Dashboard Overview
                            </Typography>
                            <Typography variant="body1" sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                                Waste generation analytics for the entire university
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        // mt: 3, // Removed mt:3 as it was on the outer box, now applied to this box
                    }}>
                        <Chip
                            icon={<CalendarToday />}
                            label={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            sx={pt.chipSx}
                        />

                        <FormControl sx={{ minWidth: 180 }}>
                            <Select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                sx={pt.selectSx}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="week">This Week</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                                <MenuItem value="year">This Year</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                </Box>

                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Total Waste"
                            value={kpiData.totalWaste}
                            unit="kg"
                            icon={DeleteOutline}
                            gradient="linear-gradient(135deg, #a01518 0%, #7b1113 100%)"
                            percentage={5.2}
                            delay={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Recycling Rate"
                            value={kpiData.recyclableRate}
                            unit="%"
                            icon={Recycling}
                            gradient="linear-gradient(135deg, #26a69a 0%, #00897b 100%)"
                            percentage={2.4}
                            delay={0.1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Most Waste (Office)"
                            value={kpiData.topOffice.value}
                            unit="kg"
                            icon={Business}
                            gradient="linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)"
                            percentage={0}
                            delay={0.2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Avg. Daily Waste"
                            value={period === 'week' ? (Number(kpiData.totalWaste) / 7).toFixed(1) : period === 'month' ? (Number(kpiData.totalWaste) / 30).toFixed(1) : (Number(kpiData.totalWaste) / 365).toFixed(1)}
                            unit="kg"
                            icon={TrendingUp}
                            gradient="linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)"
                            percentage={1.2}
                            delay={0.3}
                        />
                    </Grid>
                </Grid>

                {/* Charts Area */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            component={motion.div}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            sx={{
                                p: 4, borderRadius: '24px',
                                ...pt.cardSx,
                                position: 'relative', overflow: 'hidden',
                                '&::before': {
                                    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                    height: pt.accentBarH,
                                    background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)',
                                },
                            }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: pt.chartTitleColor, mb: 3 }}>
                                📈 Waste Generation Trend
                            </Typography>
                            <WasteTrendChart data={kpiData.trendData} />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            component={motion.div}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            sx={{
                                p: 4, borderRadius: '24px',
                                ...pt.cardSx,
                                height: '100%', position: 'relative', overflow: 'hidden',
                                '&::before': {
                                    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                    height: pt.accentBarH,
                                    background: 'linear-gradient(90deg, #ffa726 0%, #fb8c00 100%)',
                                },
                            }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: pt.chartTitleColor, mb: 3 }}>
                                ♻️ Waste Composition
                            </Typography>
                            <WasteCategoryChart data={kpiData.categoryData} />
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            component={motion.div}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            sx={{
                                p: 4, borderRadius: '24px',
                                ...pt.cardSx,
                                position: 'relative', overflow: 'hidden',
                                '&::before': {
                                    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                                    height: pt.accentBarH,
                                    background: 'linear-gradient(90deg, #e8b84b 0%, #a01518 100%)',
                                },
                            }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: pt.chartTitleColor, mb: 3 }}>
                                🏆 Top Waste Producing Offices
                            </Typography>
                            <TopOfficesChart data={kpiData.officeData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
};

export default Dashboard;
