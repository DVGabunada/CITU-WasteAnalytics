// ─── Base URL ─────────────────────────────────────────────────────────────────
// Override via VITE_API_BASE_URL in .env.local if the backend runs elsewhere.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v3';

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * POST /api/v3/users/add
 */
export async function createUser(username, password) {
    return fetch(`${BASE_URL}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, admin: false }),
    });
}

/**
 * Fetch a user by username.
 * GET /api/v3/users/{username}
 * @returns {Promise<Array<{id, username, password, admin}>>}
 */
export async function getUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`);
    if (!res.ok) return [];
    return res.json();
}

// ─── Entries ──────────────────────────────────────────────────────────────────

/**
 * Submit a new waste entry.
 * POST /api/v3/entries/add
 * @param {{ date, office, wasteCategory, weight, collector, note }} entry
 */
export async function createEntry(entry) {
    return fetch(`${BASE_URL}/entries/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
    });
}

/**
 * Fetch all waste entries.
 * GET /api/v3/entries
 * @returns {Promise<Array<{id, date, office, wasteCategory, weight, collector, note}>>}
 */
export async function getAllEntries() {
    const res = await fetch(`${BASE_URL}/entries`);
    if (!res.ok) throw new Error('Failed to fetch entries');
    return res.json();
}

/**
 * Update an existing waste entry.
 * PUT /api/v3/entries/{id}
 */
export async function updateEntry(id, entry) {
    const res = await fetch(`${BASE_URL}/entries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error('Failed to update entry');
    // Backend returns a plain string, not JSON
    return res.text();
}

/**
 * Delete one or more waste entries.
 * DELETE /api/v3/entries/{id}  (called once per id)
 */
export async function deleteEntry(id) {
    const res = await fetch(`${BASE_URL}/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete entry ${id}`);
}
