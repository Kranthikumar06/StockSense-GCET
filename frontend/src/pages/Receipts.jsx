import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';
import './Receipts.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Receipts() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Receipt Form State
  const [supplier, setSupplier] = useState('Tata Steel Ltd');
  const [destination, setDestination] = useState('Main Store Bay A');
  const [productName, setProductName] = useState('Steel Rods 12mm - Stainless');
  const [sku, setSku] = useState('STL-ROD-012');
  const [qty, setQty] = useState(100);
  const [uom, setUom] = useState('kg');
  const [dockGate, setDockGate] = useState('Dock Gate #01');
  const [poNumber, setPoNumber] = useState('PO-2026-890');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/operations?type=receipt`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReceipts(data);
    } catch (err) {
      console.error('Failed to fetch receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter((r) => {
    const statusVal = r.status.toLowerCase();
    if (statusFilter === 'Ready' && statusVal !== 'ready') return false;
    if (statusFilter === 'Done' && statusVal !== 'done') return false;
    if (statusFilter === 'Draft' && statusVal !== 'draft') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (r.reference && r.reference.toLowerCase().includes(q)) ||
        (r.supplier_or_customer && r.supplier_or_customer.toLowerCase().includes(q)) ||
        (r.product_name && r.product_name.toLowerCase().includes(q)) ||
        (r.sku && r.sku.toLowerCase().includes(q)) ||
        (r.po_or_bol_ref && r.po_or_bol_ref.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'

  const handleCancelReceipt = async (receipt) => {
    try {
      const res = await fetch(`${API_BASE}/api/operations/${receipt.id}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Cancellation failed');
      }
      showToast(`✓ Receipt ${receipt.reference} set to Canceled.`);
      fetchReceipts();
    } catch (err) {
      alert(`Error canceling receipt: ${err.message}`);
    }
  };

  const handleValidateReceipt = async (receipt) => {
    try {
      const res = await fetch(`${API_BASE}/api/operations/${receipt.id}/validate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Validation failed');
      const updated = await res.json();
      showToast(`✓ Received +${updated.quantity} ${updated.unit_of_measure} of "${updated.product_name}". Stock increased in DB.`);
      fetchReceipts();
    } catch (err) {
      alert(`Error validating receipt: ${err.message}`);
    }
  };

  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'receipt',
          supplier_or_customer: supplier,
          product_name: productName,
          sku: sku,
          quantity: Number(qty),
          unit_of_measure: uom,
          to_location: destination,
          po_or_bol_ref: poNumber,
        }),
      });

      if (!res.ok) throw new Error('Failed to create receipt');
      const newDoc = await res.json();
      setDrawerOpen(false);
      showToast(`✓ Inbound Receipt ${newDoc.reference} created in database. Ready for receiving inspection.`);
      fetchReceipts();
    } catch (err) {
      alert(`Error creating receipt: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <Sidebar
        activeRoute="/receipts"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* ── MAIN CONTENT ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            {/* Search */}
            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO #, supplier, or SKU..."
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
              />
            </div>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchReceipts()}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh Receipts"
            >
              <span className="material-symbols-outlined text-xl">refresh</span>
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden sm:inline">New Receipt</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Page Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] mb-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                NEON-DB INTAKE &bull; LIVE API
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Receipts (Incoming Goods)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Receive supplier shipments, verify SKU counts against PO demand lines, and increment ledger stock upon validation.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => fetchReceipts()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base text-slate-500">sync</span>
                Sync API Data
              </button>
            </div>
          </div>

          {/* 3 KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Dock Receipts</span>
                <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{receipts.length} Shipments</div>
                <p className="text-xs text-slate-400 mt-0.5">Database registered PO receipts</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-600">
                <span className="text-emerald-700">Neon DB Active</span>
                <span className="text-amber-700">{receipts.filter(r => r.status.toLowerCase() === 'ready').length} Ready</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ready for Validation</span>
                <div className="mt-2 text-3xl font-extrabold text-orange-600 tracking-tight">
                  {receipts.filter(r => r.status.toLowerCase() === 'ready').length} Orders
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Ready for putaway &amp; stock increment</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Auto-increments stock levels
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Validated Receipts</span>
                <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {receipts.filter(r => r.status.toLowerCase() === 'done').length} Completed
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Stock ledger reconciled</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check</span> 100% Stock ledger synced
              </div>
            </div>
          </div>

          {/* Status Quick Filter & View Toggle Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Ready', 'Done', 'Canceled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st === 'All' ? `All Receipts (${receipts.length})` : st}
                </button>
              ))}
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">view_kanban</span>
                Kanban
              </button>
            </div>
          </div>

          {/* Render List View OR Kanban View */}
          {viewMode === 'kanban' ? (
            /* ── Kanban View ── */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Draft / Scheduled', statusKeys: ['draft', 'waiting'], color: 'border-slate-300 bg-slate-50' },
                { title: 'Ready for Intake', statusKeys: ['ready'], color: 'border-amber-300 bg-amber-50/40' },
                { title: 'Done / Reconciled', statusKeys: ['done'], color: 'border-emerald-300 bg-emerald-50/40' },
                { title: 'Canceled', statusKeys: ['canceled'], color: 'border-rose-300 bg-rose-50/40' },
              ].map((col, cIdx) => {
                const colItems = filteredReceipts.filter((r) => col.statusKeys.includes(r.status.toLowerCase()));
                return (
                  <div key={cIdx} className={`rounded-2xl border p-4 flex flex-col gap-3 min-h-[400px] ${col.color}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                        {colItems.length}
                      </span>
                    </div>

                    {colItems.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">No receipts</div>
                    ) : (
                      colItems.map((r) => {
                        const isReady = r.status.toLowerCase() === 'ready';
                        const isDone = r.status.toLowerCase() === 'done';
                        const isCanceled = r.status.toLowerCase() === 'canceled';

                        return (
                          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-shadow space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-orange-600">{r.reference}</span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                LATE SCHEDULE
                              </span>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{r.product_name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{r.sku}</div>
                            </div>
                            <div className="text-[11px] text-slate-600 flex justify-between">
                              <span>Supplier: <strong>{r.supplier_or_customer || 'Vendor'}</strong></span>
                              <span className="font-bold">{r.quantity} {r.unit_of_measure}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              {isReady && (
                                <div className="flex gap-1.5 w-full">
                                  <button
                                    onClick={() => handleValidateReceipt(r)}
                                    className="flex-1 py-1 text-[11px] font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                                  >
                                    Validate (+{r.quantity})
                                  </button>
                                  <button
                                    onClick={() => handleCancelReceipt(r)}
                                    className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {isDone && (
                                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">check_circle</span> Reconciled
                                </span>
                              )}
                              {isCanceled && (
                                <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">cancel</span> Canceled
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── List View Table ── */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 pl-6 pr-4">Receipt Ref</th>
                      <th className="py-3.5 px-4">PO Reference</th>
                      <th className="py-3.5 px-4">Supplier</th>
                      <th className="py-3.5 px-4">Product &amp; SKU</th>
                      <th className="py-3.5 px-4">Destination Storage</th>
                      <th className="py-3.5 px-4">Demand / Received</th>
                      <th className="py-3.5 px-4">Schedule Status</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <span className="material-symbols-outlined text-3xl animate-spin block mb-2 text-orange-600">sync</span>
                          Loading receipts from database...
                        </td>
                      </tr>
                    ) : filteredReceipts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          No receipts found in database.
                        </td>
                      </tr>
                    ) : (
                      filteredReceipts.map((r) => {
                        const isReady = r.status.toLowerCase() === 'ready';
                        const isDone = r.status.toLowerCase() === 'done';
                        const isCanceled = r.status.toLowerCase() === 'canceled';

                        return (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 pl-6 pr-4 font-mono font-bold text-orange-600">{r.reference}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-600">{r.po_or_bol_ref || 'PO-2026-881'}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{r.supplier_or_customer || 'Vendor'}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{r.product_name}</div>
                              <div className="text-[11px] font-mono text-slate-400">{r.sku}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">{r.to_location || 'Main Store Bay A'}</td>
                            <td className="py-3.5 px-4 font-bold">
                              {r.quantity_done} / {r.quantity} {r.unit_of_measure}
                            </td>
                            <td className="py-3.5 px-4">
                              {!isDone && !isCanceled ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  LATE SCHEDULE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                  ON TIME
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                  isDone
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : isReady
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : isCanceled
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                • {r.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 pr-6 text-right space-x-1.5">
                              {isReady && (
                                <>
                                  <button
                                    onClick={() => handleValidateReceipt(r)}
                                    className="px-3 py-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
                                  >
                                    Validate (+{r.quantity})
                                  </button>
                                  <button
                                    onClick={() => handleCancelReceipt(r)}
                                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {isDone && (
                                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">check_circle</span> Reconciled
                                </span>
                              )}
                              {isCanceled && (
                                <span className="text-xs font-semibold text-rose-600 inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">cancel</span> Canceled
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add New Receipt Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[60] flex flex-col justify-between transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between flex-shrink-0 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Inbound Receipt</h2>
            <p className="text-xs text-slate-500 mt-0.5">Saves new receipt directly into Neon PostgreSQL.</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleCreateReceipt} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Supplier / Vendor</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">PO Reference</label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Product Name</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">SKU</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">UoM</label>
                <select
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="pcs">pcs</option>
                  <option value="Units">Units</option>
                  <option value="Pcs">Pcs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Destination Bay</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Dock Gate</label>
                <input
                  type="text"
                  required
                  value={dockGate}
                  onChange={(e) => setDockGate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {formSubmitting ? (
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-base">save</span>
              )}
              {formSubmitting ? 'Saving...' : 'Save Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
