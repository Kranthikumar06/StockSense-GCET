import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';
import './StockAdjustments.css';

const INITIAL_ADJUSTMENTS = [
  {
    id: 1,
    ref: 'WH/ADJ/00015',
    item: 'Hydraulic Oil ISO VG 46',
    sku: 'OIL-VG-46',
    location: 'Cold Storage Vault #02',
    recordedQty: 25,
    countedQty: 21,
    variance: -4,
    uom: 'Drums',
    reason: 'Damaged during forklift transport',
    auditor: 'Alex Morgan',
    status: 'Done',
    date: 'Yesterday, 17:40',
  },
  {
    id: 2,
    ref: 'WH/ADJ/00016',
    item: 'Steel Rods 12mm - Grade 316',
    sku: 'STL-ROD-012',
    location: 'Main Store Bay A',
    recordedQty: 100,
    countedQty: 97,
    variance: -3,
    uom: 'kg',
    reason: '3 kg steel damaged on rack edge',
    auditor: 'Sarah Lin',
    status: 'Done',
    date: 'Today, 09:15',
  },
  {
    id: 3,
    ref: 'WH/ADJ/00017',
    item: 'Galvanized Hex Nut M12',
    sku: 'NUT-HX-M12',
    location: 'Rack B-18-04',
    recordedQty: 2000,
    countedQty: 2050,
    variance: 50,
    uom: 'pcs',
    reason: 'Surplus carton discovered during audit',
    auditor: 'Dave Kelly',
    status: 'Ready',
    date: 'Today, 11:30',
  },
  {
    id: 4,
    ref: 'WH/ADJ/00018',
    item: 'Precision Ceramic Bearings 608',
    sku: 'BRG-CER-608',
    location: 'Bay North #03',
    recordedQty: 25,
    countedQty: 22,
    variance: -3,
    uom: 'Pcs',
    reason: 'Discrepancy under review',
    auditor: 'Alex Morgan',
    status: 'Waiting',
    date: 'Today, 12:00',
  },
];

