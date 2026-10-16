'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  Award,
  Upload,
  Sparkles,
} from 'lucide-react';

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  zone: string;
  email: string;
  phone: string;
  status: 'ON_DUTY' | 'AIRBORNE' | 'ON_LEAVE' | 'IN_AUDIT';
  sorties: number;
  avatar: string;
}

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: TeamMemberItem) => void;
}

const ROLES_LIST = [
  'City Chief Infrastructure Engineer',
  'UAV Drone Operations Flight Lead',
  'Senior Pavement Materials Specialist',
  'Contractor SLA & Escrow Auditor',
  'Mobile LiDAR Sensor Technician',
  'NHAI GIS Spatial Data Analyst',
  'Junior PWD Field Survey Engineer',
  'Custom Role / Title...',
];

const ZONES_LIST = [
  'New Delhi Municipal Council (NDMC)',
  'South Delhi Municipal Corp (SDMC)',
  'Dwarka Expressway Project Zone',
  'Mumbai MMRDA (Western Express Hwy)',
  'Bengaluru BBMP (Mahadevapura Tech Corridor)',
  'Hyderabad GHMC (HITEC City Cyber Corridor)',
  'Pune PCMC (Hinjewadi IT Zone)',
  'Chennai Greater Corp (OMR IT Expressway)',
  'Kolkata Bidhannagar (EM Bypass)',
  'NHAI National Corridor Command',
  'Custom Jurisdiction / State...',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
];

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onAddMember,
}: AddTeamMemberModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES_LIST[0]);
  const [customRole, setCustomRole] = useState('');
  const [zone, setZone] = useState(ZONES_LIST[0]);
  const [customZone, setCustomZone] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'ON_DUTY' | 'AIRBORNE' | 'ON_LEAVE' | 'IN_AUDIT'>('ON_DUTY');
  const [sorties, setSorties] = useState<number>(24);
  const [avatar, setAvatar] = useState<string>(PRESET_AVATARS[4]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setAvatar(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter the team member name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const finalRole = role.includes('Custom') && customRole.trim() ? customRole.trim() : role;
      const finalZone = zone.includes('Custom') && customZone.trim() ? customZone.trim() : zone;

      const newMember: TeamMemberItem = {
        id: `tm-${Date.now()}`,
        name: name.trim(),
        role: finalRole,
        zone: finalZone,
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@infratwin.ai`,
        phone: phone.trim() || '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
        status,
        sorties,
        avatar,
      };

      onAddMember(newMember);
      setIsSubmitting(false);
      onClose();

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111726] to-[#0a0e17] border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>Add Infrastructure Team Member</span>
              </h2>
              <p className="text-xs text-slate-400">
                Enroll municipal engineer, UAV pilot lead, or pavement quality auditor to operations roster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Devendra Joshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Duty Roster Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                <option value="ON_DUTY" className="bg-slate-900 text-white">ON_DUTY (Active Command)</option>
                <option value="AIRBORNE" className="bg-slate-900 text-emerald-400">AIRBORNE (Drone Flight)</option>
                <option value="IN_AUDIT" className="bg-slate-900 text-amber-400">IN_AUDIT (Field Survey)</option>
                <option value="ON_LEAVE" className="bg-slate-900 text-slate-400">ON_LEAVE (Standby)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Role & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Role / Designation
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>

              {role.includes('Custom') && (
                <input
                  type="text"
                  placeholder="Type Custom Title (e.g. Chief GIS Drone Pilot)"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Jurisdiction / Zonal Division
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {ZONES_LIST.map((z) => (
                  <option key={z} value={z} className="bg-slate-900 text-white">
                    {z}
                  </option>
                ))}
              </select>

              {zone.includes('Custom') && (
                <input
                  type="text"
                  placeholder="Type custom Zone (e.g. Jaipur Ring Road Zone)"
                  value={customZone}
                  onChange={(e) => setCustomZone(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              )}
            </div>
          </div>

          {/* Row 3: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@infratwin.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+91 98101 22334"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Missions / Sorties Slider & Avatar Selector */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Missions / Sorties Supervised:</span>
                </span>
                <span className="font-bold text-cyan-300 text-sm">{sorties} Missions</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                value={sorties}
                onChange={(e) => setSorties(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Profile Avatar Photo
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt="Selected avatar"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-cyan-glow"
                />
                <div className="flex items-center gap-2 overflow-x-auto">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      onClick={() => setAvatar(av)}
                      alt={`Avatar ${idx}`}
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer border transition-all ${
                        avatar === av ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomPhoto}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 shrink-0 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-cyan-glow text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Add Team Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
