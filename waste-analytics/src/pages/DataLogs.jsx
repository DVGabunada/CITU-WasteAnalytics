import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Chip,
    TextField,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import {
    ListAlt as ListAltIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { usePageTheme } from '../hooks/usePageTheme';
import { getTransactions } from '../data/dataStore';
// ── helpers ──────────────────────────────────────────────────────────────────

const categoryColor = (cat) => {
    const map = {
        'Biodegradable': '#43a047',
        'Recyclable': '#1565c0',
        'Residual': '#6a1b9a',
        'Hazardous': '#b71c1c',
        'Special': '#e65100',
    };
    return map[cat] ?? '#37474f';
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// ── columns ───────────────────────────────────────────────────────────────────

const columns = [
    { id: 'date', label: 'Collection Date', minWidth: 120 },
    { id: 'officeName', label: 'Office', minWidth: 160 },
    { id: 'category', label: 'Waste Category', minWidth: 130 },
    { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right' },
    { id: 'notes', label: 'Notes', minWidth: 160 },
];

// ── component ────────────────────────────────────────────────────────────────

const DataLogs = () => {
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const data = getTransactions();
        // Reverse so newest entries appear first by default
        setRows([...data].reverse());
    }, []);

    const handleSort = (col) => {
        const isAsc = orderBy === col && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(col);
        setPage(0);
    };

    const filtered = rows.filter((r) => {
        const q = filter.toLowerCase();
        return (
            (r.officeName ?? '').toLowerCase().includes(q) ||
            (r.category ?? '').toLowerCase().includes(q) ||
            (r.date ?? '').toLowerCase().includes(q) ||
            (r.notes ?? '').toLowerCase().includes(q)
        );
    });

    const sorted = [...filtered].sort(getComparator(order, orderBy));
    const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const pt = usePageTheme();

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
        }}
        >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1400px', mx: 'auto' }}>

                {/* ── Header ── */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>

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
                                Data Logs
                            </Typography>
                            <Typography variant="body1" sx={{ color: pt.subtitleColor, fontWeight: 500, mt: 0.5 }}>
                                All waste data entries recorded from the Data Entry page.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Stats chip */}
                    <Chip
                        icon={<ListAltIcon />}
                        label={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} found`}
                        sx={{ ...pt.chipSx, mt: 2 }}
                    />
                </Box>

                {/* ── Table Card ── */}
                <Paper elevation={0} sx={{
                    borderRadius: '24px', overflow: 'hidden',
                    position: 'relative',
                    ...pt.cardSx,
                    '&::before': {
                        content: '""', position: 'absolute', top: 0, left: 0, right: 0,
                        height: pt.accentBarH,
                        background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)',
                    },
                }}>
                    {/* Search bar */}
                    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search by office, category, date, or notes…"
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setPage(0); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#e8b84b' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: { xs: '100%', sm: 380 },
                                ...pt.inputSx,
                            }}
                        />
                    </Box>

                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.id}
                                            align={col.align ?? 'left'}
                                            sortDirection={orderBy === col.id ? order : false}
                                            sx={{
                                                minWidth: col.minWidth,
                                                ...pt.tableHeadSx,
                                                fontWeight: 700, fontSize: '0.875rem', py: 1.5,
                                            }}
                                        >
                                            <TableSortLabel
                                                active={orderBy === col.id}
                                                direction={orderBy === col.id ? order : 'asc'}
                                                onClick={() => handleSort(col.id)}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                                            <Typography color="text.secondary">
                                                {filter ? 'No records match your search.' : 'No data entries yet. Go to Data Entry to add records.'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((row, idx) => (
                                        <TableRow
                                            key={row.id ?? idx}
                                            hover sx={pt.tableRowSx}
                                        >
                                            {/* Collection Date */}
                                            <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap', color: pt.tableCellColor }}>
                                                {row.date ?? '—'}
                                            </TableCell>

                                            {/* Office */}
                                            <TableCell sx={{ fontSize: '0.875rem', color: pt.tableCellColor }}>
                                                {row.officeName ?? '—'}
                                            </TableCell>

                                            {/* Category */}
                                            <TableCell>
                                                <Chip
                                                    label={row.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${categoryColor(row.category)}18`,
                                                        color: categoryColor(row.category),
                                                        fontWeight: 600,
                                                        fontSize: '0.82rem',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Weight */}
                                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem', color: pt.tableWeightColor }}>
                                                {row.weight != null ? `${row.weight} kg` : '—'}
                                            </TableCell>

                                            {/* Notes */}
                                            <TableCell sx={{ fontSize: '0.875rem', color: pt.tableNoteColor, maxWidth: 220 }}>
                                                {row.notes ? (
                                                    <Tooltip title={row.notes} placement="top-start">
                                                        <Box sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: 240,
                                                            cursor: 'default',
                                                        }}>
                                                            {row.notes}
                                                        </Box>
                                                    </Tooltip>
                                                ) : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={sorted.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
                        sx={pt.paginationSx}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default DataLogs;
