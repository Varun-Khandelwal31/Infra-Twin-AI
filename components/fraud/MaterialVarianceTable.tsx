'use client';

import React, { useState } from 'react';
import { SLAVerificationData } from '@/lib/mockInference';
import { CheckCircle2, ShieldAlert, AlertTriangle, Info, Layers, Milestone } from 'lucide-react';

interface MaterialVarianceTableProps {
  sample: SLAVerificationData;
}

type MilestoneStage = 'stage-1' | 'stage-2' | 'stage-3';

export default function MaterialVarianceTable({ sample }: MaterialVarianceTableProps) {
  const [activeStage, setActiveStage] = useState<MilestoneStage>('stage-3');
  const m = sample.summaryMetrics;
  const isApproved = sample.status === 'APPROVED';

  // Stage-specific engineering checks
  const stageData = {
    'stage-1': {
      title: 'Milestone 1: Milling & Excavation Geometry',
      code: 'IRC:82-2023 Cl. 4.3.2',
      status: isApproved ? 'Compliant' : 'Non-Compliant',
      metrics: [
        { label: 'Vertical Cut Angle', value: isApproved ? '91.2°' : '64.5°', standard: '≥ 90.0°' },
        { label: 'Milling Depth', value: isApproved ? '54 mm' : '32 mm', standard: '≥ 50.0 mm' },
        { label: 'Perimeter Cleaning', value: isApproved ? '99% Dust Free' : '72% Dust Residual', standard: '100% Compressed Air' },
      ],
      checks: isApproved
        ? [
            '✓ Vertical edge cutting executed cleanly (91.2° perpendicularity)',
            '✓ Milling depth satisfies 50mm minimum DBM seating layer',
            '✓ Tack coat RS-1 applied uniformly at 0.52 kg/sqm',
          ]
        : [
            '✕ Tapered edge detected (64.5° instead of 90° vertical cut)',
            '✕ Milling depth under-excavated (32mm vs 50mm mandated)',
            '✓ Tack coat applied, but loose aggregate remains',
          ],
    },
    'stage-2': {
      title: 'Milestone 2: Sub-Base Nuclear Compaction & Density',
      code: 'MoRTH Section 3000 Cl. 3004.3',
      status: isApproved ? 'Compliant' : 'Non-Compliant',
      metrics: [
        { label: 'Relative Compaction', value: isApproved ? `${m.compactionQuality}% MDD` : `${m.compactionQuality}% MDD`, standard: '≥ 97.0% MDD' },
        { label: 'Moisture Content', value: isApproved ? '4.8%' : '7.6%', standard: 'OMC ± 1.0%' },
        { label: 'Nuclear Gauge Gauge ID', value: 'NDG-DEL-9921', standard: 'Calibrated NABL' },
      ],
      checks: isApproved
        ? [
            `✓ Sub-grade density reaches ${m.compactionQuality}% MDD (above 97% MoRTH threshold)`,
            '✓ Moisture content within optimum compaction envelope (OMC 4.8%)',
            '✓ Nuclear density gauge logs synced via BLE telemetry',
          ]
        : [
            `✕ Compaction density failed (${m.compactionQuality}% MDD vs 97% required)`,
            '✕ High moisture entrapment (7.6%) risks premature reflection cracks',
            '✕ Compaction roller passes truncated from 8 passes to 4 passes',
          ],
    },
    'stage-3': {
      title: 'Milestone 3: Final Bituminous Overlay & Surface Roughness',
      code: 'IRC:SP:84-2014 & IRC:37',
      status: isApproved ? 'Compliant' : 'Non-Compliant',
      metrics: [
        { label: 'Bump Integrator Unevenness', value: isApproved ? '1840 mm/km' : '2640 mm/km', standard: '≤ 2000 mm/km' },
        { label: 'Surface Texture Depth', value: isApproved ? '0.85 mm' : '0.41 mm', standard: '≥ 0.75 mm' },
        { label: 'Cross Fall / Camber Slope', value: isApproved ? '2.5% Transverse' : '1.1% Flat', standard: '2.5% Camber' },
      ],
      checks: sample.aiAnalysisResults,
    },
  };

  const currentStage = stageData[activeStage];

  return (
    <div className="space-y-6">
      {/* 4D Multi-Stage Milestone Audit Selector */}
      <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/30 shadow-cyan-glow space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Milestone className="w-4 h-4 text-cyan-400" />
            <span>4D MULTI-STAGE MILESTONE AUDITING WORKFLOW</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Enforces stage-wise escrow payment locks per MoRTH &amp; IRC protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveStage('stage-1')}
            className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
              activeStage === 'stage-1'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-glow'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-cyan-500/30'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">STAGE 1</span>
            <span className="font-sans font-bold text-slate-100 mt-0.5">Milling &amp; Edge Cut</span>
            <span className="text-[10px] text-cyan-400/90 mt-1">IRC:82 Cl. 4.3.2</span>
          </button>

          <button
            onClick={() => setActiveStage('stage-2')}
            className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
              activeStage === 'stage-2'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-glow'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-cyan-500/30'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">STAGE 2</span>
            <span className="font-sans font-bold text-slate-100 mt-0.5">Sub-Base Compaction</span>
            <span className="text-[10px] text-cyan-400/90 mt-1">MoRTH Cl. 3004.3</span>
          </button>

          <button
            onClick={() => setActiveStage('stage-3')}
            className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
              activeStage === 'stage-3'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-glow'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-cyan-500/30'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">STAGE 3</span>
            <span className="font-sans font-bold text-slate-100 mt-0.5">Bitumen Surface Course</span>
            <span className="text-[10px] text-cyan-400/90 mt-1">IRC:SP:84-2014</span>
          </button>
        </div>
      </div>

      {/* Lower 3 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Repair Verification Summary progress bars */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-display">Repair Verification Summary</h3>
            <span className="text-[10px] font-mono text-cyan-400">{currentStage.code}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Repair Quality Score</span>
                <span className={`font-mono font-bold ${m.repairQuality >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.repairQuality}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${m.repairQuality >= 75 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                  style={{ width: `${m.repairQuality}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Surface Smoothness</span>
                <span className="font-mono font-bold text-emerald-400">{m.surfaceSmoothness}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${m.surfaceSmoothness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Compaction Density</span>
                <span className={`font-mono font-bold ${m.compactionQuality >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.compactionQuality}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${m.compactionQuality >= 85 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                  style={{ width: `${m.compactionQuality}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Edge Compliance</span>
                <span className="font-mono font-bold text-emerald-400">{m.edgeCompliance}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${m.edgeCompliance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Drainage Camber</span>
                <span className="font-mono font-bold text-emerald-400">{m.drainageCompliance}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${m.drainageCompliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card: AI Analysis Results checklist with stage awareness */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-display">
              {currentStage.title.split(':')[0]} Checks
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                currentStage.status === 'Compliant'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {currentStage.status}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {currentStage.checks.map((result, idx) => {
              const isError = result.startsWith('✕');
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                    isError
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {isError ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-medium text-[11px]">{result}</span>
                </div>
              );
            })}
          </div>

          {/* Stage Technical Parameters */}
          <div className="pt-1 border-t border-slate-800/80 space-y-1.5 text-[10px] font-mono">
            {currentStage.metrics.map((cm, i) => (
              <div key={i} className="flex items-center justify-between text-slate-400">
                <span>{cm.label}:</span>
                <span className="text-slate-200 font-bold">
                  {cm.value} <span className="text-slate-500 font-normal">(Std: {cm.standard})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Material Used vs Material Claimed Table */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3.5">
          <h3 className="text-xs font-bold text-white font-display">Material Used vs Material Claimed</h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-900 text-slate-400 font-mono">
                <tr>
                  <th className="p-2">Material Type</th>
                  <th className="p-2">Claimed</th>
                  <th className="p-2">AI Used</th>
                  <th className="p-2">Variance</th>
                  <th className="p-2 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {sample.materialTable.map((row, idx) => {
                  const isFraud = row.status.includes('Fraud') || row.status.includes('Exceeded');
                  return (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-2 font-semibold text-slate-200">{row.type}</td>
                      <td className="p-2 font-mono text-slate-400">{row.claimed}</td>
                      <td className="p-2 font-mono text-cyan-300">{row.used}</td>
                      <td
                        className={`p-2 font-mono font-bold ${
                          isFraud ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {row.variance}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            isFraud
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>AI volumetric differencing detects asphalt thickness deficit before payment sanction.</span>
          </div>
        </div>
      </div>

      {/* Bottom Explanation Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        isApproved
          ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border-cyan-500/30'
          : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border-rose-500/40'
      }`}>
        <div className={`p-2 rounded-lg border shrink-0 ${
          isApproved ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
        }`}>
          {isApproved ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-bold text-white font-display">AI Verification Explanation &amp; PFMS Status</div>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            {sample.verificationExplanation}
          </p>
        </div>
      </div>
    </div>
  );
}

