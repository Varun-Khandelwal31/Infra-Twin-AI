'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Sparkles,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CommandPalette from '@/components/layout/CommandPalette';
import NotificationsDrawer from '@/components/layout/NotificationsDrawer';
import WalletConnectButton from '@/components/web3/WalletConnectButton';
import { triggerPrint } from '@/lib/exportUtils';

export default function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Keyboard Listener for ⌘ K / Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage('✓ Showcase URL copied to clipboard!');
        setTimeout(() => setToastMessage(null), 3500);
      }).catch(() => {
        setToastMessage('✓ Audit Link ready for sharing!');
        setTimeout(() => setToastMessage(null), 3500);
      });
    }
  };

  const handleDownloadReport = () => {
    setToastMessage('Preparing Executive Smart City Audit Report (PDF)...');
    setTimeout(() => {
      triggerPrint();
      setToastMessage(null);
    }, 600);
  };

  if (isLandingPage) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-[#0a0e17]/80 backdrop-blur-md border-b border-cyan-500/20 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:shadow-cyan-glow transition-all">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white font-display tracking-tight">
                InfraTwin <span className="text-cyan-400">AI</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Command Center</Link>
            <Link href="/audit" className="hover:text-cyan-400 transition-colors">AI Studio</Link>
            <Link href="/map" className="hover:text-cyan-400 transition-colors">Digital Twin</Link>
            <Link href="/copilot" className="hover:text-cyan-400 transition-colors">Nirman Copilot</Link>
            <Link href="/fraud-detection" className="hover:text-cyan-400 transition-colors">SLA Verification</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 border border-slate-700">⌘ K</kbd>
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-xs hover:shadow-cyan-glow transition-all duration-300 flex items-center gap-2"
            >
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </header>

        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="h-14 bg-[#0a0e17]/90 backdrop-blur-md border-b border-cyan-500/20 px-6 flex items-center justify-between shrink-0 z-20 vengence-glass-dock relative">
        {/* Left Pill Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-cyan-500/30 text-xs font-mono">
            <Link
              href="/audit"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow' : 'text-slate-400 hover:text-white'
              )}
            >
              AI Audit Studio
            </Link>
            <Link
              href="/map"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/map' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow' : 'text-slate-400 hover:text-white'
              )}
            >
              Digital Twin
            </Link>
            <Link
              href="/sla-verification"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/sla-verification' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow' : 'text-slate-400 hover:text-white'
              )}
            >
              SLA Scan
            </Link>
            <Link
              href="/copilot"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/copilot' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow' : 'text-slate-400 hover:text-white'
              )}
            >
              Nirman Copilot
            </Link>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-3 text-xs">
          {/* Search Command Trigger (⌘ K) */}
          <div className="relative hidden sm:flex items-center">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center justify-between w-56 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 transition-all font-sans text-xs"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Search telemetry...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Date Stamp */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Delhi Smart Zone</span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleDownloadReport}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
            title="Download Executive Report (PDF)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors relative"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {/* Web3 Auditor Wallet Connection */}
          <WalletConnectButton />

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 hover:shadow-cyan-glow transition-all flex items-center gap-1.5 font-mono text-xs font-bold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Audit</span>
          </button>
        </div>
      </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold shadow-cyan-glow flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <NotificationsDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
