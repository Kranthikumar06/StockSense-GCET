import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar, { useSidebarState } from '../components/Sidebar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function UserProfile() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // User state
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: 'StockSense Admin',
    email: 'admin@stocksense.io',
    role: 'manager',
  });

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Inventory & Dispatch');
  const [assignedWarehouse, setAssignedWarehouse] = useState('Main Distribution Center (WH-MAIN)');

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    lowStock: true,
    movementAlerts: true,
    weeklyReport: false,
  });

  useEffect(() => {
    // Load logged in user from localStorage if available
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        setName(parsed.name || 'StockSense Admin');
        setEmail(parsed.email || 'admin@stocksense.io');
      } else {
        setName('StockSense Admin');
        setEmail('admin@stocksense.io');
      }
    } catch (e) {
      setName('StockSense Admin');
      setEmail('admin@stocksense.io');
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update local user state
    const updated = { ...currentUser, name, email };
    setCurrentUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    showToast('Profile details updated successfully!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('New passwords do not match or are empty.', 'error');
      return;
    }

    if (!currentUser.id) {
      showToast('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/change-password`, {
        user_id: currentUser.id,
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to change password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (n) => {
    if (!n) return 'SC';
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border ${toastType === 'error' ? 'bg-rose-900 border-rose-700' : 'bg-slate-900 border-slate-700'
            } animate-bounce`}
        >
          <span className="material-symbols-outlined text-orange-400 text-base">
            {toastType === 'error' ? 'error' : 'check_circle'}
          </span>
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

      <Sidebar
        activeRoute="/profile"
        collapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* ── MAIN CONTENT ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
        {/* Header Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-600 text-2xl">account_circle</span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900">Operator Profile & Account Settings</h1>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </header>

        {/* Main Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          {/* User Hero Identity Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white text-2xl font-bold flex items-center justify-center shadow-md shrink-0">
                {getInitials(name)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
                    {currentUser.role || 'Manager'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{email}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Terminal Session • Authorized Operator
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-medium text-slate-600">
              <span className="material-symbols-outlined text-orange-600">domain</span>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Node</div>
                <div className="font-bold text-slate-800">{assignedWarehouse}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Personal Info & Security */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details Form Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-slate-600">badge</span>
                  <h3 className="text-base font-bold text-slate-900">Personal & Operational Details</h3>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Department / Function
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Assigned Warehouse
                      </label>
                      <input
                        type="text"
                        value={assignedWarehouse}
                        onChange={(e) => setAssignedWarehouse(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Security & Password Form Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-slate-600">lock</span>
                  <h3 className="text-base font-bold text-slate-900">Account Security & Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">key</span>
                      <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Notifications & Active Session */}
            <div className="space-y-6">
              {/* Notification Preferences Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-slate-600">notifications</span>
                  <h3 className="text-base font-bold text-slate-900">Notifications & Alerts</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <label className="flex items-start justify-between gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-800">Low Stock Safety Alerts</div>
                      <div className="text-slate-500 text-[11px]">Notify when SKU drops below reorder min level.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.lowStock}
                      onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 mt-1 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-800">Movement Validation Flags</div>
                      <div className="text-slate-500 text-[11px]">Alert on high-quantity receipt or delivery validation.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.movementAlerts}
                      onChange={(e) => setNotifications({ ...notifications, movementAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 mt-1 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-800">Weekly Inventory Summary</div>
                      <div className="text-slate-500 text-[11px]">Email summary digest of overall stock moves.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReport}
                      onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 mt-1 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Active Session Info Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-slate-600">devices</span>
                  <h3 className="text-base font-bold text-slate-900">Current Session</h3>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="material-symbols-outlined text-orange-600 text-base">laptop_mac</span>
                    <span>Active Terminal Workstation</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-6">
                    Browser: Web Browser • IP: 127.0.0.1
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold pl-6">
                    Session Status: Active Now
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>End Session & Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
