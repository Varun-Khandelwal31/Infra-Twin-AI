'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Layers, Box, Cpu, Sparkles, Eye, ShieldAlert } from 'lucide-react';

export default function Hero3DRoad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSlice, setActiveSlice] = useState<'3d' | 'contour' | 'mesh'>('3d');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 480;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // 3D Rendering Engine
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2 + mousePos.x * 25;
      const cy = h / 2 + mousePos.y * 25;

      ctx.clearRect(0, 0, w, h);

      // Background glowing ambient gradients
      const bgGrad = ctx.createRadialGradient(cx, cy + 20, 10, cx, cy + 20, w / 1.3);
      bgGrad.addColorStop(0, 'rgba(0, 217, 255, 0.16)');
      bgGrad.addColorStop(0.35, 'rgba(15, 23, 42, 0.5)');
      bgGrad.addColorStop(1, 'rgba(10, 14, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      rotation += 0.005;

      // Base Road Surface Height in 3D coordinate space
      const roadY = 40;
      const zCenter = 350;

      // Draw 3D Perspective Road Surface Grid
      const numGridLines = 26;
      const gridWidth = 460;
      const gridLength = 520;

      ctx.lineWidth = 1;

      for (let i = -numGridLines / 2; i <= numGridLines / 2; i++) {
        const xOffset = i * (gridWidth / numGridLines);

        const cosR = Math.cos(rotation * 0.35 + mousePos.x * 0.8);
        const sinR = Math.sin(rotation * 0.35 + mousePos.x * 0.8);

        const x1 = xOffset * cosR - (-gridLength / 2) * sinR;
        const z1 = xOffset * sinR + (-gridLength / 2) * cosR + zCenter;

        const x2 = xOffset * cosR - (gridLength / 2) * sinR;
        const z2 = xOffset * sinR + (gridLength / 2) * cosR + zCenter;

        if (z1 > 50 && z2 > 50) {
          const px1 = cx + (x1 * 400) / z1;
          const py1 = cy + (roadY * 400) / z1;
          const px2 = cx + (x2 * 400) / z2;
          const py2 = cy + (roadY * 400) / z2;

          ctx.strokeStyle = i % 4 === 0 ? 'rgba(0, 217, 255, 0.22)' : 'rgba(30, 41, 59, 0.35)';
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }
      }

      // Pre-compute 3D Mesh Vertices for Volumetric Downward Pothole Cavity
      const numRings = 15;
      const ptsPerRing = 36;
      const meshGrid: { screenX: number; screenY: number; px3D: number; py3D: number; pz3D: number; depthFactor: number }[][] = [];

      for (let r = 1; r <= numRings; r++) {
        const ringPoints = [];
        const ratio = r / numRings; // 1/15 (bottom core) -> 1.0 (outer rim)
        const radius = ratio * 155;

        // Downward Depth Displacement:
        // Outer rim (ratio = 1) is at road surface (depth = 0)
        // Center core (ratio -> 0) is DEEPEST into the road cavity (depth = +75px downward)
        const depthFactor = 1 - ratio; // 0 at rim, ~0.93 at deep bottom
        const downwardDepth = Math.pow(depthFactor, 1.35) * 75; // Downward depth displacement (+Y is down into ground)
        const py3D = roadY + downwardDepth;

        for (let p = 0; p <= ptsPerRing; p++) {
          const angle = (p / ptsPerRing) * Math.PI * 2 + rotation * 0.6;
          // Organic road distress noise along perimeter
          const noise = (Math.sin(angle * 5 + r * 1.5) * 6 + Math.cos(angle * 7) * 4) * ratio;
          const curRadius = Math.max(3, radius + noise);

          const px3D = Math.cos(angle) * curRadius;
          const pz3D = Math.sin(angle) * curRadius * 0.88 + zCenter;

          const screenX = cx + (px3D * 400) / pz3D;
          const screenY = cy + (py3D * 400) / pz3D;

          ringPoints.push({ screenX, screenY, px3D, py3D, pz3D, depthFactor });
        }
        meshGrid.push(ringPoints);
      }

      // Draw Radial Wireframe Ribs (from outer surface rim down into bottom cavity)
      if (activeSlice === 'mesh' || activeSlice === '3d') {
        const spokeStep = 3;
        for (let p = 0; p < ptsPerRing; p += spokeStep) {
          ctx.beginPath();
          for (let r = numRings - 1; r >= 0; r--) {
            const pt = meshGrid[r][p];
            if (r === numRings - 1) ctx.moveTo(pt.screenX, pt.screenY);
            else ctx.lineTo(pt.screenX, pt.screenY);
          }
          ctx.strokeStyle = activeSlice === 'mesh' ? 'rgba(0, 217, 255, 0.45)' : 'rgba(0, 217, 255, 0.18)';
          ctx.lineWidth = activeSlice === 'mesh' ? 1.2 : 0.8;
          ctx.stroke();
        }
      }

      // Draw Concentric Depth Rings (Contours / Mesh)
      // Render from deep bottom up to outer rim (or outer rim down)
      for (let r = 0; r < numRings; r++) {
        const ring = meshGrid[r];
        const depthFactor = ring[0].depthFactor; // 0.0 (rim) -> 0.93 (bottom core)

        ctx.beginPath();
        for (let p = 0; p <= ptsPerRing; p++) {
          const pt = ring[p];
          if (p === 0) ctx.moveTo(pt.screenX, pt.screenY);
          else ctx.lineTo(pt.screenX, pt.screenY);
        }
        ctx.closePath();

        // Color Interpolation: 0cm Rim (Cyan) -> 7cm Mid (Yellow/Amber) -> 15cm Core (Red)
        let rCol: number, gCol: number, bCol: number;
        if (depthFactor < 0.5) {
          const k = depthFactor / 0.5;
          rCol = Math.round(k * 245);
          gCol = Math.round(217 + k * (190 - 217));
          bCol = Math.round(255 * (1 - k * 0.9));
        } else {
          const k = (depthFactor - 0.5) / 0.5;
          rCol = Math.round(245 + k * (239 - 245));
          gCol = Math.round(190 * (1 - k) + 50 * k);
          bCol = Math.round(25 * (1 - k) + 68 * k);
        }

        if (activeSlice === 'contour') {
          rCol = Math.round(depthFactor * 240);
          gCol = Math.round((1 - depthFactor) * 217);
          bCol = Math.round((1 - depthFactor) * 255);
        }

        const alpha = 0.35 + depthFactor * 0.6;
        ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`;
        ctx.shadowColor = `rgba(${rCol}, ${gCol}, ${bCol}, 0.8)`;
        ctx.shadowBlur = activeSlice === 'mesh' ? 3 : (8 + depthFactor * 10);
        ctx.lineWidth = activeSlice === 'mesh' ? 1.1 : (1.4 + depthFactor * 1.2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Bottom Cavity Core Depth Marker (Deepest Pit Point)
      const bottomCenter = meshGrid[0][0];
      if (bottomCenter) {
        const pitX = cx;
        const pitY = cy + ((roadY + 75) * 400) / zCenter;

        // Glowing Core Reticle
        ctx.beginPath();
        ctx.arc(pitX, pitY, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulsing Depth Ring at bottom
        const pulseR = 12 + Math.sin(rotation * 4) * 4;
        ctx.beginPath();
        ctx.arc(pitX, pitY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vertical Downward Depth Measurement Line from Road Surface to Pit Base
        const surfaceY = cy + (roadY * 400) / zCenter;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pitX, surfaceY);
        ctx.lineTo(pitX, pitY);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Surface Depth Anchor Point
        ctx.beginPath();
        ctx.arc(pitX, surfaceY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00d9ff';
        ctx.fill();
      }

      // Animated Glowing Laser Scan Beam
      const scanPhase = (Math.sin(rotation * 2.2) + 1) / 2; // 0 to 1
      const scanZ = zCenter - 140 + scanPhase * 280;
      const scanY = cy + (roadY * 400) / scanZ;

      const scanGrad = ctx.createLinearGradient(cx - 220, scanY, cx + 220, scanY);
      scanGrad.addColorStop(0, 'rgba(0, 217, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 217, 255, 0.9)');
      scanGrad.addColorStop(1, 'rgba(0, 217, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(cx - 240, scanY);
      ctx.lineTo(cx + 240, scanY);
      ctx.strokeStyle = scanGrad;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00d9ff';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Floating Telemetry Callout Box 1 (Right)
      ctx.fillStyle = 'rgba(11, 17, 30, 0.92)';
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.6)';
      ctx.lineWidth = 1;

      const badgeX = cx + 70;
      const badgeY = cy - 100;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, 190, 64, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px Space Grotesk, sans-serif';
      ctx.fillStyle = '#00d9ff';
      ctx.fillText('YOLOv8 + Monocular Depth', badgeX + 14, badgeY + 22);

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Max Depth: 15.0cm (Downward)', badgeX + 14, badgeY + 40);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('• High Cavity Distress', badgeX + 14, badgeY + 54);

      // Draw Floating Telemetry Callout Box 2 (Left)
      const badge2X = cx - 220;
      const badge2Y = cy + 40;
      ctx.beginPath();
      ctx.roundRect(badge2X, badge2Y, 160, 50, 10);
      ctx.fillStyle = 'rgba(11, 17, 30, 0.92)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 10px Space Grotesk, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ Volumetric Audit', badge2X + 12, badge2Y + 20);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Volume: 0.375 m³ Void', badge2X + 12, badge2Y + 38);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSlice, mousePos]);

  return (
    <div className="relative w-full h-[480px] rounded-3xl overflow-hidden bg-slate-950/80 border border-cyan-500/30 shadow-cyan-glow flex flex-col justify-between p-4 group">
      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-cyan-glow">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Interactive 3D Spatial Matrix</span>
        </div>

        {/* View Slice Mode Selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSlice('3d')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeSlice === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Mesh
          </button>
          <button
            onClick={() => setActiveSlice('contour')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeSlice === 'contour'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Contours
          </button>
          <button
            onClick={() => setActiveSlice('mesh')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeSlice === 'mesh'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wireframe
          </button>
        </div>
      </div>

      {/* Main WebGL/Canvas Viewport */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" />

      {/* Bottom Telemetry Legend */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Move mouse to tilt perspective grid</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-cyan-400">0cm Rim</span>
          <span className="text-amber-400">7cm Mid</span>
          <span className="text-rose-400 font-bold">15cm Core</span>
        </div>
      </div>
    </div>
  );
}
