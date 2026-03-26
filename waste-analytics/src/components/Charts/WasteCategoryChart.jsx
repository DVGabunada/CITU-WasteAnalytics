import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

// ── Animated active slice ────────────────────────────────────────────────────
const ActiveSlice = ({ textColor, percentColor, expansion, ...props }) => {
    const {
        cx, cy, innerRadius, outerRadius,
        startAngle, endAngle, fill, payload, percent, value,
    } = props;

    const grow   = expansion;           // 0 → 30 (animated)
    const shrink = expansion * 0.2;     // inner radius breathes inward too

    return (
        <g>
            {/* Main sector — smoothly expands */}
            <Sector
                cx={cx} cy={cy}
                innerRadius={Math.max(0, innerRadius - shrink)}
                outerRadius={outerRadius + grow}
                startAngle={startAngle} endAngle={endAngle}
                fill={fill}
                cornerRadius={10}
                filter="url(#piePopShadow)"
            />

            {/* Outer halo ring — appears as expansion progresses */}
            {grow > 5 && (
                <Sector
                    cx={cx} cy={cy}
                    startAngle={startAngle} endAngle={endAngle}
                    innerRadius={outerRadius + grow + 4}
                    outerRadius={outerRadius + grow + 10}
                    fill={fill}
                    opacity={(grow / 30) * 0.4}
                    cornerRadius={4}
                />
            )}

            {/* Center labels — fade in as expansion progresses */}
            <text
                x={cx} y={cy} dy={-18}
                textAnchor="middle"
                fill={textColor}
                style={{ fontSize: '14px', fontWeight: 700, opacity: grow / 30 }}
            >
                {payload.name}
            </text>
            <text
                x={cx} y={cy} dy={16}
                textAnchor="middle"
                fill={percentColor}
                style={{ fontSize: '28px', fontWeight: 900, opacity: grow / 30 }}
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
            <text
                x={cx} y={cy} dy={38}
                textAnchor="middle"
                fill={textColor}
                style={{ fontSize: '12px', fontWeight: 500, opacity: (grow / 30) * 0.65 }}
            >
                {`${value} kg`}
            </text>
        </g>
    );
};

// ── Main chart component ──────────────────────────────────────────────────────
const WasteCategoryChart = ({ data }) => {
    const theme = useTheme();
    const dark  = theme.palette.mode === 'dark';

    const [activeIndex, setActiveIndex] = useState(0);
    const [expansion, setExpansion]     = useState(30); // starts fully expanded
    const rafRef       = useRef(null);
    const expansionRef = useRef(30); // track current value without stale closure

    // Animate FROM current value TO target — no jarring reset
    const animateTo = useCallback((target) => {
        const startVal = expansionRef.current;
        if (startVal === target) return;

        let startTime = null;
        const DURATION = 220; // snappy but visible

        const tick = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / DURATION, 1);

            // Ease-out quad: fast start, smooth finish
            const eased = 1 - (1 - p) * (1 - p);
            const current = startVal + (target - startVal) * eased;
            expansionRef.current = current;
            setExpansion(current);

            if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        animateTo(30);
        return () => cancelAnimationFrame(rafRef.current);
    }, [activeIndex, animateTo]);

    const textColor    = dark ? 'rgba(255,255,255,0.82)' : '#444';
    const percentColor = dark ? '#e8b84b'                : '#a01518';
    const tooltipBg    = dark ? '#1e1e2e'                : '#fff';
    const tooltipText  = dark ? '#f0f0f0'                : '#333';

    return (
        <Box
            sx={{
                width: '100%', height: 520,
                animation: 'chartFadeIn 0.7s ease-out',
                '@keyframes chartFadeIn': {
                    from: { opacity: 0, transform: 'scale(0.93)' },
                    to:   { opacity: 1, transform: 'scale(1)'    },
                },
            }}
        >
            <ResponsiveContainer>
                <PieChart>
                    <defs>
                        <filter id="piePopShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="6" stdDeviation="10"
                                floodColor="rgba(0,0,0,0.38)" floodOpacity="1" />
                        </filter>
                    </defs>

                    <Pie
                        activeIndex={activeIndex}
                        activeShape={(props) => (
                            <ActiveSlice
                                {...props}
                                textColor={textColor}
                                percentColor={percentColor}
                                expansion={expansion}
                            />
                        )}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={110}
                        outerRadius={165}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        paddingAngle={3}
                        cornerRadius={6}
                        isAnimationActive
                        animationBegin={100}
                        animationDuration={900}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                fillOpacity={index === activeIndex ? 1 : 0.45}
                                stroke="none"
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            borderRadius: 14,
                            border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 10px 32px rgba(0,0,0,0.22)',
                            backgroundColor: tooltipBg,
                            color: tooltipText,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            padding: '10px 16px',
                        }}
                        formatter={(value, name) => [`${value} kg`, name]}
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={40}
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{
                            color: dark ? 'rgba(255,255,255,0.7)' : '#555',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

WasteCategoryChart.propTypes = { data: PropTypes.array.isRequired };
export default WasteCategoryChart;
