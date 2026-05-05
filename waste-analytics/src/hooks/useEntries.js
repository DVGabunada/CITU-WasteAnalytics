/**
 * useEntries — shared hook that fetches all waste entries from the backend API.
 *
 * Returns { rows, loading, error } where `rows` is the mapped array of entries
 * in the same shape used by Dashboard, Monitoring, and Insights:
 *   { id, date, officeName, category, weight, collector, notes }
 *
 * The data is fetched once on mount. Pass `refetchTrigger` (increment it) to
 * force a re-fetch if needed.
 */
import { useState, useEffect } from 'react';
import { getAllEntries } from '../api/api';

const mapEntry = (e) => ({
    id:         e.id,
    date:       e.date,
    officeName: e.office,
    category:   e.wasteCategory,
    weight:     e.weight,
    collector:  e.collector,
    notes:      e.note,
});

export const useEntries = (refetchTrigger = 0) => {
    const [rows,    setRows]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');

        getAllEntries()
            .then(data => {
                if (!cancelled) setRows(data.map(mapEntry));
            })
            .catch(() => {
                if (!cancelled) setError('Could not load entries. Is the backend running?');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [refetchTrigger]);

    return { rows, loading, error };
};
