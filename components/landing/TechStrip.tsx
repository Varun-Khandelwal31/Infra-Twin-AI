'use client';

import React from 'react';

const TECH_BADGES = [
  { name: 'YOLOv8 Instance Segmentation', category: 'Computer Vision' },
  { name: 'Monocular Depth Anything V2', category: '3D Depth Engine' },
  { name: 'Groq Llama-3 70B', category: 'GenAI BOQ Engine' },
  { name: 'IRC:82-2023 Compliance', category: 'RAG Grounding' },
  { name: 'MapLibre GL JS', category: 'Spatial Twin' },
  { name: 'Supabase Postgres', category: 'Vector & Relational DB' },
];

export default function TechStrip() {
  return (
    <section id="tech-stack" className="py-12 border-y border-cyan-500/15 bg-[#070a11]/60">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider mb-8">
          Powered By State-of-the-Art Computer Vision & AI Architecture
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TECH_BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-center transition-colors group"
            >
              <div className="text-[10px] font-mono text-cyan-400 font-medium mb-1 uppercase tracking-tight">
                {badge.category}
              </div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
