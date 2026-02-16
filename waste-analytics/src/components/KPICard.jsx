import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const KPICard = ({ title, value, unit, icon, color, trend }) => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%', minHeight: 180, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: '50%',
                bgcolor: color,
                opacity: 0.1
            }} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ fontWeight: 800 }}>
                            {value}
                            <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 0.5 }}>
                                {unit}
                            </Typography>
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 64, height: 64 }}>
                        {React.cloneElement(icon, { sx: { fontSize: 32 } })}
                    </Avatar>
                </Box>

                {trend && (
                    <Typography variant="body1" sx={{ color: trend > 0 ? 'error.main' : 'success.main', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                        {trend > 0 ? '+' : ''}{trend}%
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            vs last month
                        </Typography>
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

KPICard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    unit: PropTypes.string,
    icon: PropTypes.element,
    color: PropTypes.string,
    trend: PropTypes.number
}

export default KPICard;
