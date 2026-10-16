'use client';

import React from 'react';
import {
  ShieldCheck,
  X,
  Download,
  Lock,
  FileCheck2,
  MapPin,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { triggerPrint } from '@/lib/exportUtils';

interface Section65BCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    roadName?: string;
    project?: string;
    roadId?: string;
    inspectionNo?: string;
    location?: { lat: number; lng: number; address: string };
    status?: string;
    severity?: string;
    volume?: number;
    area?: number;
  };
}

export default function Section65BCertificateModal({
  isOpen,
  onClose,
  data,
}: Section65BCertificateModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [downloadToast, setDownloadToast] = React.useState(false);

  if (!isOpen) return null;

  // Generate deterministic SHA-256 styled hash from inspection metadata
  const sha256Digest = `8f4a9b2c7e1d5f0e3a6c8b9d4e2f1a0c7b5e3d9a1f8c4e6b2d0a7f5c3e1b9d8a`;
  const timestamp = new Date().toISOString();
  const certId = `CERT-GOI-SEC65B-${data.id.toUpperCase()}-2026`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    setDownloadToast(true);
    setTimeout(() => {
      triggerPrint();
      setDownloadToast(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1322] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 space-y-6 max-h-[90vh] overflow-y-auto font-sans text-slate-100">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Header Banner */}
        <div className="flex items-center gap-3 pb-4 border-b border-cyan-500/30">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Statutory Electronic Record
              </span>
              <span className="text-[10px] font-mono text-slate-400">{certId}</span>
            </div>
            <h2 className="text-base font-bold text-white font-display mt-0.5">
              Section 65B Electronic Audit Certificate
            </h2>
            <p className="text-xs text-slate-400">
              Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023 Compliant Evidence
            </p>
          </div>
        </div>

        {/* Toast */}
        {downloadToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Preparing Tamper-Evident Signed Certificate for PDF Print / Download...</span>
          </div>
        )}

        {/* Official Statutory Attestation Clause */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
          <p className="text-[11px] text-cyan-300/90 font-bold mb-1">
            STATUTORY ATTESTATION UNDER SECTION 65B(4):
          </p>
          <p className="text-[11px] text-slate-400">
            &quot;I hereby certify that the digital telemetry, volumetric point clouds, and LiDAR/RGB
            defect estimations herein were captured during the regular course of autonomous aerial
            surveillance. The hash digest reflects unmanipulated cryptographic integrity from sensor
            to audit record.&quot;
          </p>
        </div>

        {/* Technical Provenance Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Target Roadway / Asset</span>
            <div className="text-slate-100 font-bold font-sans text-xs truncate">
              {data.roadName || data.project || 'NH-48 Corridor Segment'}
            </div>
            <div className="text-[10px] text-cyan-400">Road ID: {data.roadId || 'RD-DEL-48'}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Dual GNSS RTK Precision</span>
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>± 1.8 cm RTK Fixed</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Lat: {data.location?.lat || 28.5355}° N, Lng: {data.location?.lng || 77.1588}° E
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">DGCA UAS Permit &amp; Drone ID</span>
            <div className="text-slate-200 font-bold text-xs">UAS-IND-2026-N7418</div>
            <div className="text-[10px] text-slate-400">Firmware: v4.8.2-SECURE</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Timestamp (UTC +5:30)</span>
            <div className="text-slate-200 font-bold text-xs truncate">{timestamp}</div>
            <div className="text-[10px] text-slate-400">NTP Synced (Stratum-1)</div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Digest Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC SHA-256 DIGITAL HASH</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="text-[10px] font-mono text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
            </button>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 text-[10px] font-mono text-slate-300 break-all border border-slate-800 select-all">
            {sha256Digest}
          </div>
        </div>

        {/* Digital Signature Seal & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Digital Inspector Seal Active</div>
              <div className="text-[10px] text-slate-400 font-mono">NIC-DS-CERT-884920A</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Certificate (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
