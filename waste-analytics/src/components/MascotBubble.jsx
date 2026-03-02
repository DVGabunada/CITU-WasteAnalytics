import React, { useState } from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';

const MascotBubble = ({
    message = "Hi! I'm here to help you with waste management!",
    variant = 'inline', // 'inline' | 'corner'
    size = 120,
}) => {
    const [visible, setVisible] = useState(true);

    const isCorner = variant === 'corner';

    const containerSx = isCorner
        ? {
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1,
            cursor: 'pointer',
        }
        : {
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
        };

    return (
        <Fade in={visible}>
            <Box sx={containerSx} onClick={() => isCorner && setVisible(v => !v)}>
                {/* Speech bubble */}
                <Paper
                    elevation={4}
                    sx={{
                        p: 2,
                        borderRadius: '18px 18px 4px 18px',
                        maxWidth: isCorner ? 260 : 400,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
                        border: '2px solid #a5d6a7',
                        boxShadow: '0 8px 32px rgba(46,125,50,0.15)',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -12,
                            right: 24,
                            width: 0,
                            height: 0,
                            borderLeft: '12px solid transparent',
                            borderRight: '0px solid transparent',
                            borderTop: '12px solid #a5d6a7',
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: '#1b5e20',
                            lineHeight: 1.5,
                            fontSize: isCorner ? '0.85rem' : '0.95rem',
                        }}
                    >
                        {message}
                    </Typography>
                </Paper>

                {/* Mascot image */}
                <Box
                    component="img"
                    src="/Sprite Mascot.png"
                    alt="Eco Mascot"
                    sx={{
                        width: size,
                        height: size,
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 8px 16px rgba(46,125,50,0.25))',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05) translateY(-4px)',
                        },
                        animation: 'mascotBob 3s ease-in-out infinite',
                        '@keyframes mascotBob': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-8px)' },
                        },
                    }}
                />
            </Box>
        </Fade>
    );
};

export default MascotBubble;
