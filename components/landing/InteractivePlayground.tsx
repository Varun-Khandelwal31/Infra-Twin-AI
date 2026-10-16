'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanEye, Layers, Cpu, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function InteractivePlayground() {
  const [activeLayer, setActiveLayer] = useState<'rgb' | 'segmentation' | 'depth'>('segmentation');

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
          Interactive AI Playground
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mt-3">
          Test the Computer Vision & Depth Engine
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Toggle between raw aerial drone RGB imagery, YOLOv8 cyan segmentation boundary masks, and sub-centimeter monocular 3D depth heatmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111726]/80 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glass">
        {/* Left Scan Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 group">
            {/* Base Image */}
            <img
              src="/images/indian_alligator_crack_corridor.jpg"
              alt="Indian National Highway Aerial Drone Scan"
              className="w-full h-full object-cover"
            />

            {/* Cyan Segmentation Outline */}
            {(activeLayer === 'segmentation' || activeLayer === 'depth') && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                <defs>
                  <filter id="cyanGlowPlay" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M 180,140 C 230,110 320,120 370,160 C 420,200 450,270 410,340 C 370,410 270,430 200,380 C 140,330 130,240 150,180 Z"
                  fill={activeLayer === 'depth' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 217, 255, 0.2)'}
                  stroke={activeLayer === 'depth' ? '#ef4444' : '#00d9ff'}
                  strokeWidth="4"
                  strokeDasharray="8, 4"
                  filter="url(#cyanGlowPlay)"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Depth Heatmap Overlay Effect */}
            {activeLayer === 'depth' && (
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-amber-950/40 to-blue-950/40 mix-blend-color-dodge pointer-events-none" />
            )}

            {/* Layer Control Pills */}
            <div className="absolute top-4 left-4 z-20 flex items-center bg-slate-950/90 p-1.5 rounded-xl border border-cyan-500/40 text-xs shadow-cyan-glow">
              <button
                onClick={() => setActiveLayer('rgb')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'rgb'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw RGB Scan
              </button>
              <button
                onClick={() => setActiveLayer('segmentation')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'segmentation'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                YOLOv8 Mask
              </button>
              <button
                onClick={() => setActiveLayer('depth')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'depth'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-red-glow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3D Depth Mesh
              </button>
            </div>

            <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-400">
              Connaught Place • IR-2025-05-27
            </div>
          </div>
        </div>

        {/* Right Telemetry Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Volumetric Inference</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              Outer Ring Road Pothole #104
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Drone altitude: 12 meters • Resolution: 0.8 cm/pixel • Sub-centimeter accuracy
            </p>
          </div>

          {/* Metrics List */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Surface Area</div>
              <div className="text-base font-bold text-white font-display mt-0.5">2.5 sqm (±0.15)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Max Depth</div>
              <div className="text-base font-bold text-rose-400 font-display mt-0.5">15.0 cm (±1.2)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Volume Displacement</div>
              <div className="text-base font-bold text-cyan-400 font-display mt-0.5">0.375 m³</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Severity Score</div>
              <div className="text-base font-bold text-amber-400 font-display mt-0.5">98.7% Critical</div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/audit?sample=sample-1"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Full Audit Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/copilot?sample=sample-1"
              className="px-5 py-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Generate IRC BOQ</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
