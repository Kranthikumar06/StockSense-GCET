import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';
import './StockLedger.css';

const INITIAL_LEDGER_MOVES = [
  {
    id: 1,
    time: 'Just now (11:42 AM)',
    block: 'Block #9,481,203',
    ref: 'TRK-2024-0981',
    product: 'Steel Rods 12mm',
    sku: 'STL-ROD-012 • Raw Materials',
    type: 'Receipt',
    source: 'Vendor Intake',
    dest: 'Main Store Bay A',
    delta: '+100.00 kg',
    deltaColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    operator: 'Alex Morgan',
    operatorInitials: 'AM',
    operatorBg: 'bg-slate-800',
    status: 'Verified',
    statusDot: 'bg-emerald-500',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    hash: '0x8f2a...c31b',
    actionText: 'View Slip',
  },
  {
    id: 2,
    time: '12 mins ago (11:30 AM)',
    block: 'Block #9,481,202',
    ref: 'TRK-2024-0980',
    product: 'Galvanized Hex Nut M12',
    sku: 'BLT-M8-50 • Fasteners',
    type: 'Transfer',
    source: 'Main Store Bay A',
    dest: 'Assembly Line 2',
    delta: '0 kg (Internal)',
    deltaColor: 'text-blue-600 bg-blue-50 border-blue-200',
    operator: 'Sarah Lin',
    operatorInitials: 'SL',
    operatorBg: 'bg-blue-700',
    status: 'Completed',
    statusDot: 'bg-blue-500',
    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    hash: '0x4a19...e92f',
    actionText: 'Details',
  },
  {
    id: 3,
    time: '35 mins ago (11:07 AM)',
    block: 'Block #9,481,201',
    ref: 'TRK-2024-0979',
    product: 'Precision Ceramic Bearings',
    sku: 'BRG-9922 • Precision HW',
    type: 'Delivery',
    source: 'Outbound Dock #02',
    dest: 'Ford Midwest',
    delta: '-20.00 units',
    deltaColor: 'text-rose-600 bg-rose-50 border-rose-200',
    operator: 'Dave Kelly',
    operatorInitials: 'DK',
    operatorBg: 'bg-slate-700',
    status: 'Shipped',
    statusDot: 'bg-purple-500',
    statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
    hash: '0x7c92...fa01',
    actionText: 'View BOL',
  },
  {
    id: 4,
    time: '1 hr ago (10:42 AM)',
    block: 'Block #9,481,200',
    ref: 'TRK-2024-0978',
    product: 'Hydraulic Oil ISO VG 46',
    sku: 'OIL-VG-46 • Fluids & HazMat',
    type: 'Adjustment',
    source: 'WH/Cold Storage Rack C-04',
    dest: '(Scrap Write-off)',
    delta: '-3.00 drums (Damaged)',
    deltaColor: 'text-amber-700 bg-amber-50 border-amber-200',
    operator: 'Alex Morgan',
    operatorInitials: 'AM',
    operatorBg: 'bg-slate-800',
    status: 'Reconciled',
    statusDot: 'bg-amber-500',
    statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
    hash: '0x1e33...7b48',
    actionText: 'Audit Note',
  },
  {
    id: 5,
    time: '2 hrs ago (09:15 AM)',
    block: 'Block #9,481,199',
    ref: 'TRK-2024-0977',
    product: 'Planetary Gearhead 40:1',
    sku: 'SS-MTR-8812 • Hardware',
    type: 'Delivery',
    source: 'Main Store Bay A',
    dest: 'Apex Automation',
    delta: '-40.00 units',
    deltaColor: 'text-rose-600 bg-rose-50 border-rose-200',
    operator: 'Alex Morgan',
    operatorInitials: 'AM',
    operatorBg: 'bg-slate-800',
    status: 'Shipped',
    statusDot: 'bg-purple-500',
    statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
    hash: '0x9b11...e203',
    actionText: 'View BOL',
  },
  {
    id: 6,
    time: '3 hrs ago (08:30 AM)',
    block: 'Block #9,481,198',
    ref: 'TRK-2024-0976',
    product: 'Lithium-Ion Battery Pack 48V',
    sku: 'SKU-BAT-9081 • Energy',
    type: 'Receipt',
    source: 'Inbound Port',
    dest: 'Cold Unit B',
    delta: '+120.00 units',
    deltaColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    operator: 'Sarah Lin',
    operatorInitials: 'SL',
    operatorBg: 'bg-blue-700',
    status: 'Verified',
    statusDot: 'bg-emerald-500',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    hash: '0x3d44...99ac',
    actionText: 'View Slip',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/operations?tab=receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/operations?tab=deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/operations?tab=transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/operations?tab=adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger', active: true },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function StockLedger() {
  const navigate = useNavigate();

  // Sidebar & Navigation states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Ledger Data & Filters
  const [ledgerMoves, setLedgerMoves] = useState(INITIAL_LEDGER_MOVES);
  const [activeFilterTab, setActiveFilterTab] = useState('All'); // 'All', 'Receipt', 'Delivery', 'Transfer', 'Adjustment'
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceRackFilter, setSourceRackFilter] = useState('All');

  // Slide-over Drawer & Modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Location Form State
  const [parentFacility, setParentFacility] = useState('DC-North-01');
  const [locationCode, setLocationCode] = useState('RACK-C-BAY-04');
  const [locationType, setLocationType] = useState('internal_storage');
  const [capacityThreshold, setCapacityThreshold] = useState(500);
  const [hazmatChecked, setHazmatChecked] = useState(true);
  const [tempChecked, setTempChecked] = useState(false);
  const [rfidChecked, setRfidChecked] = useState(true);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setDrawerOpen(true);
      }
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Filter logic
  const filteredMoves = ledgerMoves.filter((m) => {
    if (activeFilterTab !== 'All' && m.type !== activeFilterTab) return false;
    if (sourceRackFilter === 'BayNorth' && !m.source.includes('Bay') && !m.dest.includes('Bay')) return false;
    if (sourceRackFilter === 'RackB' && !m.source.includes('Rack') && !m.dest.includes('Rack') && !m.dest.includes('Assembly')) return false;
    if (sourceRackFilter === 'ColdStorage' && !m.source.includes('Cold') && !m.dest.includes('Cold')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = m.ref.toLowerCase().includes(q);
      const matchProd = m.product.toLowerCase().includes(q);
      const matchSku = m.sku.toLowerCase().includes(q);
      const matchOperator = m.operator.toLowerCase().includes(q);
      const matchHash = m.hash.toLowerCase().includes(q);
      const matchRoute = (m.source + m.dest).toLowerCase().includes(q);
      if (!matchRef && !matchProd && !matchSku && !matchOperator && !matchHash && !matchRoute) return false;
    }
    return true;
  });

  // Handle Location Form Submission
  const handleSaveLocation = (e) => {
    e.preventDefault();
    setDrawerOpen(false);
    showToast(`✓ Storage Location ${locationCode.toUpperCase()} successfully registered in physical topology ledger.`);
  };

  const handleVerifyIntegrity = () => {
    showToast('✓ Cryptographic SHA-256 Audit Chain verified across 142 block headers. 0 discrepancies.');
  };

  const handleExportAudit = () => {
    showToast('✓ Generating Stock Movement Audit Trail (CSV & Cryptographic PDF Report)...');
  };

  return (
    <div className="stock-ledger-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex h-screen overflow-hidden">
        {/* ============================================================ */}
        {/* Left Collapsible Navigation Sidebar                          */}
        {/* ============================================================ */}
        <aside
          className={`flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between py-4 z-30 transition-all duration-300 select-none ${
            sidebarCollapsed ? 'w-[68px] items-center px-2' : 'w-[248px] px-4'
          }`}
          data-purpose="primary-sidebar"
        >
          {/* Top Brand & Nav Section */}
          <div className="flex flex-col gap-4 w-full">
            {/* Brand Header + Collapse Button */}
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
              <div className="flex items-center overflow-hidden">
                <Link to="/" className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <StockSenseLogo className="w-8 h-8 text-orange-600" />
                </Link>
              </div>

              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Collapse sidebar"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
              )}
            </div>

            {/* Expand button when collapsed */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Expand Navigation Menu"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
            )}

            {/* Sidebar Search Bar (when expanded) */}
            {!sidebarCollapsed && (
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>
            )}

            <div className="w-full h-px bg-slate-100 my-0.5" />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 w-full" aria-label="Sidebar Primary Navigation">
              {NAV_ITEMS.map((item) => {
                const active = item.active || item.label.includes('Move History');

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center rounded-xl transition-all ${
                      sidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2 justify-between'
                    } ${
                      active
                        ? 'bg-orange-600 text-white font-semibold shadow-sm shadow-orange-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          active ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Pinned: Operator profile & Sign Out */}
          <div className="flex flex-col gap-2 w-full pt-4 border-t border-slate-100">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  AM
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-slate-800 truncate">Alex Morgan</span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">Lead Systems Auditor</span>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ${
                sidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2 gap-3'
              }`}
              title="Sign Out / Lock Screen"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              {!sidebarCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* Main Content Workspace                                       */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Sticky Top Header Bar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between gap-4">
            {/* Left: Warehouse Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>

              <button
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 transition"
                type="button"
              >
                <span className="material-symbols-outlined text-orange-600 text-[18px]">warehouse</span>
                <span>Main Warehouse - Floor 1</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
              </button>
            </div>

            {/* Center: Command Palette Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU, move reference, bin, lot hash..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-9 pr-12 py-1.5 text-xs placeholder:text-slate-400 font-normal transition text-slate-700"
                />
                <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Status Signals, Notifications, Avatar, Primary Action */}
            <div className="flex items-center gap-3">
              {/* Ledger Synced Signal Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-3 py-1 rounded-full font-medium shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 crypto-pulse-dot"></span>
                <span>Ledger Synced (SHA-256 Verified)</span>
              </div>

              {/* Live Stream */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2 py-1">
                <span className="text-orange-500 font-mono text-xs">((•))</span>
                <span>Live Audit Stream</span>
              </div>

              {/* Notification Bell */}
              <button
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
                type="button"
                onClick={() => showToast('3 Recent blocks cryptographically validated into ledger.')}
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100">
                  AM
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                id="openAddLocationBtn"
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer ml-1 active:scale-95 shadow-orange-600/20"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ Add Location / Node</span>
              </button>
            </div>
          </header>

          {/* ============================================================ */}
          {/* Scrollable Page Body                                         */}
          {/* ============================================================ */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-7">
            {/* Page Heading & Integrity Actions */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  <span>IMMUTABLE LEDGER & FACILITY TOPOLOGY</span>
                  <span className="text-orange-300">•</span>
                  <span className="font-mono text-[11px] text-orange-600">WMS Node Active</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Stock Ledger & Facility Infrastructure
                </h1>
                <p className="text-xs text-slate-500">
                  Cryptographically logged stock movement audit trails and multi-warehouse physical bin topology.
                </p>
              </div>

              {/* Action Buttons Group */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleExportAudit}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">download</span>
                  <span>Export Audit Trail (CSV/PDF)</span>
                </button>
                <button
                  onClick={handleVerifyIntegrity}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                  <span>Verify Ledger Integrity</span>
                </button>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Audit KPI Cards Row                                         */}
            {/* ============================================================ */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Recorded Moves */}
              <div className="ledger-kpi-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Recorded Moves</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-mono">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> 100% Hash Valid
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">142 Today</div>
                  <p className="text-xs text-slate-500 mt-1">Zero discrepancies detected in audit chain</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last ledger write: 48s ago</span>
                  <span className="font-mono text-slate-600">Block #9,481,203</span>
                </div>
              </div>

              {/* Card 2: Active Storage Bins */}
              <div className="ledger-kpi-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Storage Bins</span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">88% Capacity</span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">384 Bins</div>
                  <p className="text-xs text-slate-500 mt-1">Across 2 Warehouse Depots (88% fill)</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Net Inbound Volume */}
              <div className="ledger-kpi-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Inbound Volume</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Intake reconciled
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-emerald-600 tracking-tight">+1,450 Units</div>
                  <p className="text-xs text-slate-500 mt-1">12 PO Receipts processed today</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    +6.2% vs yesterday
                  </span>
                  <span>Dock #01-#03 active</span>
                </div>
              </div>

              {/* Card 4: Net Outbound Dispatch */}
              <div className="ledger-kpi-card bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Outbound Dispatch</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    Fulfilled & decremented
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-purple-600 tracking-tight">-820 Units</div>
                  <p className="text-xs text-slate-500 mt-1">24 Shipments dispatched to carriers</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-purple-700 font-medium">
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                    9 picking in stage
                  </span>
                  <span>Cutoff: 16:00 EST</span>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Facility Infrastructure Section (Warehouse & Sub-Locations) */}
            {/* ============================================================ */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Warehouse Facilities & Nodes */}
              <div className="facility-card bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-100/70 text-orange-700 flex items-center justify-center font-bold text-sm">
                        <span className="material-symbols-outlined text-[20px] text-orange-600">domain</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Warehouse Facilities & Nodes</h3>
                        <p className="text-xs text-slate-500">Primary physical logistics centers</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      2 Facilities
                    </span>
                  </div>

                  {/* Node 1: Main Distribution Center */}
                  <div className="mt-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <h4 className="text-xs font-bold text-slate-900">Main Distribution Center (DC-North-01)</h4>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Primary Intake Node
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">104 Logistics Parkway, Building A • RFID Gate Array</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">92%</span>
                    </div>
                    {/* Capacity Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    {/* Attributes Badges */}
                    <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-slate-600">
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">4 Floors</span>
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">18 Docks</span>
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">92% Utilization</span>
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md px-2 py-0.5 font-medium">
                        Temperature: 18°C Controlled
                      </span>
                    </div>
                  </div>

                  {/* Node 2: Chicago South Depot */}
                  <div className="mt-3 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <h4 className="text-xs font-bold text-slate-900">Chicago South Depot (Hub 04)</h4>
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Cold Storage + HazMat
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">4500 Western Ave, Deep Bay • Sensor Node #08</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">74%</span>
                    </div>
                    {/* Capacity Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                    {/* Attributes Badges */}
                    <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-slate-600">
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">2 Floors</span>
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">8 Docks</span>
                      <span className="bg-white border border-slate-200 rounded-md px-2 py-0.5 font-medium">74% Utilization</span>
                      <span className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-2 py-0.5 font-medium">
                        Cold Chain: -20°C Certified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500">All nodes reporting heartbeat signal</span>
                  <button
                    onClick={() => showToast('Topology graph loaded for 2 active facilities.')}
                    className="text-orange-600 font-semibold hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    Manage Topology →
                  </button>
                </div>
              </div>

              {/* Card 2: Internal Sub-Locations & Bins (Realtime Occupancy) */}
              <div className="facility-card bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold text-sm">
                        <span className="material-symbols-outlined text-[20px] text-purple-600">shelves</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Internal Sub-Locations & Bins</h3>
                        <p className="text-xs text-slate-500">Live zone mapping & capacity allocation</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      Realtime Occupancy
                    </span>
                  </div>

                  {/* Interactive Zone Chips */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Zone 1 */}
                    <div
                      onClick={() => showToast('Filtered to Bay North #03 live pallets.')}
                      className="zone-item-card p-3 rounded-xl bg-white cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600">
                          Bay North #03
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          18 Pallets
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Vendor Intake • High velocity buffer</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Gate 1-3 Active</span>
                        <span className="text-emerald-600 font-medium">Ready for Putaway</span>
                      </div>
                    </div>

                    {/* Zone 2 */}
                    <div
                      onClick={() => showToast('Filtered to Rack A -> Rack B aisle inventory.')}
                      className="zone-item-card p-3 rounded-xl bg-white cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600">
                          Rack A → Rack B
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          64 SKUs
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Production Buffer • Fast-access aisle</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Floor 1 - Section 4</span>
                        <span className="text-slate-600 font-medium">81% Staged</span>
                      </div>
                    </div>

                    {/* Zone 3 */}
                    <div
                      onClick={() => showToast('Warning: Bin B-18-04 is at 94% capacity.')}
                      className="zone-item-card p-3 rounded-xl bg-white cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600">
                          Bin B-18-04
                        </span>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                          94% Full
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Fast-Moving Pick Face • Stainless Rods</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Rack Level 2</span>
                        <span className="text-rose-600 font-semibold">Near Threshold</span>
                      </div>
                    </div>

                    {/* Zone 4 */}
                    <div
                      onClick={() => showToast('Assembly Line 2 Kanban buffer active.')}
                      className="zone-item-card p-3 rounded-xl bg-white cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600">
                          Assembly Line 2
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          Kanban Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Work-in-Progress Floor • Sub-assembly</p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Sensor Auto-Count</span>
                        <span className="text-emerald-600 font-medium">Supplies Normal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heatmap Occupancy Status Legend */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Bin Rack Occupancy Spectrum:</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> &lt; 70%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> 70–90%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> &gt; 90%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* Immutable Stock Movement Ledger Table Section                */}
            {/* ============================================================ */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Ledger Filter Toolbar */}
              <div className="p-4 border-b border-slate-200/90 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative w-full lg:w-80">
                    <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-2.5">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by SKU, Reference, or Operator..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 font-normal transition"
                    />
                  </div>

                  {/* Movement Category Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
                    {[
                      { id: 'All', label: `All Moves (${ledgerMoves.length})`, dot: null },
                      { id: 'Receipt', label: 'Receipt Moves (+)', dot: 'bg-emerald-500' },
                      { id: 'Delivery', label: 'Delivery Moves (-)', dot: 'bg-purple-500' },
                      { id: 'Transfer', label: 'Internal Transfers', dot: 'bg-blue-500' },
                      { id: 'Adjustment', label: 'Stock Adjustments (±)', dot: 'bg-amber-500' },
                    ].map((tab) => {
                      const isActive = activeFilterTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveFilterTab(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Select Filters */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sourceRackFilter}
                      onChange={(e) => setSourceRackFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                    >
                      <option value="All">Source/Dest: All Racks ▾</option>
                      <option value="BayNorth">Bay North #03</option>
                      <option value="RackB">Rack B-18-04</option>
                      <option value="ColdStorage">Cold Storage Vault</option>
                    </select>

                    <div className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">calendar_today</span>
                      <span>Live Shift (Today)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Contrast Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">TIMESTAMP</th>
                      <th className="py-3 px-4">MOVE REF</th>
                      <th className="py-3 px-4">PRODUCT & SKU</th>
                      <th className="py-3 px-4">SOURCE → DESTINATION</th>
                      <th className="py-3 px-4">QUANTITY DELTA</th>
                      <th className="py-3 px-4">OPERATOR</th>
                      <th className="py-3 px-4">STATUS & HASH</th>
                      <th className="py-3 px-4 text-right">AUDIT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMoves.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">receipt_long</span>
                          <p className="text-sm font-semibold text-slate-600">No ledger transactions matched</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMoves.map((move) => (
                        <tr key={move.id} className="ledger-table-row">
                          {/* Timestamp */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{move.time}</div>
                            <div className="font-mono text-[10px] text-slate-400">{move.block}</div>
                          </td>

                          {/* Move Ref */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {move.ref}
                            </span>
                          </td>

                          {/* Product & SKU */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{move.product}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{move.sku}</div>
                          </td>

                          {/* Route */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                              <span className="font-medium text-slate-600">{move.source}</span>
                              <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
                              <span className="font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                                {move.dest}
                              </span>
                            </div>
                          </td>

                          {/* Delta */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center font-bold px-2.5 py-1 rounded-lg border text-xs font-mono ${move.deltaColor}`}>
                              {move.delta}
                            </span>
                          </td>

                          {/* Operator */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full text-white font-semibold text-[10px] flex items-center justify-center ${move.operatorBg}`}>
                                {move.operatorInitials}
                              </div>
                              <span className="font-medium text-slate-700">{move.operator}</span>
                            </div>
                          </td>

                          {/* Status & SHA Hash */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border px-2 py-0.5 rounded-full w-max ${move.statusColor}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${move.statusDot}`}></span> {move.status}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 mt-0.5">hash: {move.hash}</span>
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => showToast(`Audit details opened for ${move.ref}`)}
                              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                              type="button"
                            >
                              {move.actionText}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Pagination Controls */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div>
                  Showing <span className="font-semibold text-slate-800">1-{filteredMoves.length}</span> of{' '}
                  <span className="font-semibold text-slate-800">142</span> daily ledger transactions
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-300 bg-white cursor-not-allowed text-xs" disabled>
                    Prev
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-orange-600 bg-orange-600 text-white font-semibold text-xs">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium text-xs">
                    2
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium text-xs">
                    3
                  </button>
                  <span className="px-1 text-slate-400">...</span>
                  <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium text-xs">
                    36
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-100 text-xs">
                    Next
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Slide-Over Drawer: Register Storage Location / Bin Modal      */}
      {/* ============================================================ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Dimmed Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="ledger-drawer-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <aside className="ledger-drawer-panel relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
              <div>
                <h2 className="text-base font-bold text-slate-900">Register Storage Location / Bin</h2>
                <p className="text-xs text-slate-500 mt-1">Create physical warehouse node, zone, rack, or storage bin</p>
              </div>
              <button
                aria-label="Close Drawer"
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveLocation} id="create-location-form" className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Parent Facility */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Parent Warehouse Facility</label>
                <select
                  value={parentFacility}
                  onChange={(e) => setParentFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="DC-North-01">Main Distribution Center (DC-North-01)</option>
                  <option value="Hub-04">Chicago South Depot (Hub 04)</option>
                </select>
                <p className="text-[11px] text-slate-400">The facility that owns this rack or storage compartment.</p>
              </div>

              {/* Location Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Location Code / Identifier</label>
                <input
                  type="text"
                  required
                  value={locationCode}
                  onChange={(e) => setLocationCode(e.target.value)}
                  placeholder="e.g. RACK-C-BAY-04"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-900 focus:ring-orange-500 focus:border-orange-500 uppercase"
                />
                <p className="text-[11px] text-slate-400">Must be unique across the facility namespace for barcode tagging.</p>
              </div>

              {/* Location Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Location Type / Function</label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="internal_storage">Internal Storage Rack</option>
                  <option value="receiving_dock">Receiving Dock / Inbound Buffer</option>
                  <option value="production_line">Production / Assembly Line</option>
                  <option value="dispatch_bay">Dispatch & Carrier Staging</option>
                  <option value="cold_storage">Cold Storage Cell (-20°C)</option>
                </select>
              </div>

              {/* Capacity Threshold */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Max Capacity Threshold</label>
                <div className="relative">
                  <input
                    type="number"
                    value={capacityThreshold}
                    onChange={(e) => setCapacityThreshold(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium pointer-events-none">
                    Units / 12 Pallets
                  </span>
                </div>
                <p className="text-[11px] text-amber-600 flex items-center gap-1 font-medium mt-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Auto-warns operators at 85% occupancy threshold.
                </p>
              </div>

              {/* Environmental & Safety Compliance */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Environmental & Safety Compliance</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hazmatChecked}
                      onChange={(e) => setHazmatChecked(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>HazMat & Chemical Storage Approved</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempChecked}
                      onChange={(e) => setTempChecked(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>Temperature & Humidity Telemetry Monitored</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rfidChecked}
                      onChange={(e) => setRfidChecked(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>RFID Scanner Gate Enforced</span>
                  </label>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-location-form"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 shadow-orange-600/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Create Location Node</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
