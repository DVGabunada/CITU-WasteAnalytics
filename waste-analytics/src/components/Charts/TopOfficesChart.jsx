import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const TopOfficesChart = ({ data }) => {
    const theme = useTheme();

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 20,
                        right: 80,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#66bb6a" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={220}
                        tick={{ fontSize: 13, fontWeight: 700, fill: '#333' }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(46, 125, 50, 0.05)' }}
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                        formatter={(value) => [`${value} kg`, 'Total Waste']}
                    />
                    <Bar dataKey="value" radius={[0, 16, 16, 0]} barSize={36}>
                        <LabelList
                            dataKey="value"
                            position="right"
                            style={{ fontSize: '14px', fontWeight: 800, fill: '#2e7d32' }}
                            formatter={(val) => `${val} kg`}
                        />
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index < 3 ? 'url(#barGradient)' : '#a5d6a7'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

TopOfficesChart.propTypes = {
    data: PropTypes.array.isRequired
}

export default TopOfficesChart;
