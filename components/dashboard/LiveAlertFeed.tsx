'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, ExternalLink, Bot } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

const ALERTS = [
  {
    id: 'alt-101',
    road: 'Outer Ring Road (IIT Flyover)',
    type: 'Critical Structural Pothole (Depth 18.2cm)',
    severity: 'Critical',
    time: '4 mins ago',
    ward: 'Ward 12',
    actionLink: '/audit?sample=sample-2',
    boqLink: '/copilot?sample=sample-2',
  },
  {
    id: 'alt-102',
    road: 'Connaught Place Outer Circle',
    type: 'Water-Bound Severe Pothole (Depth 15.0cm)',
    severity: 'Critical',
    time: '12 mins ago',
    ward: 'Ward 34',
    actionLink: '/audit?sample=sample-1',
    boqLink: '/copilot?sample=sample-1',
  },
  {
    id: 'alt-103',
    road: 'Barakhamba Road Exit 2',
    type: 'High Density Alligator Cracking',
    severity: 'High',
    time: '28 mins ago',
    ward: 'Ward 34',
    actionLink: '/audit?sample=sample-1',
    boqLink: '/copilot?sample=sample-1',
  },
  {
    id: 'alt-104',
    road: 'Dwarka Expressway Sector 21',
    type: 'Longitudinal Rutting (Depth 4.2cm)',
    severity: 'Moderate',
    time: '1 hour ago',
    ward: 'Ward 08',
    actionLink: '/audit?sample=sample-3',
    boqLink: '/copilot?sample=sample-3',
  },
];

export default function LiveAlertFeed() {
  return (
    <VengenceCard glowColor="rose" className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-sm font-bold text-white font-display">Live AI Distress Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          Auto Stream
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 max-h-[340px]">
        {ALERTS.map((alert) => {
          let badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
          let Icon = AlertTriangle;

          if (alert.severity === 'High') {
            badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            Icon = AlertCircle;
          } else if (alert.severity === 'Moderate') {
            badgeStyle = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            Icon = Info;
          }

          return (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${badgeStyle} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {alert.road}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{alert.type}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                    <span>{alert.ward}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  href={alert.actionLink}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all flex items-center gap-1"
                >
                  <span>Audit</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <Link
                  href={alert.boqLink}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition-all flex items-center gap-1"
                >
                  <Bot className="w-3 h-3" />
                  <span>BOQ</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </VengenceCard>
  );
}
