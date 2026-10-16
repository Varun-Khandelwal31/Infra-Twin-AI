'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Activity,
  Sliders,
  ExternalLink,
  Download,
  CheckCircle2,
  CloudRain,
  Truck,
  X,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { downloadCSV } from '@/lib/exportUtils';

const BASE_PREDICTIVE_DATA = [
  { id: 'p-1', name: 'Outer Ring Road (IIT Flyover)', x: 9400, y: 5.2, z: 92, risk: 'Critical', ward: 'Ward 12 - South Delhi', baseDays: 14, costNowPerM: 0.48, costLaterPerM: 3.2, sampleId: 'sample-2', distressType: 'Severe Structural Void & Sub-base Fatigue' },
  { id: 'p-2', name: 'Barakhamba Road Arterial', x: 6800, y: 4.8, z: 85, risk: 'Critical', ward: 'Ward 34 - NDMC', baseDays: 22, costNowPerM: 0.35, costLaterPerM: 2.45, sampleId: 'sample-4', distressType: 'Alligator Cracking & Moisture Infiltration' },
  { id: 'p-3', name: 'NH-48 Mahipalpur Stretch', x: 11200, y: 3.6, z: 68, risk: 'Warning', ward: 'Ward 14 - Airport Zone', baseDays: 45, costNowPerM: 0.52, costLaterPerM: 3.5, sampleId: 'sample-5', distressType: 'Longitudinal Rutting & Bitumen Stripping' },
  { id: 'p-4', name: 'Connaught Place Outer Circle', x: 4200, y: 4.1, z: 62, risk: 'Warning', ward: 'Ward 34 - NDMC', baseDays: 58, costNowPerM: 0.28, costLaterPerM: 1.82, sampleId: 'sample-1', distressType: 'Pothole & Surface Ravelling' },
  { id: 'p-5', name: 'Janpath Avenue', x: 3100, y: 1.8, z: 24, risk: 'Low', ward: 'Ward 33 - NDMC', baseDays: 180, costNowPerM: 0.12, costLaterPerM: 0.85, sampleId: 'sample-3', distressType: 'Minor Micro-Cracks' },
  { id: 'p-6', name: 'Dwarka Expressway Sec 21', x: 5600, y: 0.9, z: 15, risk: 'Low', ward: 'Ward 08 - Dwarka', baseDays: 240, costNowPerM: 0.15, costLaterPerM: 0.98, sampleId: 'sample-3', distressType: 'Good Pavement Condition' },
];

const HORIZON_OPTIONS = [
  { label: '6 Months', value: 6 },
  { label: '12 Months', value: 12 },
  { label: '24 Months', value: 24 },
  { label: '36 Months', value: 36 },
];

