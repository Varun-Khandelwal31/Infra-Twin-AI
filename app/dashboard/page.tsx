'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import RoadHealthGauge from '@/components/dashboard/RoadHealthGauge';
import FinancialTicker from '@/components/dashboard/FinancialTicker';
import LiveAlertFeed from '@/components/dashboard/LiveAlertFeed';
import FleetMapWidget from '@/components/dashboard/FleetMapWidget';
import { INSPECTION_SAMPLES } from '@/lib/mockInference';
import { Route, AlertTriangle, ShieldCheck, Activity, Clock } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

function useAnimatedCounter(target: number, duration: number = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.round(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

function useLiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function DashboardPage() {
  const clock = useLiveClock();

  // Live simulated counters that tick up slightly over time
  const [auditedKm, setAuditedKm] = useState(1840);
  const [droneSorties, setDroneSorties] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setAuditedKm((prev) => prev + Math.floor(Math.random() * 3));
      setDroneSorties((prev) => (Math.random() > 0.7 ? Math.min(prev + 1, 18) : prev));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const animatedKm = useAnimatedCounter(auditedKm, 2000);
  const activePotholes = INSPECTION_SAMPLES.filter(
    (s) => s.metrics.severityIndex === 'High' || s.metrics.severityIndex === 'Critical'
  ).length;
  const totalPotholes = INSPECTION_SAMPLES.length;

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Status Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111726]/80 p-4 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h1 className="text-xl font-bold text-white font-display tracking-tight">
                  New Delhi Smart City Infrastructure Command Center
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-Time Drone AI Audits • Pavement Health Index • Financial Governance
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              {/* Live IST Clock */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold tabular-nums">{clock || '--:--:-- --'}</span>
                <span className="text-slate-500">IST</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                Active Zone: <span className="text-cyan-400 font-bold">Zone 4 (NDMC)</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                IRC:82 Engine Online
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar — Vengeance UI Spotlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VengenceCard glowColor="cyan" className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Total Audited Stretch</div>
                <div className="text-2xl font-bold text-white font-display tabular-nums">
                  {animatedKm.toLocaleString()} km
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">+3 km/min live</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Route className="w-5 h-5" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="rose" className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Active Potholes Detected</div>
                <div className="text-2xl font-bold text-rose-400 font-display">{activePotholes} Critical</div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{totalPotholes} total scanned</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="amber" className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400">SLA Fraud Alerts</div>
                <div className="text-2xl font-bold text-amber-400 font-display">3 Blocked</div>
                <div className="text-[10px] font-mono text-amber-400/80 mt-0.5">₹26.2L frozen</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="emerald" className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Active AI Drone Sorties</div>
                <div className="text-2xl font-bold text-emerald-400 font-display">{droneSorties} Flying</div>
                <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping mr-1" />
                  Telemetry streaming
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
            </VengenceCard>
          </div>

          {/* Core Grid: Health Index + Financial Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <RoadHealthGauge score={74} />
            </div>

            <div className="lg:col-span-7">
              <FinancialTicker />
            </div>
          </div>

          {/* Secondary Grid: Live Alert Feed + Fleet Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <LiveAlertFeed />
            </div>

            <div className="lg:col-span-5">
              <FleetMapWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
