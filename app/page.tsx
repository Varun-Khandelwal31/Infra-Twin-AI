'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Hero3DRoad from '@/components/landing/Hero3DRoad';
import TickerCounter from '@/components/landing/TickerCounter';
import InteractivePlayground from '@/components/landing/InteractivePlayground';
import WorkflowPipeline from '@/components/landing/WorkflowPipeline';
import FeatureGrid from '@/components/landing/FeatureGrid';
import ROICalculator from '@/components/landing/ROICalculator';
import TechStrip from '@/components/landing/TechStrip';
import { ArrowRight, ShieldCheck, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium shadow-cyan-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Road Infrastructure Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display leading-[1.1]">
            From Reactive Patchwork to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Predictive Governance
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed max-w-xl">
            InfraTwin AI is an autonomous, end-to-end road infrastructure auditing platform for Indian smart cities. Powered by sub-centimeter YOLOv8 segmentation, WebGL 3D depth mesh estimation, Llama-3 GenAI BOQ synthesis, and automated contractor SLA fraud detection.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:shadow-cyan-glow transition-all duration-300 flex items-center gap-2"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/audit"
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Explore AI Studio Scan</span>
            </Link>
          </div>

          {/* Quick Value Props */}
          <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>IRC:82-2023 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>MapLibre GL Digital Twin</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Contractor Payment Freeze</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Sub-cm 3D Depth Matrix</span>
            </div>
          </div>
        </div>

        {/* Right Upgraded 3D Visual */}
        <div className="lg:col-span-6">
          <Hero3DRoad />
        </div>
      </section>

      {/* Enterprise Ministry & National Infrastructure Integration Hub */}
      <section className="px-6 max-w-7xl mx-auto w-full pb-8">
        <div className="p-4 rounded-2xl bg-[#0e1526]/90 border border-cyan-500/30 shadow-cyan-glow space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>NATIONAL INFRASTRUCTURE INTEGRATION GATEWAY (LIVE SYNC)</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Bi-directional API Webhooks Active • MoRTH Data Lake Specification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">NHAI RAMS v2.4</div>
                <div className="text-white font-bold font-sans">Asset Condition Index</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                STREAMING
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">PM Gati Shakti GIS</div>
                <div className="text-white font-bold font-sans">National Spatial Node</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                WFS/WMS OK
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">PFMS / GeM Escrow</div>
                <div className="text-white font-bold font-sans">Automated Pay-Lock</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                ESCROW ARMED
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">DGCA DigitalSky</div>
                <div className="text-white font-bold font-sans">UAS Flight Telemetry</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                RTK LOCKED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Counter Ticker */}
      <TickerCounter />

      {/* Interactive Playground Section */}
      <InteractivePlayground />

      {/* 4-Step Pipeline */}
      <WorkflowPipeline />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Municipal ROI Calculator */}
      <ROICalculator />

      {/* Tech Strip */}
      <TechStrip />

      {/* Call to Action Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 shadow-cyan-glow relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Ready to Upgrade City Pavement Governance?
            </h2>
            <p className="text-slate-300 text-sm">
              Deploy InfraTwin AI to eliminate delayed manual surveys, prevent fraudulent contractor claims, and optimize municipal road maintenance budgets.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:shadow-cyan-glow transition-all"
              >
                <span>Launch Interactive Demo Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-xs text-slate-400">
        <p>InfraTwin AI Platform • Autonomous Digital Twin Road Auditing Division</p>
      </footer>
    </div>
  );
}