export default function StockAdjustments() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState('Steel Rods 12mm - Grade 316');
  const [skuCode, setSkuCode] = useState('STL-ROD-012');
  const [location, setLocation] = useState('Main Store Bay A');
  const [systemQty, setSystemQty] = useState(100);
  const [countedQty, setCountedQty] = useState(97);
  const [uom, setUom] = useState('kg');
  const [reason, setReason] = useState('Damaged Items / Scrap');
  const [notes, setNotes] = useState('3 kg steel damaged');

  const variance = countedQty - systemQty;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReconcile = (adj) => {
    setAdjustments((prev) =>
      prev.map((a) => (a.id === adj.id ? { ...a, status: 'Done' } : a))
    );
    showToast(`✓ Reconciled ${adj.ref}: Stock ledger adjusted by ${adj.variance > 0 ? '+' : ''}${adj.variance} ${adj.uom}.`);
  };

  const handleCreateAdjustment = (e) => {
    e.preventDefault();
    const randNum = Math.floor(100 + Math.random() * 900);
    const newDoc = {
      id: Date.now(),
      ref: `WH/ADJ/000${randNum}`,
      item: selectedProduct,
      sku: skuCode,
      location,
      recordedQty: Number(systemQty),
      countedQty: Number(countedQty),
      variance,
      uom,
      reason: `${reason}: ${notes}`,
      auditor: 'Alex Morgan',
      status: 'Ready',
      date: 'Just Now',
    };
    setAdjustments([newDoc, ...adjustments]);
    setDrawerOpen(false);
    showToast(`✓ Stock Adjustment ${newDoc.ref} created. Variance: ${variance > 0 ? '+' : ''}${variance} ${uom}.`);
  };

  const filtered = adjustments.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.ref.toLowerCase().includes(q) ||
        a.item.toLowerCase().includes(q) ||
        a.sku.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="adjustments-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">tune</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar
        activeRoute="/adjustments"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-rose-600 text-[18px]">tune</span>
                <span>Physical Count & Inventory Reconciliation</span>
              </div>
            </div>

            <div className="hidden md:flex relative w-[360px]">
              <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3 top-2 pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit ref, SKU, location..."
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
                <span>+ Log Stock Adjustment</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>AUDIT DISCREPANCY MANAGEMENT</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Stock Adjustments & Physical Count
              </h1>
              <p className="text-xs text-slate-500">
                Fix mismatches between recorded ledger quantities and physical counts (e.g. damaged stock, scrap, discovery). The system automatically computes variance and logs entries in the Stock Ledger.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="adj-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Audits</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{adjustments.length} Audits</div>
                <p className="text-xs text-slate-500 mt-1">Discrepancies identified during cycle counts</p>
              </div>

              <div className="adj-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Negative Variances (Loss / Damaged)</span>
                <div className="text-2xl font-extrabold text-rose-600 mt-1">
                  {adjustments.filter((a) => a.variance < 0).length} Items
                </div>
                <p className="text-xs text-slate-500 mt-1">Requires write-off authorization</p>
              </div>

              <div className="adj-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Surplus / Found Items</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {adjustments.filter((a) => a.variance > 0).length} Items
                </div>
                <p className="text-xs text-slate-500 mt-1">Re-entered into active bin ledger</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {['All', 'Ready', 'Waiting', 'Done'].map((st) => (
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
                    {st === 'All' ? `All Adjustments (${adjustments.length})` : st}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-500">Auto-calculation: <strong>Variance = Counted - Recorded</strong></span>
            </div>

            {/* Adjustments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Audit Ref</th>
                      <th className="py-3.5 px-4">Product & SKU</th>
                      <th className="py-3.5 px-4">Storage Location</th>
                      <th className="py-3.5 px-4">Recorded Qty</th>
                      <th className="py-3.5 px-4">Counted Qty</th>
                      <th className="py-3.5 px-4">Variance Delta</th>
                      <th className="py-3.5 px-4">Reason / Notes</th>
                      <th className="py-3.5 px-3 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filtered.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">{a.ref}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{a.item}</div>
                          <div className="font-mono text-[11px] text-slate-400">{a.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{a.location}</td>
                        <td className="py-3 px-4 font-mono">{a.recordedQty} {a.uom}</td>
                        <td className="py-3 px-4 font-mono font-bold">{a.countedQty} {a.uom}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              a.variance < 0
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : a.variance > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {a.variance > 0 ? `+${a.variance}` : a.variance} {a.uom}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{a.reason}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              a.status === 'Ready'
                                ? 'bg-amber-100 text-amber-800'
                                : a.status === 'Done'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {a.status === 'Ready' ? (
                            <button
                              onClick={() => handleReconcile(a)}
                              className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 active:scale-95 transition shadow-xs"
                              type="button"
                            >
                              Reconcile
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span> Reconciled
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
          <div onClick={() => setDrawerOpen(false)} className="drawer-backdrop-adj fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <aside className="drawer-panel-adj relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  PHYSICAL INVENTORY AUDITOR
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">Log Stock Adjustment</h2>
                <p className="text-xs text-slate-500">Record physical count variance against system ledger</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} id="newAdjForm" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description *</label>
                <input
                  type="text"
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Storage Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Main Store Bay A</option>
                    <option>Cold Storage Vault #02</option>
                    <option>Rack B-18-04</option>
                    <option>Bay North #03</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recorded Qty</label>
                  <input
                    type="number"
                    value={systemQty}
                    onChange={(e) => setSystemQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Counted Qty *</label>
                  <input
                    type="number"
                    required
                    value={countedQty}
                    onChange={(e) => setCountedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variance</label>
                  <div className={`px-3 py-2 rounded-xl border font-mono font-bold text-center ${variance < 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                    {variance > 0 ? `+${variance}` : variance} {uom}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Variance</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <option>Damaged Items / Scrap</option>
                  <option>Physical Loss / Unaccounted</option>
                  <option>Surplus Discovery / Inventory Count</option>
                  <option>Unit of Measure Calibration</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Notes / Explanation</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 3 kg steel damaged on rack edge..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                Upon reconciliation, the physical count of <strong>{countedQty} {uom}</strong> becomes the authoritative ledger baseline, and a variance entry of <strong>{variance > 0 ? '+' : ''}{variance} {uom}</strong> is cryptographically logged.
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
                form="newAdjForm"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Submit Adjustment</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
