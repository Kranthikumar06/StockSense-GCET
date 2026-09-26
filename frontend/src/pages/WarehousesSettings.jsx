import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar, { useSidebarState } from '../components/Sidebar';
import './WarehousesSettings.css';

const INITIAL_WAREHOUSES = [
  {
    id: 1,
    code: 'DC-NORTH-01',
    name: 'Main Distribution Center',
    address: '104 Logistics Parkway, Building A',
    floors: 4,
    docks: 18,
    utilization: 92,
    temp: '18°C Controlled',
    status: 'Operational',
  },
  {
    id: 2,
    code: 'HUB-04-CHI',
    name: 'Chicago South Depot',
    address: '4500 Western Ave, Deep Bay',
    floors: 2,
    docks: 8,
    utilization: 74,
    temp: 'Cold Chain -20°C',
    status: 'Operational',
  },
  {
    id: 3,
    code: 'HUB-08-TX',
    name: 'Dallas Logistics Hub',
    address: '8900 Cargo Way, North Terminal',
    floors: 3,
    docks: 12,
    utilization: 45,
    temp: 'Ambient Storage',
    status: 'Expansion Phase',
  },
];

const INITIAL_REORDER_RULES = [
  {
    id: 1,
    product: 'High-Torque Planetary Gearhead 40:1',
    sku: 'SS-MTR-8812',
    location: 'Main Store Bay A',
    min: 25,
    max: 100,
    current: 40,
    autoPO: true,
  },
  {
    id: 2,
    product: 'Steel Rods 12mm - Grade 316',
    sku: 'STL-ROD-012',
    location: 'Rack B-18-04',
    min: 200,
    max: 600,
    current: 100,
    autoPO: true,
  },
  {
    id: 3,
    product: 'Pneumatic Valve Matrix V4',
    sku: 'PNU-VLV-881',
    location: 'Assembly Line 2',
    min: 15,
    max: 50,
    current: 0,
    autoPO: true,
  },
  {
    id: 4,
    product: 'Precision Ceramic Bearings 608',
    sku: 'BRG-CER-608',
    location: 'Bay North #03',
    min: 25,
    max: 150,
    current: 4,
    autoPO: true,
  },
];

