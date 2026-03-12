import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './theme/theme'
import { BrowserRouter } from 'react-router-dom'
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Inner wrapper reads darkMode from context and swaps the MUI theme accordingly.
// This is the only reliable way to make MUI components (like DatePicker borders)
// respect dark mode — sx overrides cannot override palette-level defaults.
const DynamicThemeProvider = ({ children }) => {
  const { darkMode } = useThemeMode();
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <DynamicThemeProvider>
            <App />
          </DynamicThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeModeProvider>
  </React.StrictMode>,
)
