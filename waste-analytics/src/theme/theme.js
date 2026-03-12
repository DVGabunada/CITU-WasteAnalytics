import { createTheme } from '@mui/material/styles';

// Shared typography & component overrides
const sharedTypography = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '3rem',   fontWeight: 800 },
    h2: { fontSize: '2.5rem', fontWeight: 700 },
    h3: { fontSize: '2rem',   fontWeight: 700 },
    h4: { fontSize: '1.75rem',fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1.25rem',fontWeight: 600 },
    subtitle1: { fontSize: '1.1rem' },
    subtitle2: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '1.1rem' },
    body2: { fontSize: '1rem' },
};

const sharedComponents = {
    MuiCard: {
        styleOverrides: {
            root: { borderRadius: 20, boxShadow: '0px 8px 30px rgba(0,0,0,0.08)' },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: { borderRadius: 12, textTransform: 'none', fontWeight: 700, fontSize: '1rem', padding: '10px 24px' },
        },
    },
    MuiPaper: {
        styleOverrides: { rounded: { borderRadius: 20 } },
    },
    MuiTableCell: {
        styleOverrides: {
            head: { fontWeight: 700, fontSize: '1.1rem' },
            body: { fontSize: '1.1rem' },
        },
    },
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary:    { main: '#7b1113', light: '#a01518', dark: '#5a0d0f', contrastText: '#ffffff' },
        secondary:  { main: '#e8b84b', light: '#f5d78a', dark: '#c9a84c', contrastText: '#3e0a0b' },
        background: { default: '#f4f6f8', paper: '#ffffff' },
        text:       { primary: '#1c1c1c', secondary: '#616161' },
    },
    typography: sharedTypography,
    components: sharedComponents,
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary:    { main: '#e8b84b', light: '#f5d78a', dark: '#c9a84c', contrastText: '#1a0808' },
        secondary:  { main: '#a01518', light: '#7b1113', dark: '#5a0d0f', contrastText: '#ffffff' },
        background: { default: '#1a0808', paper: '#2d1010' },
        text:       { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)' },
    },
    typography: sharedTypography,
    components: {
        ...sharedComponents,
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    // In dark mode MUI uses rgba(255,255,255,0.23) — boost it
                    borderColor: 'rgba(255,255,255,0.4)',
                },
            },
        },
    },
});

// Default export keeps backward compatibility
export default lightTheme;
