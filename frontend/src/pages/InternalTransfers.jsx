import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';
import './InternalTransfers.css';

const INITIAL_TRANSFERS = [
  {
    id: 1,
    ref: 'WH/INT/00094',
    source: 'Main Store Bay A',
    dest: 'Production Rack (Assembly Line 2)',
    item: 'Galvanized Hex Nut M12',
    sku: 'NUT-HX-M12',
    qty: 2000,
    uom: 'pcs',
    operator: 'Sarah Lin',
    status: 'In-Transit',
    eta: 'T-10m ETA',
  },
  {
    id: 2,
    ref: 'WH/INT/00095',
    source: 'Rack A (Floor 1)',
    dest: 'Rack B (Fast-Access Aisle)',
    item: 'Steel Rods 12mm - Grade 316',
    sku: 'STL-ROD-012',
    qty: 50,
    uom: 'kg',
    operator: 'Alex Morgan',
    status: 'Ready',
    eta: 'Scheduled Today',
  },
  {
    id: 3,
    ref: 'WH/INT/00096',
    source: 'DC-North-01 (Warehouse 1)',
    dest: 'Hub 04 Chicago (Warehouse 2)',
    item: 'Industrial Electric Motor 5HP',
    sku: 'MOT-5HP-IND',
    qty: 10,
    uom: 'Units',
    operator: 'Dave Kelly',
    status: 'Done',
    eta: 'Completed 10:30',
  },
  {
    id: 4,
    ref: 'WH/INT/00097',
    source: 'Bay North #03',
    dest: 'Cold Storage Unit B',
    item: 'Lithium-Ion Battery Pack 48V',
    sku: 'SKU-BAT-9081',
    qty: 30,
    uom: 'Units',
    operator: 'Alex Morgan',
    status: 'Draft',
    eta: 'Staging in progress',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/transfers', active: true },
  { label: 'Stock Adjustments', icon: 'tune', href: '/adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function InternalTransfers() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [sourceLoc, setSourceLoc] = useState('Main Store Bay A');
  const [destLoc, setDestLoc] = useState('Production Rack (Assembly Line 2)');
  const [itemName, setItemName] = useState('Galvanized Hex Nut M12');
  const [skuCode, setSkuCode] = useState('NUT-HX-M12');
  const [quantity, setQuantity] = useState(500);
  const [uom, setUom] = useState('pcs');
  const [assignedOperator, setAssignedOperator] = useState('Sarah Lin');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExecuteTransfer = (transfer) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transfer.id ? { ...t, status: 'Done', eta: 'Transfer Verified' } : t))
    );
    showToast(`✓ Transferred ${transfer.qty} ${transfer.uom} of ${transfer.item} from ${transfer.source} → ${transfer.dest}. Total stock unchanged, locations updated.`);
  };

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    const randNum = Math.floor(100 + Math.random() * 900);
    const newDoc = {
      id: Date.now(),
      ref: `WH/INT/00${randNum}`,
      source: sourceLoc,
      dest: destLoc,
      item: itemName,
      sku: skuCode,
      qty: Number(quantity),
      uom,
      operator: assignedOperator,
      status: 'Ready',
      eta: 'Scheduled Just Now',
    };
    setTransfers([newDoc, ...transfers]);
    setDrawerOpen(false);
    showToast(`✓ Internal Transfer ${newDoc.ref} scheduled from ${newDoc.source} → ${newDoc.dest}.`);
  };

  const filtered = transfers.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.ref.toLowerCase().includes(q) ||
        t.item.toLowerCase().includes(q) ||
        t.sku.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.dest.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="transfers-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">swap_horiz</span>
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
                <button onClick={() => setSidebarCollapsed(true)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
              )}
            </div>

            {sidebarCollapsed && (
              <button onClick={() => setSidebarCollapsed(false)} className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
            )}

            {!sidebarCollapsed && (
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
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
                const active = item.label.includes('Internal Transfers');
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
                <span className="material-symbols-outlined text-blue-600 text-[18px]">swap_horiz</span>
                <span>Intra-Warehouse & Inter-Facility Movements</span>
              </div>
            </div>

            <div className="hidden md:flex relative w-[360px]">
              <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3 top-2 pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transfer ref, SKU, location..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shadow-orange-500/20 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ New Internal Transfer</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span>INTERNAL INVENTORY TRANSIT</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Internal Transfers
              </h1>
              <p className="text-xs text-slate-500">
                Move stock between internal locations (e.g. Main Store → Production Rack, Rack A → Rack B, Warehouse 1 → Warehouse 2). Stock remains unchanged in total, but location inventory updates in real time.
              </p>
            </div>

            {/* Quick Example Card (as required in problem statement) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">warehouse</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Main Store → Production Rack</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Buffer replenishment for active assembly lines</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shelves</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Rack A → Rack B</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Fast-access pick-face aisle rebalancing</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Warehouse 1 → Warehouse 2</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Inter-facility transfers between regional depots</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {['All', 'Ready', 'In-Transit', 'Done', 'Draft'].map((st) => (
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
                    {st === 'All' ? `All Transfers (${transfers.length})` : st}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-500">Ledger delta: <strong>0 kg (Internal)</strong></span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Transfer Ref</th>
                      <th className="py-3.5 px-4">Product & SKU</th>
                      <th className="py-3.5 px-4">Source Location</th>
                      <th className="py-3.5 px-4">Destination Location</th>
                      <th className="py-3.5 px-4">Transfer Qty</th>
                      <th className="py-3.5 px-4">Assigned Operator</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filtered.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">{t.ref}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{t.item}</div>
                          <div className="font-mono text-[11px] text-slate-400">{t.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{t.source}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.dest}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">
                          {t.qty} {t.uom}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{t.operator}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              t.status === 'Ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'In-Transit'
                                ? 'bg-blue-100 text-blue-800'
                                : t.status === 'Done'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {t.status === 'In-Transit' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                            <span>{t.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {t.status === 'In-Transit' || t.status === 'Ready' ? (
                            <button
                              onClick={() => handleExecuteTransfer(t)}
                              className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 active:scale-95 transition shadow-xs"
                              type="button"
                            >
                              Complete Move
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span> Relocated
                            </span>
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

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setDrawerOpen(false)} className="drawer-backdrop-transfer fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <aside className="drawer-panel-transfer relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  INTERNAL BIN ROUTER
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">Create Internal Transfer</h2>
                <p className="text-xs text-slate-500">Move inventory between racks, bays, or facilities</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} id="newTransferForm" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Location *</label>
                  <select value={sourceLoc} onChange={(e) => setSourceLoc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Main Store Bay A</option>
                    <option>Rack A (Floor 1)</option>
                    <option>DC-North-01 (Warehouse 1)</option>
                    <option>Bay North #03</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Location *</label>
                  <select value={destLoc} onChange={(e) => setDestLoc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Production Rack (Assembly Line 2)</option>
                    <option>Rack B (Fast-Access Aisle)</option>
                    <option>Hub 04 Chicago (Warehouse 2)</option>
                    <option>Cold Storage Unit B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transfer Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <select value={uom} onChange={(e) => setUom(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="Units">Units (ea)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Handler</label>
                  <select value={assignedOperator} onChange={(e) => setAssignedOperator(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Sarah Lin</option>
                    <option>Alex Morgan</option>
                    <option>Dave Kelly</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-[11px]">
                Internal transfer moves inventory between locations without altering company-wide stock totals. Both source and destination bin ledgers are updated upon completion.
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
                form="newTransferForm"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Schedule Transfer</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
