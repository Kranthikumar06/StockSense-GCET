import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';
import './WarehouseOperations.css';

const INITIAL_OPERATIONS = [
  {
    id: 1,
    ref: 'WH/IN/00042',
    type: 'Receipt',
    partner: 'Tata Steel Ltd',
    source: 'External Vendor',
    destination: 'WH/Main Bay A',
    item: 'Steel Rods 12mm - Grade 316',
    sku: 'STL-ROD-012',
    volume: '100.00 kg',
    scheduled: 'Today, 14:30',
    sla: 'On Schedule',
    slaStatus: 'good',
    status: 'Ready',
    gate: 'Bay North #03',
  },
  {
    id: 2,
    ref: 'WH/OUT/00118',
    type: 'Delivery',
    partner: 'Apex Automation (Ford Plant)',
    source: 'Main Store Bay A',
    destination: 'Apex Automation',
    item: 'Planetary Gearhead 40:1',
    sku: 'SS-MTR-8812',
    volume: '40 Units',
    scheduled: 'Today, 15:15',
    sla: '15m Remaining',
    slaStatus: 'warning',
    status: 'Ready',
    gate: 'Dock Outbound #01',
  },
  {
    id: 3,
    ref: 'WH/INT/00094',
    type: 'Transfer',
    partner: 'Internal Intra-rack',
    source: 'Rack B-04',
    destination: 'Line B Assembly',
    item: 'Galvanized Hex Nut M12',
    sku: 'NUT-HX-M12',
    volume: '2,000 pcs',
    scheduled: 'Today, 16:00',
    sla: 'Awaiting Bin Space',
    slaStatus: 'neutral',
    status: 'Waiting',
    gate: 'Inter-Rack Zone 2',
  },
  {
    id: 4,
    ref: 'WH/ADJ/00015',
    type: 'Adjustment',
    partner: 'Physical Audit Team',
    source: 'Physical Audit',
    destination: 'Cold Storage Vault #02',
    item: 'Hydraulic Oil ISO VG 46',
    sku: 'OIL-VG-46',
    volume: '-4 Drums',
    scheduled: 'Yesterday, 17:40',
    sla: 'Auditor #104 Verified',
    slaStatus: 'good',
    status: 'Done',
    gate: 'Vault #02',
  },
  {
    id: 5,
    ref: 'WH/IN/00043',
    type: 'Receipt',
    partner: 'Apex Global Components',
    source: 'Vendor Intake Port',
    destination: 'Receiving Bay 1',
    item: 'Hydraulic Hose Assembly 2m',
    sku: 'HOS-HYD-2M',
    volume: '80 Pcs',
    scheduled: 'Tomorrow, 09:30',
    sla: 'PO #49281 Active',
    slaStatus: 'neutral',
    status: 'Draft',
    gate: 'Receiving Gate #02',
  },
  {
    id: 6,
    ref: 'WH/OUT/00119',
    type: 'Delivery',
    partner: 'Nordic Freight Systems',
    source: 'Main Store',
    destination: 'Nordic Logistics Hub',
    item: 'Precision Ceramic Bearings',
    sku: 'BRG-CER-608',
    volume: '500 Pcs',
    scheduled: 'Today, 11:20',
    sla: 'BOL #9901 Signed',
    slaStatus: 'good',
    status: 'Done',
    gate: 'Dock Outbound #04',
  },
  {
    id: 7,
    ref: 'WH/IN/00044',
    type: 'Receipt',
    partner: 'Siemens Industrial Corp',
    source: 'International Logistics',
    destination: 'Cold Storage Unit B',
    item: 'Lithium-Ion Battery Pack 48V',
    sku: 'SKU-BAT-9081',
    volume: '120 Units',
    scheduled: 'Today, 16:45',
    sla: 'Dock Gate 2 Assigned',
    slaStatus: 'good',
    status: 'Ready',
    gate: 'Bay North #02',
  },
  {
    id: 8,
    ref: 'WH/OUT/00120',
    type: 'Delivery',
    partner: 'Tesla Gigafactory 4',
    source: 'Finished Goods Bay',
    destination: 'Tesla Receiving Port',
    item: 'Industrial Servo Controller V5',
    sku: 'SS-CTR-0922',
    volume: '150 Units',
    scheduled: 'Today, 17:30',
    sla: 'Carrier In-Transit',
    slaStatus: 'warning',
    status: 'Ready',
    gate: 'Dock Outbound #02',
  },
];

