import { useThemeMode } from '../context/ThemeContext';

/**
 * CIT-U Maroon & Gold design tokens for light/dark mode.
 * Primary: Maroon #7b1113 | Accent: Gold #e8b84b
 */
export const usePageTheme = () => {
    const { darkMode, toggleDarkMode } = useThemeMode();

    return {
        darkMode,
        toggleDarkMode,

        // ── Page backgrounds ──────────────────────────────────────────────
        pageBg: darkMode
            ? 'linear-gradient(160deg, #1a0808 0%, #2d1010 60%, #1a0808 100%)'
            : 'linear-gradient(135deg, #fff8f8 0%, #fce4ec 50%, #fff8f8 100%)',

        pageBeforeBg: darkMode
            ? 'radial-gradient(ellipse at 50% 0%, rgba(232,184,75,0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(123,17,19,0.05) 0%, transparent 70%)',

        // ── Title gradient ────────────────────────────────────────────────
        titleGradient: darkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #f5d78a 50%, #e8b84b 100%)'
            : 'linear-gradient(135deg, #5a0d0f 0%, #7b1113 50%, #a01518 100%)',

        // ── Text ──────────────────────────────────────────────────────────
        subtitleColor: darkMode ? 'rgba(255,255,255,0.75)' : '#7b1113',
        sectionTitleColor: darkMode ? '#fce4ec' : '#3e0a0b',
        bodyTextColor: darkMode ? 'rgba(255,255,255,0.85)' : '#37474f',
        secondaryTextColor: darkMode ? 'rgba(255,255,255,0.65)' : '#616161',
        chartTitleColor: darkMode ? '#fce4ec' : '#3e0a0b',

        // ── Date Chip ─────────────────────────────────────────────────────
        chipSx: darkMode
            ? {
                bgcolor: 'rgba(255,255,255,0.08)',
                color: '#e8b84b',
                fontWeight: 600,
                fontSize: '0.9rem', py: 2.5, px: 1,
                border: '1px solid rgba(232,184,75,0.3)',
                backdropFilter: 'blur(10px)',
                '& .MuiChip-icon': { color: '#e8b84b' },
            }
            : {
                bgcolor: 'white',
                color: '#7b1113',
                fontWeight: 600,
                fontSize: '0.9rem', py: 2.5, px: 1,
                boxShadow: '0 4px 12px rgba(123,17,19,0.12)',
                '& .MuiChip-icon': { color: '#a01518' },
            },

        // ── Period Select ─────────────────────────────────────────────────
        selectSx: darkMode
            ? {
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(232,184,75,0.25)',
                backdropFilter: 'blur(10px)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: '#e8b84b' },
                fontWeight: 600, color: '#e8b84b',
            }
            : {
                bgcolor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(123,17,19,0.1)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                fontWeight: 600, color: '#7b1113',
            },

        // ── Glass Card / Paper ────────────────────────────────────────────
        cardSx: darkMode
            ? {
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
            }
            : {
                background: 'white',
                border: 'none',
                boxShadow: '0 10px 40px rgba(123,17,19,0.1)',
            },

        cardShadow: darkMode ? '0 12px 48px rgba(0,0,0,0.3)' : '0 12px 48px rgba(123,17,19,0.1)',
        cardBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        cardBg: darkMode ? 'rgba(255,255,255,0.04)' : 'white',
        cardBackdropFilter: darkMode ? 'blur(16px)' : 'none',

        // ── Top accent bar ────────────────────────────────────────────────
        accentBarH: darkMode ? '3px' : '4px',

        // ── Divider ───────────────────────────────────────────────────────
        dividerSx: darkMode ? { bgcolor: 'rgba(255,255,255,0.1)' } : { bgcolor: 'rgba(123,17,19,0.1)' },

        // ── Input field styles ────────────────────────────────────────────
        inputSx: darkMode
            ? {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#e8b84b' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiSvgIcon-root': { color: '#e8b84b' },
            }
            : {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: '#212121' },
                '& .MuiInputLabel-root': { color: '#555555' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#7b1113' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7b1113' },
            },

        selectInputSx: darkMode
            ? {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#e8b84b' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e8b84b' },
                '& .MuiSelect-icon': { color: '#e8b84b' },
                '& .MuiSelect-select': { color: 'white' },
            }
            : {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: '#212121' },
                '& .MuiInputLabel-root': { color: '#555555' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#7b1113' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7b1113' },
                '& .MuiSelect-icon': { color: '#7b1113' },
            },

        // ── Table ─────────────────────────────────────────────────────────
        tableHeadSx: darkMode
            ? { bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.15)',
                '& .MuiTableSortLabel-root': { color: '#ffffff' },
                '& .MuiTableSortLabel-root.Mui-active': { color: '#e8b84b' },
                '& .MuiTableSortLabel-icon': { color: '#e8b84b !important' },
              }
            : { bgcolor: '#fce4ec', color: '#7b1113', borderBottom: '2px solid #f8bbd0' },

        tableRowSx: darkMode
            ? {
                '&:nth-of-type(even)': { bgcolor: 'rgba(255,255,255,0.05)' },
                '&:hover': { bgcolor: 'rgba(232,184,75,0.09) !important' },
                transition: 'background 0.15s',
            }
            : { '&:nth-of-type(even)': { bgcolor: '#fff8f8' }, transition: 'background 0.15s' },

        tableCellColor: darkMode ? 'rgba(255,255,255,0.92)' : 'inherit',
        tableWeightColor: darkMode ? '#e8b84b' : '#7b1113',
        tableNoteColor: darkMode ? 'rgba(255,255,255,0.7)' : '#616161',

        paginationSx: darkMode
            ? {
                borderTop: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                '& .MuiTablePagination-selectIcon': { color: '#e8b84b' },
                '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiIconButton-root.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
            }
            : { borderTop: '1px solid #fce4ec' },

        // ── Survey tokens ─────────────────────────────────────────────────
        formLabelColor: darkMode ? '#f5d78a' : '#7b1113',
        radioCheckedColor: darkMode ? '#e8b84b' : '#7b1113',
        radioColor: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
        radioLabelColor: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
        ratingEmptyColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        ratingLabelColor: darkMode ? 'rgba(255,255,255,0.7)' : '#616161',
        textFieldColor: darkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
        textFieldBorderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
        textFieldHoverBorderColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.87)',
        textFieldFocusedBorderColor: darkMode ? '#e8b84b' : '#7b1113',
        textFieldPlaceholderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',

        // ── Tab tokens ────────────────────────────────────────────────────
        tabColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
        tabSelectedColor: darkMode ? '#e8b84b' : '#7b1113',
        tabIndicatorColor: darkMode ? '#e8b84b' : '#7b1113',

        // ── Chip named tokens ─────────────────────────────────────────────
        chipBg: darkMode ? 'rgba(255,255,255,0.08)' : 'white',
        chipColor: darkMode ? '#e8b84b' : '#7b1113',
        chipBorder: darkMode ? '1px solid rgba(232,184,75,0.3)' : 'none',
        chipShadow: darkMode ? 'none' : '0 4px 12px rgba(123,17,19,0.1)',
        chipBackdropFilter: darkMode ? 'blur(10px)' : 'none',
        chipIconColor: darkMode ? '#e8b84b' : '#a01518',

        // ── Generic Paper tokens ──────────────────────────────────────────
        paperBg: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
        paperBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        paperBackdropFilter: darkMode ? 'blur(20px)' : 'none',
        paperShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(123,17,19,0.1)',

        // ── IconButton tokens ─────────────────────────────────────────────
        iconButtonBg: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
        iconButtonHoverBg: darkMode ? 'rgba(255,255,255,0.15)' : '#e0e0e0',
        iconButtonColor: darkMode ? '#fce4ec' : 'inherit',

        // ── Dot indicator ─────────────────────────────────────────────────
        dotColor: darkMode ? 'rgba(255,255,255,0.25)' : '#bdbdbd',
    };
};
