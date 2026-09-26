import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EnterpriseLogin from './pages/EnterpriseLogin';
import EnterpriseSignup from './pages/EnterpriseSignup';
import Dashboard from './pages/Dashboard';
import ProductCatalog from './pages/ProductCatalog';
import Receipts from './pages/Receipts';
import DeliveryOrders from './pages/DeliveryOrders';
import InternalTransfers from './pages/InternalTransfers';
import StockAdjustments from './pages/StockAdjustments';
import StockLedger from './pages/StockLedger';
import WarehousesSettings from './pages/WarehousesSettings';
import UserProfile from './pages/UserProfile';
import WarehouseOperations from './pages/WarehouseOperations';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<EnterpriseLogin />} />
          <Route path="/login" element={<EnterpriseLogin />} />
          <Route path="/signin" element={<EnterpriseLogin />} />
          <Route path="/signup" element={<EnterpriseSignup />} />
          <Route path="/register" element={<EnterpriseSignup />} />

          {/* Main App Workspace Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/deliveries" element={<DeliveryOrders />} />
          <Route path="/transfers" element={<InternalTransfers />} />
          <Route path="/adjustments" element={<StockAdjustments />} />
          <Route path="/ledger" element={<StockLedger />} />
          <Route path="/move-history" element={<StockLedger />} />
          <Route path="/warehouses" element={<WarehousesSettings />} />
          <Route path="/settings" element={<WarehousesSettings />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/operations" element={<WarehouseOperations />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
