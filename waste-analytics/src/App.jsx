import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Insights from './pages/Insights';
import DataEntry from './pages/DataEntry';
import DataLogs from './pages/DataLogs';
import Survey from './pages/Survey';
import Awareness from './pages/Awareness';
import QuizPage from './pages/QuizPage';
import React from 'react';

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin-only login portal — access via /admin */}
      <Route path="/admin" element={<AdminLoginPage />} />

      {/* Protected 5S+ system — requires login */}
      <Route
        path="/5s-system"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="awareness" replace />} />

        {/* Guest + Admin pages */}
        <Route path="awareness" element={<Awareness />} />
        <Route path="survey" element={<Survey />} />
        <Route path="quiz" element={<QuizPage />} />

        {/* Admin-only pages */}
        <Route path="dashboard"  element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="monitoring" element={<ProtectedRoute adminOnly><Monitoring /></ProtectedRoute>} />
        <Route path="insights"   element={<ProtectedRoute adminOnly><Insights /></ProtectedRoute>} />
        <Route path="data-entry" element={<ProtectedRoute adminOnly><DataEntry /></ProtectedRoute>} />
        <Route path="data-logs" element={<ProtectedRoute adminOnly><DataLogs /></ProtectedRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
