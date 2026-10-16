'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Award,
  Layers,
  Download,
  Calendar,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

const PCI_DATA_SETS: Record<string, Array<{ month: string; ndmc: number; southDelhi: number; dwarka: number; airportZone: number }>> = {
  '1M': [
    { month: 'Week 1', ndmc: 75, southDelhi: 67, dwarka: 72, airportZone: 78 },
    { month: 'Week 2', ndmc: 74, southDelhi: 66, dwarka: 71, airportZone: 77 },
    { month: 'Week 3', ndmc: 73, southDelhi: 64, dwarka: 70, airportZone: 75 },
    { month: 'Week 4', ndmc: 72, southDelhi: 62, dwarka: 68, airportZone: 74 },
  ],
  '3M': [
    { month: 'Apr', ndmc: 75, southDelhi: 68, dwarka: 71, airportZone: 78 },
    { month: 'May', ndmc: 74, southDelhi: 65, dwarka: 70, airportZone: 76 },
    { month: 'Jun', ndmc: 72, southDelhi: 62, dwarka: 68, airportZone: 74 },
  ],
  '6M': [
    { month: 'Jan', ndmc: 82, southDelhi: 74, dwarka: 78, airportZone: 85 },
    { month: 'Feb', ndmc: 80, southDelhi: 72, dwarka: 76, airportZone: 83 },
    { month: 'Mar', ndmc: 78, southDelhi: 70, dwarka: 74, airportZone: 80 },
    { month: 'Apr', ndmc: 75, southDelhi: 68, dwarka: 71, airportZone: 78 },
    { month: 'May', ndmc: 74, southDelhi: 65, dwarka: 70, airportZone: 76 },
    { month: 'Jun', ndmc: 72, southDelhi: 62, dwarka: 68, airportZone: 74 },
  ],
  '1Y': [
    { month: 'Q1 (Jul)', ndmc: 88, southDelhi: 80, dwarka: 82, airportZone: 90 },
    { month: 'Q2 (Oct)', ndmc: 85, southDelhi: 77, dwarka: 79, airportZone: 88 },
    { month: 'Q3 (Jan)', ndmc: 82, southDelhi: 74, dwarka: 78, airportZone: 85 },
    { month: 'Q4 (Apr)', ndmc: 75, southDelhi: 68, dwarka: 71, airportZone: 78 },
  ],
};

const DISTRESS_DISTRIBUTION = [
  { name: 'Water-Bound Potholes', value: 42, color: '#ef4444' },
  { name: 'Alligator Cracking', value: 28, color: '#f59e0b' },
  { name: 'Longitudinal Rutting', value: 18, color: '#3b82f6' },
  { name: 'Transverse Thermal Cracks', value: 12, color: '#10b981' },
];

interface ContractorItem {
  name: string;
  totalOrders: number;
  verifiedSla: string;
  status: string;
  escrowStatus: string;
  contactPerson: string;
  totalBilled: string;
  ratingScore: number;
}

