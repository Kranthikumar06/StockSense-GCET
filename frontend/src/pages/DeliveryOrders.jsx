import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';
import './DeliveryOrders.css';

const INITIAL_DELIVERIES = [
  {
    id: 1,
    ref: 'WH/OUT/00118',
    customer: 'Apex Automation (Ford Plant)',
    carrier: 'FedEx Freight #8812',
    source: 'Main Store Bay A',
    item: 'Planetary Gearhead 40:1',
    sku: 'SS-MTR-8812',
    qty: 40,
    uom: 'Units',
    step: 'Packed', // 'Picking', 'Packed', 'Validated'
    status: 'Ready',
    cutoff: '15:15 EST',
    bolRef: 'BOL-2026-9901',
  },
  {
    id: 2,
    ref: 'WH/OUT/00119',
    customer: 'Nordic Freight Systems',
    carrier: 'DHL Global Forwarding',
    source: 'Bay North #03',
    item: 'Precision Ceramic Bearings 608',
    sku: 'BRG-CER-608',
    qty: 20,
    uom: 'Pcs',
    step: 'Validated',
    status: 'Done',
    cutoff: '11:20 EST',
    bolRef: 'BOL-2026-9899',
  },
  {
    id: 3,
    ref: 'WH/OUT/00120',
    customer: 'Tesla Gigafactory 4',
    carrier: 'Expedited Express',
    source: 'Finished Goods Bay',
    item: 'Industrial Servo Controller V5',
    sku: 'SS-CTR-0922',
    qty: 150,
    uom: 'Units',
    step: 'Picking',
    status: 'Waiting',
    cutoff: '16:00 EST',
    bolRef: 'BOL-2026-9902',
  },
  {
    id: 4,
    ref: 'WH/OUT/00121',
    customer: 'Boeing Aero Support',
    carrier: 'Ryder Logistics',
    source: 'Cold Storage Vault',
    item: 'Lithium-Ion Battery Pack 48V',
    sku: 'SKU-BAT-9081',
    qty: 15,
    uom: 'Units',
    step: 'Picking',
    status: 'Draft',
    cutoff: 'Tomorrow, 10:00',
    bolRef: 'BOL-2026-9903',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/deliveries', active: true, badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function DeliveryOrders() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Delivery Order Form State
  const [customer, setCustomer] = useState('Apex Automation');
  const [sourceLoc, setSourceLoc] = useState('Main Store Bay A');
  const [item, setItem] = useState('Planetary Gearhead 40:1');
  const [sku, setSku] = useState('SS-MTR-8812');
  const [qty, setQty] = useState(10);
  const [uom, setUom] = useState('Units');
  const [carrier, setCarrier] = useState('FedEx Freight');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNextStep = (order) => {
    if (order.step === 'Picking') {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === order.id ? { ...d, step: 'Packed', status: 'Ready' } : d))
      );
      showToast(`✓ Order ${order.ref} picked and staged for packing.`);
    } else if (order.step === 'Packed') {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === order.id ? { ...d, step: 'Validated', status: 'Done' } : d))
      );
      showToast(`✓ Delivery ${order.ref} validated: -${order.qty} ${order.uom} decremented from ${order.source} automatically.`);
    }
  };

  const handleCreateDelivery = (e) => {
    e.preventDefault();
    const randNum = Math.floor(100 + Math.random() * 900);
    const newDoc = {
      id: Date.now(),
      ref: `WH/OUT/00${randNum}`,
      customer,
      carrier,
      source: sourceLoc,
      item,
      sku,
      qty: Number(qty),
      uom,
      step: 'Picking',
      status: 'Waiting',
      cutoff: 'Today, 16:30 EST',
      bolRef: `BOL-2026-${randNum + 5000}`,
    };
    setDeliveries([newDoc, ...deliveries]);
    setDrawerOpen(false);
    showToast(`✓ Outgoing Delivery Order ${newDoc.ref} generated. Ready for picking.`);
  };

  const filtered = deliveries.filter((d) => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.ref.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q) ||
        d.item.toLowerCase().includes(q) ||
        d.carrier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="delivery-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">local_shipping</span>
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
                const active = item.label.includes('Delivery Orders');
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

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-indigo-600 text-[18px]">local_shipping</span>
                <span>Outbound Shipping Dispatch</span>
              </div>
            </div>

            <div className="hidden md:flex relative w-[360px]">
              <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3 top-2 pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search BOL #, customer, or SKU..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">checklist</span>
                <span>Batch Picking List</span>
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shadow-orange-500/20 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ New Delivery Order</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  <span>CUSTOMER FULFILLMENT PIPELINE</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Delivery Orders (Outgoing Goods)
                </h1>
                <p className="text-xs text-slate-500">
                  Pick items from warehouse racks, pack shipments, generate carrier BOL slips, and automatically decrement inventory levels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-orange-600 text-[16px]">alarm</span>
                  <span>Carrier Cutoff: <strong>16:00 EST</strong></span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="delivery-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Shipments</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">24 Outbound</div>
                <p className="text-xs text-slate-500 mt-1">9 picking in stage • 15 ready</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-semibold font-mono">
                  <span>BOL Carrier Queue</span>
                  <span>FedEx / DHL</span>
                </div>
              </div>

              <div className="delivery-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step Process Pipeline</span>
                <div className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-xs">1. Pick</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs">2. Pack</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs">3. Validate</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Deducts stock on validation step</p>
              </div>

              <div className="delivery-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Decremented</span>
                <div className="text-2xl font-extrabold text-purple-600 mt-1">-820 Units</div>
                <p className="text-xs text-slate-500 mt-1">Stock ledger auto-synchronized</p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-emerald-600 font-semibold">
                  ✓ 100% On-time Carrier Handover
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
                    {st === 'All' ? `All Deliveries (${deliveries.length})` : st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Auto-decrement rule: <strong>Validate → Stock -Qty</strong>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Delivery Ref</th>
                      <th className="py-3.5 px-4">BOL Slip #</th>
                      <th className="py-3.5 px-4">Customer Destination</th>
                      <th className="py-3.5 px-4">Product & SKU</th>
                      <th className="py-3.5 px-4">Source Bin</th>
                      <th className="py-3.5 px-4">Volume Delta</th>
                      <th className="py-3.5 px-3 text-center">Fulfillment Step</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filtered.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">{d.ref}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{d.bolRef}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{d.customer}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{d.carrier}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{d.item}</div>
                          <div className="font-mono text-[11px] text-slate-400">{d.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{d.source}</td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">
                          -{d.qty} {d.uom}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              d.step === 'Picking'
                                ? 'bg-amber-100 text-amber-800'
                                : d.step === 'Packed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {d.step}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {d.step === 'Picking' && (
                            <button
                              onClick={() => handleNextStep(d)}
                              className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition"
                              type="button"
                            >
                              Pack Items
                            </button>
                          )}
                          {d.step === 'Packed' && (
                            <button
                              onClick={() => handleNextStep(d)}
                              className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 active:scale-95 transition shadow-xs"
                              type="button"
                            >
                              Validate (-{d.qty})
                            </button>
                          )}
                          {d.step === 'Validated' && (
                            <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-[14px]">local_shipping</span> Dispatched
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

      {/* Slide-over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setDrawerOpen(false)} className="drawer-backdrop-delivery fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <aside className="drawer-panel-delivery relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  OUTBOUND DISPATCH
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">Create Delivery Order</h2>
                <p className="text-xs text-slate-500">Initiate shipment for customer sales order</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} id="newDeliveryForm" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Consignee *</label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Carrier Partner</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <option>FedEx Freight</option>
                  <option>DHL Global Express</option>
                  <option>UPS Supply Chain</option>
                  <option>Nordic Logistics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Description *</label>
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Quantity to Ship</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <select value={uom} onChange={(e) => setUom(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option value="Units">Units (ea)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="Pcs">Pieces (pcs)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Location</label>
                  <select value={sourceLoc} onChange={(e) => setSourceLoc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Main Store Bay A</option>
                    <option>Bay North #03</option>
                    <option>Finished Goods Bay</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 text-[11px]">
                Upon validation after picking & packing, <strong>-{qty} {uom}</strong> will be deducted from <strong>{sourceLoc}</strong> and logged into the Stock Ledger.
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
                form="newDeliveryForm"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">outbox</span>
                <span>Create Delivery Order</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
