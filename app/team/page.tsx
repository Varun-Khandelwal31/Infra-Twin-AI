'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import AddTeamMemberModal, { TeamMemberItem } from '@/components/team/AddTeamMemberModal';
import { downloadCSV } from '@/lib/exportUtils';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  Activity,
  Award,
  Plus,
  Search,
  Filter,
  Trash2,
  Radio,
  Download,
} from 'lucide-react';

const INITIAL_TEAM_MEMBERS: TeamMemberItem[] = [
  {
    id: 'tm-1',
    name: 'Aarav Mehta',
    role: 'City Chief Infrastructure Engineer',
    zone: 'New Delhi Municipal Council (NDMC)',
    email: 'aarav.mehta@ndmc.gov.in',
    phone: '+91 98101 44521',
    status: 'ON_DUTY',
    sorties: 42,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tm-2',
    name: 'Rajesh Kumar',
    role: 'UAV Drone Operations Flight Lead',
    zone: 'South Delhi Municipal Corp (SDMC)',
    email: 'rajesh.k@infratwin.ai',
    phone: '+91 98210 11982',
    status: 'AIRBORNE',
    sorties: 128,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tm-3',
    name: 'Ananya Sharma',
    role: 'Senior Pavement Materials Specialist',
    zone: 'Central Delhi Zone 4',
    email: 'ananya.s@ndmc.gov.in',
    phone: '+91 98711 33029',
    status: 'ON_DUTY',
    sorties: 84,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tm-4',
    name: 'Vikram Singh',
    role: 'Contractor SLA & Escrow Auditor',
    zone: 'Dwarka Expressway Sector',
    email: 'vikram.singh@pwd.gov.in',
    phone: '+91 99100 88210',
    status: 'IN_AUDIT',
    sorties: 65,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tm-5',
    name: 'Pooja Iyer',
    role: 'Mobile LiDAR Sensor Lead',
    zone: 'Mumbai MMRDA (Western Express Hwy)',
    email: 'pooja.iyer@mmrda.maharashtra.gov.in',
    phone: '+91 98332 10924',
    status: 'AIRBORNE',
    sorties: 92,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'tm-6',
    name: 'Siddharth Rao',
    role: 'NHAI GIS Spatial Data Analyst',
    zone: 'Bengaluru BBMP (Mahadevapura)',
    email: 'siddharth.rao@bbmp.gov.in',
    phone: '+91 98450 77123',
    status: 'ON_DUTY',
    sorties: 110,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
  },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(INITIAL_TEAM_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddMember = (newMember: TeamMemberItem) => {
    setTeamMembers((prev) => [newMember, ...prev]);
    setToastMessage(`✓ Team member ${newMember.name} (${newMember.role}) added to operations roster.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Remove ${name} from operations roster?`)) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      setToastMessage(`Staff member ${name} removed from active roster.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Staff ID', 'Name', 'Role / Designation', 'Municipal Zone', 'Official Email', 'Phone', 'Active Status', 'Total Sorties / Audits'];
    const rows = teamMembers.map((m) => [
      m.id,
      m.name,
      m.role,
      m.zone,
      m.email,
      m.phone,
      m.status,
      m.sorties,
    ]);
    downloadCSV(`InfraTwin_Operations_Team_Roster_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage('✓ Municipal Operations Team Roster exported as CSV!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onDutyCount = teamMembers.filter((m) => m.status === 'ON_DUTY').length;
  const airborneCount = teamMembers.filter((m) => m.status === 'AIRBORNE').length;
  const inAuditCount = teamMembers.filter((m) => m.status === 'IN_AUDIT').length;

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#111726] via-slate-900 to-cyan-950/40 border border-cyan-500/20 shadow-glass">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Users className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Municipal Infrastructure Audit &amp; Operations Team
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Chief Engineers • UAV Flight Leads • Pavement Quality Auditors • Live Active Duty Roster
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Roster (CSV)</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>
          </div>

          {/* Success Toast Banner */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold shadow-cyan-glow flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase">Operations Roster</div>
                  <div className="text-cyan-300">{toastMessage}</div>
                </div>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-xs text-slate-400 hover:text-white font-mono underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Quick Roster Status Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Total Enrolled Team</div>
                <div className="text-2xl font-bold text-white font-display">{teamMembers.length} Staff</div>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Active on Duty</div>
                <div className="text-2xl font-bold text-cyan-400 font-display">{onDutyCount} Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Airborne Drone Pilots</div>
                <div className="text-2xl font-bold text-emerald-400 font-display">{airborneCount} Flying</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-400">In Field SLA Audits</div>
                <div className="text-2xl font-bold text-amber-400 font-display">{inAuditCount} Auditing</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search staff by name, role, or municipal zone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              {['ALL', 'ON_DUTY', 'AIRBORNE', 'IN_AUDIT'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                    statusFilter === status
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-glow font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const isAirborne = member.status === 'AIRBORNE';
              const isOnDuty = member.status === 'ON_DUTY';
              const isInAudit = member.status === 'IN_AUDIT';

              return (
                <div
                  key={member.id}
                  className="p-6 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4 hover:border-cyan-500/40 transition-all card-3d-tilt flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${
                          isAirborne
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-green-glow'
                            : isOnDuty
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isAirborne && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        <span>{member.status.replace('_', ' ')}</span>
                      </span>

                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white font-display truncate">{member.name}</h3>
                        <p className="text-xs text-cyan-400 font-mono truncate">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400 pt-1 font-sans">
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{member.zone}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">Sorties Completed</span>
                    <span className="text-emerald-400 font-bold font-display">{member.sorties} Missions</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
