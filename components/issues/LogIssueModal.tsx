'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Upload,
  AlertTriangle,
  MapPin,
  Camera,
  Layers,
  ShieldAlert,
  Bot,
  CheckCircle2,
  Sliders,
  DollarSign,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface IssueItem {
  id: string;
  title: string;
  distress: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  ward: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  reportedAt: string;
  reportedBy: string;
  areaSqm: number;
  maxDepthCm: number;
  estCost: string;
  sampleId: string;
  imageUrl?: string;
}

interface LogIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIssue: (issue: IssueItem) => void;
  nextIdNumber: number;
}

const DISTRESS_TYPES = [
  'Critical Structural Pothole (Depth > 15cm)',
  'Severe Water-Bound Aggregate Cavity',
  'Alligator Fatigue Cracking & Base Subsidence',
  'Longitudinal Rutting & Edge Bleeding',
  'Transverse Thermal Cracking & Asphalt Void',
  'Sub-grade Shear Failure & Depression',
];

const WARDS_AND_ZONES = [
  'Delhi NCR - Ward 12 (South Delhi IIT)',
  'Delhi NCR - Ward 34 (NDMC Connaught Place)',
  'Delhi NCR - Ward 08 (Dwarka Expressway)',
  'Mumbai - K-East Ward (Andheri / WEH)',
  'Mumbai - H-West Ward (Bandra / Sea Link)',
  'Mumbai - M-West Ward (Chembur / Eastern Freeway)',
  'Bengaluru - Mahadevapura (ORR Bellandur)',
  'Bengaluru - BTM Layout (Silk Board Junction)',
  'Bengaluru - Bommanahalli (Electronic City Expressway)',
  'Hyderabad - Serilingampally (HITEC City Cyber Towers)',
  'Hyderabad - Rajendranagar (Nehru ORR Gachibowli)',
  'Pune - PCMC IT Zone (Hinjewadi Phase 1)',
  'Pune - PMC South Zone (Pune-Satara Katraj Bypass)',
  'Chennai - Sholinganallur (OMR IT Corridor)',
  'Chennai - Alandur (GST Road Guindy Flyover)',
  'Kolkata - Bidhannagar (EM Bypass Salt Lake)',
  'NHAI Corridor - NH-48 (Delhi-Mumbai Expressway)',
  'NHAI Corridor - NH-44 (North-South Corridor)',
  'NHAI Corridor - Mumbai-Pune Expressway',
  'NHAI Corridor - Purvanchal Expressway',
  'Custom / Other State or Highway...',
];

const REPORTERS = [
  'Autonomous Drone DR-908 (LiDAR + RGB)',
  'Drone Swarm Patrol DR-912',
  'Patrol Vehicle LiDAR Mobile Scan',
  'NHAI / PWD Junior Engineer Survey',
  'Citizen Telemetry Mobile App',
];

