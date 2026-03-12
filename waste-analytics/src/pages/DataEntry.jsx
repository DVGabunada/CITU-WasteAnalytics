import { format } from 'date-fns';
import { addTransaction } from '../data/dataStore';
import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, TextField,
    Autocomplete, Button, MenuItem, Alert, Snackbar,
    Chip, Divider, IconButton, Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Send as SendIcon, CalendarToday,
    AddCircleOutline as AddIcon,
    RemoveCircleOutline as RemoveIcon,
    CheckCircleOutline as CheckIcon,
} from '@mui/icons-material';
import { offices } from '../data/offices';
import { wasteCategories } from '../data/wasteCategories';
import { usePageTheme } from '../hooks/usePageTheme';

// ── Helpers ───────────────────────────────────────────────────────────────────

const emptyRow = () => ({
    id: Date.now() + Math.random(),
    date: new Date(),
    selectedOffice: null,
    category: '',
    weight: '',
    collectedBy: '',
    notes: '',
});

// ── Component ─────────────────────────────────────────────────────────────────

const DataEntry = () => {
    const [rows, setRows] = useState([emptyRow()]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [submittedCount, setSubmittedCount] = useState(0);

    const pt = usePageTheme();
    const { darkMode } = pt;

    // ── Row operations ────────────────────────────────────────────────────────
    const addRow = () => setRows(prev => [...prev, emptyRow()]);

    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));

    const updateRow = (id, field, value) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        const valid = rows.filter(r => r.selectedOffice && r.category && r.weight);
        if (!valid.length) return;

        valid.forEach(r => {
            addTransaction({
                id: Date.now().toString() + Math.random(),
                date: format(r.date, 'yyyy-MM-dd'),
                submittedAt: new Date().toISOString(),
                officeId: r.selectedOffice.id,
                officeName: r.selectedOffice.name,
                category: r.category,
                weight: Number(r.weight),
                unit: 'kg',
                notes: r.notes,
            });
        });

        setSubmittedCount(valid.length);
        setRows([emptyRow()]);
        setOpenSnackbar(true);
    };

    // ── Shared field sx ───────────────────────────────────────────────────────
    const fieldSx = pt.inputSx;
    const selectSx = pt.selectInputSx;

    // ── Row Card ──────────────────────────────────────────────────────────────
    const RowCard = ({ row, index }) => (
        <Box sx={{
            borderRadius: '20px',
            border: darkMode
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(123,17,19,0.1)',
            background: darkMode
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(255,255,255,0.7)',
            backdropFilter: darkMode ? 'blur(12px)' : 'none',
            overflow: 'hidden',
            transition: 'all 0.25s ease',
            '&:hover': {
                border: darkMode
                    ? '1px solid rgba(232,184,75,0.25)'
                    : '1px solid rgba(123,17,19,0.22)',
                boxShadow: darkMode
                    ? '0 8px 32px rgba(0,0,0,0.25)'
                    : '0 8px 24px rgba(123,17,19,0.08)',
            },
        }}>
            {/* Row header */}
            <Box sx={{
                px: 3, py: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: darkMode
                    ? 'rgba(232,184,75,0.08)'
                    : 'rgba(123,17,19,0.04)',
                borderBottom: darkMode
                    ? '1px solid rgba(255,255,255,0.07)'
                    : '1px solid rgba(123,17,19,0.07)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 28, height: 28, borderRadius: '50%',
                        bgcolor: darkMode ? 'rgba(232,184,75,0.2)' : 'rgba(123,17,19,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Typography sx={{
                            fontWeight: 900, fontSize: '0.75rem',
                            color: darkMode ? '#e8b84b' : '#7b1113',
                        }}>
                            {String(index + 1).padStart(2, '0')}
                        </Typography>
                    </Box>
                    <Typography sx={{
                        fontWeight: 700, fontSize: '0.85rem',
                        color: darkMode ? 'rgba(255,255,255,0.75)' : '#7b1113',
                        letterSpacing: '0.5px',
                    }}>
                        Entry {index + 1}
                    </Typography>
                </Box>
                {rows.length > 1 && (
                    <Tooltip title="Remove this entry">
                        <IconButton size="small" onClick={() => removeRow(row.id)} sx={{
                            color: darkMode ? 'rgba(255,120,120,0.7)' : '#b71c1c',
                            '&:hover': {
                                bgcolor: darkMode ? 'rgba(255,100,100,0.1)' : 'rgba(183,28,28,0.08)',
                            },
                        }}>
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Row fields */}
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                    {/* Date */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Collection Date"
                                value={row.date}
                                onChange={(v) => updateRow(row.id, 'date', v)}
                                slotProps={{ textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    id: `date-picker-${row.id}`,
                                    inputProps: { id: `date-picker-input-${row.id}` },
                                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } },
                                } }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Office */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Autocomplete
                            options={offices}
                            getOptionLabel={(o) => `${o.name} (${o.building})`}
                            value={row.selectedOffice}
                            onChange={(_, v) => updateRow(row.id, 'selectedOffice', v)}
                            ListboxProps={{ style: { maxHeight: 300 } }}
                            renderInput={(params) => (
                                <TextField {...params} label="Office" required fullWidth variant="outlined" sx={fieldSx} />
                            )}
                            PaperComponent={({ children }) => (
                                <Paper sx={{
                                    borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', mt: 1,
                                    ...(darkMode && {
                                        bgcolor: '#2d1010',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '& li': { color: 'rgba(255,255,255,0.88)' },
                                    }),
                                }}>
                                    {children}
                                </Paper>
                            )}
                            renderOption={(props, option) => {
                                const { key, ...rest } = props;
                                return (
                                    <li key={key} {...rest} style={{
                                        fontSize: '1rem', padding: '10px 16px',
                                        ...(darkMode && { color: 'rgba(255,255,255,0.88)' }),
                                    }}>
                                        {option.name}
                                        <span style={{ color: darkMode ? 'rgba(232,184,75,0.7)' : '#888', fontSize: '0.85rem', marginLeft: '8px' }}>
                                            ({option.building})
                                        </span>
                                    </li>
                                );
                            }}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select fullWidth label="Waste Category"
                            value={row.category} required variant="outlined"
                            onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                            sx={selectSx}
                            SelectProps={{ MenuProps: { PaperProps: { sx: {
                                maxHeight: 300, borderRadius: 3,
                                ...(darkMode && { bgcolor: '#2d1010', border: '1px solid rgba(255,255,255,0.1)' }),
                            } } } }}
                        >
                            {wasteCategories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.name} sx={{
                                    py: 1.2, fontSize: '1rem',
                                    ...(darkMode && {
                                        color: 'rgba(255,255,255,0.9)',
                                        '&:hover': { bgcolor: 'rgba(232,184,75,0.12)' },
                                        '&.Mui-selected': { bgcolor: 'rgba(232,184,75,0.18)', color: '#e8b84b' },
                                    }),
                                }}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Weight */}
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <TextField
                            fullWidth label="Weight (kg)" type="number"
                            inputProps={{ step: '0.01', min: '0' }}
                            value={row.weight} required variant="outlined"
                            onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                            sx={selectSx}
                        />
                    </Grid>

                    {/* Collected By */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            fullWidth label="Collected By (Optional)"
                            placeholder="Name of staff / intern"
                            value={row.collectedBy} variant="outlined"
                            onChange={(e) => updateRow(row.id, 'collectedBy', e.target.value)}
                            sx={fieldSx}
                        />
                    </Grid>

                    {/* Notes */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            fullWidth label="Notes (Optional)" multiline rows={2}
                            value={row.notes} variant="outlined"
                            placeholder="Special events, cleanup drive, etc."
                            onChange={(e) => updateRow(row.id, 'notes', e.target.value)}
                            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx?.['& .MuiOutlinedInput-root'], borderRadius: 3 } }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            background: pt.pageBg,
            minHeight: '100vh',
            position: 'relative',
            '&::before': {
                content: '""', position: 'absolute',
                top: 0, left: 0, right: 0, height: '300px',
                background: pt.pageBeforeBg, zIndex: 0,
            },
        }}>
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1200px', mx: 'auto' }}>

                {/* ── Header ── */}
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box>
                            <Typography variant="h2" sx={{
                                fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: pt.titleGradient,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                letterSpacing: '-2px',
                            }}>
                                Record Waste Data
                            </Typography>
                            <Typography variant="body1" sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                                Enter daily waste collection info for each office. You can add multiple entries at once.
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={<CalendarToday />}
                        label={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        sx={{ ...pt.chipSx, mt: 3 }}
                    />
                </Box>

                {/* ── Form Card ── */}
                <Paper elevation={0} sx={{
                    borderRadius: '24px',
                    ...pt.cardSx,
                    position: 'relative', overflow: 'hidden',
                    '&::before': {
                        content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                        height: pt.accentBarH,
                        background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)',
                    },
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* ── Section label ── */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography sx={{
                                        fontWeight: 800, fontSize: '1.1rem',
                                        color: darkMode ? '#e8b84b' : '#7b1113',
                                        letterSpacing: '0.5px',
                                    }}>
                                        Waste Entries
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: pt.secondaryTextColor, mt: 0.3 }}>
                                        {rows.length} {rows.length === 1 ? 'entry' : 'entries'} ready to submit
                                    </Typography>
                                </Box>

                                <Button
                                    onClick={addRow}
                                    startIcon={<AddIcon />}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '12px', fontWeight: 700, px: 3,
                                        borderColor: darkMode ? 'rgba(232,184,75,0.5)' : 'rgba(123,17,19,0.4)',
                                        color: darkMode ? '#e8b84b' : '#7b1113',
                                        '&:hover': {
                                            borderColor: darkMode ? '#e8b84b' : '#7b1113',
                                            bgcolor: darkMode ? 'rgba(232,184,75,0.08)' : 'rgba(123,17,19,0.05)',
                                        },
                                    }}
                                >
                                    Add Entry
                                </Button>
                            </Box>

                            <Divider sx={pt.dividerSx} />

                            {/* ── Entry rows ── */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {rows.map((row, i) => (
                                    <RowCard key={row.id} row={row} index={i} />
                                ))}
                            </Box>

                            <Divider sx={pt.dividerSx} />

                            {/* ── Submit ── */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <CheckIcon sx={{ color: darkMode ? '#69f0ae' : '#2e7d32', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ color: pt.secondaryTextColor }}>
                                        All required fields (Office, Category, Weight) must be filled per entry.
                                    </Typography>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    endIcon={<SendIcon />}
                                    sx={{
                                        px: 6, py: 1.8, fontSize: '1.05rem',
                                        borderRadius: '14px',
                                        boxShadow: '0 8px 16px rgba(123,17,19,0.24)',
                                        background: 'linear-gradient(135deg, #a01518 0%, #7b1113 100%)',
                                        fontWeight: 700,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #7b1113 0%, #5a0d0f 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 20px rgba(123,17,19,0.35)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Submit {rows.length > 1 ? `${rows.length} Entries` : 'Entry'}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Box>

            {/* ── Success snackbar ── */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ zIndex: 9999 }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    sx={{ width: '100%', fontSize: '1.05rem', borderRadius: 2 }}
                >
                    {submittedCount} {submittedCount === 1 ? 'entry' : 'entries'} recorded successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DataEntry;
