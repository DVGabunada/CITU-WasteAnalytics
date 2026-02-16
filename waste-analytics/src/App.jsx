import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="data-entry" element={<DataEntry />} />
      </Route>
    </Routes>
  );
}

export default App;