const CONTRACTOR_LEADERBOARD: ContractorItem[] = [
  {
    name: 'Greenline Pavements Pvt Ltd',
    totalOrders: 14,
    verifiedSla: '98.5%',
    status: 'Tier 1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'Harsh Vardhan (+91 98112 34500)',
    totalBilled: '₹42.8 Lakhs',
    ratingScore: 98,
  },
  {
    name: 'Apex Infraworks Pvt Ltd',
    totalOrders: 22,
    verifiedSla: '94.2%',
    status: 'Tier 1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'Sunil Aggarwal (+91 98710 88219)',
    totalBilled: '₹68.5 Lakhs',
    ratingScore: 94,
  },
  {
    name: 'Urban Infrastructure Corp',
    totalOrders: 9,
    verifiedSla: '88.0%',
    status: 'Tier 2 Compliant',
    escrowStatus: 'UNDER_REVIEW',
    contactPerson: 'Pravin Joshi (+91 99201 55432)',
    totalBilled: '₹26.4 Lakhs',
    ratingScore: 88,
  },
  {
    name: 'Buildcon Highways Ltd',
    totalOrders: 18,
    verifiedSla: '48.5%',
    status: 'Under Investigation (Fraud)',
    escrowStatus: 'ESCROW_PAYMENT_FROZEN',
    contactPerson: 'Ramanathan Iyer (+91 98402 11990)',
    totalBilled: '₹54.0 Lakhs',
    ratingScore: 48,
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [selectedContractor, setSelectedContractor] = useState<ContractorItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentChartData = useMemo(() => PCI_DATA_SETS[timeRange] || PCI_DATA_SETS['6M'], [timeRange]);

  const handleExportCSV = () => {
    const headers = ['Metric', 'Zone 4 (NDMC)', 'Zone 1 (South Delhi)', 'Zone 8 (Dwarka)', 'Zone 14 (Airport)'];
    const pciRows = currentChartData.map((d) => [d.month, d.ndmc, d.southDelhi, d.dwarka, d.airportZone]);

    const contractorHeaders = ['Contractor Name', 'Completed Orders', 'Verified SLA Rate', 'Tier Rating', 'Escrow Status', 'Total Billed'];
    const contractorRows = CONTRACTOR_LEADERBOARD.map((c) => [
      c.name,
      c.totalOrders,
      c.verifiedSla,
      c.status,
      c.escrowStatus,
      c.totalBilled,
    ]);

    downloadCSV(
      `InfraTwin_Analytics_PCI_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`,
      [...pciRows, ['', '', '', '', ''], contractorHeaders, ...contractorRows],
      headers
    );

    setToastMessage(`✓ Infrastructure Analytics & PCI Report (${timeRange}) exported as CSV!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#111726] via-slate-900 to-indigo-950/40 border border-cyan-500/20 shadow-glass">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Infrastructure Telemetry Analytics &amp; PCI Trends
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-Ward Pavement Degradation Curves • Distress Severity Distribution • Contractor Audit Ratings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Analytics CSV</span>
              </button>
            </div>
          </div>

          {/* Toast Feedback */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Historical PCI Trend Line Chart */}
          <div className="p-6 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white font-display">
                  Pavement Condition Index (PCI) Historical Degradation Trend
                </h2>
                <p className="text-xs text-slate-400">Monthly PCI trajectory across major smart city zones</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      timeRange === range
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-glow font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-80 bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#00d9ff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="ndmc" name="Zone 4 (NDMC)" stroke="#00d9ff" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="southDelhi" name="Zone 1 (South Delhi)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="dwarka" name="Zone 8 (Dwarka)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="airportZone" name="Zone 14 (Airport)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Grid: Distress Pie Chart + Contractor Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Distress Type Breakdown</h3>
                <p className="text-xs text-slate-400">AI Computer Vision Classification</p>
              </div>

              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DISTRESS_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {DISTRESS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#00d9ff',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {DISTRESS_DISTRIBUTION.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300 truncate">{d.name}</span>
                    <span className="font-bold text-slate-400 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contractor Leaderboard */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Contractor SLA Compliance Audit</h3>
                  <p className="text-xs text-slate-400">Click any contractor row to view escrow hold details</p>
                </div>
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-2">
                {CONTRACTOR_LEADERBOARD.map((c, i) => {
                  const isFraud = c.ratingScore < 60;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedContractor(c)}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                          #{i + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.totalOrders} Orders Completed • {c.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                              isFraud
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-red-glow'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {c.verifiedSla} SLA
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contractor Detail Modal */}
          {selectedContractor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
              <div className="fixed inset-0" onClick={() => setSelectedContractor(null)} />

              <div className="relative w-full max-w-md rounded-2xl bg-[#0c121f] border border-cyan-500/40 shadow-cyan-glow p-6 space-y-4 z-10 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">{selectedContractor.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{selectedContractor.status}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedContractor(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Verified SLA Quality</div>
                    <div className="text-cyan-300 font-bold text-base mt-0.5">{selectedContractor.verifiedSla}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Total Billed to Date</div>
                    <div className="text-emerald-400 font-bold text-base mt-0.5">{selectedContractor.totalBilled}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-400">
                    <strong>Primary Contact:</strong> {selectedContractor.contactPerson}
                  </div>
                  <div className="text-slate-400">
                    <strong>PFMS / GeM Escrow Status:</strong>{' '}
                    <span
                      className={`font-bold ${
                        selectedContractor.escrowStatus === 'ESCROW_PAYMENT_FROZEN'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedContractor.escrowStatus}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedContractor(null)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30"
                  >
                    Close Audit Overview
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
