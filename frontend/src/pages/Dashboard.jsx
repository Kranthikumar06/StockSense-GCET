import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StockSenseLogo from '../components/StockSenseLogo';
import Sidebar, { useSidebarState } from '../components/Sidebar';

const API_URL = 'http://localhost:8000/api/dashboard';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-1');

  // Sample operations data from Stitch design
  const operationsData = [
    {
      id: 'WH/IN/00042',
      type: 'Receipt',
      typeIcon: 'move_to_inbox',
      typeColor: 'text-amber-600 bg-amber-50',
      partner: 'Tata Steel Ltd',
      partnerSub: 'PO-2023-8891',
      date: 'Today, 09:30 AM',
      dateSub: 'Dock Gate #2',
      dateAlert: true,
      units: '450 EA',
      status: 'Waiting',
      statusColor: 'bg-amber-100 text-amber-800 animate-pulse',
    },
    {
      id: 'WH/OUT/00118',
      type: 'Delivery',
      typeIcon: 'local_shipping',
      typeColor: 'text-orange-600 bg-orange-50',
      partner: 'Acme Retail Corp',
      partnerSub: 'SO-99214-US',
      date: 'Today, 11:15 AM',
      dateSub: 'Standard Logistics',
      dateAlert: false,
      units: '1,200 EA',
      status: 'Ready',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'WH/INT/00094',
      type: 'Transfer',
      typeIcon: 'swap_horiz',
      typeColor: 'text-slate-600 bg-slate-100',
      partner: 'Internal Bay A → Assembly B',
      partnerSub: 'Forklift Route #4',
      date: 'Today, 12:00 PM',
      dateSub: 'Internal Request',
      dateAlert: false,
      units: '80 EA',
      status: 'Ready',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'WH/ADJ/00015',
      type: 'Adjustment',
      typeIcon: 'tune',
      typeColor: 'text-rose-600 bg-rose-50',
      partner: 'Cold Storage Rack C-04',
      partnerSub: 'Cycle Count Audit #12',
      date: 'Yesterday, 17:40',
      dateSub: 'Manager Override',
      dateAlert: false,
      units: '-12 EA',
      unitsAlert: true,
      status: 'Done',
      statusColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'WH/IN/00043',
      type: 'Receipt',
      typeIcon: 'move_to_inbox',
      typeColor: 'text-amber-600 bg-amber-50',
      partner: 'Apex Global Components',
      partnerSub: 'PO-2023-9002',
      date: 'Today, 14:00 PM',
      dateSub: 'Priority Air Freight',
      dateAlert: false,
      units: '340 EA',
      status: 'Draft',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'WH/OUT/00119',
      type: 'Delivery',
      typeIcon: 'local_shipping',
      typeColor: 'text-orange-600 bg-orange-50',
      partner: 'Nordic Freight Systems',
      partnerSub: 'SO-99220-EU',
      date: 'Today, 15:30 PM',
      dateSub: 'Express Export',
      dateAlert: false,
      units: '510 EA',
      status: 'Waiting',
      statusColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'WH/OUT/00120',
      type: 'Delivery',
      typeIcon: 'local_shipping',
      typeColor: 'text-orange-600 bg-orange-50',
      partner: 'Vanguard Hardware Group',
      partnerSub: 'SO-99225-US',
      date: 'Today, 16:00 PM',
      dateSub: 'Fleet Truck #09',
      dateAlert: false,
      units: '95 EA',
      status: 'Ready',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const filteredOperations = operationsData.filter((op) => {
    if (activeTab === 'receipts' && op.type !== 'Receipt') return false;
    if (activeTab === 'deliveries' && op.type !== 'Delivery') return false;
    if (activeTab === 'transfers' && op.type !== 'Transfer') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        op.id.toLowerCase().includes(q) ||
        op.partner.toLowerCase().includes(q) ||
        op.partnerSub.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeRoute="/dashboard"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Body Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
          }`}
      >
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Warehouse Selector */}
            <div className="relative hidden sm:flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-slate-400 pointer-events-none text-lg">
                location_on
              </span>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="bg-slate-100 text-slate-800 text-xs font-semibold pl-8 pr-7 py-2 rounded-xl appearance-none cursor-pointer hover:bg-slate-200/70 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="wh-1">Main Warehouse - Floor 1</option>
                <option value="wh-2">Secondary Depot - Rack B</option>
                <option value="wh-3">Cold Storage Unit 3</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 text-slate-400 pointer-events-none text-base">
                expand_more
              </span>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-14 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
                placeholder="Search SKU, operation, partner..."
                type="text"
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-600 hidden sm:inline-block">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live Feed Pill */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-xs text-orange-600">sensors</span>
                Live Stock Feed
              </span>
            </div>

            {/* Notifications Button */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* New Operation Primary CTA Button */}
            <div className="inline-flex items-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-colors">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold tracking-wide"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span className="hidden sm:inline">New Operation</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          {/* Operations Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-200 text-slate-800 font-bold">
                  DC-NORTH-01
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Live Ingestion Engine Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Warehouse Operations Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Main Distribution Center • Updated just now • <span className="text-orange-600 font-semibold">99.8% on-time fulfillment rate</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center bg-white border border-slate-200 shadow-xs rounded-xl px-3 py-2 gap-2 text-xs font-semibold text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-base">calendar_today</span>
                <span>Shift: Morning (06:00 - 14:00)</span>
              </div>
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors">
                <span className="material-symbols-outlined text-base leading-none">download</span>
                <span>Ledger</span>
              </button>
              <button className="flex items-center gap-1.5 bg-orange-600 text-white hover:bg-orange-700 shadow-sm px-3.5 py-2 rounded-xl text-xs font-semibold transition-all">
                <span className="material-symbols-outlined text-base leading-none">qr_code_scanner</span>
                <span>Terminal Scan</span>
                <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-mono">F2</span>
              </button>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Active Products */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In-Stock Volume</span>
                <span className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">14,820</div>
                <div className="text-[11px] text-slate-500">across 2 warehouse nodes</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  Live DB Count
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-semibold">98.2% fill</span>
              </div>
              <div className="w-full mt-2">
                <svg className="w-full h-6 text-orange-500" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 20 Q 25 15, 50 18 T 100 6" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <path d="M0 20 Q 25 15, 50 18 T 100 6 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
              </div>
            </div>

            {/* Card 2: Stock Attention */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stock Attention</span>
                <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">8</span>
                  <span className="text-xs font-semibold text-rose-600">SKUs flagged</span>
                </div>
                <div className="text-[11px] text-slate-500">Threshold triggers detected</div>
              </div>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">3 Out of Stock</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">5 Critical</span>
              </div>
              <div className="w-full mt-2">
                <svg className="w-full h-6 text-rose-500" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 10 Q 30 18, 60 8 T 100 20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <path d="M0 10 Q 30 18, 60 8 T 100 20 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
              </div>
            </div>

            {/* Card 3: Pending Receipts */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Receipts</span>
                <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                  <span className="material-symbols-outlined text-lg">move_to_inbox</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">12 Orders</div>
                <div className="text-[11px] text-slate-500">~1,450 incoming units</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">4 Due Today</span>
                <span className="text-[11px] text-slate-500">Gate 1-3</span>
              </div>
              <div className="w-full mt-2">
                <svg className="w-full h-6 text-amber-500" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 22 L 20 18 L 40 19 L 60 11 L 80 14 L 100 4" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <path d="M0 22 L 20 18 L 40 19 L 60 11 L 80 14 L 100 4 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
              </div>
            </div>

            {/* Card 4: Pending Deliveries */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Deliveries</span>
                <span className="p-1.5 rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">24 Shipments</div>
                <div className="text-[11px] text-slate-500">Outbound queue active</div>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-slate-600"><strong className="text-slate-900">9</strong> picking</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">15 Dispatch</span>
              </div>
              <div className="w-full mt-2">
                <svg className="w-full h-6 text-orange-500" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0 16 C 30 18, 50 12, 75 9 S 90 4, 100 2" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <path d="M0 16 C 30 18, 50 12, 75 9 S 90 4, 100 2 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1"></path>
                </svg>
              </div>
            </div>

            {/* Card 5: Pending Operations */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Ops</span>
                <span className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                  <span className="material-symbols-outlined text-lg">pending_actions</span>
                </span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">36</div>
                <div className="text-[11px] text-slate-500">Draft moves queued</div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">Live Status</span>
              </div>
            </div>
          </div>

          {/* Operations Data Table Section */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
            {/* Table Header Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-slate-900">Recent Warehouse Operations</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {filteredOperations.length} Total
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    All ({operationsData.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'receipts'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Receipts
                  </button>
                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'deliveries'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Deliveries
                  </button>
                  <button
                    onClick={() => setActiveTab('transfers')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'transfers'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    Transfers
                  </button>
                </div>

                {/* Filter / Search input */}
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-base pointer-events-none">
                    filter_list
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:bg-white border border-transparent focus:border-slate-300 transition-colors w-36 sm:w-44"
                    placeholder="Filter references..."
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                    <th className="py-3 px-4 sm:px-6">Reference</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Partner / Node</th>
                    <th className="py-3 px-4 sm:px-6">Scheduled Date</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Units</th>
                    <th className="py-3 px-4 sm:px-6 text-center">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOperations.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-orange-600">
                        {op.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${op.typeColor}`}>
                          <span className="material-symbols-outlined text-sm">{op.typeIcon}</span>
                          {op.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900">{op.partner}</div>
                        <div className="text-[11px] text-slate-400">{op.partnerSub}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="text-xs text-slate-800">{op.date}</div>
                        <div className={`text-[10px] font-semibold ${op.dateAlert ? 'text-rose-600' : 'text-slate-400'}`}>
                          {op.dateSub}
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 sm:px-6 text-right font-mono font-bold ${op.unitsAlert ? 'text-rose-600' : 'text-slate-900'}`}>
                        {op.units}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${op.statusColor}`}>
                          {op.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors">
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <span className="font-semibold text-slate-800">{filteredOperations.length}</span> operations
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40" disabled>
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="px-3 py-1 rounded-lg bg-orange-600 text-white font-bold">1</button>
                <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">2</button>
                <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Real-time Telemetry Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">sensors</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Active RFID Portals</div>
                  <div className="text-[11px] text-slate-500">14/14 Readers Synchronized</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                99.9% PING
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">forklift</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">MHE Automation Telemetry</div>
                  <div className="text-[11px] text-slate-500">6 AGVs in Continuous Loop</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 font-bold border border-amber-200/60">
                Zero Stops
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cycle Count Compliance</div>
                  <div className="text-[11px] text-slate-500">Daily Schedule 100% on Track</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-bold">
                Audited 12:00
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
