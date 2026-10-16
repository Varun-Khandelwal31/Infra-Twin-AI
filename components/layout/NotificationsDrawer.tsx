'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Route,
  X,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'fraud' | 'uav' | 'pci' | 'system';
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🚨 Payment Freeze Triggered',
    message: 'Buildcon Highways escrow payment ₹14.5L frozen due to 22.4% asphalt volume deficit on Outer Ring Road.',
    type: 'fraud',
    time: '4 mins ago',
    read: false,
    link: '/fraud-detection',
  },
  {
    id: 'notif-2',
    title: '🚁 UAV Sortie DR-908 Airborne',
    message: 'Matrice 300 RTK drone deployed for Zone 1 South Delhi inspection run.',
    type: 'uav',
    time: '12 mins ago',
    read: false,
    link: '/dashboard',
  },
  {
    id: 'notif-3',
    title: '⚠️ Critical Pothole Segmented',
    message: 'YOLOv8 detected 4.1 sqm void (Depth 18.2cm) on IIT Flyover Corridor.',
    type: 'pci',
    time: '28 mins ago',
    read: false,
    link: '/audit?sample=sample-2',
  },
  {
    id: 'notif-4',
    title: '🛡️ CodeMate AI Audit Passed',
    message: 'OWASP security and static code health score evaluated at 98/100 (A+).',
    type: 'system',
    time: '1 hour ago',
    read: true,
    link: '/settings',
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl bg-[#0c121f] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,217,255,0.15)] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white font-display">System Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Feed */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No active alerts. All systems operational.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl transition-all relative group flex flex-col gap-1.5 ${
                  notif.read ? 'opacity-70 hover:opacity-100 hover:bg-slate-900/40' : 'bg-slate-900/60 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                    <span>{notif.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500">{notif.time}</span>
                    <button
                      onClick={(e) => dismissNotification(notif.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all"
                      title="Dismiss alert"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{notif.message}</p>

                {notif.link && (
                  <Link
                    href={notif.link}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    <span>View in module</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Live telemetry sync: Active</span>
            <button
              onClick={clearAll}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[10px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
