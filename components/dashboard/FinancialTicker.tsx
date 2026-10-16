'use client';

import React from 'react';
import { IndianRupee, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

export default function FinancialTicker() {
  return (
    <VengenceCard glowColor="emerald" className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
            Financial Impact
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            +18.4% vs Q1
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-display">₹48.5 Lakhs</div>
            <div className="text-xs font-medium text-emerald-400">Municipal Budget Saved This Quarter</div>
          </div>
        </div>

        <p className="text-slate-400 text-xs mt-2">
          Prevented contractor over-billing through AI 3D volume verification and early preventive patch maintenance.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Fraudulent Over-billing Blocked
          </span>
          <span className="font-mono font-bold text-amber-400">₹26.2 Lakhs</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Early Preventive Maintenance
          </span>
          <span className="font-mono font-bold text-emerald-400">₹22.3 Lakhs</span>
        </div>
      </div>
    </VengenceCard>
  );
}
