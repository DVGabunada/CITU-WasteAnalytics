import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser, getUserByUsername } from '../api/api';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

const SESSION_KEY = 'citu_5s_session';

// ─── SHA-256 hash using the browser's built-in Web Crypto API ─────────────────
// Deterministic: same password always produces the same 64-char hex digest.
// No external library required — crypto.subtle is available in all modern browsers.
const hashPassword = async (plaintext) => {
    const encoded = new TextEncoder().encode(plaintext);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(() => {
        try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
        catch { return null; }
    });

    // Persist session across refreshes
    useEffect(() => {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        else localStorage.removeItem(SESSION_KEY);
    }, [session]);

    // ── Student login (validates @cit.edu email + student ID on the page) ────────
    const loginAsGuest = (email = '', studentId = '') => {
        setSession({ role: 'guest', username: email, studentId });
    };

    // ── Admin signup ──────────────────────────────────────────────────────────
    const adminSignup = async (username, password) => {
        try {
            // Check for duplicate username
            const existing = await getUserByUsername(username);
            if (existing.length > 0) {
                return { ok: false, error: 'Username already exists.' };
            }

            // Hash the password before sending to the backend.
            // The plaintext password never leaves the browser.
            const hashedPassword = await hashPassword(password);

            // Register with backend (stores the SHA-256 hash, never the plaintext)
            const res = await createUser(username, hashedPassword);
            if (!res.ok) {
                return { ok: false, error: 'Failed to create account. Please try again.' };
            }

            setSession({ role: 'admin', username });
            return { ok: true };
        } catch {
            return { ok: false, error: 'Network error. Is the backend running?' };
        }
    };

    // ── Admin login ───────────────────────────────────────────────────────────
    const adminLogin = async (username, password) => {
        try {
            const users = await getUserByUsername(username);
            if (users.length === 0) {
                return { ok: false, error: 'Invalid username or password.' };
            }
            const user = users[0];

            // Hash the entered password and compare against the stored hash
            const hashedPassword = await hashPassword(password);
            if (user.password !== hashedPassword) {
                return { ok: false, error: 'Invalid username or password.' };
            }

            setSession({ role: 'admin', username: user.username, isAdmin: user.admin });
            return { ok: true };
        } catch {
            return { ok: false, error: 'Network error. Is the backend running?' };
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = () => setSession(null);

    const isAdmin = session?.role === 'admin';
    const isGuest = session?.role === 'guest';
    const isLoggedIn = !!session;

    return (
        <AuthContext.Provider value={{
            session, isLoggedIn, isAdmin, isGuest,
            loginAsGuest, adminSignup, adminLogin, logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