export default function WarehouseOperations() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar & Navigation states
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Operations Data & Filtering states
  const [operations, setOperations] = useState(INITIAL_OPERATIONS);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Receipts', 'Delivery Orders', 'Internal Transfers', 'Stock Adjustments'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [binFilter, setBinFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Slide-over Drawer & Modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [validationModalDoc, setValidationModalDoc] = useState(null);

  // New Operation Form state
  const [newOpType, setNewOpType] = useState('Receipt');
  const [newOpPartner, setNewOpPartner] = useState('Apex Dynamics Ltd');
  const [newOpSource, setNewOpSource] = useState('Bay North #03 - Main Store');
  const [newOpDest, setNewOpDest] = useState('Rack B-18-04 - Line Assembly');
  const [newOpDate, setNewOpDate] = useState('2026-09-26');
  const [newOpShift, setNewOpShift] = useState('Morning Shift (06:00 - 14:00)');
  const [newOpNotes, setNewOpNotes] = useState('');
  const [newOpLines, setNewOpLines] = useState([
    { id: 1, name: 'Industrial Servo Controller V5', sku: 'SS-CTR-0922', category: 'Finished Goods', qty: 150, uom: 'units' },
    { id: 2, name: 'Planetary Gearhead 40:1', sku: 'SS-MTR-8812', category: 'Hardware', qty: 40, uom: 'units' },
  ]);

  // Sync tab from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'receipts') setActiveTab('Receipts');
    else if (tabParam === 'deliveries') setActiveTab('Delivery Orders');
    else if (tabParam === 'transfers') setActiveTab('Internal Transfers');
    else if (tabParam === 'adjustments') setActiveTab('Stock Adjustments');
  }, [location.search]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut listener (F2: New Operation, F3: Picking Slips)
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
  const filteredOperations = operations.filter((op) => {
    // Tab filter
    if (activeTab === 'Receipts' && op.type !== 'Receipt') return false;
    if (activeTab === 'Delivery Orders' && op.type !== 'Delivery') return false;
    if (activeTab === 'Internal Transfers' && op.type !== 'Transfer') return false;
    if (activeTab === 'Stock Adjustments' && op.type !== 'Adjustment') return false;

    // Status filter
    if (statusFilter !== 'All' && op.status !== statusFilter) return false;

    // Bin filter
    if (binFilter === 'BayNorth' && !op.destination.includes('Bay') && !op.source.includes('Bay') && !op.gate.includes('Bay')) return false;
    if (binFilter === 'Rack' && !op.destination.includes('Rack') && !op.source.includes('Rack')) return false;
    if (binFilter === 'Vault' && !op.destination.includes('Vault') && !op.source.includes('Vault')) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = op.ref.toLowerCase().includes(q);
      const matchPartner = op.partner.toLowerCase().includes(q);
      const matchItem = op.item.toLowerCase().includes(q);
      const matchSku = op.sku.toLowerCase().includes(q);
      const matchRoute = (op.source + op.destination + op.gate).toLowerCase().includes(q);
      if (!matchRef && !matchPartner && !matchItem && !matchSku && !matchRoute) return false;
    }

    return true;
  });

  // Toggle Row Selection
  const toggleRowSelect = (id) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredOperations.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredOperations.map((o) => o.id)));
    }
  };

  // Quick Validate Action
  const handleValidateOperation = (op) => {
    setOperations((prev) =>
      prev.map((item) =>
        item.id === op.id ? { ...item, status: 'Done', sla: 'Validated by Operator', slaStatus: 'good' } : item
      )
    );
    showToast(`✓ Operation ${op.ref} validated & stock ledger updated successfully.`);
  };

  // Add Dynamic Line to Drawer Form
  const addFormLine = () => {
    const newLine = {
      id: Date.now(),
      name: 'Precision Ceramic Bearings 608',
      sku: 'BRG-CER-608',
      category: 'Hardware',
      qty: 25,
      uom: 'pcs',
    };
    setNewOpLines([...newOpLines, newLine]);
  };

  const removeFormLine = (id) => {
    if (newOpLines.length <= 1) return;
    setNewOpLines(newOpLines.filter((l) => l.id !== id));
  };

  const updateLineQty = (id, val) => {
    setNewOpLines(
      newOpLines.map((l) => (l.id === id ? { ...l, qty: Math.max(1, parseInt(val, 10) || 1) } : l))
    );
  };

  // Create Operation Submit
  const handleCreateOperation = (e) => {
    e.preventDefault();
    const typePrefix =
      newOpType === 'Receipt'
        ? 'IN'
        : newOpType === 'Delivery'
        ? 'OUT'
        : newOpType === 'Transfer'
        ? 'INT'
        : 'ADJ';
    const randNum = Math.floor(100 + Math.random() * 900);
    const newDoc = {
      id: Date.now(),
      ref: `WH/${typePrefix}/00${randNum}`,
      type: newOpType,
      partner: newOpPartner || 'Vendor / Partner',
      source: newOpSource,
      destination: newOpDest,
      item: newOpLines[0]?.name || 'Standard Warehouse Goods',
      sku: newOpLines[0]?.sku || 'SS-GEN-01',
      volume: `${newOpLines.reduce((acc, curr) => acc + (parseInt(curr.qty, 10) || 0), 0)} Units (${newOpLines.length} items)`,
      scheduled: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sla: 'New Scheduled Dispatch',
      slaStatus: 'good',
      status: 'Ready',
      gate: newOpDest.includes('Bay') ? 'Bay North #03' : 'Main Hub',
    };

    setOperations([newDoc, ...operations]);
    setDrawerOpen(false);
    showToast(`✓ Document ${newDoc.ref} (${newDoc.type}) created and dispatched to Floor.`);
  };

  const copyRefToClipboard = (ref) => {
    navigator.clipboard?.writeText(ref);
    showToast(`Copied reference ${ref} to clipboard`);
  };

  return (
    <div className="warehouse-ops-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar
        activeRoute="/operations"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>

        {/* ============================================================ */}
        {/* Main Workspace Container                                    */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
            {/* Left: Mobile menu button + Warehouse Location Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>

              <button
                className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-orange-600 text-[18px]">warehouse</span>
                <span>Main Warehouse - Floor 1</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
              </button>
            </div>

            {/* Center: Global Quick Search Bar */}
            <div className="hidden md:flex relative w-[380px] lg:w-[440px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, operation ref, partner..."
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl pl-9 pr-11 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs font-semibold">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Status Indicators, Notifications, CTA Button */}
            <div className="flex items-center gap-3">
              {/* Online status */}
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium text-xs px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>

              {/* Feed Chip */}
              <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 text-xs px-3 py-1 rounded-full font-medium">
                <span className="text-orange-500 font-mono text-[11px]">((•))</span>
                <span>Live Stock Feed</span>
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                type="button"
                title="3 Unread Dispatch Notifications"
                onClick={() => showToast('3 Incoming PO Shipments ready for receiving inspection.')}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 bg-orange-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </button>

              {/* Primary CTA Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all shadow-orange-500/20 active:scale-95"
                type="button"
                id="openNewOpBtn"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ Create Operation</span>
              </button>
            </div>
          </header>

          {/* ============================================================ */}
          {/* Scrollable Main Content Area                                 */}
          {/* ============================================================ */}
          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            {/* Top Operational Context & Actions Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-slate-700 text-xs shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="font-mono text-xs font-bold tracking-wide text-orange-700">DC-NORTH-01</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-medium text-slate-700">LOGISTICS DISPATCH & INTAKE • Live WMS Workflow Active</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Warehouse Stock Operations
                </h1>
                <p className="text-xs text-slate-500">
                  Manage vendor receipts, outgoing customer shipments, internal floor transfers, and inventory reconciliations.
                </p>
              </div>

              {/* Secondary Header Controls & Telemetry */}
              <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-center">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-600 text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                  <span>Shift: <strong className="text-slate-900 font-semibold">Morning (06:00 - 14:00)</strong></span>
                </div>

                <button
                  onClick={() => showToast('Manifest PDF Export generated for DC-NORTH-01.')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-slate-500">download</span>
                  <span>Export Manifest</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-orange-600">print</span>
                  <span>Batch Picking Slips</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500 uppercase">F3</kbd>
                </button>

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Create Operation</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Operational KPI Metric Cards (Visual Telemetry Sparklines)   */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Inbound Receipts */}
              <div
                onClick={() => setActiveTab('Receipts')}
                className={`ops-kpi-card relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm cursor-pointer transition-all ${
                  activeTab === 'Receipts' ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Receipts (Inbound)</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900">12</span>
                      <span className="text-xs font-semibold text-slate-500">Orders</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">~1,450 units awaiting dock intake</p>
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>4 Due Today</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Gate 1-3 Active</span>
                </div>
                {/* Bottom sparkline accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
                  <div className="h-full bg-orange-600" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Card 2: Delivery Orders */}
              <div
                onClick={() => setActiveTab('Delivery Orders')}
                className={`ops-kpi-card relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm cursor-pointer transition-all ${
                  activeTab === 'Delivery Orders' ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Delivery Orders (Outbound)</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900">24</span>
                      <span className="text-xs font-semibold text-slate-500">Shipments</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">9 picking in progress • 15 ready</p>
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[11px] font-semibold font-mono">
                    <span className="material-symbols-outlined text-[12px] text-indigo-600">timer</span>
                    <span>Cutoff 16:00 EST</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">15 Dispatch</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Card 3: Internal Transfers */}
              <div
                onClick={() => setActiveTab('Internal Transfers')}
                className={`ops-kpi-card relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm cursor-pointer transition-all ${
                  activeTab === 'Internal Transfers' ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Internal Transfers</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-slate-900">5</span>
                      <span className="text-xs font-semibold text-slate-500">Scheduled</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">Intra-rack: Bay 1 → Line B Assembly</p>
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>2 In-Transit</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">T-10m ETA</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Card 4: Stock Attention / Adjustments */}
              <div
                onClick={() => setActiveTab('Stock Adjustments')}
                className={`ops-kpi-card relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm cursor-pointer transition-all ${
                  activeTab === 'Stock Adjustments' ? 'ring-2 ring-rose-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Stock Attention</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-rose-600">3</span>
                      <span className="text-xs font-semibold text-rose-500">Flagged</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">Physical audit discrepancies</p>
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold font-mono">
                    <span>2 Critical Variance</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Ledger hold</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '25%' }} />
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Operations Dual Command Split Cards                         */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Incoming Receipts Command Card */}
              <div className="command-card rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">move_to_inbox</span>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Incoming Receipts</h2>
                        <p className="text-xs text-slate-500">Vendor Procurement Inflow & Dock Unloading</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                      12 Pending (4 Overdue)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Receive items from registered suppliers, perform barcode inspection, execute lot verification, and reconcile ledger inventory levels into storage bays.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-orange-600">warehouse</span>
                      <span className="text-slate-400">Dock Gate:</span>
                      <span className="font-semibold text-slate-800">Bay North #03</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Pallets awaiting breakdown:</span>
                      <span className="font-semibold text-orange-600">18</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 flex items-center gap-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveTab('Receipts');
                      showToast('Filtered view to Incoming Receipts workflow.');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-xs hover:bg-orange-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Process Receipts</span>
                  </button>
                  <button
                    onClick={() => showToast('Laser Inbound Scanner activated on Gate 3.')}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">qr_code_scanner</span>
                    <span>Scan Inbound Dock</span>
                  </button>
                </div>
              </div>

              {/* Outgoing Deliveries Command Card */}
              <div className="command-card rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Outgoing Deliveries</h2>
                        <p className="text-xs text-slate-500">Customer Fulfillment Pipeline & BOL Dispatch</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
                      24 Ready to Pick
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pick, pack, and validate customer shipments against routing slips. Generate dispatch manifests, print BOL documents, and push carrier tracking updates.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-orange-600">alarm</span>
                      <span className="text-slate-400">Carrier Cutoff:</span>
                      <span className="font-semibold text-orange-600">15:30 EST</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Pending print slips:</span>
                      <span className="font-semibold text-slate-800">9 Orders</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 flex items-center gap-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveTab('Delivery Orders');
                      showToast('Filtered view to Outgoing Deliveries workflow.');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">outbox</span>
                    <span>Process Deliveries</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">checklist</span>
                    <span>Batch Picking List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Operational Filter Hub & Tab Strip                          */}
            {/* ============================================================ */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left Pill Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'All', label: 'All Operations', count: operations.length, dot: null },
                    { id: 'Receipts', label: 'Receipts', count: operations.filter((o) => o.type === 'Receipt').length, dot: 'bg-emerald-500' },
                    { id: 'Delivery Orders', label: 'Delivery Orders', count: operations.filter((o) => o.type === 'Delivery').length, dot: 'bg-indigo-500' },
                    { id: 'Internal Transfers', label: 'Internal Transfers', count: operations.filter((o) => o.type === 'Transfer').length, dot: 'bg-blue-500' },
                    { id: 'Stock Adjustments', label: 'Stock Adjustments', count: operations.filter((o) => o.type === 'Adjustment').length, dot: 'bg-amber-500' },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`op-nav-tab px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                        type="button"
                      >
                        {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                        <span>
                          {tab.label} ({tab.count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Sub-Toolbar Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[200px]">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter doc #, SKU, partner..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses (Ready, Waiting, Done)</option>
                    <option value="Ready">Ready Only</option>
                    <option value="Waiting">Waiting (Blocked)</option>
                    <option value="Done">Done / Completed</option>
                    <option value="Draft">Draft</option>
                  </select>

                  <select
                    value={binFilter}
                    onChange={(e) => setBinFilter(e.target.value)}
                    className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Bins (Floor 1)</option>
                    <option value="BayNorth">Bay North #01 - #04</option>
                    <option value="Rack">Rack B-18 / Assembly</option>
                    <option value="Vault">Cold Storage Vault #02</option>
                  </select>

                  <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-mono text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-orange-600">calendar_today</span>
                    <span>Today (Live)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Operations Master Data Table                                */}
            {/* ============================================================ */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === filteredOperations.length && filteredOperations.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4 font-semibold">Reference #</th>
                      <th className="py-3.5 px-3 font-semibold">Type</th>
                      <th className="py-3.5 px-4 font-semibold">Partner / Directional Route</th>
                      <th className="py-3.5 px-4 font-semibold">Primary Items & Volume</th>
                      <th className="py-3.5 px-4 font-semibold">Scheduled SLA</th>
                      <th className="py-3.5 px-3 font-semibold text-center">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {filteredOperations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">inventory_2</span>
                          <p className="text-sm font-semibold text-slate-600">No matching operations found</p>
                          <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search query</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOperations.map((op) => {
                        const isSelected = selectedRows.has(op.id);
                        return (
                          <tr
                            key={op.id}
                            className={`ops-table-row group ${isSelected ? 'row-selected' : ''}`}
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleRowSelect(op.id)}
                                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                              />
                            </td>

                            {/* Reference # */}
                            <td className="py-3 px-4 font-mono font-bold text-orange-600">
                              <div className="flex items-center gap-1.5">
                                <span
                                  onClick={() => copyRefToClipboard(op.ref)}
                                  className="cursor-pointer hover:underline"
                                  title="Click to copy ref"
                                >
                                  {op.ref}
                                </span>
                                <button
                                  onClick={() => copyRefToClipboard(op.ref)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-opacity p-0.5"
                                  title="Copy Ref #"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                </button>
                              </div>
                            </td>

                            {/* Type Badge */}
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  op.type === 'Receipt'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : op.type === 'Delivery'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                    : op.type === 'Transfer'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                }`}
                              >
                                {op.type}
                              </span>
                            </td>

                            {/* Partner & Directional Route */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>{op.partner}</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
                                <span className="font-mono text-slate-500 font-normal">{op.destination}</span>
                              </div>
                            </td>

                            {/* Primary Items & Volume */}
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="font-medium text-slate-900">{op.item}</div>
                                  <div className="font-mono text-[11px] text-slate-400">{op.sku}</div>
                                </div>
                                <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                                  {op.volume}
                                </span>
                              </div>
                            </td>

                            {/* Scheduled SLA */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-900">{op.scheduled}</div>
                              <div
                                className={`text-[11px] font-semibold flex items-center gap-1 ${
                                  op.slaStatus === 'good'
                                    ? 'text-emerald-600'
                                    : op.slaStatus === 'warning'
                                    ? 'text-orange-600'
                                    : 'text-slate-500'
                                }`}
                              >
                                {op.slaStatus === 'good' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                )}
                                {op.slaStatus === 'warning' && (
                                  <span className="material-symbols-outlined text-[13px]">timer</span>
                                )}
                                <span>{op.sla}</span>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  op.status === 'Ready'
                                    ? 'bg-emerald-100/70 text-emerald-800'
                                    : op.status === 'Waiting'
                                    ? 'bg-amber-100/70 text-amber-800'
                                    : op.status === 'Done'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {op.status === 'Ready' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                )}
                                {op.status === 'Waiting' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                )}
                                {op.status === 'Done' && (
                                  <span className="material-symbols-outlined text-[13px] text-emerald-600">check</span>
                                )}
                                <span>{op.status}</span>
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                {op.status === 'Ready' ? (
                                  <button
                                    onClick={() => handleValidateOperation(op)}
                                    className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 active:scale-95 transition-all shadow-xs"
                                    type="button"
                                  >
                                    Validate
                                  </button>
                                ) : op.status === 'Done' ? (
                                  <button
                                    onClick={() => showToast(`Audit trail viewed for ${op.ref}`)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                                    type="button"
                                  >
                                    Audit Trail
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => showToast(`Details for ${op.ref} loaded.`)}
                                    className="px-2.5 py-1 text-slate-600 text-xs hover:text-slate-900 hover:underline"
                                    type="button"
                                  >
                                    View Details
                                  </button>
                                )}

                                <button
                                  onClick={() => copyRefToClipboard(op.ref)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                  title="Actions menu"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination & Operational Telemetry Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <strong className="text-slate-800">1 - {filteredOperations.length}</strong> of{' '}
                    <strong className="text-slate-800">{operations.length}</strong> live movements
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/50">
                    99.8% on-time fulfillment rate
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs disabled:opacity-40"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-slate-900 text-white shadow-2xs font-semibold">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs">
                    2
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Slide-Over Drawer: Create New Operation Modal                 */}
      {/* ============================================================ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Dimmed Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="drawer-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="drawer-panel relative w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between z-10">
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-mono text-[11px] font-bold">
                  WORKFLOW DISPATCHER
                </span>
                <h2 className="text-lg font-bold text-slate-900">New Stock Movement & Operation</h2>
                <p className="text-xs text-slate-500">Create inbound PO receipt, customer delivery slip, or intra-bin transfer.</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateOperation} id="newOpForm" className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Step 1: Operation Type Selector Chips */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-2">Operation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'Receipt', icon: 'inventory_2', title: 'Receipt (Inbound)', sub: 'Vendor to Warehouse', iconColor: 'text-orange-600' },
                    { type: 'Delivery', icon: 'local_shipping', title: 'Delivery (Outbound)', sub: 'Store to Customer', iconColor: 'text-indigo-600' },
                    { type: 'Transfer', icon: 'sync_alt', title: 'Internal Transfer', sub: 'Rack-to-assembly', iconColor: 'text-blue-600' },
                    { type: 'Adjustment', icon: 'tune', title: 'Stock Adjustment', sub: 'Physical reconciliation', iconColor: 'text-rose-600' },
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setNewOpType(t.type)}
                      className={`type-chip-btn p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        newOpType === t.type
                          ? 'border-orange-500 bg-orange-50/70 text-orange-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[22px] ${t.iconColor}`}>{t.icon}</span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{t.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{t.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Partner / Supplier / Customer *
                </label>
                <input
                  type="text"
                  required
                  value={newOpPartner}
                  onChange={(e) => setNewOpPartner(e.target.value)}
                  placeholder="e.g. Apex Dynamics Ltd or Ford Manufacturing"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Source & Destination Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Location</label>
                  <select
                    value={newOpSource}
                    onChange={(e) => setNewOpSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option>Vendors / External Partner</option>
                    <option>Bay North #03 - Main Store</option>
                    <option>Rack B-18-04 - Line Assembly</option>
                    <option>Cold Storage Vault #02</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Location</label>
                  <select
                    value={newOpDest}
                    onChange={(e) => setNewOpDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option>Customer / Logistics Carrier</option>
                    <option>Main Store - Zone A</option>
                    <option>Rack B-18-04 - Line Assembly</option>
                    <option>Intake Holding Pen</option>
                  </select>
                </div>
              </div>

              {/* Scheduled Date & Operational Shift */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={newOpDate}
                    onChange={(e) => setNewOpDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Shift</label>
                  <select
                    value={newOpShift}
                    onChange={(e) => setNewOpShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option>Morning Shift (06:00 - 14:00)</option>
                    <option>Evening Shift (14:00 - 22:00)</option>
                    <option>Night Shift (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Line Items */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Product Demand Lines</span>
                  <button
                    type="button"
                    onClick={addFormLine}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    <span>Add Another Line</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newOpLines.map((line) => (
                    <div
                      key={line.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-xs text-slate-900">{line.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {line.sku} • {line.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={line.qty}
                          onChange={(e) => updateLineQty(line.id, e.target.value)}
                          className="w-20 px-2 py-1 text-right font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">{line.uom}</span>
                        {newOpLines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFormLine(line.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove line"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routing Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pick & Routing Instructions
                </label>
                <textarea
                  rows={2}
                  value={newOpNotes}
                  onChange={(e) => setNewOpNotes(e.target.value)}
                  placeholder="e.g. Ensure lot batch verification against PO manifest before staging on Dock #2..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shadow-lg">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="newOpForm"
                className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 shadow-orange-600/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">post_add</span>
                <span>Create Operation Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
