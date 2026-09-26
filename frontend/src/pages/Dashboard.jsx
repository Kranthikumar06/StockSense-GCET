import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar, { useSidebarState } from '../components/Sidebar';

const API_URL = 'http://localhost:8000/api/dashboard';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-1');

  // Backend state integration
  const [stats, setStats] = useState({
    total_products: 0,
    total_warehouses: 0,
    total_internal_locations: 0,
    total_stock_quantity: 0,
    total_inventory_value: 0,
    low_stock_count: 0,
    pending_operations_count: 0
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);

  // Fetch live metrics from FastAPI Backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, lowStockRes, activityRes] = await Promise.all([
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/low-stock`),
        axios.get(`${API_URL}/recent-activity`)
      ]);

      setStats(statsRes.data);
      setLowStockItems(lowStockRes.data);
      setRecentActivities(activityRes.data);
      setApiOnline(true);
    } catch (err) {
      console.warn('Backend API connection pending, using default views:', err);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000); // Live refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Operations data fallback or live activity data
  const fallbackOperations = [
    {
      id: 'WH/IN/00042',
      type: 'Receipt',
      typeIcon: 'move_to_inbox',
      typeColor: 'text-amber-600 bg-amber-50',
      partner: 'Tata Steel Ltd',
      partnerSub: 'PO-2023-8891',
      date: 'Today, 09:30 AM',
      dateSub: 'Dock Gate #2',
      dateAlert: true,
      units: '450 EA',
      status: 'Waiting',
      statusColor: 'bg-amber-100 text-amber-800 animate-pulse',
    },
    {
      id: 'WH/OUT/00118',
      type: 'Delivery',
      typeIcon: 'local_shipping',
      typeColor: 'text-orange-600 bg-orange-50',
      partner: 'Acme Retail Corp',
      partnerSub: 'SO-99214-US',
      date: 'Today, 11:15 AM',
      dateSub: 'Standard Logistics',
      dateAlert: false,
      units: '1,200 EA',
      status: 'Ready',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'WH/INT/00094',
      type: 'Transfer',
      typeIcon: 'swap_horiz',
      typeColor: 'text-slate-600 bg-slate-100',
      partner: 'Internal Bay A → Assembly B',
      partnerSub: 'Forklift Route #4',
      date: 'Today, 12:00 PM',
      dateSub: 'Internal Request',
      dateAlert: false,
      units: '80 EA',
      status: 'Ready',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'WH/ADJ/00015',
      type: 'Adjustment',
      typeIcon: 'tune',
      typeColor: 'text-rose-600 bg-rose-50',
      partner: 'Cold Storage Rack C-04',
      partnerSub: 'Cycle Count Audit #12',
      date: 'Yesterday, 17:40',
      dateSub: 'Manager Override',
      dateAlert: false,
      units: '-12 EA',
      unitsAlert: true,
      status: 'Done',
      statusColor: 'bg-slate-100 text-slate-700',
    }
  ];

  const operationsData = recentActivities.length > 0
    ? recentActivities.map((act) => ({
        id: act.reference || `REF-${act.id}`,
        type: act.from_location_name?.includes('Supplier') ? 'Receipt' : act.to_location_name?.includes('Customer') ? 'Delivery' : 'Transfer',
        typeIcon: act.from_location_name?.includes('Supplier') ? 'move_to_inbox' : 'local_shipping',
        typeColor: 'text-amber-600 bg-amber-50',
        partner: `${act.from_location_name} → ${act.to_location_name}`,
        partnerSub: act.product_name,
        date: new Date(act.created_at).toLocaleString(),
        dateSub: 'Live System Move',
        dateAlert: false,
        units: `${act.quantity} EA`,
        status: act.status.toUpperCase(),
        statusColor: act.status === 'done' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
      }))
    : fallbackOperations;

  const filteredOperations = operationsData.filter((op) => {
    if (activeTab === 'receipts' && op.type !== 'Receipt') return false;
    if (activeTab === 'deliveries' && op.type !== 'Delivery') return false;
    if (activeTab === 'transfers' && op.type !== 'Transfer') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        op.id.toLowerCase().includes(q) ||
        op.partner.toLowerCase().includes(q) ||
        op.partnerSub.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col">
      <Sidebar
        activeRoute="/dashboard"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Body Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="relative hidden sm:flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-slate-400 pointer-events-none text-lg">
                location_on
              </span>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="bg-slate-100 text-slate-800 text-xs font-semibold pl-8 pr-7 py-2 rounded-xl appearance-none cursor-pointer hover:bg-slate-200/70 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="wh-1">Main Warehouse ({stats.total_warehouses} Total)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 text-slate-400 pointer-events-none text-base">
                expand_more
              </span>
            </div>

            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-14 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
                placeholder="Search SKU, reference..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live Backend Connection Indicator */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                apiOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {apiOnline ? 'FastAPI Connected' : 'Connecting Backend...'}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          {/* Operations Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-200 text-slate-800 font-bold">
                  STOCK-SENSE-API
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Live Database Synchronized (Neon PostgreSQL)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Warehouse Operations Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time Stock Telemetry • Updated automatically
              </p>
            </div>
          </div>

          {/* 5 KPI Metric Cards (Integrated with Backend API Data) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Active Products */}
            <Link to="/products" className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Products</span>
                <span className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stats.total_products}
                </div>
                <div className="text-[11px] text-slate-500">catalog items registered</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  Live DB Count →
                </span>
              </div>
            </Link>

            {/* Card 2: In-Stock Quantity */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In-Stock Quantity</span>
                <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                  <span className="material-symbols-outlined text-lg">view_in_ar</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stats.total_stock_quantity.toLocaleString()} EA
                </div>
                <div className="text-[11px] text-slate-500">across internal nodes</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-semibold">
                  {stats.total_internal_locations} Locations
                </span>
              </div>
            </div>

            {/* Card 3: Inventory Valuation */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inventory Value</span>
                <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <span className="material-symbols-outlined text-lg">payments</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  ₹{stats.total_inventory_value.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">total asset valuation</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-600">Calculated sum</span>
              </div>
            </div>

            {/* Card 4: Low Stock Attention */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock Alerts</span>
                <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.low_stock_count}</span>
                  <span className="text-xs font-semibold text-rose-600">SKUs below min</span>
                </div>
                <div className="text-[11px] text-slate-500">Reorder thresholds</div>
              </div>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">
                  {stats.low_stock_count} Threshold Triggers
                </span>
              </div>
            </div>

            {/* Card 5: Pending Receipts */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Receipts</span>
                <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined text-lg">call_received</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_receipts_count || 0}</div>
                <div className="text-[11px] text-slate-500">Inbound receipts queued</div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 font-semibold">Incoming</span>
              </div>
            </div>

            {/* Card 6: Pending Deliveries */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Deliveries</span>
                <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_deliveries_count || 0}</div>
                <div className="text-[11px] text-slate-500">Outbound orders queued</div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 font-semibold">Outgoing</span>
              </div>
            </div>

            {/* Card 7: Internal Transfers */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Internal Transfers</span>
                <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                  <span className="material-symbols-outlined text-lg">sync_alt</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats.pending_transfers_count || 0}</div>
                <div className="text-[11px] text-slate-500">Location shifts queued</div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 font-semibold">Node Shifts</span>
              </div>
            </div>
          </div>

          {/* Operations Data Table Section */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-slate-900">Recent Inventory Transactions</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {filteredOperations.length} Total
                </span>
              </div>
            </div>

            {/* Table Content */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                    <th className="py-3 px-4 sm:px-6">Reference</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Node Route</th>
                    <th className="py-3 px-4 sm:px-6">Timestamp</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Units</th>
                    <th className="py-3 px-4 sm:px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOperations.map((op, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-orange-600">
                        {op.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${op.typeColor}`}>
                          <span className="material-symbols-outlined text-sm">{op.typeIcon}</span>
                          {op.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900">{op.partner}</div>
                        <div className="text-[11px] text-slate-400">{op.partnerSub}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="text-xs text-slate-800">{op.date}</div>
                        <div className="text-[10px] text-slate-400">{op.dateSub}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-slate-900">
                        {op.units}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${op.statusColor}`}>
                          {op.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
