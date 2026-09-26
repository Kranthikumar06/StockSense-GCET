import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StockSenseLogo from './StockSenseLogo';

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Products Catalog', icon: 'inventory_2', href: '/products' },
  { label: 'Receipts (Incoming)', icon: 'move_to_inbox', href: '/receipts', badge: '12', badgeColor: 'bg-amber-100 text-amber-800' },
  { label: 'Delivery Orders (Outgoing)', icon: 'local_shipping', href: '/deliveries', badge: '24', badgeColor: 'bg-orange-100 text-orange-800' },
  { label: 'Internal Transfers', icon: 'swap_horiz', href: '/transfers' },
  { label: 'Stock Adjustments', icon: 'tune', href: '/adjustments' },
  { label: 'Move History (Ledger)', icon: 'receipt_long', href: '/ledger' },
  { label: 'Warehouses & Settings', icon: 'warehouse', href: '/warehouses' },
];

export function useSidebarState() {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    const saved = localStorage.getItem('stocksense_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('stocksense_sidebar_collapsed');
      if (saved !== null) {
        setSidebarCollapsedState(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('sidebarToggle', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('sidebarToggle', handleSync);
    };
  }, []);

  const setSidebarCollapsed = (val) => {
    setSidebarCollapsedState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('stocksense_sidebar_collapsed', JSON.stringify(nextVal));
      window.dispatchEvent(new Event('sidebarToggle'));
      return nextVal;
    });
  };

  return [sidebarCollapsed, setSidebarCollapsed];
}

export default function Sidebar({ activeRoute, collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const currentPath = activeRoute || location.pathname;

  const [internalCollapsed, setInternalCollapsed] = useSidebarState();
  const sidebarCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const setSidebarCollapsed = onToggle || setInternalCollapsed;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(mobileOpen || false);
  const [sidebarSearch, setSidebarSearch] = useState('');

  useEffect(() => {
    if (mobileOpen !== undefined) {
      setMobileMenuOpen(mobileOpen);
    }
  }, [mobileOpen]);

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={handleMobileClose}
        />
      )}

      {/* Collapsible White-Theme Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        } ${
          mobileMenuOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Bar with Logo & Menu Toggle */}
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-100">
            {!sidebarCollapsed ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
                  <StockSenseLogo className="h-8" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none flex items-center justify-center"
                  title="Collapse Sidebar"
                >
                  <span className="material-symbols-outlined text-2xl leading-none">
                    menu
                  </span>
                </button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-11 h-11 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center focus:outline-none"
                  title="Expand Sidebar"
                >
                  <span className="material-symbols-outlined text-2xl leading-none">
                    menu
                  </span>
                </button>
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={handleMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 ml-auto"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Search Box inside Sidebar */}
          <div className="px-3 pt-3 pb-1">
            {!sidebarCollapsed ? (
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">
                  search
                </span>
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
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-11 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  title="Search"
                >
                  <span className="material-symbols-outlined text-xl leading-none">search</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
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
                  onClick={handleMobileClose}
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

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-xs">
              <Link to="/profile" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  SC
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate leading-tight">StockSense Admin</span>
                  <span className="text-[10px] text-slate-500 truncate leading-tight">Inventory Manager</span>
                </div>
              </Link>
              <Link
                to="/login"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-lg leading-none">logout</span>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                to="/login"
                className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all shadow-xs"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-xl leading-none">logout</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
