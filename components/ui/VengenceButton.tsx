'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VengenceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VengenceButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: VengenceButtonProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 border-cyan-400/50 shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)]',
    secondary:
      'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-slate-800/90 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.15)] hover:shadow-[0_0_25px_rgba(0,217,255,0.35)]',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400/50 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]',
    success:
      'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-mono font-bold rounded-xl',
    md: 'px-4 py-2 text-xs font-mono font-bold rounded-xl',
    lg: 'px-6 py-3 text-sm font-sans font-bold rounded-2xl',
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 border font-bold transition-all duration-200 overflow-hidden cursor-pointer select-none group',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      {/* Radial Spotlight Overlay */}
      {isHovered && (
        <span
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.3), transparent 80%)`,
          }}
        />
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
