import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const WasteTrendChart = ({ data }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const axisColor   = dark ? 'rgba(255,255,255,0.6)'  : '#666';
    const gridColor   = dark ? 'rgba(255,255,255,0.07)' : '#E0E0E0';
    const tooltipBg   = dark ? '#1e1e2e'                : 'rgba(255,255,255,0.97)';
    const tooltipText = dark ? '#f0f0f0'                : '#333';

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#a01518" stopOpacity={dark ? 0.5 : 0.35} />
                            <stop offset="95%" stopColor="#a01518" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: axisColor }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: axisColor }}
                        tickLine={false}
                        axisLine={false}
                        width={55}
                        label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: axisColor, fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 16,
                            border: dark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            backgroundColor: tooltipBg,
                        }}
                        itemStyle={{ color: dark ? '#e8b84b' : '#a01518', fontWeight: 700 }}
                        labelStyle={{ color: tooltipText, marginBottom: '0.4rem', fontWeight: 600 }}
                        formatter={(value) => [`${value} kg`, 'Total Waste']}
                    />
                    <Area
                        type="monotone"
                        dataKey="totalWeight"
                        stroke="#a01518"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#trendGrad)"
                        activeDot={{ r: 7, fill: '#e8b84b', stroke: dark ? '#1e1e2e' : '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

WasteTrendChart.propTypes = { data: PropTypes.array.isRequired };
export default WasteTrendChart;
