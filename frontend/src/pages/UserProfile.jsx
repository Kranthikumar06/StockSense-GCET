import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StockSenseLogo from '../components/StockSenseLogo';
import './UserProfile.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export default function UserProfile() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@stocksense.logistics');
  const [phone, setPhone] = useState('+1 (312) 555-0194');
  const [shift, setShift] = useState('morning');
  const [locale, setLocale] = useState('English (US) — Eastern Time (UTC-5)');
  const [defaultNode, setDefaultNode] = useState('floor1');
  const [userRole, setUserRole] = useState('Level 4 Lead');

  // Alert preferences
  const [alerts, setAlerts] = useState({
    criticalStock: true,
    highValueVariance: true,
    shiftHandoff: true,
    weeklyLedger: false,
  });

  // Active terminal sessions
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Terminal #4 (Warehouse Floor Scanner)',
      details: 'Zebra TC57 Android Enterprise • OS 13',
      icon: 'barcode_scanner',
      ip: '10.14.2.88',
      telemetry: 'Just Now',
      isCurrent: true,
    },
    {
      id: 2,
      device: 'Logistics Office Workstation',
      details: 'Chrome 122 • macOS Sonoma (Dock Dispatch 1)',
      icon: 'laptop_mac',
      ip: '10.14.0.12',
      telemetry: '18m ago',
      isCurrent: false,
    },
    {
      id: 3,
      device: 'iPad Pro 12.9 (Forklift Dock Bay 03)',
      details: 'Dedicated Mounting • StockSense Native POS',
      icon: 'tablet',
      ip: '10.14.5.109',
      telemetry: 'Yesterday, 17:42',
      isCurrent: false,
    },
  ]);

  // OTP Reset Password Modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleProfileSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Operator profile and security policies successfully synchronized across warehouse nodes.');
    }, 600);
  };

  const handleTerminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    showToast('All external remote terminal sessions have been successfully terminated.');
  };

  const handleRevokeSingleSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast('Terminal session revoked.');
  };

  const handleRequestOtp = () => {
    setOtpSent(true);
    showToast(`✓ 6-Digit security OTP sent to ${email}`);
  };

  const handleVerifyOtpReset = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      showToast('Please enter a valid OTP code.');
      return;
    }
    setOtpModalOpen(false);
    setOtpSent(false);
    setOtpCode('');
    setNewPassword('');
    showToast('✓ Master password successfully updated via 2FA OTP verification.');
  };

  const handleDownloadAudit = () => {
    showToast('Downloading cryptographic operator activity log (.PDF)...');
  };

  return (
    <div className="profile-page-wrapper min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 toast-slide-down">
          <span className="material-symbols-outlined text-orange-400 text-base">verified_user</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
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
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
              )}
            </div>

            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl transition"
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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center rounded-xl transition-all ${
                    sidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2 justify-between'
                  } text-slate-600 hover:text-slate-900 hover:bg-slate-100`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-slate-500">
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-2 w-full pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className={`flex items-center rounded-xl transition-colors ${
                sidebarCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2 gap-3'
              } bg-orange-600 text-white font-semibold shadow-xs`}
              title="My Profile"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              {!sidebarCollapsed && <span className="text-xs font-semibold">My Profile</span>}
            </Link>
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
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between gap-4">
            {/* Left: Facility selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="relative">
                <button
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 transition"
                  type="button"
                >
                  <span className="text-sm">🏢</span>
                  <span>Main Warehouse - Floor 1</span>
                  <span className="material-symbols-outlined text-slate-400 text-xs">expand_more</span>
                </button>
              </div>
            </div>

            {/* Center: Command Palette Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 absolute left-3 text-base pointer-events-none">
                  search
                </span>
                <input
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-9 pr-12 py-1.5 text-xs placeholder:text-slate-400 font-normal transition text-slate-700"
                  placeholder="Search operator settings, security logs, clearances..."
                  type="text"
                />
                <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right Signals */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-3 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>FIPS 140-2 Compliant</span>
              </div>
              <button
                aria-label="Notifications"
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100">
                  AM
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-7">
            {/* Top Command & Breadcrumb Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-orange-50 text-orange-800 font-medium text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>USER IDENTITY & ACCESS CONTROL • Active Operator Session</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Profile & Security</h1>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Manage personal operator credentials, warehouse authorization roles, dual-factor cryptographic keys, and active terminal sessions.
                </p>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadAudit}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>Download Audit Log</span>
                </button>
                <button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSaving ? 'animate-spin' : ''}`}>
                    {isSaving ? 'refresh' : 'check_circle'}
                  </span>
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            {/* Bento Enterprise Grid (1/3 vs 2/3 Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ================= LEFT COLUMN: Core Operator Identity & Clearances (4 Cols) ================= */}
              <div className="lg:col-span-4 space-y-6">
                {/* Profile Identity Card */}
                <div className="profile-card p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-sm ring-2 ring-slate-200">
                        AM
                      </div>
                      <span
                        className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white"
                        title="Active on Terminal #4"
                      ></span>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 truncate">{fullName}</h2>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Online • {userRole}</span>
                      </div>
                      <p className="text-xs text-orange-600 font-mono font-semibold">OP-94812</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Assigned Facility</span>
                      <span className="font-mono font-semibold text-slate-800">DC-NORTH-01</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Department</span>
                      <span className="font-semibold text-slate-800">Logistics Dispatch & Intake</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Shift Schedule</span>
                      <span className="font-semibold text-slate-800">Morning (06:00 - 14:00)</span>
                    </div>
                  </div>

                  {/* Telemetry Stats Ticker */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-base font-extrabold text-slate-900">1,420</div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Movements</div>
                    </div>
                    <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="text-base font-extrabold text-orange-600">99.8%</div>
                      <div className="text-[10px] text-orange-700 uppercase font-semibold mt-0.5">Accuracy</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-base font-extrabold text-slate-900">454</div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Days Active</div>
                    </div>
                  </div>

                  {/* Quick Operator Card Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => showToast('Avatar customization window opened.')}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl text-center transition"
                      type="button"
                    >
                      Change Avatar
                    </button>
                    <button
                      onClick={() => showToast('Keycard RFID authentication revoked.')}
                      className="py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl text-center transition"
                      type="button"
                    >
                      Revoke Keycard
                    </button>
                  </div>
                </div>

                {/* Role & Warehouse Clearance Card */}
                <div className="profile-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-orange-600">verified</span>
                      <h3 className="text-sm font-bold text-slate-900">Security Clearances</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-mono text-[11px] font-bold">
                      Tier 4 Clearance
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Operator privileges validated via facility security policy. Re-certification scheduled in 142 days.
                  </p>

                  {/* Permissions Checklist */}
                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">Inbound PO Receipts & Breakdown</p>
                        <p className="text-[11px] text-slate-500">Full intake authorization across dock bays 01-14</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">Outbound Dispatch & BOL Sign-off</p>
                        <p className="text-[11px] text-slate-500">Authorized to release carrier manifests & seals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">Physical Stock Reconciliations</p>
                        <p className="text-[11px] text-slate-500">Cycle count variances up to $25,000 threshold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">Cryptographic Ledger Signing</p>
                        <p className="text-[11px] text-slate-500">Hardware-backed SHA-256 block commitment</p>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Depots */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                      Authorized Warehouse Depots
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-orange-600">warehouse</span>
                        <span>DC-North-01 (Primary)</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-slate-500">domain</span>
                        <span>Hub 04 (Chicago South)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Hardware Lock / Keycard Status */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[22px] text-orange-600 shrink-0">badge</span>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">RFID NFC Badge Synced</h4>
                    <p className="text-slate-500">
                      Badge ID: <span className="font-mono font-semibold text-slate-900">#NFC-9941-88</span>. Synced with North Perimeter turnstiles and cold-chain airlocks.
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT COLUMN: Detailed Settings, 2FA, Terminals & Alerts (8 Cols) ================= */}
              <div className="lg:col-span-8 space-y-6">
                {/* Card 1: General Operator Credentials Form */}
                <div className="profile-card p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-orange-600">tune</span>
                      <h3 className="text-sm font-bold text-slate-900">Operator Profile Details</h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Last synchronized 2 mins ago</span>
                  </div>

                  <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700" htmlFor="full-name">
                        Full Legal Name
                      </label>
                      <input
                        className="profile-input"
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    {/* Corporate Email */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-700" htmlFor="email">
                          Corporate Email
                        </label>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          Domain Verified
                        </span>
                      </div>
                      <input
                        className="profile-input"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Phone / Terminal Comm */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700" htmlFor="phone">
                        Warehouse Radio / Terminal Comm
                      </label>
                      <input
                        className="profile-input"
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    {/* Shift Window */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700" htmlFor="shift">
                        Operational Shift Slot
                      </label>
                      <select
                        className="profile-select"
                        id="shift"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                      >
                        <option value="morning">Morning Shift (06:00 - 14:00 EST)</option>
                        <option value="afternoon">Afternoon Shift (14:00 - 22:00 EST)</option>
                        <option value="graveyard">Night Shift (22:00 - 06:00 EST)</option>
                      </select>
                    </div>

                    {/* Language & Timezone */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700" htmlFor="locale">
                        System Locale & Timezone
                      </label>
                      <input
                        className="profile-input"
                        id="locale"
                        type="text"
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                      />
                    </div>

                    {/* Default Warehouse Node */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700" htmlFor="default-node">
                        Default Topology View
                      </label>
                      <select
                        className="profile-select"
                        id="default-node"
                        value={defaultNode}
                        onChange={(e) => setDefaultNode(e.target.value)}
                      >
                        <option value="floor1">🏢 Main Warehouse - Floor 1 (DC-North-01)</option>
                        <option value="floor2">🏢 Upper Racking Mezzanine - Floor 2</option>
                        <option value="colddock">❄️ Cold Storage Vault & Buffer</option>
                        <option value="hub4">📦 Chicago South Depot (Hub 04)</option>
                      </select>
                    </div>
                  </form>
                </div>

                {/* Card 2: Security & Hardware Dual-Factor Authentication (2FA) */}
                <div className="profile-card p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-orange-600">security</span>
                      <h3 className="text-sm font-bold text-slate-900">Dual-Factor Authentication & Keys</h3>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>FIPS 140-2 Compliant</span>
                    </div>
                  </div>

                  {/* Password Status Bar */}
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-4 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800">
                        <span className="material-symbols-outlined text-[18px]">password</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Master Operator Password</p>
                        <p className="text-slate-500 text-[11px]">Last rotated 32 days ago • Entropy: High (18 characters)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOtpModalOpen(true)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-lg transition"
                      type="button"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Registered 2FA Hardware Keys */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <span>Registered Hardware Security Tokens</span>
                      <button
                        onClick={() => showToast('Scan YubiKey NFC or plug into USB-C slot...')}
                        className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span> Register New Token
                      </button>
                    </div>

                    {/* YubiKey Row */}
                    <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-4 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                          <span className="material-symbols-outlined text-[20px]">key</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">YubiKey 5C NFC</p>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] uppercase font-bold">
                              Primary
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">Serial: #YK-9024-8119 • Registered Jan 14, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[14px]">sensors</span> NFC Active
                        </span>
                      </div>
                    </div>

                    {/* TOTP Authenticator Row */}
                    <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-4 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700">
                          <span className="material-symbols-outlined text-[20px]">smartphone</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">Warehouse Mobile Authenticator (TOTP)</p>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px] uppercase font-bold">
                              Backup
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">30-second rolling code generator</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('TOTP QR re-enrollment generated.')}
                        className="text-slate-500 hover:text-orange-600 font-semibold text-xs"
                        type="button"
                      >
                        Re-enroll
                      </button>
                    </div>
                  </div>

                  {/* Terminal Timeout Policy */}
                  <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">timer</span>
                      <span>Terminal Auto-Lock Timeout</span>
                    </div>
                    <span className="font-mono text-orange-600 font-bold">15 Minutes of Inactivity</span>
                  </div>
                </div>

                {/* Card 3: Active Terminal & Device Sessions */}
                <div className="profile-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-orange-600">devices</span>
                      <h3 className="text-sm font-bold text-slate-900">Active Terminal & Device Sessions</h3>
                    </div>
                    <button
                      onClick={handleTerminateOtherSessions}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">logout</span>
                      <span>Terminate All Other Sessions</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3 rounded-l-lg">Device & Station</th>
                          <th className="py-2.5 px-3">IP & Gateway</th>
                          <th className="py-2.5 px-3">Last Telemetry</th>
                          <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-orange-600 text-[20px]">
                                  {session.icon}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-900">{session.device}</p>
                                  <p className="text-slate-500 text-[11px]">{session.details}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-500">{session.ip}</td>
                            <td className="py-3 px-3">
                              {session.isCurrent ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>Just Now</span>
                                </span>
                              ) : (
                                <span className="text-slate-500">{session.telemetry}</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {session.isCurrent ? (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                  Current Session
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleRevokeSingleSession(session.id)}
                                  className="text-slate-400 hover:text-rose-600 font-semibold text-xs"
                                  type="button"
                                >
                                  Revoke
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Card 4: Operational Alerts & Telemetry Subscriptions */}
                <div className="profile-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-orange-600">notifications_active</span>
                      <h3 className="text-sm font-bold text-slate-900">Operational Alerts & Telemetry Subscriptions</h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Push & Terminal Paging</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
                    {/* Alert 1 */}
                    <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-100 transition">
                      <input
                        checked={alerts.criticalStock}
                        onChange={(e) => setAlerts({ ...alerts, criticalStock: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500 shrink-0"
                        type="checkbox"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">Critical Stock Level Alerts</p>
                        <p className="text-[11px] text-slate-500">Notify when any assigned bin reaches &lt; 10% safety buffer threshold.</p>
                      </div>
                    </label>

                    {/* Alert 2 */}
                    <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-100 transition">
                      <input
                        checked={alerts.highValueVariance}
                        onChange={(e) => setAlerts({ ...alerts, highValueVariance: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500 shrink-0"
                        type="checkbox"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">High-Value Discrepancy Flagging</p>
                        <p className="text-[11px] text-slate-500">Automatic push alert for variance claims exceeding $1,000.</p>
                      </div>
                    </label>

                    {/* Alert 3 */}
                    <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-100 transition">
                      <input
                        checked={alerts.shiftHandoff}
                        onChange={(e) => setAlerts({ ...alerts, shiftHandoff: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500 shrink-0"
                        type="checkbox"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">Shift Handoff & Transfer Manifests</p>
                        <p className="text-[11px] text-slate-500">Receive end-of-shift reconciliation reports from prior operators.</p>
                      </div>
                    </label>

                    {/* Alert 4 */}
                    <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-100 transition">
                      <input
                        checked={alerts.weeklyLedger}
                        onChange={(e) => setAlerts({ ...alerts, weeklyLedger: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500 shrink-0"
                        type="checkbox"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">Weekly Ledger Summary via Email</p>
                        <p className="text-[11px] text-slate-500">Digest of all immutable SHA-256 movements committed by your ID.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* OTP Password Reset Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">OTP Security Password Reset</h3>
                <p className="text-xs text-slate-500">Verify one-time passcode to update master credentials</p>
              </div>
              <button onClick={() => setOtpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {!otpSent ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  A verification code will be dispatched to <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition"
                >
                  Send 6-Digit OTP Code
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtpReset} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 492810"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold tracking-widest text-center text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-slate-500 hover:underline text-[11px]"
                  >
                    Resend Code
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
                  >
                    Confirm & Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
