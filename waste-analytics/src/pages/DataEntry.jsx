import { format } from 'date-fns';
import { addTransaction } from '../data/dataStore';
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Autocomplete,
    Button,
    MenuItem,
    Alert,
    Snackbar,
    Chip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Send as SendIcon, CalendarToday } from '@mui/icons-material';

import { offices } from '../data/offices';
import { wasteCategories } from '../data/wasteCategories';
import { usePageTheme } from '../hooks/usePageTheme';

const DataEntry = () => {
    const [date, setDate] = useState(new Date());
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedOffice || !category || !weight) return;

        const transaction = {
            id: Date.now().toString(),
            date: format(date, 'yyyy-MM-dd'),
            submittedAt: new Date().toISOString(),
            officeId: selectedOffice.id,
            officeName: selectedOffice.name,
            category: category,
            weight: Number(weight),
            unit: 'kg',
            notes: notes
        };

        addTransaction(transaction);
        console.log('Transaction saved:', transaction);

        // Reset form
        setSelectedOffice(null);
        setCategory('');
        setWeight('');
        setNotes('');
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const pt = usePageTheme();

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            background: pt.pageBg,
            minHeight: '100vh',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: pt.pageBeforeBg,
                zIndex: 0,
            },
        }}>
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1200px', mx: 'auto' }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{
                            width: 6,
                            height: 48,
                            background: 'linear-gradient(180deg, #2e7d32 0%, #43a047 100%)',
                            borderRadius: '10px',
                        }} />
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
                                Record Waste Data
                            </Typography>
                            <Typography variant="body1" sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                                Enter daily waste collection info for each office.
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={<CalendarToday />}
                        label={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        sx={{ ...pt.chipSx, mt: 3 }}
                    />
                </Box>

                <Paper elevation={0} sx={{
                    p: 6, borderRadius: '24px',
                    ...pt.cardSx,
                    position: 'relative', overflow: 'hidden',
                    '&::before': {
                        content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                        height: pt.accentBarH,
                        background: 'linear-gradient(90deg, #69f0ae 0%, #43a047 100%)',
                    },
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {/* Row 1: Date, Category, Weight */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Collection Date"
                                            value={date}
                                            onChange={(newValue) => setDate(newValue)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    sx: {
                                                        '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#69f0ae' },
                                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#69f0ae' },
                                                        '& .MuiSvgIcon-root': { color: '#69f0ae' },
                                                    }
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid size={{ xs: 12, md: 7 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Waste Category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        variant="outlined"
                                        sx={pt.selectInputSx}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    sx: { maxHeight: 300, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }
                                                }
                                            }
                                        }}
                                    >
                                        {wasteCategories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.name} sx={{ py: 1.5, fontSize: '1.1rem' }}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Weight (kg)"
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        required
                                        variant="outlined"
                                        sx={pt.selectInputSx}
                                    />
                                </Grid>
                            </Grid>

                            {/* Row 2: Office, Collected By */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Autocomplete
                                        options={offices}
                                        getOptionLabel={(option) => `${option.name} (${option.building})`}
                                        value={selectedOffice}
                                        onChange={(event, newValue) => {
                                            setSelectedOffice(newValue);
                                        }}
                                        ListboxProps={{ style: { maxHeight: 350 } }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Office"
                                                required
                                                fullWidth
                                                variant="outlined"
                                                sx={pt.inputSx}
                                            />
                                        )}
                                        PaperComponent={({ children }) => (
                                            <Paper sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                                mt: 1,
                                                minWidth: '400px',
                                                width: 'auto !important'
                                            }}>
                                                {children}
                                            </Paper>
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} style={{ fontSize: '1.1rem', padding: '12px 16px' }}>
                                                {option.name} <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: '8px' }}>({option.building})</span>
                                            </li>
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Collected By (Optional)"
                                        placeholder="Name of staff/intern"
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#69f0ae' },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#69f0ae' },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                multiline
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Special events, cleanup drive, etc."
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                endIcon={<SendIcon />}
                                sx={{
                                    mt: 2,
                                    px: 8,
                                    py: 2,
                                    fontSize: '1.2rem',
                                    borderRadius: 4,
                                    boxShadow: '0 8px 16px rgba(46, 125, 50, 0.24)',
                                    background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 20px rgba(46, 125, 50, 0.32)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Submit Entry
                            </Button>
                        </Box>
                    </form>
                </Paper>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ zIndex: 9999 }}
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', fontSize: '1.1rem', borderRadius: 2 }}>
                        Data recorded successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DataEntry;
