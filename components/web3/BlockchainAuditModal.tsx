'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Copy,
  Layers,
  CheckCircle2,
  Lock,
  Download,
  AlertTriangle,
  Coins,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { OnChainAuditRecord } from '@/lib/web3/types';
import { downloadJSON } from '@/lib/exportUtils';

interface BlockchainAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: OnChainAuditRecord | null;
}

export default function BlockchainAuditModal({
  isOpen,
  onClose,
  record,
}: BlockchainAuditModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleExportReceipt = () => {
    downloadJSON(
      `InfraTwin_OnChain_Receipt_${record.inspectionId}_${record.receipt.blockNumber}.json`,
      record
    );
  };

  const isFrozen = record.escrowStatus === 'PAYMENT_FROZEN' || record.isFraud;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#070b14] border border-cyan-500/40 shadow-[0_0_60px_rgba(0,217,255,0.25)] p-6 sm:p-8 space-y-6 text-slate-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Polygon Amoy Verified
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Block #{record.receipt.blockNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-display mt-0.5 flex items-center gap-2">
                <span>Proof of Infrastructure Audit (PoIA)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographic Merkle Tree &amp; Smart Contract Escrow State
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Copy Notification Toast */}
        {copiedField && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{copiedField} copied to clipboard!</span>
          </div>
        )}

        {/* On-Chain Provenance Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Smart Contract Escrow State</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  isFrozen
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-red-glow'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-green-glow'
                }`}
              >
                {isFrozen ? '🔒 PAYMENT_FROZEN (FRAUD ALERT)' : '🟢 APPROVED_RELEASED'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Blockchain Network</div>
            <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5 pt-0.5">
              <Coins className="w-4 h-4 text-purple-400" />
              <span>{record.receipt.network}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">Gas: {record.receipt.gasUsed}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Target Highway Asset</div>
            <div className="text-sm font-bold text-cyan-300 font-display truncate pt-0.5">
              {record.roadName}
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">Contractor: {record.contractor}</div>
          </div>
        </div>

        {/* Transaction Hash Box */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
              <span>ON-CHAIN TRANSACTION HASH (POLYGON AMOY)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(record.receipt.txHash, 'Transaction Hash')}
                className="text-[10px] font-mono text-cyan-300 hover:text-white px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Tx</span>
              </button>
              <a
                href={record.receipt.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-purple-300 hover:text-white px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 flex items-center gap-1 transition-colors"
              >
                <span>Polygonscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 break-all border border-slate-800 select-all">
            {record.receipt.txHash}
          </div>
        </div>

        {/* Merkle Root & Leaves Tree Viewer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>CRYPTOGRAPHIC MERKLE TREE LEAVES ({record.merkleProof.leaves.length} NODES)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Merkle Depth: {record.merkleProof.depth} Levels
            </span>
          </div>

          {/* Merkle Root Banner */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="min-w-0">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">Root Hash (Anchored in State)</div>
              <div className="text-white font-bold truncate mt-0.5">{record.merkleProof.root}</div>
            </div>
            <button
              onClick={() => handleCopy(record.merkleProof.root, 'Merkle Root')}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:text-white shrink-0"
              title="Copy Merkle Root"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Leaf Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
            {record.merkleProof.leaves.map((leaf, idx) => (
              <div
                key={leaf.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold">Leaf #{idx + 1}: {leaf.label}</span>
                  <button
                    onClick={() => handleCopy(leaf.hash, leaf.label)}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-slate-400 break-all">
                  {leaf.hash.slice(0, 24)}...{leaf.hash.slice(-16)}
                </div>
                <div className="text-[9px] font-sans text-slate-500 truncate">
                  Payload: {leaf.dataSummary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contract: {record.receipt.toContract.slice(0, 14)}...</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReceipt}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export On-Chain Receipt (.json)</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