export default function LogIssueModal({
  isOpen,
  onClose,
  onAddIssue,
  nextIdNumber,
}: LogIssueModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [ward, setWard] = useState(WARDS_AND_ZONES[0]);
  const [customWardText, setCustomWardText] = useState('');
  const [distress, setDistress] = useState(DISTRESS_TYPES[0]);
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Moderate' | 'Low'>('Critical');
  const [reportedBy, setReportedBy] = useState(REPORTERS[0]);
  const [areaSqm, setAreaSqm] = useState<number>(3.2);
  const [maxDepthCm, setMaxDepthCm] = useState<number>(16.5);
  const [imagePreview, setImagePreview] = useState<string>('/images/pothole_severe_before.jpg');
  const [imageName, setImageName] = useState<string>('pothole_severe_before.jpg');
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute realistic estimated repair cost in Lakhs
  const calculatedCostLakhs = Math.max(
    0.45,
    Number(((areaSqm * (maxDepthCm / 10) * 0.48) + 0.35).toFixed(2))
  );

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setImagePreview(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter the Road / Location Name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const finalWard = ward.includes('Custom') && customWardText.trim() ? customWardText.trim() : ward;
      const newIssue: IssueItem = {
        id: `ISS-${nextIdNumber}`,
        title: title.trim(),
        distress,
        severity,
        ward: finalWard,
        status: 'OPEN',
        reportedAt: 'Just now',
        reportedBy,
        areaSqm: Number(areaSqm.toFixed(1)),
        maxDepthCm: Number(maxDepthCm.toFixed(1)),
        estCost: `₹${calculatedCostLakhs} Lakhs`,
        sampleId: 'sample-1',
        imageUrl: imagePreview,
      };

      onAddIssue(newIssue);
      setIsSubmitting(false);
      onClose();

      // Reset form
      setTitle('');
      setCustomWardText('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111726] to-[#0a0e17] border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>Log New Road Inspection Issue</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ISS-{nextIdNumber}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Register AI-detected road cavity across India, assign severity, and trigger contractor work orders
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Location Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Road / Location Stretch Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Western Express Highway Andheri Mumbai, ORR Bellandur Bengaluru, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* Row 2: Ward & Distress Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Municipal Ward / Zone / Highway Corridor
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {WARDS_AND_ZONES.map((w) => (
                  <option key={w} value={w} className="bg-slate-900 text-white">
                    {w}
                  </option>
                ))}
              </select>

              {ward.includes('Custom') && (
                <input
                  type="text"
                  placeholder="Type custom City, Ward or State (e.g. Ahmedabad SG Highway Zone)"
                  value={customWardText}
                  onChange={(e) => setCustomWardText(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Distress Classification
              </label>
              <select
                value={distress}
                onChange={(e) => setDistress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {DISTRESS_TYPES.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Severity Selector Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 'Critical', label: 'Critical (🔴 >15cm)', color: 'border-rose-500/50 bg-rose-500/20 text-rose-300' },
                { level: 'High', label: 'High (🟠 10-15cm)', color: 'border-amber-500/50 bg-amber-500/20 text-amber-300' },
                { level: 'Moderate', label: 'Moderate (🟡 5-10cm)', color: 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300' },
                { level: 'Low', label: 'Low (🟢 <5cm)', color: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' },
              ].map((sev) => (
                <button
                  type="button"
                  key={sev.level}
                  onClick={() => setSeverity(sev.level as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold font-mono transition-all text-center ${
                    severity === sev.level
                      ? `${sev.color} shadow-lg scale-102`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: AI Dimension Sliders (Area & Depth) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>3D Volumetric Parameters (IRC:82 Standards)</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                Est. Repair Cost: ₹{calculatedCostLakhs} Lakhs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Area */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Pothole Void Area:</span>
                  <span className="font-bold text-white">{areaSqm.toFixed(1)} m²</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={10.0}
                  step={0.1}
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.5 m²</span>
                  <span>5.0 m²</span>
                  <span>10.0 m²</span>
                </div>
              </div>

              {/* Depth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Excavation Depth:</span>
                  <span className="font-bold text-amber-400">{maxDepthCm.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={25.0}
                  step={0.5}
                  value={maxDepthCm}
                  onChange={(e) => setMaxDepthCm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>3 cm (Surface)</span>
                  <span>15 cm (Deep)</span>
                  <span>25 cm (Severe)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Inspection Photo Upload + Reporter Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Reporter Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Ingested By / Telemetry Source
              </label>
              <select
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {REPORTERS.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Drone Photo Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Drone / Mobile Evidence Photo
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFile}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/40 shrink-0 bg-slate-900">
                  <img
                    src={imagePreview}
                    alt="Uploaded Distress"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{imageName ? imageName.slice(0, 16) : 'Upload Scan'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 6: Auto-dispatch Work Order Toggle */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Auto-Generate Work Order &amp; PFMS Milestone</div>
                <div className="text-[11px] text-slate-400">
                  Instantly dispatches ticket to municipal zonal contractor
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoDispatch}
              onChange={(e) => setAutoDispatch(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-cyan-glow transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Registering Ticket...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit &amp; Dispatch Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