export default function PredictivePage() {
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [selectedRoadIdx, setSelectedRoadIdx] = useState<number | null>(null);
  const [monsoonFactor, setMonsoonFactor] = useState<number>(1.2);
  const [trafficGrowth, setTrafficGrowth] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recalculate risk and costs based on time horizon & simulation factors
  const predictiveData = useMemo(() => {
    return BASE_PREDICTIVE_DATA.map((road) => {
      const weatherMultiplier = monsoonFactor;
      const trafficMultiplier = 1 + trafficGrowth / 100;
      const effectiveHorizon = horizonMonths / 12;

      // Accelerated degradation days
      const scaledDays = Math.max(
        1,
        Math.round((road.baseDays / (weatherMultiplier * trafficMultiplier)) * (1 / effectiveHorizon))
      );

      let risk: 'Critical' | 'Warning' | 'Low' = 'Low';
      if (scaledDays < 30) risk = 'Critical';
      else if (scaledDays < 90) risk = 'Warning';

      const costNow = Number((road.costNowPerM * 10 * effectiveHorizon * weatherMultiplier).toFixed(1));
      const costLater = Number((road.costLaterPerM * 10 * effectiveHorizon * weatherMultiplier * trafficMultiplier).toFixed(1));

      return {
        ...road,
        x: Math.round(road.x * trafficMultiplier),
        daysToFailure: scaledDays,
        risk,
        costNow,
        costLater,
        z: Math.min(100, Math.round(road.z * (1 / effectiveHorizon) * weatherMultiplier)),
      };
    });
  }, [horizonMonths, monsoonFactor, trafficGrowth]);

  // Aggregate budget from selected or all critical/warning roads
  const budgetData = useMemo(() => {
    const critical = predictiveData.filter((r) => r.risk === 'Critical' || r.risk === 'Warning');
    const totalNow = critical.reduce((sum, r) => sum + r.costNow, 0);
    const totalLater = critical.reduce((sum, r) => sum + r.costLater, 0);
    const savings = totalNow > 0 ? (totalLater / totalNow).toFixed(1) : '0';
    return { totalNow: totalNow.toFixed(1), totalLater: totalLater.toFixed(1), savings };
  }, [predictiveData]);

  const handleExportCSV = () => {
    const headers = ['Road Segment', 'Ward', 'Traffic (PCU/day)', 'Road Age (Yrs)', 'Distress Risk', 'Predicted Days to Failure', 'Preventative Cost (Lakhs)', 'Deferred Failure Cost (Lakhs)', 'IRC:82 Treatment'];
    const rows = predictiveData.map((r) => [
      r.name,
      r.ward,
      r.x,
      r.y,
      r.risk,
      r.daysToFailure,
      `₹${r.costNow}L`,
      `₹${r.costLater}L`,
      r.distressType,
    ]);
    downloadCSV(`InfraTwin_Predictive_Budget_${horizonMonths}M_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage(`✓ Predictive Maintenance Forecast exported for ${horizonMonths}-Month Horizon!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeSelectedRoad = selectedRoadIdx !== null ? predictiveData[selectedRoadIdx] : null;

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111726] via-slate-900 to-purple-950/40 border border-cyan-500/20 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Predictive Maintenance &amp; Multi-Year Budget Allocation
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Traffic Load vs. Road Age Degradation Scatter Model • Preventative Cost Optimization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Budget Plan (CSV)</span>
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

          {/* Time Horizon & What-If Simulation Sliders */}
          <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                <Sliders className="w-4 h-4" />
                <span>PREDICTION HORIZON &amp; CLIMATIC WHAT-IF SIMULATOR</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Forecast Horizon:</span>
                {HORIZON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHorizonMonths(opt.value)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all',
                      horizonMonths === opt.value
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Monsoon Intensity Multiplier:</span>
                  </span>
                  <span className="font-bold text-cyan-400">{monsoonFactor.toFixed(1)}x Rainfall</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={2.5}
                  step={0.1}
                  value={monsoonFactor}
                  onChange={(e) => setMonsoonFactor(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Above Average)</span>
                  <span>2.5x (Flash Flood Stress)</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Heavy Commercial Axle Load Growth:</span>
                  </span>
                  <span className="font-bold text-amber-400">+{trafficGrowth}% Traffic</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={trafficGrowth}
                  onChange={(e) => setTrafficGrowth(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>+0% (Current MSA)</span>
                  <span>+20% (Urban Expansion)</span>
                  <span>+40% (Freight Corridor)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Scatter Plot Chart Card */}
          <div className="p-6 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-white font-display">
                  Traffic Volume vs. Pavement Age Scatter Matrix ({horizonMonths}-Month Forecast)
                </h2>
                <p className="text-xs text-slate-400">
                  Bubble size represents Distress Risk Index. Click any bubble or table row to inspect recommended treatment.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (&lt;30 days)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning (30-90 days)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk (&gt;90 days)
                </span>
              </div>
            </div>

            {/* Recharts Scatter Plot */}
            <div className="w-full h-80 bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Traffic Load"
                    unit=" PCU/day"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Road Age"
                    unit=" Yrs"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 800]} name="Risk Index" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 border border-cyan-500/50 rounded-xl shadow-glass text-xs space-y-1">
                          <div className="font-bold text-white">{d.name}</div>
                          <div className="text-slate-400">Ward: {d.ward}</div>
                          <div className="text-cyan-400 font-mono">Traffic: {d.x.toLocaleString()} PCU/day</div>
                          <div className="text-slate-300 font-mono">Age: {d.y} Years</div>
                          <div className="text-rose-400 font-mono font-bold">
                            Predicted Failure: in {d.daysToFailure} Days
                          </div>
                          <div className="text-emerald-400 font-mono">
                            Fix Now: ₹{d.costNow}L • Fix Later: ₹{d.costLater}L
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Road Segments" data={predictiveData}>
                    {predictiveData.map((entry, index) => {
                      let fill = '#10b981';
                      if (entry.risk === 'Critical') fill = '#ef4444';
                      else if (entry.risk === 'Warning') fill = '#f59e0b';
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={fill}
                          opacity={selectedRoadIdx === index ? 1 : 0.75}
                          stroke={selectedRoadIdx === index ? '#fff' : 'none'}
                          strokeWidth={selectedRoadIdx === index ? 2 : 0}
                          onClick={() => setSelectedRoadIdx(index)}
                          cursor="pointer"
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Road Segment Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Road Segment</th>
                    <th className="p-3">Ward</th>
                    <th className="p-3">Risk</th>
                    <th className="p-3">Days to Failure</th>
                    <th className="p-3">Fix Now</th>
                    <th className="p-3">Fix Later</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 font-mono">
                  {predictiveData.map((road, idx) => {
                    const isSelected = selectedRoadIdx === idx;
                    let riskColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
                    if (road.risk === 'Critical') riskColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
                    else if (road.risk === 'Warning') riskColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedRoadIdx(idx)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400'
                            : 'hover:bg-slate-900/60'
                        )}
                      >
                        <td className="p-3 font-semibold text-slate-200 font-sans">{road.name}</td>
                        <td className="p-3 text-slate-400">{road.ward}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskColor}`}>
                            {road.risk}
                          </span>
                        </td>
                        <td className={`p-3 font-bold ${road.daysToFailure < 30 ? 'text-rose-400' : road.daysToFailure < 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {road.daysToFailure} days
                        </td>
                        <td className="p-3 text-emerald-400">₹{road.costNow}L</td>
                        <td className="p-3 text-rose-400">₹{road.costLater}L</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/audit?sample=${road.sampleId}`}
                              className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                            >
                              Audit <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                            <Link
                              href={`/copilot?sample=${road.sampleId}`}
                              className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                            >
                              BOQ <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preventative Budget Allocation — Dynamic */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111726] to-[#0c1322] border border-cyan-500/30 shadow-glass space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Preventative Budget Allocation ({horizonMonths}-Month Forecast)
                  </h3>
                  <p className="text-xs text-slate-400">AI Recommendation Engine • Computed from {predictiveData.filter(r => r.risk !== 'Low').length} at-risk segments</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                Save {budgetData.savings}x Budget
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3 card-3d-tilt">
                <div className="text-xs uppercase font-mono font-bold text-emerald-400">
                  Option A: Preventative Patching Now (Next {horizonMonths} Months)
                </div>
                <div className="text-3xl font-extrabold text-white font-display">₹{budgetData.totalNow} Lakhs</div>
                <p className="text-xs text-slate-300">
                  Full-depth micro-patching of all at-risk segments before monsoon moisture infiltration.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Extends pavement life by 4+ years</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-3 card-3d-tilt">
                <div className="text-xs uppercase font-mono font-bold text-rose-400">
                  Option B: Deferred Full Reconstruction (After Failure)
                </div>
                <div className="text-3xl font-extrabold text-rose-400 font-display">₹{budgetData.totalLater} Lakhs</div>
                <p className="text-xs text-slate-300">
                  Complete sub-base milling, DBM overlay, traffic diversion costs, and emergency contractor tenders.
                </p>
                <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Causes {budgetData.savings}x higher municipal budget strain</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/copilot"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center gap-2"
              >
                <span>Generate Preventative Maintenance Work Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Road Inspection Detail Drawer */}
          {activeSelectedRoad && (
            <div className="p-5 rounded-2xl bg-[#0c121f] border border-cyan-500/40 shadow-cyan-glow space-y-3 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold text-white font-sans text-sm">{activeSelectedRoad.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({activeSelectedRoad.ward})</span>
                </div>
                <button
                  onClick={() => setSelectedRoadIdx(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Predicted Failure</div>
                  <div className="text-rose-400 font-bold font-sans text-sm">{activeSelectedRoad.daysToFailure} Days</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Traffic Loading</div>
                  <div className="text-cyan-300 font-bold font-sans text-sm">{activeSelectedRoad.x.toLocaleString()} PCU/day</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Preventative Cost</div>
                  <div className="text-emerald-400 font-bold font-sans text-sm">₹{activeSelectedRoad.costNow} Lakhs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Deferred Cost</div>
                  <div className="text-rose-400 font-bold font-sans text-sm">₹{activeSelectedRoad.costLater} Lakhs</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-[11px]">
                  <strong>Recommended IRC Treatment:</strong> {activeSelectedRoad.distressType} (IRC:82-2023 Cl 4.3)
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/audit?sample=${activeSelectedRoad.sampleId}`}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30 transition-colors"
                  >
                    Open in AI Audit Studio
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
