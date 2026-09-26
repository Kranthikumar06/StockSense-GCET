import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';
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

export default function StockLedger() {
  const navigate = useNavigate();

  // Sidebar & Navigation states
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

      <Sidebar
        activeRoute="/ledger"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>

        {/* ============================================================ */}
        {/* Main Content Workspace                                       */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Sticky Top Header Bar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Left-Aligned Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-2xl min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>

              <div className="relative flex items-center flex-1 min-w-0">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU, operation reference, vendor..."
                  className="w-full bg-slate-100/80 border border-slate-200/80 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-normal transition outline-none"
                />
                <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200/80 rounded shadow-2xs pointer-events-none hidden sm:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Primary Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                id="openAddLocationBtn"
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-orange-600/20 shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden xs:inline sm:inline">Add Location / Node</span>
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

            {/* Dynamic 3 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL MOVEMENT LOGS</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{ledgerMoves.length} Logged Moves</div>
                <div className="text-xs text-slate-500 mt-1">Real-time ledger audit trail</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">RECEIPTS & TRANSFERS</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1.5">
                  {ledgerMoves.filter((m) => m.type === 'Receipt' || m.type === 'Transfer').length} Inbound / Move
                </div>
                <div className="text-xs text-slate-500 mt-1">Stock intake & internal relocations</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">DISPATCH & ADJUSTMENTS</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1.5">
                  {ledgerMoves.filter((m) => m.type === 'Delivery' || m.type === 'Adjustment').length} Outbound / Reconciled
                </div>
                <div className="text-xs text-slate-500 mt-1">Dispatch shipments & cycle count variances</div>
              </div>
            </div>

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
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${isActive
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
        <div className="fixed inset-0 z-[70] overflow-hidden flex justify-end">
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
