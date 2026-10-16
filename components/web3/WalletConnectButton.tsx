'use client';

import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Copy,
  Coins,
  Shield,
} from 'lucide-react';
import { DEFAULT_MUNICIPAL_WALLET } from '@/lib/web3/blockchainService';
import { BlockchainNetwork } from '@/lib/web3/types';

export default function WalletConnectButton() {
  const [wallet, setWallet] = useState(DEFAULT_MUNICIPAL_WALLET);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSwitchNetwork = (network: BlockchainNetwork) => {
    setWallet((prev) => ({ ...prev, network }));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 text-xs font-mono transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] active:scale-95 cursor-pointer"
      >
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <Wallet className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span className="text-purple-300 font-bold hidden sm:inline">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
          Amoy
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0e1626] border border-purple-500/40 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-slate-100 font-sans text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white font-display">Municipal Auditor Keycard</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Active
            </span>
          </div>

          {/* Account Address Box */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Auditor Address</span>
              <button
                onClick={handleCopyAddress}
                className="text-purple-300 hover:text-white text-[10px] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-200 break-all select-all font-bold">
              {wallet.address}
            </div>
          </div>

          {/* Balance & Role */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400">Treasury Gas</div>
              <div className="font-bold text-purple-300 flex items-center gap-1 mt-0.5">
                <Coins className="w-3 h-3 text-purple-400" />
                <span>{wallet.balanceMatic}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400">Authorized Role</div>
              <div className="font-bold text-emerald-400 truncate mt-0.5">Chief Engineer</div>
            </div>
          </div>

          {/* Switch Network */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-[11px]">
            <div className="text-[10px] text-slate-400">Target Settlement Network:</div>
            <div className="space-y-1">
              {(['Polygon Amoy', 'Arbitrum Sepolia', 'Hyperledger Besu (Gov Intranet)'] as BlockchainNetwork[]).map(
                (net) => (
                  <button
                    key={net}
                    onClick={() => handleSwitchNetwork(net)}
                    className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                      wallet.network === net
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{net}</span>
                    {wallet.network === net && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Block Explorer Link */}
          <a
            href={`https://amoy.polygonscan.com/address/${wallet.address}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors"
          >
            <span>View on Polygonscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
