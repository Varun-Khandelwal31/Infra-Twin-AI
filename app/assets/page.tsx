'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import AddAssetModal, { AssetItem } from '@/components/assets/AddAssetModal';
import { downloadCSV } from '@/lib/exportUtils';
import {
  Layers,
  Search,
  Navigation,
  Cpu,
  Route,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Wrench,
} from 'lucide-react';

const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'AST-DR-904',
    name: 'Skydio X2 Autonomous Drone (Zone 4)',
    category: 'Drone Fleet',
    location: 'NDMC Command Hub',
    status: 'OPERATIONAL',
    health: '98%',
    lastMaintenance: 'May 10, 2025',
    estValue: '₹14.5 Lakhs',
    serialNo: 'SK2-UAV-2025-904',
  },
  {
    id: 'AST-DR-908',
    name: 'Matrice 300 RTK Volumetric UAV (Zone 1)',
    category: 'Drone Fleet',
    location: 'South Delhi Base',
    status: 'OPERATIONAL',
    health: '94%',
    lastMaintenance: 'Apr 28, 2025',
    estValue: '₹22.0 Lakhs',
    serialNo: 'M300-RTK-2025-908',
  },
  {
    id: 'AST-RD-101',
    name: 'Connaught Place Outer Circle Road Stretch (2.4km)',
    category: 'Pavement Stretch',
    location: 'Ward 34 - NDMC',
    status: 'MONITORED',
    health: '72% (PCI)',
    lastMaintenance: 'Dec 15, 2024',
    estValue: '₹180.0 Lakhs',
    serialNo: 'RD-NDMC-CP-01',
  },
  {
    id: 'AST-CAM-402',
    name: 'FLIR Boson Thermal Infrared Sensor Pod',
    category: 'Sensors & Hardware',
    location: 'Mounted on DR-904',
    status: 'OPERATIONAL',
    health: '100%',
    lastMaintenance: 'May 02, 2025',
    estValue: '₹8.2 Lakhs',
    serialNo: 'FLIR-BOS-2025-402',
  },
  {
    id: 'AST-EDGE-12',
    name: 'NVIDIA Jetson AGX Orin 64GB Edge AI Node',
    category: 'Edge Computing',
    location: 'Drone Ground Station 12',
    status: 'OPERATIONAL',
    health: '96%',
    lastMaintenance: 'May 20, 2025',
    estValue: '₹3.5 Lakhs',
    serialNo: 'NV-ORIN-2025-012',
  },
  {
    id: 'AST-RD-102',
    name: 'Outer Ring Road (IIT Flyover Pavement Sector - 3.8km)',
    category: 'Pavement Stretch',
    location: 'Ward 12 - South Delhi',
    status: 'UNDER_MAINTENANCE',
    health: '54% (PCI)',
    lastMaintenance: 'Jan 10, 2025',
    estValue: '₹240.0 Lakhs',
    serialNo: 'RD-PWD-IIT-02',
  },
];

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [assetsList, setAssetsList] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddAsset = (newAsset: AssetItem) => {
    setAssetsList((prev) => [newAsset, ...prev]);
    setToastMessage(`✓ Asset "${newAsset.name}" registered and assigned tag ${newAsset.id}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleScheduleMaintenance = (asset: AssetItem) => {
    setAssetsList((prev) =>
      prev.map((a) =>
        a.id === asset.id
          ? {
              ...a,
              status: a.status === 'UNDER_MAINTENANCE' ? 'OPERATIONAL' : 'UNDER_MAINTENANCE',
              lastMaintenance: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            }
          : a
      )
    );
    setToastMessage(`✓ Maintenance status updated for ${asset.name}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (confirm(`Remove asset ${name} (${id}) from active registry?`)) {
      setAssetsList((prev) => prev.filter((a) => a.id !== id));
      setToastMessage(`Asset ${name} removed from inventory.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Asset ID', 'Name', 'Category', 'Location', 'Status', 'Health Index', 'Last Maintenance', 'Valuation', 'Serial No'];
    const rows = assetsList.map((a) => [
      a.id,
      a.name,
      a.category,
      a.location,
      a.status,
      a.health,
      a.lastMaintenance,
      a.estValue,
      a.serialNo,
    ]);
    downloadCSV(`InfraTwin_SmartCity_Asset_Manifest_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage('✓ Smart City Asset Manifest exported as CSV!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAssets = assetsList.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || ast.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const droneCount = assetsList.filter((a) => a.category === 'Drone Fleet').length;
  const cameraCount = assetsList.filter((a) => a.category === 'Sensors & Hardware').length;
  const edgeCount = assetsList.filter((a) => a.category === 'Edge Computing').length;

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#111726] via-slate-900 to-teal-950/40 border border-cyan-500/20 shadow-glass">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
                  <Layers className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Smart City Infrastructure Asset Inventory
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pavement Network Catalog • UAV Fleet Units • Multi-Spectral Sensors • Edge Compute Nodes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Manifest (CSV)</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Asset</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Asset Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Pavement Stretches</div>
                <div className="text-2xl font-bold text-white font-display">1,840 km</div>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Route className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Autonomous UAV Fleet</div>
                <div className="text-2xl font-bold text-emerald-400 font-display">{droneCount} Drones</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">IR & RGB Cameras</div>
                <div className="text-2xl font-bold text-amber-400 font-display">{cameraCount} Units</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Edge Compute Nodes</div>
                <div className="text-2xl font-bold text-indigo-400 font-display">{edgeCount} Stations</div>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search assets by name, ID, or zone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              {['ALL', 'Drone Fleet', 'Pavement Stretch', 'Sensors & Hardware', 'Edge Computing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-glow font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Assets Inventory Table */}
          <div className="rounded-2xl border border-cyan-500/20 bg-[#111726]/90 backdrop-blur-xl shadow-glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Asset ID</th>
                    <th className="p-4">Asset Description</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location / Zone</th>
                    <th className="p-4">Health / Quality</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Est. Valuation</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                        No assets found matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => {
                      const isOp = asset.status === 'OPERATIONAL';
                      const isMaint = asset.status === 'UNDER_MAINTENANCE';

                      return (
                        <tr key={asset.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-cyan-400">{asset.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-100 font-sans">{asset.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">SN: {asset.serialNo}</div>
                          </td>
                          <td className="p-4 font-mono text-slate-300">{asset.category}</td>
                          <td className="p-4 text-slate-400 font-sans">{asset.location}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {asset.health}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                                isOp
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : isMaint
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {asset.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-200">{asset.estValue}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleScheduleMaintenance(asset)}
                                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                                title="Toggle Maintenance Mode"
                              >
                                <Wrench className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                                title="Decommission Asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AddAssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAsset}
      />
    </div>
  );
}
