import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Admin credentials stored in localStorage key ─────────────────────────────
const ADMIN_STORE_KEY = 'citu_5s_admins';
const SESSION_KEY = 'citu_5s_session';

function getAdmins() {
    try { return JSON.parse(localStorage.getItem(ADMIN_STORE_KEY)) || []; }
    catch { return []; }
}

function saveAdmins(list) {
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(list));
}

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
    const adminSignup = (username, password) => {
        const admins = getAdmins();
        if (admins.find(a => a.username.toLowerCase() === username.toLowerCase())) {
            return { ok: false, error: 'Username already exists.' };
        }
        const updated = [...admins, { username, password }];
        saveAdmins(updated);
        setSession({ role: 'admin', username });
        return { ok: true };
    };

    // ── Admin login ───────────────────────────────────────────────────────────
    const adminLogin = (username, password) => {
        const admins = getAdmins();
        const match = admins.find(
            a => a.username.toLowerCase() === username.toLowerCase() && a.password === password
        );
        if (!match) return { ok: false, error: 'Invalid username or password.' };
        setSession({ role: 'admin', username: match.username });
        return { ok: true };
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
