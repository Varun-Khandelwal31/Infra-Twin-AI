'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Download,
  Plus,
  ExternalLink,
  Bot,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import LogIssueModal, { IssueItem } from '@/components/issues/LogIssueModal';
import { downloadCSV } from '@/lib/exportUtils';

const INITIAL_ISSUES: IssueItem[] = [
  {
    id: 'ISS-801',
    title: 'Outer Ring Road (IIT Flyover)',
    distress: 'Critical Structural Pothole & Alligator Cracking',
    severity: 'Critical',
    ward: 'Ward 12 - South Delhi',
    status: 'OPEN',
    reportedAt: '10 mins ago',
    reportedBy: 'Autonomous Drone DR-908',
    areaSqm: 4.1,
    maxDepthCm: 18.2,
    estCost: '₹3.2 Lakhs',
    sampleId: 'sample-2',
    imageUrl: '/images/indian_alligator_crack_corridor.jpg',
  },
  {
    id: 'ISS-802',
    title: 'Connaught Place Outer Circle',
    distress: 'Severe Water-Bound Pothole (Depth 15.0cm)',
    severity: 'Critical',
    ward: 'Ward 34 - NDMC',
    status: 'IN_PROGRESS',
    reportedAt: '35 mins ago',
    reportedBy: 'Autonomous Drone DR-904',
    areaSqm: 2.5,
    maxDepthCm: 15.0,
    estCost: '₹1.8 Lakhs',
    sampleId: 'sample-1',
    imageUrl: '/images/indian_pothole_severe_before.jpg',
  },
  {
    id: 'ISS-803',
    title: 'Barakhamba Road Exit 2',
    distress: 'High Density Alligator Cracking & Sub-base Collapse',
    severity: 'High',
    ward: 'Ward 34 - NDMC',
    status: 'OPEN',
    reportedAt: '1 hour ago',
    reportedBy: 'Citizen Telemetry App',
    areaSqm: 3.5,
    maxDepthCm: 16.4,
    estCost: '₹2.45 Lakhs',
    sampleId: 'sample-4',
    imageUrl: '/images/indian_flyover_joint_oblique.jpg',
  },
  {
    id: 'ISS-804',
    title: 'Dwarka Expressway Sector 21',
    distress: 'Longitudinal Rutting & Edge Bleeding',
    severity: 'Moderate',
    ward: 'Ward 08 - Dwarka',
    status: 'RESOLVED',
    reportedAt: '3 hours ago',
    reportedBy: 'Autonomous Drone DR-912',
    areaSqm: 1.8,
    maxDepthCm: 8.5,
    estCost: '₹0.95 Lakhs',
    sampleId: 'sample-3',
    imageUrl: '/images/indian_pothole_repaired_after.jpg',
  },
  {
    id: 'ISS-805',
    title: 'NH-48 Mahipalpur Stretch',
    distress: 'Transverse Thermal Cracking & Asphalt Void',
    severity: 'Moderate',
    ward: 'Ward 14 - Airport Zone',
    status: 'IN_PROGRESS',
    reportedAt: '5 hours ago',
    reportedBy: 'Patrol Vehicle Scan',
    areaSqm: 2.1,
    maxDepthCm: 7.2,
    estCost: '₹1.2 Lakhs',
    sampleId: 'sample-5',
    imageUrl: '/images/indian_road_rutting_closeup.jpg',
  },
];

export default function IssuesPage() {
  const [issuesList, setIssuesList] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddNewIssue = (newIssue: IssueItem) => {
    setIssuesList((prev) => [newIssue, ...prev]);
    setToastMessage(`✓ New Inspection Ticket ${newIssue.id} logged for "${newIssue.title}" & dispatched to PWD Contractor!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleToggleStatus = (id: string) => {
    setIssuesList((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const nextStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' =
            issue.status === 'OPEN'
              ? 'IN_PROGRESS'
              : issue.status === 'IN_PROGRESS'
              ? 'RESOLVED'
              : 'OPEN';
          setToastMessage(`✓ Ticket ${issue.id} status updated to ${nextStatus}!`);
          setTimeout(() => setToastMessage(null), 3500);
          return { ...issue, status: nextStatus };
        }
        return issue;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Location', 'Distress Type', 'Severity', 'Ward', 'Status', 'Reported Time', 'Reporter', 'Area (sqm)', 'Max Depth (cm)', 'Estimated Cost'];
    const rows = issuesList.map((i) => [
      i.id,
      i.title,
      i.distress,
      i.severity,
      i.ward,
      i.status,
      i.reportedAt,
      i.reportedBy,
      i.areaSqm,
      i.maxDepthCm,
      i.estCost,
    ]);
    downloadCSV(`InfraTwin_Road_Distress_Tickets_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage('✓ Citywide Road Distress Log exported as CSV!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredIssues = issuesList.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.distress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesWard = wardFilter === 'ALL' || issue.ward.includes(wardFilter);
    return matchesSearch && matchesSeverity && matchesWard;
  });

  const criticalCount = issuesList.filter((i) => i.severity === 'Critical' && i.status !== 'RESOLVED').length;
  const inProgressCount = issuesList.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issuesList.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#111726] via-slate-900 to-rose-950/30 border border-cyan-500/20 shadow-glass">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Citywide Road Issues &amp; Distress Command Center
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-Time AI-Detected Pavement Voids • Ticket Lifecycle Management • Work Order Dispatch
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Tickets CSV</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-cyan-glow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Road Distress</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold shadow-cyan-glow flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Total Logged Tickets</div>
                <div className="text-2xl font-bold text-white font-display">{issuesList.length} Issues</div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Critical Distress</div>
                <div className="text-2xl font-bold text-rose-400 font-display">{criticalCount} Critical</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">In Repair / Milling</div>
                <div className="text-2xl font-bold text-amber-400 font-display">{inProgressCount} Active</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Resolved &amp; Verified</div>
                <div className="text-2xl font-bold text-emerald-400 font-display">{resolvedCount} Repaired</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by ticket ID, road name, or distress description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                {['ALL', 'Critical', 'High', 'Moderate'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      severityFilter === sev
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-cyan-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issues List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIssues.map((issue) => {
              const isCrit = issue.severity === 'Critical';
              const isHigh = issue.severity === 'High';

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all card-3d-tilt"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{issue.id}</span>
                      <button
                        onClick={() => handleToggleStatus(issue.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                          issue.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : issue.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Click to toggle lifecycle status"
                      >
                        {issue.status.replace('_', ' ')}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white font-display">{issue.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-sans leading-relaxed">{issue.distress}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Area</span>
                        <span className="text-slate-200 font-bold">{issue.areaSqm} sqm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Max Depth</span>
                        <span className="text-slate-200 font-bold">{issue.maxDepthCm} cm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Est. Cost</span>
                        <span className="text-emerald-400 font-bold">{issue.estCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500">{issue.reportedAt}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/audit?sample=${issue.sampleId}`}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold hover:bg-cyan-500/20 flex items-center gap-1"
                      >
                        <span>Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/copilot?sample=${issue.sampleId}`}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-mono font-bold hover:bg-blue-500/20 flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>BOQ</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <LogIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIssue={handleAddNewIssue}
        nextIdNumber={806}
      />
    </div>
  );
}
