import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import DataLogs from './pages/DataLogs';
import Survey from './pages/Survey';
import Awareness from './pages/Awareness';
import React from 'react';

function App() {
  return (
    <Routes>
      {/* Landing page — no sidebar */}
      <Route path="/" element={<LandingPage />} />

      {/* 5S+ System — all pages with sidebar */}
      <Route path="/5s-system" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="data-entry" element={<DataEntry />} />
        <Route path="data-logs" element={<DataLogs />} />
        <Route path="survey" element={<Survey />} />
        <Route path="awareness" element={<Awareness />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
