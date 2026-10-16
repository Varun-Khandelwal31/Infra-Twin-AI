'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bot,
  ShieldAlert,
  Route,
  Activity,
  Layers,
  Users,
  Settings,
  TrendingUp,
  Cpu,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Action' | 'Smart Road' | 'Contractor Audit';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  url?: string;
  action?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commandItems: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      category: 'Navigation',
      title: 'Command Center Dashboard',
      subtitle: 'Real-time telemetry, IST clock, drone sorties',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      url: '/dashboard',
    },
    {
      id: 'nav-audit',
      category: 'Navigation',
      title: 'AI Audit Studio',
      subtitle: 'Volumetric drone scans, YOLOv8 segmentation & 3D matrix',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      url: '/audit',
    },
    {
      id: 'nav-copilot',
      category: 'Navigation',
      title: 'Nirman Copilot (GenAI BOQ)',
      subtitle: 'IRC:82-2023 compliant BOQ generator powered by Llama-3',
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
      url: '/copilot',
    },
    {
      id: 'nav-fraud',
      category: 'Navigation',
      title: 'Contractor SLA & Fraud Audit',
      subtitle: 'Before/after scan comparison & automated payment freeze',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      url: '/fraud-detection',
    },
    {
      id: 'nav-map',
      category: 'Navigation',
      title: 'Spatial Digital Twin Map',
      subtitle: 'Interactive 3D smart city map for Delhi & Pan-India',
      icon: <Route className="w-4 h-4 text-cyan-400" />,
      url: '/map',
    },
    {
      id: 'nav-predictive',
      category: 'Navigation',
      title: 'Predictive Maintenance Forecast',
      subtitle: '6-36 month budget forecasting & degradation models',
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      url: '/predictive',
    },
    {
      id: 'nav-issues',
      category: 'Navigation',
      title: 'Road Issues & Distress Logs',
      subtitle: 'Citywide detected pothole and crack tickets',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
      url: '/issues',
    },
    {
      id: 'nav-work-orders',
      category: 'Navigation',
      title: 'Contractor Work Orders',
      subtitle: 'Tender dispatch, escrow holds & execution tracking',
      icon: <Layers className="w-4 h-4 text-teal-400" />,
      url: '/work-orders',
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      title: 'Analytics & PCI Trends',
      subtitle: 'Multi-ward degradation curves and contractor leaderboards',
      icon: <Activity className="w-4 h-4 text-indigo-400" />,
      url: '/analytics',
    },
    {
      id: 'nav-assets',
      category: 'Navigation',
      title: 'Infrastructure Asset Inventory',
      subtitle: 'Drone fleet, thermal sensors, pavement registry',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      url: '/assets',
    },
    {
      id: 'nav-team',
      category: 'Navigation',
      title: 'Audit & Operations Team',
      subtitle: 'Municipal engineers, UAV flight leads, roster',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      url: '/team',
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      title: 'System Settings & CodeMate AI',
      subtitle: 'YOLOv8 confidence, depth calibration, OWASP security',
      icon: <Settings className="w-4 h-4 text-cyan-400" />,
      url: '/settings',
    },

    // Sample Roads
    {
      id: 'road-delhi-iit',
      category: 'Smart Road',
      title: 'Outer Ring Road (IIT Flyover Delhi)',
      subtitle: 'Critical Pothole • 4.1 sqm • Depth 18.2cm',
      icon: <Route className="w-4 h-4 text-rose-400" />,
      url: '/audit?sample=sample-2',
    },
    {
      id: 'road-delhi-cp',
      category: 'Smart Road',
      title: 'Connaught Place Outer Circle',
      subtitle: 'Water-Bound Pothole • 2.5 sqm • Depth 15.0cm',
      icon: <Route className="w-4 h-4 text-amber-400" />,
      url: '/audit?sample=sample-1',
    },
    {
      id: 'road-mumbai-weh',
      category: 'Smart Road',
      title: 'Western Express Highway (Andheri)',
      subtitle: 'MMRDA Corridor • 5.8 sqm • Depth 19.5cm',
      icon: <Route className="w-4 h-4 text-rose-400" />,
      url: '/audit?sample=sample-2',
    },

    // Quick Actions
    {
      id: 'action-freeze',
      category: 'Action',
      title: 'Freeze Escrow Payment on GeM / PFMS',
      subtitle: 'Lock contractor funds due to material deficit',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      url: '/fraud-detection',
    },
    {
      id: 'action-boq',
      category: 'Action',
      title: 'Generate Pan-India IRC:82 BOQ',
      subtitle: 'AI estimation for high-traffic bitumen repair',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      url: '/copilot',
    },
  ];

  const filteredItems = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.url) {
      router.push(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c121f] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden z-10 flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80 gap-3 bg-slate-900/50">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a module, city, road, or action (e.g. Copilot, Freeze, Mumbai)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              No matching modules or actions found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/40 shadow-cyan-glow'
                      : 'text-slate-300 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold font-sans flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                      isSelected ? 'opacity-100 text-cyan-400' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
