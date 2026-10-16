'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  ClipboardList,
  Building2,
  Calendar,
  IndianRupee,
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface WorkOrderItem {
  id: string;
  project: string;
  contractor: string;
  zone: string;
  budget: string;
  materialClaimed: string;
  progress: number;
  status: 'UNDER_AUDIT' | 'PAYMENT_FROZEN' | 'APPROVED' | 'IN_PROGRESS';
  deadline: string;
  slaStatus: string;
  sampleId: string;
  tenderDocName?: string;
}

interface IssueWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkOrder: (order: WorkOrderItem) => void;
  nextIdNumber: number;
}

const ZONES_LIST = [
  'Delhi NCR - Ward 12 (South Delhi IIT)',
  'Delhi NCR - Ward 34 (NDMC Connaught Place)',
  'Delhi NCR - Ward 08 (Dwarka Expressway)',
  'Mumbai - K-East Ward (Andheri / WEH)',
  'Mumbai - H-West Ward (Bandra / Sea Link)',
  'Bengaluru - Mahadevapura (ORR Bellandur)',
  'Bengaluru - BTM Layout (Silk Board Junction)',
  'Hyderabad - Serilingampally (HITEC City Cyber Towers)',
  'Pune - PCMC IT Zone (Hinjewadi Phase 1)',
  'Chennai - Sholinganallur (OMR IT Corridor)',
  'Kolkata - Bidhannagar (EM Bypass Salt Lake)',
  'NHAI Corridor - NH-48 (Delhi-Mumbai Expressway)',
  'NHAI Corridor - NH-44 (North-South Corridor)',
  'Custom / Other Zonal Division...',
];

const CONTRACTORS_LIST = [
  'Apex Infraworks Pvt Ltd',
  'Buildcon Highways Ltd',
  'Greenline Pavements & Infra',
  'Larsen & Toubro Heavy Civil Infrastructure',
  'Shapoorji Pallonji Roadworks',
  'Tata Projects Urban Pavements',
  'Custom Contractor / Bidder...',
];

export default function IssueWorkOrderModal({
  isOpen,
  onClose,
  onAddWorkOrder,
  nextIdNumber,
}: IssueWorkOrderModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [zone, setZone] = useState(ZONES_LIST[0]);
  const [customZone, setCustomZone] = useState('');
  const [contractor, setContractor] = useState(CONTRACTORS_LIST[0]);
  const [customContractor, setCustomContractor] = useState('');
  const [budgetLakhs, setBudgetLakhs] = useState<number>(6.5);
  const [bitumenTon, setBitumenTon] = useState<number>(3.5);
  const [deadline, setDeadline] = useState('2026-06-30');
  const [tenderDocName, setTenderDocName] = useState<string | null>(null);
  const [isEscrowLocked, setIsEscrowLocked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTenderDocName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      alert('Please enter the Work Order / Tender Project Name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const finalZone = zone.includes('Custom') && customZone.trim() ? customZone.trim() : zone;
      const finalContractor =
        contractor.includes('Custom') && customContractor.trim()
          ? customContractor.trim()
          : contractor;

      const newOrder: WorkOrderItem = {
        id: `WO-2025-${nextIdNumber}`,
        project: projectTitle.trim(),
        contractor: finalContractor,
        zone: finalZone,
        budget: `₹${budgetLakhs.toFixed(2)} Lakhs`,
        materialClaimed: `${bitumenTon.toFixed(2)} Ton Bitumen VG-30`,
        progress: 0,
        status: 'IN_PROGRESS',
        deadline: new Date(deadline).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        slaStatus: 'SCHEDULED',
        sampleId: 'sample-1',
        tenderDocName: tenderDocName || 'Standard_IRC82_Tender_Notice.pdf',
      };

      onAddWorkOrder(newOrder);
      setIsSubmitting(false);
      onClose();

      // Reset form
      setProjectTitle('');
      setTenderDocName(null);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111726] to-[#0a0e17] border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>Issue New Work Order Tender</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  WO-2025-{nextIdNumber}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Publish municipal or highway road tender, upload RFQ documents, and link PFMS smart escrow
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
          {/* Row 1: Project Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Work Order / Tender Project Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Western Express Highway Andheri Milling & DBM Overlay"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* Row 2: Zonal Division & Contractor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Zonal Division / Corridor
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
                  placeholder="Type custom Zone (e.g. Ahmedabad SG Highway Zone 2)"
                  value={customZone}
                  onChange={(e) => setCustomZone(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Assigned Contractor / Bidder
              </label>
              <select
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              >
                {CONTRACTORS_LIST.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>

              {contractor.includes('Custom') && (
                <input
                  type="text"
                  placeholder="Type Contractor Name (e.g. Gammon India Infrastructure)"
                  value={customContractor}
                  onChange={(e) => setCustomContractor(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
              )}
            </div>
          </div>

          {/* Row 3: Budget & Bitumen Material Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tender Sanction Budget:</span>
                </span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₹{budgetLakhs.toFixed(2)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={30.0}
                step={0.25}
                value={budgetLakhs}
                onChange={(e) => setBudgetLakhs(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bitumen Allocation:</span>
                </span>
                <span className="font-bold text-cyan-400 text-sm">
                  {bitumenTon.toFixed(2)} Ton (VG-30)
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={15.0}
                step={0.1}
                value={bitumenTon}
                onChange={(e) => setBitumenTon(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Row 4: Completion Deadline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Target Completion Deadline <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* Row 5: Upload Work Order Tender Document / Specification */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Upload Work Tender Document / RFQ Specification (PDF, Word, or Image)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-slate-950/60 hover:bg-slate-900/60 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">
                    {tenderDocName ? tenderDocName : 'Click or Drag Tender Specification File Here'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tenderDocName ? 'Document attached successfully' : 'Supports MoRTH Tender Notice PDF, BOQ Spreadsheet, or Site Scan'}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold shrink-0">
                {tenderDocName ? 'Replace' : 'Browse File'}
              </span>
            </div>
          </div>

          {/* Row 6: PFMS Smart Escrow Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">PFMS Smart Contract Escrow Lock</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Funds held in escrow; 100% payout released only after AI dual-scan SLA verification (&gt;90% compaction)
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEscrowLocked}
              onChange={(e) => setIsEscrowLocked(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Submit CTA */}
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
                  <span>Publishing Tender...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Issue &amp; Publish Work Order Tender</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
