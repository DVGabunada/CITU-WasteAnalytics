import React, { createContext, useContext, useState } from 'react';

const ThemeModeContext = createContext({
    darkMode: false,
    toggleDarkMode: () => { },
});

export const ThemeModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        try { return localStorage.getItem('5s-dark-mode') === 'true'; }
        catch { return false; }
    });

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('5s-dark-mode', String(next));
            return next;
        });
    };

    return (
        <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeModeContext.Provider>
    );
};

export const useThemeMode = () => useContext(ThemeModeContext);
