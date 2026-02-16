import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const WasteTrendChart = ({ data }) => {
    const theme = useTheme();

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#43a047" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#43a047" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: '#999' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 16,
                            border: 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                        }}
                        itemStyle={{ color: '#2e7d32', fontWeight: 700 }}
                        formatter={(value) => [`${value} kg`, 'Total Waste']}
                        labelStyle={{ color: '#666', marginBottom: '0.5rem' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="totalWeight"
                        stroke="#43a047"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        activeDot={{ r: 8, fill: '#2e7d32', stroke: '#fff', strokeWidth: 4 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

WasteTrendChart.propTypes = {
    data: PropTypes.array.isRequired
}

export default WasteTrendChart;
