'use client';

import React, { useState, useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Section65BCertificateModal from '@/components/fraud/Section65BCertificateModal';
import BlockchainAuditModal from '@/components/web3/BlockchainAuditModal';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  Coins,
} from 'lucide-react';
import { analyzeDroneImagePairAsync } from '@/lib/imageAnalyzer';
import { triggerPrint } from '@/lib/exportUtils';
import { CONTRACTOR_SLA_SAMPLES } from '@/lib/mockInference';
import { anchorAuditOnChain } from '@/lib/web3/blockchainService';
import { OnChainAuditRecord } from '@/lib/web3/types';

export default function SLAVerificationPage() {
  // Preset scenarios or interactive slider
  const [billedVolume, setBilledVolume] = useState<number>(0.53);
  const [aiFilledVolume, setAiFilledVolume] = useState<number>(0.52);
  const [compactionDensity, setCompactionDensity] = useState<number>(98.2);
  const [voidArea, setVoidArea] = useState<number>(2.85);
  const [voidDepth, setVoidDepth] = useState<number>(18.5);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPaymentFrozen, setIsPaymentFrozen] = useState(false);

  // Blockchain Anchoring & Modal State
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [onChainRecord, setOnChainRecord] = useState<OnChainAuditRecord | null>(null);

  // Custom Upload States
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [beforeImg, setBeforeImg] = useState<string>('/images/pothole_severe_before.jpg');
  const [afterImg, setAfterImg] = useState<string>('/images/pothole_repaired_after.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);

  const runImageAnalysis = async (bUrl: string, aUrl: string) => {
    setIsScanning(true);
    setScanProgress(15);

    const result = await analyzeDroneImagePairAsync(bUrl, aUrl);

    let p = 20;
    const timer = setInterval(() => {
      p += 30;
      if (p >= 100) {
        clearInterval(timer);
        setScanProgress(100);
        setIsScanning(false);
        // Sync calculated metrics
        setVoidArea(result.beforeAreaSqm);
        setVoidDepth(result.beforeDepthCm);
        setBilledVolume(Number((result.beforeVolumeM3 * (1 + (result.status === 'FRAUD_ALERT' ? result.materialVariancePct / 100 : 0.02))).toFixed(2)));
        setAiFilledVolume(result.afterFilledVolumeM3);
        setCompactionDensity(result.compactionDensity);
      } else {
        setScanProgress((prev) => Math.min(prev + 20, 95));
      }
    }, 200);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        if (isBefore) {
          setBeforeImg(url);
          runImageAnalysis(url, afterImg);
        } else {
          setAfterImg(url);
          runImageAnalysis(beforeImg, url);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (sample: (typeof CONTRACTOR_SLA_SAMPLES)[0]) => {
    const isOver = sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED';
    setBilledVolume(isOver ? 0.78 : 0.52);
    setAiFilledVolume(0.52);
    setCompactionDensity(isOver ? 92.5 : 98.4);
    setVoidArea(3.4);
    setVoidDepth(isOver ? 19.2 : 14.5);
    setBeforeImg(sample.beforeScan.imageUrl);
    setAfterImg(sample.afterScan.imageUrl);
    setIsPaymentFrozen(isOver);
    setToastMessage(`✓ Loaded preset: ${(sample as any).roadName || sample.project}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const volumeDeficit = Math.max(0, billedVolume - aiFilledVolume);
  const deficitPercentage = billedVolume > 0 ? ((volumeDeficit / billedVolume) * 100).toFixed(1) : '0';
  const isFraud = Number(deficitPercentage) > 5 || compactionDensity < 95;

  const handleTogglePaymentFreeze = () => {
    const nextState = !isPaymentFrozen;
    setIsPaymentFrozen(nextState);
    if (nextState) {
      setToastMessage('🔒 PFMS / GeM Escrow Payment FROZEN: Contractor invoice flagged for statutory vigilance review!');
    } else {
      setToastMessage('✓ PFMS / GeM Escrow Payment RELEASED: Milestone verified compliant with MoRTH specifications.');
    }
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleExportPDF = () => {
    setToastMessage('Generating Official Volumetric SLA Audit Certificate (PDF)...');
    setTimeout(() => {
      triggerPrint();
      setToastMessage(null);
    }, 600);
  };

  const handleAnchorOnBlockchain = () => {
    setIsAnchoring(true);
    setToastMessage('⛓️ Computing SHA-256 Merkle Tree & Broadcasting to Polygon Amoy Testnet...');

    setTimeout(() => {
      const record = anchorAuditOnChain({
        inspectionId: `INSP-SLA-${Date.now().toString().slice(-6)}`,
        roadId: 'RD-NDMC-CP-01',
        roadName: 'Outer Ring Road (IIT Flyover Corridor)',
        city: 'Delhi',
        contractor: 'Apex Infraworks Pvt Ltd',
        lat: 28.548,
        lng: 77.185,
        areaSqm: voidArea,
        depthCm: voidDepth,
        volumeCum: aiFilledVolume,
        billedVolumeCum: billedVolume,
        materialVariancePct: Number(deficitPercentage),
        compactionDensityPct: compactionDensity,
        pciScore: isFraud ? 58 : 84,
        isFraud,
      });

      setOnChainRecord(record);
      setIsAnchoring(false);
      setIsBlockchainModalOpen(true);
      setToastMessage('✓ Merkle Root anchored on Polygon Amoy (Block #' + record.receipt.blockNumber + ')!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      {/* Hidden file inputs */}
      <input
        ref={beforeInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleCustomUpload(e, true)}
      />
      <input
        ref={afterInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleCustomUpload(e, false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-display">
                  Contractor SLA &amp; Volumetric Fraud Verification Module
                </h1>
                <span
                  className={`p-1 rounded-full border ${
                    isFraud
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {isFraud ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Side-by-side 3D volumetric audit comparing contractor material invoices against AI drone scans
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Blockchain Anchoring Trigger */}
              <button
                onClick={handleAnchorOnBlockchain}
                disabled={isAnchoring}
                className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-95 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAnchoring ? 'Anchoring on Polygon...' : 'Anchor on Blockchain'}</span>
              </button>

              <button
                onClick={() => setIsCertOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-cyan-glow cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Section 65B Certificate</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit PDF</span>
              </button>

              <button
                onClick={handleTogglePaymentFreeze}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer ${
                  isPaymentFrozen
                    ? 'bg-rose-500 text-white shadow-red-glow hover:bg-rose-600'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isPaymentFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isPaymentFrozen ? 'PFMS Payment: FROZEN' : 'PFMS Payment: ACTIVE'}</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold shadow-cyan-glow flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* PRESET SAMPLES PICKER */}
          <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                Select Municipal Inspection Scenario Preset:
              </span>
              <span className="text-[11px] font-mono text-cyan-400">Click to load real inspection telemetry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTRACTOR_SLA_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleApplyPreset(sample)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 group-hover:text-cyan-300 transition-colors font-bold truncate">
                      {(sample as any).roadName || sample.project}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                        sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED' ? 'FRAUD' : 'PASSED'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">
                    Contractor: {(sample as any).contractor || 'Apex Infraworks Pvt Ltd'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DUAL IMAGE UPLOAD & LIVE SCAN TRIGGER HUB */}
          <div className="p-4 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                  Live Custom Orthomosaic Upload &amp; 3D Volume Analysis
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Upload your own drone imagery pair</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => beforeInputRef.current?.click()}
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Upload Custom Before Photo</span>
                <span className="text-[10px] font-mono opacity-80">Pre-Repair Scan</span>
              </button>

              <button
                onClick={() => afterInputRef.current?.click()}
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Upload Custom After Photo</span>
                <span className="text-[10px] font-mono opacity-80">Post-Repair Scan</span>
              </button>

              <button
                onClick={() => runImageAnalysis(beforeImg, afterImg)}
                disabled={isScanning}
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-cyan-glow hover:opacity-90 cursor-pointer"
              >
                <span>{isScanning ? 'Scanning Orthomosaics...' : 'Run Live 3D AI Differencing'}</span>
              </button>
            </div>

            {isScanning && (
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-mono text-cyan-400 mb-1">
                  <span>[AI Engine] Segmenting Pothole Voids &amp; Computing Compaction...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* FLASHING RED FRAUD ALERT BANNER OR GREEN CLEARANCE BANNER */}
          {isFraud ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-slate-950 border-2 border-rose-500/80 text-rose-200 shadow-red-glow animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-100 font-display flex items-center gap-2">
                    <span>SLA VOLUMETRIC DEFICIT FRAUD DETECTED</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500 text-white font-bold">
                      HIGH RISK
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/90 mt-0.5">
                    Contractor billed <strong className="text-white">{billedVolume.toFixed(2)} m³</strong> ({(billedVolume * 2.4).toFixed(2)} Ton) of asphalt, but AI drone scan verified only <strong className="text-white">{aiFilledVolume.toFixed(2)} m³</strong> ({(aiFilledVolume * 2.4).toFixed(2)} Ton) filled.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-rose-400 uppercase">Material Deficit</div>
                  <div className="text-xl font-bold text-white">-{deficitPercentage}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-950 border border-emerald-500/40 text-emerald-200 shadow-green-glow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-display">SLA Compliance Verified</div>
                  <div className="text-xs text-emerald-300/80">Material filled matches billed invoice within 5% tolerance.</div>
                </div>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold">
                Compaction Quality: {compactionDensity}% (PASSED)
              </div>
            </div>
          )}

          {/* Interactive Sliders Simulation Control */}
          <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                <Sliders className="w-4 h-4" />
                <span>INTERACTIVE AUDIT PARAMETER SIMULATOR</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Drag sliders to test fraud detection thresholds</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Contractor Claimed / Billed Volume:</span>
                  <span className="font-bold text-rose-400">{billedVolume.toFixed(2)} m³</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.50"
                  step="0.01"
                  value={billedVolume}
                  onChange={(e) => setBilledVolume(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.10 m³</span>
                  <span>Invoiced Material</span>
                  <span>1.50 m³</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">AI Drone Verified Material Filled:</span>
                  <span className="font-bold text-emerald-400">{aiFilledVolume.toFixed(2)} m³</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.50"
                  step="0.01"
                  value={aiFilledVolume}
                  onChange={(e) => setAiFilledVolume(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.10 m³</span>
                  <span>LiDAR Monocular Mesh</span>
                  <span>1.50 m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side Dual Scan Viewers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Pre-repair Pothole with RED Mask */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-500/30 bg-[#0d1322] shadow-glass flex flex-col justify-between h-[360px] p-4 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Step 1: Pre-Repair Drone Scan (Void Detected)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                  {voidDepth.toFixed(1)} cm Max Depth
                </span>
              </div>

              {/* Background Road Image with RED Segmentation Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={beforeImg}
                  alt="Pre-Repair Pothole Scan"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />

                {/* RED Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d="M 180,140 C 250,110 340,120 400,160 C 450,200 430,300 380,360 C 310,400 220,390 170,330 C 130,270 140,190 180,140 Z"
                    fill="rgba(239, 68, 68, 0.35)"
                    stroke="#ef4444"
                    strokeWidth="4"
                    filter="url(#redGlow)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Prominent Bottom Volume Card */}
              <div className="relative z-10 p-4 rounded-xl bg-slate-950/90 backdrop-blur-xl border border-rose-500/40 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider">Contractor Invoiced Volume</div>
                  <div className="text-xl font-black text-rose-400 font-display mt-0.5">
                    Claimed = {billedVolume.toFixed(2)} m³
                  </div>
                </div>
                <div className="text-right border-l border-slate-800 pl-4">
                  <span className="text-slate-400 block">Area: {voidArea.toFixed(2)} m²</span>
                  <span className="text-rose-400 font-bold block">Deficit: -{deficitPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Right Box: Post-repair Pothole with GREEN Mask */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#0d1322] shadow-glass flex flex-col justify-between h-[360px] p-4 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Step 2: Post-Repair AI Verification Scan
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded">
                  Dual RTK Fixed ±1.8cm
                </span>
              </div>

              {/* Background Road Image with GREEN Segmentation Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={afterImg}
                  alt="After Repair Drone Scan"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />

                {/* GREEN / RED Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d="M 180,140 C 250,110 340,120 400,160 C 450,200 430,300 380,360 C 310,400 220,390 170,330 C 130,270 140,190 180,140 Z"
                    fill={isFraud ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.25)'}
                    stroke={isFraud ? '#ef4444' : '#10b981'}
                    strokeWidth="4"
                    strokeDasharray="8, 4"
                    filter="url(#greenGlow)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Prominent Bottom Volume Card */}
              <div className="relative z-10 p-4 rounded-xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider">AI Verified Material Filled</div>
                  <div className="text-xl font-black text-emerald-400 font-display mt-0.5">
                    Volume filled = {aiFilledVolume.toFixed(2)} m³
                  </div>
                </div>
                <div className="text-right border-l border-slate-800 pl-4">
                  <span className="text-slate-400 block">Compaction: {compactionDensity}%</span>
                  <span className={`block font-bold ${isFraud ? 'text-rose-400' : 'text-emerald-400'}`}>
                    SLA: {isFraud ? 'FRAUD ALERT' : 'APPROVED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Audit Table */}
          <div className="p-5 rounded-2xl bg-[#111726]/90 backdrop-blur-xl border border-cyan-500/20 shadow-glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                Volumetric Material Audit &amp; On-Chain Governance Diagnostics
              </h3>
              {onChainRecord && (
                <button
                  onClick={() => setIsBlockchainModalOpen(true)}
                  className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1 underline"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Merkle Proof (Tx: {onChainRecord.receipt.txHash.slice(0, 10)}...)</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Material Category</th>
                    <th className="p-3">Contractor Billed</th>
                    <th className="p-3">AI Verified Volume Filled</th>
                    <th className="p-3">Variance / Deficit</th>
                    <th className="p-3 text-right">Audit &amp; Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-slate-200 font-sans">VG-30 Bituminous Concrete</td>
                    <td className="p-3 text-slate-300">{(billedVolume * 2.4).toFixed(2)} Ton ({billedVolume.toFixed(2)} m³)</td>
                    <td className="p-3 text-cyan-300">{(aiFilledVolume * 2.4).toFixed(2)} Ton ({aiFilledVolume.toFixed(2)} m³)</td>
                    <td className={`p-3 font-bold ${isFraud ? 'text-rose-400' : 'text-emerald-400'}`}>
                      -{deficitPercentage}% ({volumeDeficit.toFixed(2)} m³ Shortfall)
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                          isFraud
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-red-glow'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-green-glow'
                        }`}
                      >
                        {isFraud ? 'OVER-BILLING FRAUD (ESCROW FROZEN)' : 'WITHIN SLA (ESCROW RELEASED)'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Section 65B Modal */}
      <Section65BCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        data={{
          id: 'sla-verification-801',
          project: 'Contractor SLA & Volumetric Differencing Audit',
          roadId: 'RD-NDMC-CP-01',
          inspectionNo: 'INSP-SLA-2026',
          status: isFraud ? 'FRAUD_ALERT' : 'APPROVED',
          volume: billedVolume,
          area: voidArea,
        }}
      />

      {/* Blockchain Audit & Merkle Proof Modal */}
      <BlockchainAuditModal
        isOpen={isBlockchainModalOpen}
        onClose={() => setIsBlockchainModalOpen(false)}
        record={onChainRecord}
      />
    </div>
  );
}
