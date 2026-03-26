import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const TopOfficesChart = ({ data }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const axisColor   = dark ? 'rgba(255,255,255,0.75)' : '#333';
    const labelColor  = dark ? '#e8b84b'                : '#7b1113';
    const gridColor   = dark ? 'rgba(255,255,255,0.07)' : '#f0f0f0';
    const tooltipBg   = dark ? '#1e1e2e'                : '#fff';
    const tooltipText = dark ? '#f0f0f0'                : '#333';

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 90, left: 20, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="barGradientDash" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"   stopColor="#a01518" stopOpacity={0.85} />
                            <stop offset="100%" stopColor="#e8b84b" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="barGradientFade" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"   stopColor="#a01518" stopOpacity={0.45} />
                            <stop offset="100%" stopColor="#e8b84b" stopOpacity={0.6} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={220}
                        tick={{ fontSize: 13, fontWeight: 700, fill: axisColor }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                    />
                    <Tooltip
                        cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(160,21,24,0.04)' }}
                        contentStyle={{
                            borderRadius: 12, border: dark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            backgroundColor: tooltipBg, color: tooltipText,
                        }}
                        labelStyle={{ color: tooltipText, fontWeight: 700 }}
                        formatter={(value) => [`${value} kg`, 'Total Waste']}
                    />
                    <Bar dataKey="value" radius={[0, 16, 16, 0]} barSize={36}>
                        <LabelList
                            dataKey="value"
                            position="right"
                            style={{ fontSize: '13px', fontWeight: 800, fill: labelColor }}
                            formatter={(val) => `${val} kg`}
                        />
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index < 3 ? 'url(#barGradientDash)' : 'url(#barGradientFade)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

TopOfficesChart.propTypes = { data: PropTypes.array.isRequired };
export default TopOfficesChart;
