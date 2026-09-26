import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';

const PRODUCTS = [
  {
    id: 1, initials: 'GH', color: 'bg-orange-50 border-orange-200/50 text-orange-600',
    name: 'High-Torque Planetary Gearhead 40:1', sub: 'Hardware & Fasteners', barcode: 'BAR-8891024',
    sku: 'SS-MTR-8812', bin: 'Bay North #03', binIcon: 'location_on', uom: 'Units',
    qty: 40, qtyMax: 62, qtyPct: 65, qtyColor: 'bg-emerald-500', qtyText: 'text-slate-900',
    min: 'Min: 25 Units', status: 'In Stock', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500', action: 'Adjust', actionColor: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
    category: 'Hardware & Fasteners',
  },
  {
    id: 2, initials: 'SR', color: 'bg-slate-100 border-slate-200 text-slate-600',
    name: 'Steel Rods 12mm - Grade 316 Stainless', sub: 'Raw Materials', barcode: 'BAR-5529011',
    sku: 'STL-ROD-012', bin: 'Rack B-18-04', binIcon: 'shelves', uom: 'kg',
    qty: 100, qtyMax: 500, qtyPct: 20, qtyColor: 'bg-amber-500', qtyText: 'text-amber-700',
    min: 'Min: 200 kg', status: 'Low Stock', statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500', action: 'Reorder', actionColor: 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200',
    category: 'Raw Materials',
  },
  {
    id: 3, initials: 'PV', color: 'bg-rose-50 border-rose-200 text-rose-600',
    name: 'Pneumatic Valve Matrix V4', sub: 'Finished Goods', barcode: 'BAR-1002931',
    sku: 'PNU-VLV-881', bin: 'Assembly Line 2', binIcon: 'precision_manufacturing', uom: 'Units',
    qty: 0, qtyMax: 15, qtyPct: 0, qtyColor: 'bg-rose-500', qtyText: 'text-rose-600',
    min: 'Min: 15 Units', status: 'Out of Stock', statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500', action: 'Urgent PO', actionColor: 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200',
    category: 'Finished Goods',
  },
  {
    id: 4, initials: 'EM', color: 'bg-blue-50 border-blue-200/50 text-blue-600',
    name: 'Industrial Electric Motor 5HP', sub: 'Finished Goods', barcode: 'BAR-9092817',
    sku: 'MOT-5HP-IND', bin: 'Cold Storage Vault', binIcon: 'ac_unit', uom: 'Units',
    qty: 20, qtyMax: 25, qtyPct: 80, qtyColor: 'bg-emerald-500', qtyText: 'text-slate-900',
    min: 'Min: 10 Units', status: 'In Stock', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500', action: 'Adjust', actionColor: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
    category: 'Finished Goods',
  },
  {
    id: 5, initials: 'HN', color: 'bg-slate-100 border-slate-200 text-slate-600',
    name: 'Galvanized Hex Nut M12', sub: 'Hardware & Fasteners', barcode: 'BAR-4491029',
    sku: 'NUT-HX-M12', bin: 'Intake Buffer', binIcon: 'shelves', uom: 'pcs',
    qty: 2000, qtyMax: 2222, qtyPct: 90, qtyColor: 'bg-emerald-500', qtyText: 'text-slate-900',
    min: 'Min: 500 pcs', status: 'In Stock', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500', action: 'Adjust', actionColor: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
    category: 'Hardware & Fasteners',
  },
  {
    id: 6, initials: 'HH', color: 'bg-orange-50 border-orange-200/50 text-orange-600',
    name: 'Hydraulic Hose Assembly 2m', sub: 'Raw Materials', barcode: 'BAR-3301982',
    sku: 'HOS-HYD-2M', bin: 'Line B Assembly', binIcon: 'shelves', uom: 'Pcs',
    qty: 80, qtyMax: 111, qtyPct: 72, qtyColor: 'bg-emerald-500', qtyText: 'text-slate-900',
    min: 'Min: 30 Pcs', status: 'In Stock', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500', action: 'Adjust', actionColor: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
    category: 'Raw Materials',
  },
  {
    id: 7, initials: 'CB', color: 'bg-amber-50 border-amber-200/50 text-amber-700',
    name: 'Precision Ceramic Bearings 608', sub: 'Hardware & Fasteners', barcode: 'BAR-7718910',
    sku: 'BRG-CER-608', bin: 'Bay North #03', binIcon: 'shelves', uom: 'Pcs',
    qty: 4, qtyMax: 27, qtyPct: 15, qtyColor: 'bg-amber-500', qtyText: 'text-amber-700',
    min: 'Min: 25 Pcs', status: 'Low Stock', statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500', action: 'Reorder', actionColor: 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200',
    category: 'Hardware & Fasteners',
  },
  {
    id: 8, initials: 'LB', color: 'bg-purple-50 border-purple-200/50 text-purple-600',
    name: 'Lithium-Ion Battery Pack 48V', sub: 'Finished Goods', barcode: 'BAR-9081204',
    sku: 'SKU-BAT-9081', bin: 'Cold Unit B', binIcon: 'ac_unit', uom: 'Units',
    qty: 480, qtyMax: 800, qtyPct: 60, qtyColor: 'bg-emerald-500', qtyText: 'text-slate-900',
    min: 'Min: 100 Units', status: 'In Stock', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500', action: 'Adjust', actionColor: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
    category: 'Finished Goods',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard', active: false },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products', active: true },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/operations?tab=receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/operations?tab=deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/operations?tab=transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/operations?tab=adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function ProductCatalog() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const categories = ['All', 'Raw Materials', 'Hardware & Fasteners', 'Finished Goods'];

  const filtered = PRODUCTS.filter((p) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (activeStatus === 'In Stock' && p.status !== 'In Stock') return false;
    if (activeStatus === 'Low Stock' && p.status !== 'Low Stock') return false;
    if (activeStatus === 'Out of Stock' && p.status !== 'Out of Stock') return false;
    if (lowStockOnly && p.status === 'In Stock') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex">
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

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-100">
            {!sidebarCollapsed ? (
              <>
                <Link to="/" className="flex items-center gap-2 overflow-hidden">
                  <StockSenseLogo className="h-8" />
                </Link>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center"
                  title="Collapse"
                >
                  <span className="material-symbols-outlined text-2xl leading-none">menu</span>
                </button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-11 h-11 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center"
                  title="Expand"
                >
                  <span className="material-symbols-outlined text-2xl leading-none">menu</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 ml-auto"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-1">
            {!sidebarCollapsed ? (
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">search</span>
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs pl-9 pr-3 py-2.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-11 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  title="Search"
                >
                  <span className="material-symbols-outlined text-xl leading-none">search</span>
                </button>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.active;
              const baseClass = `flex items-center rounded-xl transition-all ${
                sidebarCollapsed ? 'w-11 h-11 mx-auto justify-center' : 'px-3.5 py-2.5 gap-3'
              }`;
              const stateClass = isActive
                ? 'bg-orange-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`${baseClass} ${stateClass}`}
                  title={item.label}
                >
                  <span className={`material-symbols-outlined text-xl leading-none ${!isActive && 'text-current'}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-orange-500/20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkPZiRJy0UN6oodwmHtzavZ1T4zOIukDdFpccTV-obe-GD79zRxZOwaAulOimGhi2Yf3vpkT1yhyB2ul7RS38mjpg6Af8MFwFi7VH8US7roiFDoF_X1-zvo9ydTTM2uiV2-sIExHSqmH_E42GBGWKn_joDumM6XeiQe-JgoNkaCenF8Et_KigF9E2trzXD6_Ud2DE10ugyZ9g01z3L42W304dYtCVtCu7hk3OC8Dso5BYhXi1reTLd7A"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate leading-tight">Alex Chen</span>
                  <span className="text-[10px] text-slate-500 truncate leading-tight">Inventory Manager</span>
                </div>
              </div>
              <Link to="/login" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0" title="Log Out">
                <span className="material-symbols-outlined text-lg leading-none">logout</span>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link to="/login" className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center transition-all shadow-xs" title="Log Out">
                <span className="material-symbols-outlined text-xl leading-none">logout</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

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
            {/* Warehouse selector */}
            <div className="relative hidden sm:flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-slate-400 pointer-events-none text-lg">location_on</span>
              <select className="bg-slate-100 text-slate-800 text-xs font-semibold pl-8 pr-7 py-2 rounded-xl appearance-none cursor-pointer hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                <option>Main Warehouse - Floor 1</option>
                <option>Secondary Depot - Rack B</option>
                <option>Cold Storage Unit 3</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 text-slate-400 pointer-events-none text-base">expand_more</span>
            </div>
            {/* Search */}
            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, product, barcode..."
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-14 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-600 hidden sm:inline-block">⌘K</span>
            </div>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-xs text-orange-600">sensors</span>
                Live Stock Feed
              </span>
            </div>
            <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">

          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] mb-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                DC-NORTH-01 &bull;
                <span className="text-emerald-700 font-semibold ml-1">Live SKU Registry Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Product Catalog &amp; Stock Availability
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>Main Distribution Center</span>
                <span>&bull;</span>
                <span>Updated just now</span>
                <span>&bull;</span>
                <span className="font-semibold text-orange-600">99.8% on-time fulfillment rate</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                <span className="material-symbols-outlined text-base text-slate-500">download</span>
                Export Ledger
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-xl text-xs font-semibold shadow-xs transition-colors">
                <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                Print Barcode Labels
                <kbd className="ml-1 px-1 py-0.5 bg-orange-800/40 text-[10px] rounded font-mono">F2</kbd>
              </button>
            </div>
          </div>

          {/* ── 4 KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Unique SKUs</span>
                  <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">1,248</span>
                  <span className="text-xs font-semibold text-slate-500 ml-1">Active</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Across 3 warehouse nodes</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +4.2% MoM
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">98.2% fill</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stock Attention</span>
                  <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">8</span>
                  <span className="text-xs font-bold text-rose-600 ml-1">SKUs flagged</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Threshold triggers detected</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">3 Out of Stock</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">5 Critical</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Receipts</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">move_to_inbox</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">12 Orders</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">~1,450 incoming units</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100/70 text-amber-800">4 Due Today</span>
                <span className="text-xs font-medium text-slate-400">Gate 1-3</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">On-Hand Valuation</span>
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">payments</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">$482,900</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Real-time balance ledger</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
                </span>
                <span className="text-[11px] font-mono text-slate-400">Audited 10m ago</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
            </div>
          </div>

          {/* ── Filter Toolbar ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter SKU, item, barcode..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        activeCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {/* Right controls */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 pr-8">
                  <option>All Bins &amp; Zones (Floor 1)</option>
                  <option>Bay North (#01 - #10)</option>
                  <option>Rack B (Fasteners)</option>
                  <option>Assembly Lines</option>
                  <option>Cold Vault Storage</option>
                </select>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={(e) => setLowStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Low Stock Only</span>
                </label>
              </div>
            </div>
            {/* Status quick-filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeStatus === s
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {s !== 'All' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      s === 'In Stock' ? 'bg-emerald-500' : s === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  )}
                  {s}
                  <span className="opacity-60 font-mono">
                    {s === 'All' ? ` ${PRODUCTS.length}` : ` ${PRODUCTS.filter(p => p.status === s).length}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Products Table ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-6 pr-4">Product Details</th>
                    <th className="py-3.5 px-4">SKU / Code</th>
                    <th className="py-3.5 px-4">Bin Location</th>
                    <th className="py-3.5 px-4 text-center">UoM</th>
                    <th className="py-3.5 px-4">Stock Level</th>
                    <th className="py-3.5 px-4">Reorder Min</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">inventory_2</span>
                        No products match your filters.
                      </td>
                    </tr>
                  ) : filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        p.status === 'Low Stock' ? 'bg-amber-50/20' : p.status === 'Out of Stock' ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0 ${p.color}`}>
                            {p.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{p.name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{p.sub}</span>
                              <span>•</span>
                              <span className="font-mono">{p.barcode}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                          {p.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <span className="material-symbols-outlined text-sm text-slate-400">{p.binIcon}</span>
                          {p.bin}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-600 font-medium">{p.uom}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className={`font-bold ${p.qtyText}`}>
                            {p.qty.toLocaleString()} <span className="text-[11px] text-slate-400 font-normal">{p.uom}</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`${p.qtyColor} h-full rounded-full`} style={{ width: `${p.qtyPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{p.min}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${p.statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button className={`px-2.5 py-1 text-xs font-semibold border rounded-lg transition-colors ${p.actionColor}`}>
                            {p.action}
                          </button>
                          <button className="text-slate-400 hover:text-slate-700 p-1 text-base">⋮</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="border-t border-slate-200 px-6 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-700">1,248</span> products
              </span>
              <div className="inline-flex items-center gap-1">
                <button className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 rounded-lg border border-slate-200 cursor-not-allowed" disabled>Previous</button>
                <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white bg-orange-600 rounded-lg shadow-xs">1</button>
                <button className="w-8 h-8 flex items-center justify-center text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">3</button>
                <span className="px-1 text-slate-400 text-xs">...</span>
                <button className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 bg-white rounded-lg border border-slate-200 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── ADD PRODUCT DRAWER ── */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[60] flex flex-col justify-between transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between flex-shrink-0 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-600">inventory_2</span>
              <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Create a new inventory item and define warehouse rules.</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        {/* Drawer Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Product Name <span className="text-rose-500">*</span></label>
            <input className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40" placeholder="e.g. Hexagonal Titanium Screw M6" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">SKU / Code <span className="text-rose-500">*</span></label>
                <button className="text-[11px] text-orange-600 hover:underline font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">autorenew</span> Auto-generate
                </button>
              </div>
              <input className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="SKU-XXX-0000" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Barcode / EAN-13</label>
              <div className="relative">
                <input className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono px-3 py-2 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="00000000000" />
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">barcode_scanner</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Category <span className="text-rose-500">*</span></label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none appearance-none">
                <option>Finished Goods / Precision Parts</option>
                <option>Raw Materials</option>
                <option>Hardware &amp; Fasteners</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Unit of Measure <span className="text-rose-500">*</span></label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none appearance-none">
                <option>Units (pcs)</option>
                <option>Kilogram (kg)</option>
                <option>Meter (m)</option>
                <option>Roll</option>
                <option>Box / Pack</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Warehouse Location <span className="text-rose-500">*</span></label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none appearance-none">
              <option>Main Store - Rack A-04</option>
              <option>Bay North #03</option>
              <option>Rack B-18-04</option>
              <option>Cold Storage Vault</option>
              <option>Intake Buffer Zone</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">On-Hand Qty</label>
              <input type="number" min="0" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Min Buffer</label>
              <input type="number" min="0" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Max Buffer</label>
              <input type="number" min="0" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30" placeholder="0" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Notes / Description</label>
            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" placeholder="Internal notes, supplier info, handling instructions..." />
          </div>
        </div>
        {/* Drawer Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">save</span>
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
