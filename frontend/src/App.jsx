import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
import EnterpriseLogin from './pages/EnterpriseLogin';
import EnterpriseSignup from './pages/EnterpriseSignup';
import Dashboard from './pages/Dashboard';
import ProductCatalog from './pages/ProductCatalog';
import WarehouseOperations from './pages/WarehouseOperations';
import StockLedger from './pages/StockLedger';
import Receipts from './pages/Receipts';
import DeliveryOrders from './pages/DeliveryOrders';
import InternalTransfers from './pages/InternalTransfers';
import StockAdjustments from './pages/StockAdjustments';
import WarehousesSettings from './pages/WarehousesSettings';
import UserProfile from './pages/UserProfile';

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

          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Products Management */}
          <Route path="/products" element={<ProductCatalog />} />

          {/* Operations & Workflows */}
          <Route path="/operations" element={<WarehouseOperations />} />
          <Route path="/warehouse-operations" element={<WarehouseOperations />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/deliveries" element={<DeliveryOrders />} />
          <Route path="/delivery-orders" element={<DeliveryOrders />} />
          <Route path="/transfers" element={<InternalTransfers />} />
          <Route path="/internal-transfers" element={<InternalTransfers />} />
          <Route path="/adjustments" element={<StockAdjustments />} />
          <Route path="/stock-adjustments" element={<StockAdjustments />} />

          {/* Ledger & Facilities */}
          <Route path="/ledger" element={<StockLedger />} />
          <Route path="/move-history" element={<StockLedger />} />
          <Route path="/facilities" element={<StockLedger />} />
          <Route path="/warehouses" element={<WarehousesSettings />} />
          <Route path="/settings" element={<WarehousesSettings />} />

          {/* User Profile */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-profile" element={<UserProfile />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;