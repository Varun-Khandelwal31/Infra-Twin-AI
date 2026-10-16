'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShieldCheck, Route, Zap } from 'lucide-react';

const STATS = [
  {
    icon: IndianRupee,
    value: '₹142.8 Lakhs',
    label: 'Municipal Budget Saved',
    subtext: 'Through fraud prevention & early repairs',
    glowColor: 'from-emerald-500/20 to-cyan-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
  {
    icon: Route,
    value: '1,840+ km',
    label: 'Road Stretch Audited',
    subtext: 'Across New Delhi & NCR Smart Zones',
    glowColor: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
  },
  {
    icon: Zap,
    value: '4.2x Faster',
    label: 'Audit Cycle Speed',
    subtext: 'Drone AI vs Manual PWD Surveys',
    glowColor: 'from-purple-500/20 to-cyan-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
  },
  {
    icon: ShieldCheck,
    value: '99.4%',
    label: 'SLA Verification Accuracy',
    subtext: 'Sub-centimeter volumetric depth audit',
    glowColor: 'from-amber-500/20 to-cyan-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
];

export default function TickerCounter() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.glowColor} backdrop-blur-xl border ${stat.borderColor} relative overflow-hidden group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-900/80 border ${stat.borderColor} flex items-center justify-center ${stat.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800">
                  Live Ticker
                </span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight font-display ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">{stat.label}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.subtext}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
