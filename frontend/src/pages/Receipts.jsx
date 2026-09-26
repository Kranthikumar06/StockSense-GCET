import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';
import './Receipts.css';

const INITIAL_RECEIPTS = [
  {
    id: 1,
    ref: 'WH/IN/00042',
    supplier: 'Tata Steel Ltd',
    dest: 'Main Store Bay A',
    item: 'Steel Rods 12mm - Grade 316',
    sku: 'STL-ROD-012',
    qtyDemand: 100,
    qtyDone: 100,
    uom: 'kg',
    status: 'Ready',
    dock: 'Dock Gate #01',
    eta: 'Today, 14:30',
    poRef: 'PO-2026-881',
  },
  {
    id: 2,
    ref: 'WH/IN/00043',
    supplier: 'Apex Global Components',
    dest: 'Receiving Bay 1',
    item: 'Hydraulic Hose Assembly 2m',
    sku: 'HOS-HYD-2M',
    qtyDemand: 80,
    qtyDone: 0,
    uom: 'Pcs',
    status: 'Draft',
    dock: 'Dock Gate #02',
    eta: 'Tomorrow, 09:30',
    poRef: 'PO-2026-882',
  },
  {
    id: 3,
    ref: 'WH/IN/00044',
    supplier: 'Siemens Industrial Corp',
    dest: 'Cold Storage Unit B',
    item: 'Lithium-Ion Battery Pack 48V',
    sku: 'SKU-BAT-9081',
    qtyDemand: 120,
    qtyDone: 120,
    uom: 'Units',
    status: 'Ready',
    dock: 'Dock Gate #03',
    eta: 'Today, 16:45',
    poRef: 'PO-2026-883',
  },
  {
    id: 4,
    ref: 'WH/IN/00041',
    supplier: 'Fastener Direct Inc',
    dest: 'Rack B-18-04',
    item: 'Galvanized Hex Nut M12',
    sku: 'NUT-HX-M12',
    qtyDemand: 2000,
    qtyDone: 2000,
    uom: 'pcs',
    status: 'Done',
    dock: 'Dock Gate #01',
    eta: 'Today, 10:15',
    poRef: 'PO-2026-879',
  },
  {
    id: 5,
    ref: 'WH/IN/00040',
    supplier: 'Precision Bearings Co',
    dest: 'Bay North #03',
    item: 'Precision Ceramic Bearings 608',
    sku: 'BRG-CER-608',
    qtyDemand: 50,
    qtyDone: 0,
    uom: 'Pcs',
    status: 'Waiting',
    dock: 'Dock Gate #04',
    eta: 'Awaiting Customs Hold',
    poRef: 'PO-2026-875',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/receipts', active: true, badge: '12', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function Receipts() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Receipt Form State
  const [supplier, setSupplier] = useState('Tata Steel Ltd');
  const [destination, setDestination] = useState('Main Store Bay A');
  const [productName, setProductName] = useState('Steel Rods 12mm - Grade 316');
  const [sku, setSku] = useState('STL-ROD-012');
  const [qty, setQty] = useState(50);
  const [uom, setUom] = useState('kg');
  const [dockGate, setDockGate] = useState('Dock Gate #01');
  const [poNumber, setPoNumber] = useState('PO-2026-890');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReceipts = receipts.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.ref.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q) ||
        r.item.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.poRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleValidateReceipt = (receipt) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === receipt.id ? { ...r, status: 'Done', qtyDone: r.qtyDemand } : r))
    );
    showToast(`✓ Received +${receipt.qtyDemand} ${receipt.uom} of "${receipt.item}". Stock increased automatically in ${receipt.dest}.`);
  };

  const handleCreateReceipt = (e) => {
    e.preventDefault();
    const randNum = Math.floor(100 + Math.random() * 900);
    const newDoc = {
      id: Date.now(),
      ref: `WH/IN/000${randNum}`,
      supplier,
      dest: destination,
      item: productName,
      sku,
      qtyDemand: Number(qty),
      qtyDone: 0,
      uom,
      status: 'Ready',
      dock: dockGate,
      eta: 'Today, Scheduled',
      poRef: poNumber,
    };
    setReceipts([newDoc, ...receipts]);
    setDrawerOpen(false);
    showToast(`✓ Inbound Receipt ${newDoc.ref} created for ${newDoc.supplier}. Ready for receiving inspection.`);
  };

  return (
    <div className="receipts-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between py-4 z-30 transition-all duration-300 select-none ${
            sidebarCollapsed ? 'w-[68px] items-center px-2' : 'w-[248px] px-4'
          }`}
        >
          <div className="flex flex-col gap-4 w-full">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
              <div className="flex items-center overflow-hidden">
                <Link to="/" className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <StockSenseLogo className="w-8 h-8 text-orange-600" />
                </Link>
              </div>
              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
              )}
            </div>

            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
            )}

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
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                />
              </div>
            )}

            <div className="w-full h-px bg-slate-100 my-0.5" />

            <nav className="flex flex-col gap-1 w-full">
              {NAV_ITEMS.map((item) => {
                const active = item.label.includes('Receipts');
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
                      <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-slate-500'}`}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-2 w-full pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ${
                sidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2 gap-3'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              {!sidebarCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-orange-600 text-[18px]">move_to_inbox</span>
                <span>Inbound Dock Management</span>
              </div>
            </div>

            <div className="hidden md:flex relative w-[360px]">
              <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3 top-2 pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO #, supplier, or SKU..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Laser Inbound Scanner activated on Bay North #03.')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">qr_code_scanner</span>
                <span>Scan Inbound Barcode</span>
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shadow-orange-500/20 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ New Receipt</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>VENDOR PROCUREMENT INTAKE</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Receipts (Incoming Goods)
                </h1>
                <p className="text-xs text-slate-500">
                  Receive supplier shipments, verify SKU counts against PO demand lines, and increment ledger stock upon validation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Dock Manifest</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="receipt-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Dock Receipts</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">12 Shipments</div>
                <p className="text-xs text-slate-500 mt-1">~1,450 units awaiting dock breakdown</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-emerald-600">
                  <span>Gate 1-3 Active</span>
                  <span>4 Due Today</span>
                </div>
              </div>

              <div className="receipt-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ready for Validation</span>
                <div className="text-2xl font-extrabold text-orange-600 mt-1">
                  {receipts.filter((r) => r.status === 'Ready').length} Orders
                </div>
                <p className="text-xs text-slate-500 mt-1">Inspection passed • Ready for putaway</p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400">
                  Auto-increments stock levels
                </div>
              </div>

              <div className="receipt-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validated Today</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {receipts.filter((r) => r.status === 'Done').length} Completed
                </div>
                <p className="text-xs text-slate-500 mt-1">Stock ledger reconciled</p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-emerald-700 font-semibold font-mono">
                  ✓ 100% Hash verified
                </div>
              </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {['All', 'Ready', 'Waiting', 'Done', 'Draft'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                    type="button"
                  >
                    {st === 'All' ? `All Receipts (${receipts.length})` : st}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Auto-increment rule: <strong>Validate → Stock +Qty</strong>
              </div>
            </div>

            {/* Receipts Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Receipt Ref</th>
                      <th className="py-3.5 px-4">PO Reference</th>
                      <th className="py-3.5 px-4">Supplier</th>
                      <th className="py-3.5 px-4">Product & SKU</th>
                      <th className="py-3.5 px-4">Destination Storage</th>
                      <th className="py-3.5 px-4">Demand / Received</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredReceipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">{r.ref}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{r.poRef}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{r.supplier}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{r.item}</div>
                          <div className="font-mono text-[11px] text-slate-400">{r.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{r.dest}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={r.status === 'Done' ? 'text-emerald-600' : 'text-slate-800'}>
                            {r.qtyDone} / {r.qtyDemand} {r.uom}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              r.status === 'Ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'Waiting'
                                ? 'bg-amber-100 text-amber-800'
                                : r.status === 'Done'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {r.status === 'Ready' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>}
                            <span>{r.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {r.status === 'Ready' ? (
                            <button
                              onClick={() => handleValidateReceipt(r)}
                              className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 active:scale-95 transition shadow-xs"
                              type="button"
                            >
                              Validate (+{r.qtyDemand})
                            </button>
                          ) : r.status === 'Done' ? (
                            <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span> Reconciled
                            </span>
                          ) : (
                            <button
                              onClick={() => showToast(`Opening PO ${r.poRef} details.`)}
                              className="text-orange-600 font-semibold hover:underline text-xs"
                              type="button"
                            >
                              View PO
                            </button>
                          )}
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

      {/* New Receipt Slide-Over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setDrawerOpen(false)} className="drawer-backdrop-receipts fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <aside className="drawer-panel-receipts relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  INBOUND RECEIVING DISPATCHER
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">Create Vendor Receipt</h2>
                <p className="text-xs text-slate-500">Record incoming goods from purchase orders</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} id="newReceiptForm" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier / Vendor *</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Tata Steel Ltd"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PO Reference #</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Steel Rods 12mm - Grade 316"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure (UoM)</label>
                  <select
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="Units">Units (ea)</option>
                    <option value="Pcs">Pieces (pcs)</option>
                    <option value="Drums">Drums</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Receiving Dock</label>
                  <select
                    value={dockGate}
                    onChange={(e) => setDockGate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option>Dock Gate #01</option>
                    <option>Dock Gate #02</option>
                    <option>Dock Gate #03</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Storage Location</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <option>Main Store Bay A</option>
                  <option>Bay North #03</option>
                  <option>Rack B-18-04</option>
                  <option>Cold Storage Unit B</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
                Upon validation, <strong>+{qty} {uom}</strong> will be added to the stock ledger for <strong>{destination}</strong>.
              </div>
            </form>

            <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="newReceiptForm"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Create Inbound Receipt</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
