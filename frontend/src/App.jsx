import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnterpriseLogin from './pages/EnterpriseLogin';
import EnterpriseSignup from './pages/EnterpriseSignup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterpriseLogin />} />
        <Route path="/login" element={<EnterpriseLogin />} />
        <Route path="/signin" element={<EnterpriseLogin />} />
        <Route path="/signup" element={<EnterpriseSignup />} />
        <Route path="/register" element={<EnterpriseSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
