import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#555" style={{ fontSize: '16px', fontWeight: 600 }}>
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#333" style={{ fontSize: '24px', fontWeight: 800 }}>
                {`${(percent * 100).toFixed(1)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={6}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 12}
                outerRadius={outerRadius + 15}
                fill={fill}
            />
        </g>
    );
};

const WasteCategoryChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={160}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        paddingAngle={4}
                        cornerRadius={6}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                fillOpacity={index === activeIndex ? 1 : 0.6}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

WasteCategoryChart.propTypes = {
    data: PropTypes.array.isRequired
}

export default WasteCategoryChart;
