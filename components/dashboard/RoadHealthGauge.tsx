'use client';

import React from 'react';
import VengenceCard from '@/components/ui/VengenceCard';

interface RoadHealthGaugeProps {
  score?: number; // 0 to 100
}

export default function RoadHealthGauge({ score = 74 }: RoadHealthGaugeProps) {
  const radius = 70;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = 'stroke-emerald-400';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let statusText = 'Fair - Action Needed in Ward 12';

  if (score < 50) {
    scoreColor = 'stroke-rose-500';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    statusText = 'Critical Infrastructure Deficit';
  } else if (score < 75) {
    scoreColor = 'stroke-amber-400';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    statusText = 'Fair Condition (Moderate Distress)';
  }

  return (
    <VengenceCard glowColor="cyan" className="p-6 flex flex-col items-center justify-between h-full relative overflow-hidden">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-display">Citywide Road Health Index</h3>
          <p className="text-[11px] text-slate-400">New Delhi Smart Zone Network</p>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
          Real-Time Audit
        </span>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative my-2 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(30, 41, 59, 0.8)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`transition-all duration-1000 ease-out ${scoreColor}`}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-4xl font-extrabold text-white font-display tracking-tight">{score}</div>
          <div className="text-[10px] font-mono uppercase text-slate-400 font-medium">Out of 100</div>
        </div>
      </div>

      <div className="w-full text-center mt-2 pt-3 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-200">{statusText}</div>
        <p className="text-[11px] text-slate-400 mt-0.5">840 km scanned • 12 Active Drone Sorties</p>
      </div>
    </VengenceCard>
  );
}
