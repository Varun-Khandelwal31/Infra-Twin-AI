'use client';

import React from 'react';

export default function VengenceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Radial Ambient Light Aurora Beams */}
      <div className="absolute -top-[30%] -left-[20%] w-[800px] h-[800px] rounded-full bg-cyan-500/10 blur-[140px] animate-ray-sweep" />
      <div className="absolute top-[40%] -right-[20%] w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[150px] animate-ray-sweep" style={{ animationDelay: '-6s' }} />
      <div className="absolute -bottom-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-purple-600/08 blur-[160px] animate-ray-sweep" style={{ animationDelay: '-12s' }} />

      {/* Cybernetic Cyber Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
    </div>
  );
}
