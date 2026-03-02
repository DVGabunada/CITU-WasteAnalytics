import { useThemeMode } from '../context/ThemeContext';

/**
 * Returns consistent light/dark styling tokens used across all inner pages.
 * Each page can supplement these with its own accent-specific overrides.
 */
export const usePageTheme = () => {
    const { darkMode, toggleDarkMode } = useThemeMode();

    return {
        darkMode,
        toggleDarkMode,

        // ── Page backgrounds ──────────────────────────────────────────────
        pageBg: darkMode
            ? 'linear-gradient(160deg, #111e17 0%, #1a2e21 60%, #111e17 100%)'
            : 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #e8f5e9 100%)',

        pageBeforeBg: darkMode
            ? 'radial-gradient(ellipse at 50% 0%, rgba(105,240,174,0.08) 0%, transparent 70%)'
            : 'linear-gradient(135deg, rgba(46,125,50,0.05) 0%, rgba(104,159,56,0.05) 100%)',

        // ── Title gradient ────────────────────────────────────────────────
        titleGradient: darkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #a5d6a7 50%, #69f0ae 100%)'
            : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',

        // ── Text ──────────────────────────────────────────────────────────
        subtitleColor: darkMode ? 'rgba(255,255,255,0.55)' : '#558b2f',
        sectionTitleColor: darkMode ? '#e0e0e0' : '#1a237e',
        bodyTextColor: darkMode ? 'rgba(255,255,255,0.7)' : '#37474f',
        secondaryTextColor: darkMode ? 'rgba(255,255,255,0.5)' : '#546e7a',
        chartTitleColor: darkMode ? '#e8f5e9' : '#1b5e20',

        // ── Date Chip ─────────────────────────────────────────────────────
        chipSx: darkMode
            ? {
                bgcolor: 'rgba(255,255,255,0.08)',
                color: '#69f0ae',
                fontWeight: 600,
                fontSize: '0.9rem', py: 2.5, px: 1,
                border: '1px solid rgba(105,240,174,0.25)',
                backdropFilter: 'blur(10px)',
                '& .MuiChip-icon': { color: '#69f0ae' },
            }
            : {
                bgcolor: 'white',
                color: '#2e7d32',
                fontWeight: 600,
                fontSize: '0.9rem', py: 2.5, px: 1,
                boxShadow: '0 4px 12px rgba(46,125,50,0.1)',
                '& .MuiChip-icon': { color: '#43a047' },
            },

        // ── Period Select ─────────────────────────────────────────────────
        selectSx: darkMode
            ? {
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(105,240,174,0.25)',
                backdropFilter: 'blur(10px)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: '#69f0ae' },
                fontWeight: 600, color: '#69f0ae',
            }
            : {
                bgcolor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(46,125,50,0.1)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                fontWeight: 600, color: '#2e7d32',
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
                boxShadow: '0 10px 40px rgba(46,125,50,0.12)',
            },

        // ── Top accent bar color ──────────────────────────────────────────
        accentBarH: darkMode ? '3px' : '4px',

        // ── Divider ───────────────────────────────────────────────────────
        dividerSx: darkMode ? { bgcolor: 'rgba(255,255,255,0.1)' } : {},

        // ── Input field styles ────────────────────────────────────────────
        inputSx: darkMode
            ? {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#69f0ae' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#69f0ae' },
            }
            : { '& .MuiOutlinedInput-root': { borderRadius: 3 } },

        selectInputSx: darkMode
            ? {
                '& .MuiOutlinedInput-root': { borderRadius: 3, color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#69f0ae' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#69f0ae' },
                '& .MuiSelect-icon': { color: '#69f0ae' },
                '& .MuiSelect-select': { color: 'white' },
            }
            : { '& .MuiOutlinedInput-root': { borderRadius: 3 } },

        // ── Table ─────────────────────────────────────────────────────────
        tableHeadSx: darkMode
            ? { bgcolor: 'rgba(255,255,255,0.04)', color: '#69f0ae', borderBottom: '1px solid rgba(255,255,255,0.1)' }
            : { bgcolor: '#f9fbe7', color: '#2e7d32', borderBottom: '2px solid #c8e6c9' },

        tableRowSx: darkMode
            ? {
                '&:nth-of-type(even)': { bgcolor: 'rgba(255,255,255,0.03)' },
                '&:hover': { bgcolor: 'rgba(105,240,174,0.06) !important' },
                transition: 'background 0.15s',
            }
            : { '&:nth-of-type(even)': { bgcolor: '#f9fbe7' }, transition: 'background 0.15s' },

        tableCellColor: darkMode ? 'rgba(255,255,255,0.75)' : 'inherit',
        tableWeightColor: darkMode ? '#69f0ae' : '#2e7d32',
        tableNoteColor: darkMode ? 'rgba(255,255,255,0.5)' : '#546e7a',

        paginationSx: darkMode
            ? {
                borderTop: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                '& .MuiTablePagination-selectIcon': { color: '#69f0ae' },
                '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiIconButton-root.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
            }
            : { borderTop: '1px solid #e8f5e9' },

        // ── Survey purple-accent tokens ────────────────────────────────────
        formLabelColor: darkMode ? '#ce93d8' : '#4a148c',
        radioCheckedColor: darkMode ? '#ce93d8' : '#7b1fa2',
        radioColor: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
        radioLabelColor: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
        ratingEmptyColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        ratingLabelColor: darkMode ? 'rgba(255,255,255,0.7)' : '#616161',
        textFieldColor: darkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
        textFieldBorderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
        textFieldHoverBorderColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.87)',
        textFieldFocusedBorderColor: darkMode ? '#ce93d8' : '#7b1fa2',
        textFieldPlaceholderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',

        // ── Survey/Awareness Tab tokens ────────────────────────────────────
        tabColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
        tabSelectedColor: darkMode ? '#ce93d8' : '#7b1fa2',
        tabIndicatorColor: darkMode ? '#ce93d8' : '#7b1fa2',

        // ── Chip tokens (named for direct use when chip.mt overrides needed)
        chipBg: darkMode ? 'rgba(255,255,255,0.08)' : 'white',
        chipColor: darkMode ? '#69f0ae' : '#2e7d32',
        chipBorder: darkMode ? '1px solid rgba(105,240,174,0.25)' : 'none',
        chipShadow: darkMode ? 'none' : '0 4px 12px rgba(46,125,50,0.1)',
        chipBackdropFilter: darkMode ? 'blur(10px)' : 'none',
        chipIconColor: darkMode ? '#69f0ae' : '#43a047',

        // ── Generic Paper tokens (for cards without named cardSx needed)
        paperBg: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
        paperBorder: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        paperBackdropFilter: darkMode ? 'blur(20px)' : 'none',
        paperShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(123,31,162,0.12)',

        // ── Card background / backdrop (for Card components in Awareness) ─────────
        cardBg: darkMode ? 'rgba(255,255,255,0.04)' : 'white',
        cardBackdropFilter: darkMode ? 'blur(16px)' : 'none',

        // ── IconButton (trivia nav arrows) ───────────────────────────────
        iconButtonBg: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
        iconButtonHoverBg: darkMode ? 'rgba(255,255,255,0.15)' : '#e0e0e0',
        iconButtonColor: darkMode ? '#e8f5e9' : 'inherit',

        // ── Dot / pagination indicator ─────────────────────────────────
        dotColor: darkMode ? 'rgba(255,255,255,0.25)' : '#bdbdbd',
    };
};
