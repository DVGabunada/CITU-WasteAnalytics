import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser, getUserByUsername } from '../api/api';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

const SESSION_KEY = 'citu_5s_session';

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

    // ── Guest login (no password needed) ──────────────────────────────────────
    const loginAsGuest = (name = 'Guest') => {
        setSession({ role: 'guest', username: name });
    };

    // ── Admin signup ──────────────────────────────────────────────────────────
    const adminSignup = async (username, password) => {
        try {
            // Check for duplicate username
            const existing = await getUserByUsername(username);
            if (existing.length > 0) {
                return { ok: false, error: 'Username already exists.' };
            }

            // Register with backend
            const res = await createUser(username, password);
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
            if (user.password !== password) {
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
