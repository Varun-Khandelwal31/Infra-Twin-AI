'use client';

import React, { useState } from 'react';
import { SLAVerificationData } from '@/lib/mockInference';
import { CheckCircle2, ShieldAlert, Cpu, Sliders } from 'lucide-react';

interface BeforeAfterViewerProps {
  sample: SLAVerificationData;
}

export default function BeforeAfterViewer({ sample }: BeforeAfterViewerProps) {
  const isApproved = sample.status === 'APPROVED';
  const [sliderPos, setSliderPos] = useState(50); // 50% split default
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0c111c] border border-cyan-500/25 shadow-glass p-2 space-y-2">
      {/* Interactive Draggable Split-View Scan Container */}
      <div
        className="relative h-[360px] rounded-xl overflow-hidden border border-cyan-500/30 select-none cursor-ew-resize group"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Right Side Image (After Repair) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={sample.afterScan.imageUrl}
            alt="After Repair Drone Scan"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-xs text-right">
            <span className="font-bold text-emerald-400">After Repair (Drone Scan)</span>
            <span className="block text-[10px] text-slate-300 font-mono">
              Captured: {sample.afterScan.capturedOn}
            </span>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
            <defs>
              <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={sample.afterScan.path}
              fill={isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
              stroke={isApproved ? '#10b981' : '#ef4444'}
              strokeWidth="3.5"
              strokeDasharray="6, 3"
              filter="url(#greenGlow)"
              className="animate-pulse"
            />
          </svg>

          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300">
            Area: {sample.afterScan.area}
          </div>
        </div>

        {/* Left Side Image (Before Repair) Clipped by Slider */}
        <div
          className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-cyan-400 z-10 shadow-2xl transition-all duration-75"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={sample.beforeScan.imageUrl}
            alt="Before Repair Drone Scan"
            className="w-full h-full object-cover"
            style={{ width: `calc(100vw / 1.5)`, maxWidth: 'none' }}
          />

          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-rose-950/90 backdrop-blur-md border border-rose-500/40 text-xs">
            <span className="font-bold text-rose-400">Before Repair (Drone Scan)</span>
            <span className="block text-[10px] text-slate-300 font-mono">
              Captured: {sample.beforeScan.capturedOn}
            </span>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
            <defs>
              <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={sample.beforeScan.path}
              fill="rgba(239, 68, 68, 0.2)"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeDasharray="6, 3"
              filter="url(#redGlow)"
              className="animate-pulse"
            />
          </svg>

          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-xs font-mono text-rose-300">
            Area: {sample.beforeScan.area}
          </div>
        </div>

        {/* Center Draggable Split Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ left: `calc(${sliderPos}% - 16px)` }}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-cyan-glow border-2 border-white text-xs">
            ↔
          </div>
        </div>

        {/* Center Floating AI VERIFICATION Card */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 p-3.5 rounded-2xl bg-[#090d16]/95 backdrop-blur-xl border border-cyan-500/40 shadow-cyan-glow flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-mono mb-1">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>REAL-TIME AI VERIFICATION</span>
          </div>

          <div className="text-[10px] text-slate-400 uppercase tracking-tight">Repair Quality Score</div>
          <div
            className={`text-3xl font-extrabold font-display my-0.5 ${
              isApproved ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {sample.repairQualityScore}%
          </div>

          <div
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border flex items-center gap-1 mt-0.5 ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-green-glow'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-red-glow'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>APPROVED • PAYMENT CLEARED</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>FRAUD ALERT • PAYMENT FROZEN</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Split Slider Instructions Bar */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 pointer-events-none flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drag split handle horizontally to compare before vs after repair scan</span>
        </div>
      </div>
    </div>
  );
}
