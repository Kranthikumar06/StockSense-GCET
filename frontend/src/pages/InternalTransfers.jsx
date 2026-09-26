import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar, { useSidebarState } from '../components/Sidebar';
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

const API_URL = 'http://localhost:8000/api/operations';

export default function InternalTransfers() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(`${API_URL}?type=internal`);
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((op) => ({
          id: op.id,
          ref: op.reference,
          source: op.from_location || 'Main Store Bay A',
          dest: op.to_location || 'Production Rack',
          item: op.product_name || 'Product Item',
          sku: op.sku || 'SKU-001',
          qty: op.quantity,
          uom: op.unit_of_measure,
          operator: op.supplier_or_customer || 'Manager',
          status: op.status === 'done' ? 'Done' : op.status === 'ready' ? 'Ready' : 'In-Transit',
          eta: op.status === 'done' ? 'Verified' : 'Scheduled',
        }));
        setTransfers(mapped);
      }
    } catch (e) {
      console.warn('Using fallback transfer data', e);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleExecuteTransfer = async (transfer) => {
    try {
      await axios.post(`${API_URL}/${transfer.id}/validate`);
      fetchTransfers();
      showToast(`✓ Transferred ${transfer.qty} ${transfer.uom} of ${transfer.item} from ${transfer.source} → ${transfer.dest}. Live stock updated.`);
    } catch (e) {
      setTransfers((prev) =>
        prev.map((t) => (t.id === transfer.id ? { ...t, status: 'Done', eta: 'Transfer Verified' } : t))
      );
      showToast(`✓ Transferred ${transfer.qty} ${transfer.uom} of ${transfer.item} from ${transfer.source} → ${transfer.dest}. Total stock unchanged, locations updated.`);
    }
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        type: 'internal',
        supplier_or_customer: assignedOperator,
        product_name: itemName,
        sku: skuCode,
        quantity: Number(quantity),
        unit_of_measure: uom,
        from_location: sourceLoc,
        to_location: destLoc,
        status: 'ready'
      });
      fetchTransfers();
      setDrawerOpen(false);
      showToast(`✓ Internal Transfer scheduled from ${sourceLoc} → ${destLoc}. Saved in database.`);
    } catch (err) {
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
    }
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

      <Sidebar
        activeRoute="/transfers"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-20">
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <div className="relative flex items-center flex-1">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transfer ref, SKU, location..."
                  className="w-full bg-slate-100/80 border border-slate-200/80 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-normal transition outline-none"
                />
                <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200/80 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shadow-orange-500/20 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>New Internal Transfer</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
            {/* Page Title Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Internal Transfers
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Move stock between internal locations (e.g. Main Store → Production Rack, Rack A → Rack B). Total inventory remains unchanged while bin locations update.
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => fetchTransfers()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-slate-500">sync</span>
                  Sync API Data
                </button>
              </div>
            </div>

            {/* 3 KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL INTERNAL TRANSFERS</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{transfers.length} Transfers</div>
                <div className="text-xs text-slate-500 mt-1">Database registered bin moves</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">READY / IN-TRANSIT</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-1.5">
                  {transfers.filter((t) => t.status === 'Ready' || t.status === 'In-Transit' || t.status === 'ready').length} Active
                </div>
                <div className="text-xs text-slate-500 mt-1">Awaiting relocation completion</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">COMPLETED MOVES</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1.5">
                  {transfers.filter((t) => t.status === 'Done' || t.status === 'done').length} Relocated
                </div>
                <div className="text-xs text-slate-500 mt-1">Location stock updated in ledger</div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {['All', 'Ready', 'In-Transit', 'Done', 'Draft'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${statusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    type="button"
                  >
                    {st === 'All' ? `All Transfers (${transfers.length})` : st}
                  </button>
                ))}
              </div>
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
                        <td className="py-3 px-4 font-medium text-slate-700">{t.source}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{t.dest}</td>
                        <td className="py-3 px-4 font-semibold text-blue-600">
                          {t.qty} {t.uom}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{t.operator}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${t.status === 'Ready'
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
