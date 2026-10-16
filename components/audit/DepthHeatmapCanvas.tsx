'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Layers, Eye, RotateCw, Sliders, Compass, Sparkles } from 'lucide-react';
import { InspectionData } from '@/lib/mockInference';

interface DepthHeatmapCanvasProps {
  sample: InspectionData;
  flightAltitudeM?: number;
  depthScale?: number;
  onAltitudeChange?: (val: number) => void;
  onDepthScaleChange?: (val: number) => void;
}

export default function DepthHeatmapCanvas({
  sample,
  flightAltitudeM = 12.4,
  depthScale = 1.0,
  onAltitudeChange,
  onDepthScaleChange,
}: DepthHeatmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'top' | 'side'>('3d');
  const [pitch, setPitch] = useState(0.45);
  const [yaw, setYaw] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);

  // Dynamic GSD Calculation from Camera Optics & Altitude (Sony 24MP 3.76um, 24mm lens)
  const calculatedGsd = Number(((flightAltitudeM * 100 * 0.000376) / 2.4).toFixed(2));
  const currentMaxDepth = sample.metrics.maxDepthCm;
  const currentVolume = sample.metrics.volumeCum;

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || viewMode !== '3d') return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(0.1, Math.min(1.2, prev + dy * 0.008)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let autoRotation = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 340;
    };
    resize();
    window.addEventListener('resize', resize);

    const depthGrid = sample.depthGrid && sample.depthGrid.length > 0
      ? sample.depthGrid
      : Array.from({ length: 20 }, () => Array(20).fill(0));
    
    const rows = depthGrid.length;
    const cols = depthGrid[0]?.length || 20;
    const maxDepth = Math.max(currentMaxDepth, 1);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 15;

      ctx.clearRect(0, 0, w, h);

      // Ambient background with radial glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w / 1.2);
      bgGrad.addColorStop(0, '#0a101d');
      bgGrad.addColorStop(1, '#05080e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (viewMode === '3d' && !isDragging) {
        autoRotation += 0.004;
      }

      const currentYaw = yaw + autoRotation;
      const gridSpacing = 14;
      const halfW = (cols * gridSpacing) / 2;
      const halfH = (rows * gridSpacing) / 2;

      // Render 3D Extruded Depth Columns
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rawD = depthGrid[r]?.[c] ?? 0;
          const d = rawD * depthScale;

          // Thermal Color Interpolation: Blue (0cm) -> Cyan -> Yellow -> Red (maxDepth)
          const normDepth = Math.min(d / maxDepth, 1);
          let rCol = Math.round(normDepth * 239);
          let gCol = Math.round((1 - normDepth) * 200 + normDepth * 40);
          let bCol = Math.round((1 - normDepth) * 255);

          if (d <= 0.2) {
            rCol = 14;
            gCol = 24;
            bCol = 48; // Dark blue base pavement
          }

          let px = c * gridSpacing - halfW;
          let py = r * gridSpacing - halfH;
          let pz = d * 5.5 * depthScale; // Dynamic 3D depth extrusion height

          let screenX = cx;
          let screenY = cy;

          if (viewMode === '3d') {
            const cosY = Math.cos(currentYaw);
            const sinY = Math.sin(currentYaw);
            const rx = px * cosY - py * sinY;
            const ry = px * sinY + py * cosY;
            screenX = cx + rx;
            screenY = cy + ry * pitch + pz;
          } else if (viewMode === 'top') {
            screenX = cx + px;
            screenY = cy + py;
          } else if (viewMode === 'side') {
            screenX = cx + px;
            screenY = cy + pz * 2.2;
          }

          // Render 3D Column Top Face
          ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`;
          ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.35)`;
          ctx.lineWidth = 0.6;

          ctx.beginPath();
          ctx.rect(screenX, screenY, gridSpacing * 0.9, gridSpacing * 0.9);
          ctx.fill();
          ctx.stroke();

          // Render 3D Column Side Extrusion Wall if deep
          if (d > 0.5 && viewMode === '3d') {
            ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.35)`;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + gridSpacing * 0.9);
            ctx.lineTo(screenX + gridSpacing * 0.9, screenY + gridSpacing * 0.9);
            ctx.lineTo(screenX + gridSpacing * 0.9, screenY + gridSpacing * 0.9 + pz * 0.3);
            ctx.lineTo(screenX, screenY + gridSpacing * 0.9 + pz * 0.3);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sample, viewMode, pitch, yaw, isDragging, depthScale, currentMaxDepth]);

  return (
    <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-[#060a12] border border-cyan-500/25 shadow-cyan-glow card-3d-tilt flex flex-col justify-between">
      {/* Title Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-white font-display pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Box className="w-3.5 h-3.5" />
          </span>
          <span>Interactive 3D Pothole Volumetric Matrix</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow">
            GSD CALIBRATED: {calculatedGsd} cm/px • H: {flightAltitudeM.toFixed(1)}m AGL
          </span>

          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
            VOL: {currentVolume.toFixed(3)} m³
          </span>

          <button
            onClick={() => setShowControls(!showControls)}
            className="px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>{showControls ? 'Hide Calibrator' : 'Recalibrate 3D'}</span>
          </button>
        </div>
      </div>

      {/* Left Rainbow Thermal Depth Scale */}
      <div className="absolute top-14 left-4 z-20 flex items-center gap-2">
        <div className="w-3 h-44 rounded-full bg-gradient-to-t from-blue-600 via-cyan-400 via-yellow-400 to-rose-600 border border-slate-700 shadow-glass" />
        <div className="flex flex-col justify-between h-44 text-[10px] font-mono text-slate-300">
          <span className="text-rose-400 font-bold">{currentMaxDepth.toFixed(1)} cm</span>
          <span>{(currentMaxDepth * 0.8).toFixed(1)}</span>
          <span>{(currentMaxDepth * 0.6).toFixed(1)}</span>
          <span>{(currentMaxDepth * 0.4).toFixed(1)}</span>
          <span>{(currentMaxDepth * 0.2).toFixed(1)}</span>
          <span className="text-blue-400">0.0</span>
        </div>
      </div>

      {/* Real-time Dynamic Recalibration Sliders Bar (Altitude & Depth Extrusion) */}
      {showControls && (
        <div className="absolute top-14 right-4 z-20 w-64 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-2xl space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] text-cyan-400 font-bold uppercase">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>Optic &amp; Volumetric Calibrator</span>
            </span>
            <span>Real-Time</span>
          </div>

          {/* Slider 1: Flight Altitude */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Flight Altitude (AGL):</span>
              <span className="font-bold text-cyan-300">{flightAltitudeM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={5.0}
              max={40.0}
              step={0.5}
              value={flightAltitudeM}
              onChange={(e) => onAltitudeChange && onAltitudeChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>5m (Close)</span>
              <span>12.4m (Standard)</span>
              <span>40m (High AGL)</span>
            </div>
          </div>

          {/* Slider 2: Depth Extrusion Scale */}
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Depth Extrusion Scale:</span>
              <span className="font-bold text-rose-400">{depthScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.05}
              value={depthScale}
              onChange={(e) => onDepthScaleChange && onDepthScaleChange(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0.50x (Shallow)</span>
              <span>1.00x (Standard)</span>
              <span>2.50x (Deep)</span>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Controls (3D Mesh / Top View / Side View) */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            viewMode === '3d' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Mesh</span>
        </button>

        <button
          onClick={() => setViewMode('top')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            viewMode === 'top' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Top View</span>
        </button>

        <button
          onClick={() => setViewMode('side')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            viewMode === 'side' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Side View</span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-4 z-20 text-[10px] font-mono text-cyan-400/90 bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 pointer-events-none">
        <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" />
        <span>Click &amp; drag mouse to rotate 3D crater camera</span>
      </div>

      {/* Canvas with mouse drag listeners */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