export default function WarehousesSettings() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [activeTab, setActiveTab] = useState('warehouses'); // 'warehouses', 'reordering', 'general'
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [reorderRules, setReorderRules] = useState(INITIAL_REORDER_RULES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Warehouse Form
  const [whCode, setWhCode] = useState('');
  const [whName, setWhName] = useState('');
  const [whAddress, setWhAddress] = useState('');
  const [whFloors, setWhFloors] = useState(2);
  const [whDocks, setWhDocks] = useState(6);
  const [whTemp, setWhTemp] = useState('Ambient Storage');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddWarehouse = (e) => {
    e.preventDefault();
    const newWh = {
      id: Date.now(),
      code: whCode.toUpperCase(),
      name: whName,
      address: whAddress,
      floors: Number(whFloors),
      docks: Number(whDocks),
      utilization: 15,
      temp: whTemp,
      status: 'Operational',
    };
    setWarehouses([...warehouses, newWh]);
    setDrawerOpen(false);
    showToast(`✓ Warehouse facility ${newWh.code} registered in system topology.`);
  };

  return (
    <div className="settings-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-base">settings</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar
        activeRoute="/warehouses"
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
                <span className="material-symbols-outlined text-orange-600 text-[18px]">settings</span>
                <span>System Administration & Facilities</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shadow-orange-500/20 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ Add Warehouse Facility</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>MULTI-WAREHOUSE INFRASTRUCTURE & SETTINGS</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Warehouses & Settings
              </h1>
              <p className="text-xs text-slate-500">
                Configure physical logistics facilities, storage topologies, automated stock reordering thresholds, and system integration parameters.
              </p>
            </div>

            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('warehouses')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'warehouses'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                type="button"
              >
                Warehouse Facilities ({warehouses.length})
              </button>
              <button
                onClick={() => setActiveTab('reordering')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'reordering'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                type="button"
              >
                Reordering Rules ({reorderRules.length})
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'general'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                type="button"
              >
                System Parameters & Barcodes
              </button>
            </div>

            {/* Content: Warehouses */}
            {activeTab === 'warehouses' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {warehouses.map((wh) => (
                  <div key={wh.id} className="warehouse-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                            {wh.code}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-2">{wh.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{wh.address}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800">{wh.utilization}%</span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${wh.utilization > 85 ? 'bg-orange-600' : 'bg-emerald-600'}`}
                          style={{ width: `${wh.utilization}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-600">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Floors</span>
                          <span className="font-bold text-slate-800">{wh.floors} Levels</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Dock Bays</span>
                          <span className="font-bold text-slate-800">{wh.docks} Gates</span>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        {wh.temp}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{wh.status}</span>
                      <button
                        onClick={() => showToast(`Zone layout for ${wh.code} opened.`)}
                        className="text-xs font-semibold text-orange-600 hover:underline"
                        type="button"
                      >
                        Edit Topology →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content: Reordering Rules */}
            {activeTab === 'reordering' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Automated Reordering & Min/Max Threshold Rules</h3>
                  <button
                    onClick={() => showToast('Reorder rule creator opened.')}
                    className="px-3 py-1 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700"
                    type="button"
                  >
                    + Add Reorder Rule
                  </button>
                </div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">SKU Code</th>
                      <th className="py-3 px-4">Storage Location</th>
                      <th className="py-3 px-4">Min Threshold</th>
                      <th className="py-3 px-4">Max Buffer</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Auto PO</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reorderRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">{rule.product}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{rule.sku}</td>
                        <td className="py-3 px-4 font-mono">{rule.location}</td>
                        <td className="py-3 px-4 font-bold text-rose-600">{rule.min}</td>
                        <td className="py-3 px-4 font-bold text-slate-700">{rule.max}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={rule.current <= rule.min ? 'text-rose-600' : 'text-emerald-600'}>
                            {rule.current}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Enabled
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => showToast(`Triggered replenishment calculation for ${rule.sku}.`)}
                            className="text-orange-600 font-semibold hover:underline text-xs"
                            type="button"
                          >
                            Trigger PO
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Content: General Settings */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Barcode & Scanner Integration</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Default Barcode Standard</label>
                      <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                        <option>EAN-13 / GS1 Standard</option>
                        <option>Code 128 (Industrial)</option>
                        <option>QR Matrix 2D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">SKU Auto-Prefix</label>
                      <input type="text" defaultValue="SS-" className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Ledger & Audit Chain Parameters</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p>Cryptographic Hashing: <strong>SHA-256 Enabled</strong></p>
                    <p>Block Commit Interval: <strong>Real-time Synchronous</strong></p>
                    <p>Zero-Discrepancy Audit Standard: <strong>Odoo 18 / ERP Compatible</strong></p>
                    <button
                      onClick={() => showToast('System settings saved.')}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                      type="button"
                    >
                      Save Parameters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Facility Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setDrawerOpen(false)} className="drawer-backdrop-settings fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <aside className="drawer-panel-settings relative w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Add Warehouse Facility</h2>
                <p className="text-xs text-slate-500">Register new physical logistics center</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddWarehouse} id="addWhForm" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DC-SOUTH-02"
                  value={whCode}
                  onChange={(e) => setWhCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlanta Regional Distribution Hub"
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Industrial Blvd"
                  value={whAddress}
                  onChange={(e) => setWhAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floors / Levels</label>
                  <input
                    type="number"
                    min="1"
                    value={whFloors}
                    onChange={(e) => setWhFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dock Gates</label>
                  <input
                    type="number"
                    min="1"
                    value={whDocks}
                    onChange={(e) => setWhDocks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temperature / Storage Type</label>
                <select value={whTemp} onChange={(e) => setWhTemp(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <option>Ambient Storage</option>
                  <option>18°C Controlled</option>
                  <option>Cold Chain -20°C</option>
                  <option>HazMat Secure Vault</option>
                </select>
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
                form="addWhForm"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">domain</span>
                <span>Register Facility</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
