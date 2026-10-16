'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  ScanEye,
  Bot,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Command Center',
    pitch: 'Real-time citywide Road Health Index (0-100), financial ticker cards, and live AI distress alert feed.',
    link: '/dashboard',
    badge: 'Executive View',
  },
  {
    icon: Map,
    title: 'Spatial Digital Twin',
    pitch: 'MapLibre GL JS vector map with temporal degradation tracking (Jan-Jun) and segment micro-analytics.',
    link: '/map',
    badge: 'MapLibre Vector',
  },
  {
    icon: ScanEye,
    title: 'AI Audit Studio',
    pitch: 'Sub-centimeter YOLOv8 segmentation outlines combined with WebGL 3D elevation depth heatmaps.',
    link: '/audit',
    badge: 'YOLOv8 + 3D Mesh',
  },
  {
    icon: Bot,
    title: 'Nirman Copilot',
    pitch: 'Groq Llama-3 GenAI engine producing IRC:82-2023 compliant Bills of Quantities and CO2 estimates.',
    link: '/copilot',
    badge: 'Llama-3 + IRC RAG',
  },
  {
    icon: ShieldCheck,
    title: 'Contractor SLA & Fraud Detection',
    pitch: 'Side-by-side drone Before/After AI verification, material variance table, and auto payment freezes.',
    link: '/fraud-detection',
    badge: 'Fraud Audit',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Maintenance',
    pitch: 'Traffic Load vs. Road Age scatter modeling to allocate municipal budget before structural failure.',
    link: '/predictive',
    badge: 'Budget Optimizer',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-widest mb-3">
          End-to-End Infrastructure Intelligence
        </h2>
        <p className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
          6 Core Modules for Modern Smart City Governance
        </p>
        <p className="text-slate-400 text-sm mt-3">
          Replacing slow manual inspections with autonomous drone AI, 3D volumetric depth analysis, and LLM-powered IRC compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link href={feat.link} className="block h-full">
                <VengenceCard glowColor="cyan" className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {feat.pitch}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Module</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </VengenceCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
