'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  MapPin,
  FileText,
  Plus,
  Check,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Compass,
  Cpu,
  Lock,
} from 'lucide-react';
import { InspectionData } from '@/lib/mockInference';
import Section65BCertificateModal from '@/components/fraud/Section65BCertificateModal';

interface MetricsSidebarProps {
  sample: InspectionData;
  flightAltitudeM?: number;
  depthScale?: number;
}

export default function MetricsSidebar({
  sample,
  flightAltitudeM = 12.4,
  depthScale = 1.0,
}: MetricsSidebarProps) {
  const m = sample.metrics;
  const [workOrders, setWorkOrders] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);

  const calculatedGsd = Number(((flightAltitudeM * 100 * 0.000376) / 2.4).toFixed(2));
  const volumetricIndex = Number(((m.volumeCum / (m.areaSqm || 1)) * 100).toFixed(1));

  const isHighOrCritical = m.severityIndex === 'High' || m.severityIndex === 'Critical';
  const severityBadgeClass = isHighOrCritical
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  const woNumber = workOrders[sample.id];

  const handleAddToWorkOrder = () => {
    if (woNumber) return;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newWo = `WO-${randomDigits}`;
    setWorkOrders((prev) => ({ ...prev, [sample.id]: newWo }));
    setToastMessage(`Added to Work Order #${newWo}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full lg:w-[380px] space-y-4 shrink-0 relative">
      {/* Inline Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-emerald-glow animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Card 1: AI Detected Pothole & Confidence Score */}
      <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-display">AI Detected Pothole</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${severityBadgeClass}`}>
              {m.severityIndex}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Confidence Score</p>
        </div>

        {/* Circular Confidence Meter */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="#10b981"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={138}
              strokeDashoffset={138 - (138 * m.confidenceScore) / 100}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-emerald-400 font-mono">
            {m.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Card 2: Inspection Metrics Table */}
      <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-400 mb-4 tracking-wider">
          Inspection Metrics
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Area</span>
            <div className="text-right">
              <span className="font-bold text-slate-100 font-mono">{m.areaSqm} sqm</span>
              <span className="text-[10px] text-slate-500 block font-mono">± {m.areaTol} sqm</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Max Depth</span>
            <div className="text-right">
              <span className="font-bold text-slate-100 font-mono">{m.maxDepthCm} cm</span>
              <span className="text-[10px] text-slate-500 block font-mono">± {m.maxDepthTol} cm</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Avg Depth</span>
            <div className="text-right">
              <span className="font-bold text-slate-100 font-mono">{m.avgDepthCm} cm</span>
              <span className="text-[10px] text-slate-500 block font-mono">± {m.avgDepthTol} cm</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Volume</span>
            <div className="text-right">
              <span className="font-bold text-slate-100 font-mono">{m.volumeCum} m³</span>
              <span className="text-[10px] text-slate-500 block font-mono">± {m.volumeTol} m³</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Perimeter</span>
            <div className="text-right">
              <span className="font-bold text-slate-100 font-mono">{m.perimeterM} m</span>
              <span className="text-[10px] text-slate-500 block font-mono">± {m.perimeterTol} m</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 font-medium">Severity Index</span>
            <span className={`font-bold font-mono text-xs ${isHighOrCritical ? 'text-rose-400' : 'text-amber-400'}`}>
              {m.severityIndex}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: GSD & Spatial Metric Physics Calibration Card (Eliminates Scale Ambiguity Doubt) */}
      <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="tracking-wider">SPATIAL SENSOR & GSD CALIBRATION</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            RTK LOCKED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Flight Altitude (H)</span>
            <span className="text-cyan-300 font-bold">{flightAltitudeM.toFixed(1)} m AGL</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Sensor Focal (f)</span>
            <span className="text-slate-200 font-bold">24 mm CMOS</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Ground Resolution</span>
            <span className="text-cyan-300 font-bold">{calculatedGsd} cm/px (GSD)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Volumetric Index</span>
            <span className="text-emerald-300 font-bold">{volumetricIndex} cm (Avg)</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950 border border-cyan-500/20 text-[10px] text-slate-300 space-y-1">
          <div className="text-cyan-400 font-bold flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>Simpson&apos;s 2D Volume Integral:</span>
          </div>
          <code className="text-emerald-300 block font-mono">
            V = ∬_Ω λ · z_metric(x,y) dx dy = {m.volumeCum} m³
          </code>
        </div>
      </div>

      {/* Card 4: Location Card */}
      <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
          Location
        </h3>
        <div>
          <div className="text-xs font-semibold text-slate-100">{sample.location.address}</div>
          <div className="text-[11px] font-mono text-cyan-400/80 mt-1">
            {sample.location.lat}° N, {sample.location.lng}° E
          </div>
        </div>

        <Link
          href={`/map`}
          className="w-full py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View on Map</span>
        </Link>
      </div>

      {/* Card 5: Recommended Action & BOQ CTA Buttons */}
      <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
          Recommended Action
        </h3>

        {/* Warning Alert Box */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-400">{sample.recommendedAction.headline}</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{sample.recommendedAction.subtext}</div>
          </div>
        </div>

        {/* Primary Glowing Cyan BOQ Button */}
        <Link
          href={`/copilot?sample=${sample.id}`}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-cyan-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Generate BOQ</span>
        </Link>

        {/* Section 65B Evidence Certificate Button */}
        <button
          onClick={() => setIsCertOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Section 65B Legal Certificate</span>
        </button>

        {/* Secondary Add to Work Order Button */}
        <button
          onClick={handleAddToWorkOrder}
          disabled={!!woNumber}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            woNumber
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          {woNumber ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Work Order #{woNumber}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Work Order</span>
            </>
          )}
        </button>
      </div>

      {/* Section 65B Modal Instance */}
      <Section65BCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        data={{
          id: sample.id,
          roadName: sample.roadName,
          inspectionNo: sample.inspectionNo,
          location: sample.location,
          severity: sample.metrics.severityIndex,
          volume: sample.metrics.volumeCum,
          area: sample.metrics.areaSqm,
        }}
      />
    </div>
  );
}

