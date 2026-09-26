import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function ProductCatalog() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Products state from Backend API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Form state for creating product
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit_of_measure: 'pcs',
    per_unit_cost: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const autoGenerateSku = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : 'PRD';
    setFormData((prev) => ({ ...prev, sku: `SKU-${prefix}-${randomCode}` }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      setFormError('Product Name and SKU are required.');
      return;
    }

    setFormError('');
    setFormSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          unit_of_measure: formData.unit_of_measure,
          per_unit_cost: parseFloat(formData.per_unit_cost) || 0.0,
          is_active: formData.is_active,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create product.');
      }

      // Success
      setFormData({
        name: '',
        sku: '',
        unit_of_measure: 'pcs',
        per_unit_cost: 0,
        is_active: true,
      });
      setDrawerOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to delete product.');
      }
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Filter products
  const categories = ['All', 'Raw Materials', 'Hardware & Fasteners', 'Finished Goods'];

  const filtered = products.filter((p) => {
    const qty = p.total_quantity || 0;
    const status = qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock';

    if (activeStatus === 'In Stock' && status !== 'In Stock') return false;
    if (activeStatus === 'Low Stock' && status !== 'Low Stock') return false;
    if (activeStatus === 'Out of Stock' && status !== 'Out of Stock') return false;
    if (lowStockOnly && status === 'In Stock') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name ? p.name.toLowerCase().includes(q) : false;
      const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
      return matchName || matchSku;
    }
    return true;
  });

  // Calculate KPIs dynamically
  const totalSKUs = products.length;
  const lowStockCount = products.filter((p) => (p.total_quantity || 0) > 0 && (p.total_quantity || 0) <= 10).length;
  const outOfStockCount = products.filter((p) => (p.total_quantity || 0) === 0).length;
  const totalValuation = products.reduce((acc, p) => acc + (p.per_unit_cost || 0) * (p.total_quantity || 0), 0);

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

      <Sidebar
        activeRoute="/products"
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
                placeholder="Search SKU, product..."
                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl hover:bg-slate-200/60 focus:bg-white focus:ring-2 focus:ring-orange-500/30 border border-transparent focus:border-orange-500/40 transition-all outline-none"
              />
            </div>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchProducts()}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh Products"
            >
              <span className="material-symbols-outlined text-xl">refresh</span>
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
                NEON-DB &bull;
                <span className="text-emerald-700 font-semibold ml-1">Live Backend API Connected</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Product Catalog &amp; Stock Registry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>Real-Time Inventory Database</span>
                <span>&bull;</span>
                <span>Connected to /api/products</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => fetchProducts()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base text-slate-500">sync</span>
                Sync Database
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
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalSKUs}</span>
                  <span className="text-xs font-semibold text-slate-500 ml-1">Active</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Database SKUs</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Low / Out of Stock</span>
                  <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{lowStockCount + outOfStockCount}</span>
                  <span className="text-xs font-bold text-rose-600 ml-1">Flagged</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{outOfStockCount} Out of Stock &bull; {lowStockCount} Low</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Stock Quantity</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">view_in_ar</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {products.reduce((sum, p) => sum + (p.total_quantity || 0), 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Units in warehouses</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Valuation</span>
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">payments</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Calculated cost value</p>
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
                    placeholder="Filter SKU or product name..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
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
                    <th className="py-3.5 pl-6 pr-4">Product Name</th>
                    <th className="py-3.5 px-4">SKU Code</th>
                    <th className="py-3.5 px-4 text-center">UoM</th>
                    <th className="py-3.5 px-4">Per Unit Cost</th>
                    <th className="py-3.5 px-4">On Hand</th>
                    <th className="py-3.5 px-4">Free to Use</th>
                    <th className="py-3.5 px-4">Location Availability</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-3xl animate-spin block mb-2 text-orange-600">sync</span>
                        Loading products from database...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">inventory_2</span>
                        No products found in the database.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      const qty = p.total_quantity || 0;
                      const reserved = p.reserved_quantity || 0;
                      const freeToUse = p.free_to_use_quantity !== undefined ? p.free_to_use_quantity : Math.max(0, qty - reserved);
                      const status = qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock';
                      const statusBadge =
                        status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200';
                      const dotColor =
                        status === 'In Stock' ? 'bg-emerald-500' : status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500';

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-3.5 pl-6 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {p.name ? p.name.substring(0, 2).toUpperCase() : 'PR'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {p.category ? p.category.name : 'General Category'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                              {p.sku}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-slate-600 font-medium">{p.unit_of_measure}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            ${(p.per_unit_cost || 0).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {qty.toLocaleString()} <span className="text-[11px] text-slate-400 font-normal">{p.unit_of_measure}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-emerald-700">
                              {freeToUse.toLocaleString()} <span className="text-[11px] text-slate-400 font-normal">{p.unit_of_measure}</span>
                            </div>
                            {reserved > 0 && (
                              <div className="text-[10px] text-amber-600 font-medium">({reserved} reserved)</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {p.location_stocks && p.location_stocks.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {p.location_stocks.map((ls, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200" title={`${ls.warehouse_name} - Min: ${ls.min_reorder_level}`}>
                                    <span className="font-semibold">{ls.location_name}:</span> {ls.quantity}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                                Main Bay: {qty}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                              {status}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 pr-6 text-right space-x-1.5">
                            <button
                              onClick={async () => {
                                const newQty = prompt(`Enter new actual stock quantity for ${p.name}:`, qty);
                                if (newQty !== null && !isNaN(parseFloat(newQty))) {
                                  try {
                                    const res = await fetch(`http://127.0.0.1:8000/api/products/${p.id}/adjust-stock`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ new_quantity: parseFloat(newQty) })
                                    });
                                    if (res.ok) {
                                      fetchProducts();
                                    } else {
                                      alert('Failed to update stock');
                                    }
                                  } catch (e) {
                                    alert('Error updating stock');
                                  }
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                              title="Update stock manually"
                            >
                              Stock Update
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                              title="Deactivate product"
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="border-t border-slate-200 px-6 py-3.5 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> products from API
              </span>
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
            <p className="text-xs text-slate-500 mt-0.5">Saves new product directly into Neon PostgreSQL.</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleCreateProduct} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                • {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40"
                placeholder="e.g. High-Torque Gearbox 40:1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    SKU Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={autoGenerateSku}
                    className="text-[11px] text-orange-600 hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs">autorenew</span> Auto
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="SKU-PRD-1001"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Unit of Measure <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.unit_of_measure}
                  onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="pcs">pcs (Pieces)</option>
                  <option value="kg">kg (Kilogram)</option>
                  <option value="m">m (Meter)</option>
                  <option value="Units">Units</option>
                  <option value="Box">Box / Pack</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Per Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.per_unit_cost}
                onChange={(e) => setFormData({ ...formData, per_unit_cost: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Drawer Footer */}
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
              {formSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
