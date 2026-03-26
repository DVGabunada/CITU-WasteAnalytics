import React, { useState, useEffect, useRef } from 'react';
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
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    ListAlt as ListAltIcon,
    Search as SearchIcon,
    FileDownload as ExportIcon,
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon,
    CalendarMonth as CalendarIcon,
    KeyboardArrowDown as ArrowDownIcon,
    FilterList as FilterListIcon,
    TrendingDown as LeastIcon,
} from '@mui/icons-material';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { usePageTheme } from '../hooks/usePageTheme';
import { getTransactions } from '../data/dataStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ── helpers ──────────────────────────────────────────────────────────────────

const categoryColorLight = (cat) => {
    const map = {
        'Biodegradable': '#2e7d32',
        'Recyclable':    '#1565c0',
        'Residual':      '#6a1b9a',
        'Hazardous':     '#b71c1c',
        'Special':       '#e65100',
    };
    return map[cat] ?? '#37474f';
};

const categoryColorDark = (cat) => {
    const map = {
        'Biodegradable': '#69f0ae',
        'Recyclable':    '#82b1ff',
        'Residual':      '#ea80fc',
        'Hazardous':     '#ff8a80',
        'Special':       '#ffab40',
    };
    return map[cat] ?? '#b0bec5';
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

// Returns "YYYY-MM" for the current month
const getCurrentMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

// Format "YYYY-MM" → "March 2026"
const formatMonthLabel = (ym) => {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

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
    const [maxWeight, setMaxWeight] = useState('all'); // 'all'|5|20|50|100

    // Export state
    const [exportAnchor, setExportAnchor] = useState(null);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState(''); // 'pdf' | 'excel'
    const [exportMonth, setExportMonth] = useState(getCurrentMonth());
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });

    useEffect(() => {
        const data = getTransactions();
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
        const textMatch =
            (r.officeName ?? '').toLowerCase().includes(q) ||
            (r.category ?? '').toLowerCase().includes(q) ||
            (r.date ?? '').toLowerCase().includes(q) ||
            (r.notes ?? '').toLowerCase().includes(q);
        const weightMatch = maxWeight === 'all' || (r.weight ?? 0) <= Number(maxWeight);
        return textMatch && weightMatch;
    });

    const handleLeastFirst = () => {
        setOrderBy('weight');
        setOrder('asc');
        setPage(0);
    };

    const sorted = [...filtered].sort(getComparator(order, orderBy));
    const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const pt = usePageTheme();
    const { darkMode } = pt;
    const categoryColor = darkMode ? categoryColorDark : categoryColorLight;

    // ── Export helpers ─────────────────────────────────────────────────────────

    const openExportMenu = (e) => setExportAnchor(e.currentTarget);
    const closeExportMenu = () => setExportAnchor(null);

    const openExportDialog = (format) => {
        setExportFormat(format);
        setExportMonth(getCurrentMonth());
        closeExportMenu();
        setExportDialogOpen(true);
    };

    // Filter all rows (not just current page) by the chosen month
    const getExportRows = () => {
        if (!exportMonth) return rows;
        return rows.filter((r) => {
            const dateStr = r.date ?? '';
            // date field can be "YYYY-MM-DD" or other formats — match the "YYYY-MM" prefix
            return dateStr.startsWith(exportMonth);
        });
    };

    const handleExport = () => {
        const exportRows = getExportRows();

        if (exportRows.length === 0) {
            setSnackbar({ open: true, msg: `No records found for ${formatMonthLabel(exportMonth)}.`, severity: 'warning' });
            setExportDialogOpen(false);
            return;
        }

        const monthLabel = formatMonthLabel(exportMonth);
        const filename = `CIT-U-Waste-Data-${exportMonth}`;
        const tableData = exportRows.map((r) => ([
            r.date ?? '—',
            r.officeName ?? '—',
            r.category ?? '—',
            r.weight != null ? `${r.weight} kg` : '—',
            r.notes ?? '—',
        ]));

        if (exportFormat === 'pdf') {
            const doc = new jsPDF({ orientation: 'landscape' });

            // Header banner
            doc.setFillColor(123, 17, 19);
            doc.rect(0, 0, doc.internal.pageSize.width, 22, 'F');
            doc.setTextColor(232, 184, 75);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('CIT-U 5S+ Waste Monitoring System', 14, 10);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Waste Data Log — ${monthLabel}`, 14, 17);

            // Generated date (right side)
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 50, 17);

            // Table
            autoTable(doc, {
                startY: 28,
                head: [['Collection Date', 'Office', 'Waste Category', 'Weight (kg)', 'Notes']],
                body: tableData,
                headStyles: {
                    fillColor: [123, 17, 19],
                    textColor: [232, 184, 75],
                    fontStyle: 'bold',
                    fontSize: 9,
                },
                bodyStyles: { fontSize: 8.5, textColor: [30, 30, 30] },
                alternateRowStyles: { fillColor: [255, 248, 248] },
                columnStyles: {
                    0: { cellWidth: 32 },
                    3: { halign: 'right', cellWidth: 28 },
                    4: { cellWidth: 60 },
                },
                margin: { left: 14, right: 14 },
                didDrawPage: (data) => {
                    // Footer on each page
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(7);
                    doc.setTextColor(150);
                    doc.text(
                        `Page ${data.pageNumber} of ${pageCount}  |  CIT-U 5S+ Waste Analytics`,
                        14,
                        doc.internal.pageSize.height - 8
                    );
                },
            });

            doc.save(`${filename}.pdf`);
            setSnackbar({ open: true, msg: `PDF exported — ${exportRows.length} records for ${monthLabel}.`, severity: 'success' });

        } else if (exportFormat === 'excel') {
            const wsData = [
                ['CIT-U 5S+ Waste Monitoring System'],
                [`Waste Data Log — ${monthLabel}`],
                [`Generated: ${new Date().toLocaleDateString()}`],
                [],
                ['Collection Date', 'Office', 'Waste Category', 'Weight (kg)', 'Notes'],
                ...tableData,
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Column widths
            ws['!cols'] = [
                { wch: 18 },
                { wch: 30 },
                { wch: 18 },
                { wch: 14 },
                { wch: 40 },
            ];

            // Merge title rows
            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, monthLabel.replace(' ', '_'));
            XLSX.writeFile(wb, `${filename}.xlsx`);
            setSnackbar({ open: true, msg: `Excel exported — ${exportRows.length} records for ${monthLabel}.`, severity: 'success' });
        }

        setExportDialogOpen(false);
    };

    // ── UI ────────────────────────────────────────────────────────────────────

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
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1400px', mx: 'auto' }}>

                {/* ── Header ── */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
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

                        {/* Export button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: { xs: 1, md: 1.5 } }}>
                            <Button
                                variant="contained"
                                startIcon={<ExportIcon />}
                                endIcon={<ArrowDownIcon />}
                                onClick={openExportMenu}
                                sx={{
                                    background: 'linear-gradient(135deg, #7b1113 0%, #a01518 100%)',
                                    color: '#e8b84b',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    px: 2.5,
                                    py: 1,
                                    boxShadow: '0 4px 16px rgba(123,17,19,0.35)',
                                    border: '1px solid rgba(232,184,75,0.25)',
                                    textTransform: 'none',
                                    fontSize: '0.9rem',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #a01518 0%, #c62828 100%)',
                                        boxShadow: '0 6px 24px rgba(123,17,19,0.45)',
                                    },
                                }}
                            >
                                Export
                            </Button>

                            {/* Export dropdown menu */}
                            <Menu
                                anchorEl={exportAnchor}
                                open={Boolean(exportAnchor)}
                                onClose={closeExportMenu}
                                PaperProps={{
                                    sx: {
                                        borderRadius: '16px',
                                        minWidth: 200,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(123,17,19,0.1)',
                                        overflow: 'hidden',
                                        mt: 0.5,
                                    },
                                }}
                            >
                                <Box sx={{ px: 2, py: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'text.secondary' }}>
                                        Choose format
                                    </Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={() => openExportDialog('pdf')} sx={{ gap: 1.5, py: 1.5, px: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 0 }}>
                                        <PdfIcon sx={{ color: '#b71c1c', fontSize: 22 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Export as PDF"
                                        secondary="Formatted report document"
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                    />
                                </MenuItem>
                                <MenuItem onClick={() => openExportDialog('excel')} sx={{ gap: 1.5, py: 1.5, px: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 0 }}>
                                        <ExcelIcon sx={{ color: '#2e7d32', fontSize: 22 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Export as Excel"
                                        secondary="Spreadsheet (.xlsx)"
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                    />
                                </MenuItem>
                            </Menu>
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
                    {/* Search + filter bar */}
                    <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
                            sx={{ width: { xs: '100%', sm: 340 }, ...pt.inputSx }}
                        />

                        {/* Max weight filter */}
                        <FormControl size="small" sx={{ minWidth: 170, ...pt.inputSx }}>
                            <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
                                <FilterListIcon sx={{ fontSize: 15 }} /> Max Weight
                            </InputLabel>
                            <Select
                                value={maxWeight}
                                label="Max Weight"
                                onChange={(e) => { setMaxWeight(e.target.value); setPage(0); }}
                                sx={{ borderRadius: '10px', fontSize: '0.875rem' }}
                            >
                                <MenuItem value="all">All weights</MenuItem>
                                <MenuItem value={5}>≤ 5 kg</MenuItem>
                                <MenuItem value={20}>≤ 20 kg</MenuItem>
                                <MenuItem value={50}>≤ 50 kg</MenuItem>
                                <MenuItem value={100}>≤ 100 kg</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Least waste first shortcut */}
                        <Chip
                            icon={<LeastIcon sx={{ fontSize: 16 }} />}
                            label="Least waste first"
                            onClick={handleLeastFirst}
                            variant={orderBy === 'weight' && order === 'asc' ? 'filled' : 'outlined'}
                            sx={{
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                                borderColor: '#e8b84b',
                                color: orderBy === 'weight' && order === 'asc' ? 'white' : '#e8b84b',
                                bgcolor: orderBy === 'weight' && order === 'asc' ? '#a01518' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(232,184,75,0.12)' },
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
                                            <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap', color: pt.tableCellColor }}>
                                                {row.date ?? '—'}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.875rem', color: pt.tableCellColor }}>
                                                {row.officeName ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: darkMode
                                                            ? `${categoryColor(row.category)}22`
                                                            : `${categoryColor(row.category)}18`,
                                                        color: categoryColor(row.category),
                                                        fontWeight: 700,
                                                        fontSize: '0.82rem',
                                                        borderRadius: '8px',
                                                        border: darkMode
                                                            ? `1px solid ${categoryColor(row.category)}55`
                                                            : 'none',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem', color: pt.tableWeightColor }}>
                                                {row.weight != null ? `${row.weight} kg` : '—'}
                                            </TableCell>
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

            {/* ── Export Dialog ── */}
            <Dialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        minWidth: { xs: '90vw', sm: 420 },
                        background: darkMode ? '#1e1e2e' : '#ffffff',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(123,17,19,0.1)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                        overflow: 'hidden',
                    },
                }}
            >
                {/* Dialog accent bar */}
                <Box sx={{ height: 5, background: 'linear-gradient(90deg, #e8b84b 0%, #7b1113 100%)' }} />

                <DialogTitle sx={{ pt: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {exportFormat === 'pdf'
                            ? <PdfIcon sx={{ color: '#b71c1c', fontSize: 28 }} />
                            : <ExcelIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
                        }
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: darkMode ? 'white' : '#2d1010' }}>
                                Export as {exportFormat === 'pdf' ? 'PDF' : 'Excel'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.2 }}>
                                Select a month to filter the export data
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, mb: 1 }}>
                        <CalendarIcon sx={{ color: '#7b1113', fontSize: 22 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            Month to export:
                        </Typography>
                    </Box>

                    {/* Native month picker */}
                    <Box
                        component="input"
                        type="month"
                        value={exportMonth}
                        onChange={(e) => setExportMonth(e.target.value)}
                        sx={{
                            width: '100%',
                            px: 2, py: 1.4,
                            borderRadius: '12px',
                            border: darkMode
                                ? '1px solid rgba(255,255,255,0.2)'
                                : '1px solid rgba(123,17,19,0.25)',
                            background: darkMode ? 'rgba(255,255,255,0.06)' : 'white',
                            color: darkMode ? 'white' : '#2d1010',
                            fontSize: '1rem',
                            outline: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            '&:focus': {
                                border: '1px solid #7b1113',
                                boxShadow: '0 0 0 3px rgba(123,17,19,0.12)',
                            },
                            colorScheme: darkMode ? 'dark' : 'light',
                        }}
                    />

                    {exportMonth && (
                        <Box sx={{
                            mt: 2, px: 2, py: 1.2, borderRadius: '10px',
                            background: darkMode ? 'rgba(232,184,75,0.1)' : 'rgba(123,17,19,0.05)',
                            border: darkMode ? '1px solid rgba(232,184,75,0.2)' : '1px solid rgba(123,17,19,0.1)',
                        }}>
                            <Typography sx={{ fontSize: '0.82rem', color: darkMode ? '#e8b84b' : '#7b1113', fontWeight: 600 }}>
                                {(() => {
                                    const count = rows.filter(r => (r.date ?? '').startsWith(exportMonth)).length;
                                    return count > 0
                                        ? `${count} record${count !== 1 ? 's' : ''} found for ${formatMonthLabel(exportMonth)}`
                                        : `No records found for ${formatMonthLabel(exportMonth)}`;
                                })()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                    <Button
                        onClick={() => setExportDialogOpen(false)}
                        sx={{
                            borderRadius: '10px', textTransform: 'none', fontWeight: 600,
                            color: 'text.secondary', px: 2.5,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleExport}
                        startIcon={exportFormat === 'pdf' ? <PdfIcon /> : <ExcelIcon />}
                        disabled={!exportMonth}
                        sx={{
                            borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3,
                            background: exportFormat === 'pdf'
                                ? 'linear-gradient(135deg, #7b1113 0%, #a01518 100%)'
                                : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                            '&:hover': {
                                background: exportFormat === 'pdf'
                                    ? 'linear-gradient(135deg, #a01518 0%, #c62828 100%)'
                                    : 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                            },
                        }}
                    >
                        Download {exportFormat === 'pdf' ? 'PDF' : 'Excel'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Success / Warning snackbar ── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DataLogs;
