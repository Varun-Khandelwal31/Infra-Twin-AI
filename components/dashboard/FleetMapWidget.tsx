'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation, Battery, Radio, ArrowUpRight } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

const DRONES = [
  { id: 'DR-904', operator: 'Rajesh Kumar (Zone 1)', battery: '88%', status: 'Scanning CP Outer Circle', lat: 28.6315, lng: 77.2167 },
  { id: 'DR-908', operator: 'Ananya Sharma (Zone 4)', battery: '74%', status: 'Scanning Outer Ring Road', lat: 28.5456, lng: 77.1928 },
  { id: 'DR-912', operator: 'Vikram Singh (Zone 2)', battery: '92%', status: 'Scanning Dwarka Sec 21', lat: 28.5523, lng: 77.0581 },
];

export default function FleetMapWidget() {
  return (
    <VengenceCard glowColor="cyan" className="p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-display">Active Drone Fleet Tracking</h3>
          <p className="text-[11px] text-slate-400">Autonomous Telemetry Stream</p>
        </div>
        <Link
          href="/map"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
        >
          <span>Open Full Map</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Simulated Drone Map Widget Visual */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
        {/* Map grid background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        {/* Drone Markers */}
        {DRONES.map((drone, i) => {
          const positions = [
            'top-8 left-12',
            'bottom-10 right-16',
            'top-16 right-36',
          ];
          return (
            <div key={drone.id} className={`absolute ${positions[i]} flex items-center gap-2 group cursor-pointer`}>
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-60"></span>
                <div className="w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-cyan-glow">
                  <Navigation className="w-3 h-3 transform rotate-45" />
                </div>
              </div>
              <div className="bg-slate-900/90 border border-cyan-500/40 px-2 py-1 rounded text-[10px] text-cyan-300 font-mono hidden sm:block">
                {drone.id}
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>3 Sorties Live</span>
        </div>
      </div>

      {/* Drone List */}
      <div className="mt-4 space-y-2">
        {DRONES.map((drone) => (
          <div
            key={drone.id}
            className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-cyan-400">{drone.id}</span>
              <span className="text-slate-300 truncate max-w-[140px]">{drone.operator}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>{drone.battery}</span>
            </div>
          </div>
        ))}
      </div>
    </VengenceCard>
  );
}
