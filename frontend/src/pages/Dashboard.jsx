import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';
import Sidebar, { useSidebarState } from '../components/Sidebar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [stats, setStats] = useState({
    total_products: 0,
    total_warehouses: 0,
    total_internal_locations: 0,
    total_stock_quantity: 0,
    total_inventory_value: 0,
    low_stock_count: 0,
    pending_operations_count: 0,
    pending_receipts_count: 0,
    pending_deliveries_count: 0,
    pending_transfers_count: 0,
  });

  const [operations, setOperations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWarehouse, selectedCategory]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let statsUrl = `${API_BASE}/api/dashboard/stats`;
      const params = new URLSearchParams();
      if (selectedWarehouse && selectedWarehouse !== 'All') {
        params.append('warehouse_id', selectedWarehouse);
      }
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category_id', selectedCategory);
      }
      if (params.toString()) {
        statsUrl += `?${params.toString()}`;
      }

      const [statsRes, opsRes, catRes, whRes] = await Promise.all([
        axios.get(statsUrl),
        axios.get(`${API_BASE}/api/operations`),
        axios.get(`${API_BASE}/api/categories`),
        axios.get(`${API_BASE}/api/warehouses`),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (opsRes.data && Array.isArray(opsRes.data)) setOperations(opsRes.data);
      if (catRes.data && Array.isArray(catRes.data)) setCategories(catRes.data);
      if (whRes.data && Array.isArray(whRes.data)) setWarehouses(whRes.data);
    } catch (err) {
      console.error('Error fetching live dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOperations = operations.filter((op) => {
    const opType = (op.type || '').toLowerCase();
    if (activeTab === 'receipts' && opType !== 'receipt') return false;
    if (activeTab === 'deliveries' && opType !== 'delivery') return false;
    if (activeTab === 'transfers' && opType !== 'internal') return false;

    if (selectedStatus !== 'All' && (op.status || '').toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const refMatch = op.reference && op.reference.toLowerCase().includes(q);
      const partnerMatch = op.supplier_or_customer && op.supplier_or_customer.toLowerCase().includes(q);
      const productMatch = op.product_name && op.product_name.toLowerCase().includes(q);
      const skuMatch = op.sku && op.sku.toLowerCase().includes(q);
      return refMatch || partnerMatch || productMatch || skuMatch;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeRoute="/dashboard"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Body Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
          }`}
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Search Input */}
            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-14 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
                placeholder="Search SKU, operation reference, vendor..."
                type="text"
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-600 hidden sm:inline-block">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live Feed Status */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                PostgreSQL Live DB Connected
              </span>
            </div>

            {/* Refresh Data */}
            <button
              type="button"
              onClick={fetchDashboardData}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh Dashboard Data"
            >
              <span className={`material-symbols-outlined text-xl ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          {/* Operations Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-200 text-slate-800 font-bold">
                  DC-MAIN-01
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  StockSense Engine Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Warehouse Inventory Operations Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Main Distribution Center • Real-time database telemetry • <span className="text-orange-600 font-semibold">100% Stock Traceability</span>
              </p>
            </div>
          </div>

          {/* 5 KPI Metric Cards (Connected to PostgreSQL Database) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Total In-Stock Volume */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Stock On-Hand</span>
                <span className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.total_stock_quantity.toLocaleString()} units</div>
                <div className="text-[11px] text-slate-500">{stats.total_products} unique SKUs</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  PostgreSQL Sync
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-semibold">${stats.total_inventory_value.toLocaleString()} Val</span>
              </div>
            </div>

            {/* Card 2: Low Stock Attention */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock Attention</span>
                <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.low_stock_count}</span>
                  <span className="text-xs font-semibold text-rose-600">SKUs Flagged</span>
                </div>
                <div className="text-[11px] text-slate-500">Below Reorder Min Level</div>
              </div>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">Needs Replenishment</span>
              </div>
            </div>

            {/* Card 3: Pending Receipts */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Receipts</span>
                <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                  <span className="material-symbols-outlined text-lg">move_to_inbox</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_receipts_count} Receipts</div>
                <div className="text-[11px] text-slate-500">Incoming Vendor Orders</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <Link to="/receipts" className="text-xs text-amber-700 font-semibold hover:underline">Manage Receipts →</Link>
              </div>
            </div>

            {/* Card 4: Pending Deliveries */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Deliveries</span>
                <span className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_deliveries_count} Deliveries</div>
                <div className="text-[11px] text-slate-500">Outbound Shipping Queue</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <Link to="/deliveries" className="text-xs text-orange-700 font-semibold hover:underline">Manage Deliveries →</Link>
              </div>
            </div>

            {/* Card 5: Total Pending Operations */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Operations</span>
                <span className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                  <span className="material-symbols-outlined text-lg">pending_actions</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_operations_count}</div>
                <div className="text-[11px] text-slate-500">Total Unvalidated Moves</div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">Live Status</span>
              </div>
            </div>
          </div>

          {/* Operations Data Table Section */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
            {/* Table Header Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-slate-900">Recent Warehouse Operations</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {filteredOperations.length} Total
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    All ({operations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'receipts'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Receipts
                  </button>
                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'deliveries'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Deliveries
                  </button>
                  <button
                    onClick={() => setActiveTab('transfers')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'transfers'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Transfers
                  </button>
                </div>

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Ready">Ready</option>
                  <option value="Done">Done</option>
                  <option value="Canceled">Canceled</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Filter / Search input */}
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-base pointer-events-none">
                    filter_list
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:bg-white border border-transparent focus:border-slate-300 transition-colors w-36 sm:w-44"
                    placeholder="Filter references..."
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                    <th className="py-3 px-4 sm:px-6">Reference</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Contact / Product</th>
                    <th className="py-3 px-4 sm:px-6">From → To Location</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Quantity</th>
                    <th className="py-3 px-4 sm:px-6 text-center">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOperations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                        No operations found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOperations.map((op) => {
                      const opType = (op.type || '').toLowerCase();
                      const isReceipt = opType === 'receipt';
                      const isDelivery = opType === 'delivery';
                      const isTransfer = opType === 'internal';

                      let typeColor = 'text-slate-600 bg-slate-100';
                      let typeIcon = 'tune';
                      if (isReceipt) {
                        typeColor = 'text-amber-600 bg-amber-50';
                        typeIcon = 'move_to_inbox';
                      } else if (isDelivery) {
                        typeColor = 'text-orange-600 bg-orange-50';
                        typeIcon = 'local_shipping';
                      } else if (isTransfer) {
                        typeColor = 'text-slate-600 bg-slate-100';
                        typeIcon = 'swap_horiz';
                      }

                      let statusColor = 'bg-slate-100 text-slate-700';
                      if ((op.status || '').toLowerCase() === 'ready') statusColor = 'bg-emerald-100 text-emerald-800';
                      else if ((op.status || '').toLowerCase() === 'waiting') statusColor = 'bg-amber-100 text-amber-800';
                      else if ((op.status || '').toLowerCase() === 'draft') statusColor = 'bg-blue-100 text-blue-800';
                      else if ((op.status || '').toLowerCase() === 'done') statusColor = 'bg-slate-100 text-slate-800 font-bold';

                      return (
                        <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-orange-600">
                            {op.reference || `WH/OP/${op.id}`}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeColor}`}>
                              <span className="material-symbols-outlined text-sm">{typeIcon}</span>
                              {isReceipt ? 'Receipt' : isDelivery ? 'Delivery' : isTransfer ? 'Internal Transfer' : 'Adjustment'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="font-semibold text-slate-900">{op.supplier_or_customer || op.product_name || 'General Operation'}</div>
                            <div className="text-[11px] text-slate-400">{op.sku ? `SKU: ${op.sku}` : op.po_or_bol_ref}</div>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="text-xs text-slate-800 font-medium">
                              {op.from_location || 'Vendor Location'} → {op.to_location || 'Customer Location'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {op.created_at ? new Date(op.created_at).toLocaleDateString() : 'Today'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-slate-900">
                            {op.quantity} {op.unit_of_measure || 'pcs'}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusColor}`}>
                              {op.status ? op.status.charAt(0).toUpperCase() + op.status.slice(1) : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <Link
                              to={isReceipt ? '/receipts' : isDelivery ? '/deliveries' : isTransfer ? '/internal-transfers' : '/ledger'}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors inline-block"
                            >
                              Inspect
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <span className="font-semibold text-slate-800">{filteredOperations.length}</span> operations from live database
              </div>
            </div>
          </div>

          {/* 3 Real-time Inventory Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">sensors</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Warehouse Nodes & Locations</div>
                  <div className="text-[11px] text-slate-500">{stats.total_warehouses} Warehouses • {stats.total_internal_locations} Internal Locations</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                ACTIVE
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">forklift</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pending Movements Queue</div>
                  <div className="text-[11px] text-slate-500">{stats.pending_operations_count} Operations in Draft/Ready State</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 font-bold border border-amber-200/60">
                QUEUED
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cycle Count & Reordering</div>
                  <div className="text-[11px] text-slate-500">Threshold Compliance Monitored</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-bold">
                AUDITED
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
