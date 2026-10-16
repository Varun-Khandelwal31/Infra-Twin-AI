'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VengenceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'rose' | 'emerald' | 'amber' | 'purple';
  spotlight?: boolean;
}

export default function VengenceCard({
  children,
  className,
  glowColor = 'cyan',
  spotlight = true,
  ...props
}: VengenceCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowStyles = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_25px_rgba(0,217,255,0.12)] hover:shadow-[0_0_35px_rgba(0,217,255,0.3)]',
    rose: 'border-rose-500/30 hover:border-rose-400/60 shadow-[0_0_25px_rgba(239,68,68,0.12)] hover:shadow-[0_0_35px_rgba(239,68,68,0.3)]',
    emerald: 'border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]',
    amber: 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.12)] hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]',
    purple: 'border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.12)] hover:shadow-[0_0_35px_rgba(168,85,247,0.3)]',
  };

  const spotlightGlows = {
    cyan: 'rgba(0, 217, 255, 0.18)',
    rose: 'rgba(239, 68, 68, 0.18)',
    emerald: 'rgba(16, 185, 129, 0.18)',
    amber: 'rgba(245, 158, 11, 0.18)',
    purple: 'rgba(168, 85, 247, 0.18)',
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'relative rounded-2xl bg-[#0d1322]/90 backdrop-blur-xl border transition-all duration-300 overflow-hidden group',
        glowStyles[glowColor],
        className
      )}
      {...(props as any)}
    >
      {/* Vengeance UI Radial Spotlight Glow Layer */}
      {spotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightGlows[glowColor]}, transparent 75%)`,
          }}
        />
      )}

      {/* Cybernetic Corner Bracket Accents */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-2xl z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-2xl z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-2xl z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br-2xl z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Card Body */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
