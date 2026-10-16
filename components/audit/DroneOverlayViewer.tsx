'use client';

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Camera,
  Sun,
  Contrast,
  Flame,
  Activity,
  Maximize2,
} from 'lucide-react';
import { InspectionData, InspectionImage } from '@/lib/mockInference';

interface DroneOverlayViewerProps {
  sample: InspectionData;
}

export default function DroneOverlayViewer({ sample }: DroneOverlayViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showMask, setShowMask] = useState(true);
  const [isThermalHeatmap, setIsThermalHeatmap] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const gallery = sample.galleryImages && sample.galleryImages.length > 0 
    ? sample.galleryImages 
    : [
        { id: 'g1', label: 'Overhead RGB Scan', type: 'RGB Drone' as const, url: sample.imageUrl },
        { id: 'g2', label: 'Thermal IR Scan', type: 'Thermal IR' as const, url: '/images/indian_pothole_1.png' },
        { id: 'g3', label: '45° Oblique View', type: 'Oblique 45°' as const, url: '/images/indian_flyover_joint_oblique.jpg' },
        { id: 'g4', label: 'Macro Pothole Close-up', type: 'Close-up Macro' as const, url: '/images/indian_pothole_severe_before.jpg' },
      ];

  const [selectedImage, setSelectedImage] = useState<InspectionImage>(gallery[0]);

  // Trigger scanline animation when sample or camera mode changes
  React.useEffect(() => {
    if (sample.galleryImages && sample.galleryImages.length > 0) {
      setSelectedImage(sample.galleryImages[0]);
    }
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 1200);
    return () => clearTimeout(timer);
  }, [sample]);

  return (
    <div className="relative w-full h-[390px] rounded-2xl overflow-hidden bg-[#0c111c] border border-cyan-500/25 shadow-glass group flex flex-col justify-between select-none">
      {/* Top Overlay Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-slate-200 pointer-events-auto">
          <span>AI Multi-Spectral Drone Feed</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            • {selectedImage.type}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsThermalHeatmap(!isThermalHeatmap)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              isThermalHeatmap
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-red-glow'
                : 'bg-slate-950/85 text-slate-300 border-slate-800 hover:text-cyan-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Thermal Colormap Mode</span>
          </button>
        </div>
      </div>

      {/* Left Floating Toolbar */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowMask(!showMask)}
          className={`p-2 rounded-lg transition-colors ${
            showMask ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-slate-800 hover:text-cyan-400'
          }`}
          title="Toggle Segmentation Mask"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Right Floating Toolbar */}
      <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300">
        <button
          onClick={() => setIsScanning(true)}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Trigger Laser Rescan"
        >
          <Activity className="w-4 h-4" />
        </button>
        <button
          onClick={() => setBrightness((b) => (b === 100 ? 125 : 100))}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Enhance Brightness"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setContrast((c) => (c === 100 ? 130 : 100))}
          className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title="Enhance Contrast"
        >
          <Contrast className="w-4 h-4" />
        </button>
      </div>

      {/* Main Active Image Viewport */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          filter: isThermalHeatmap
            ? `brightness(${brightness + 10}%) contrast(${contrast + 50}%) hue-rotate(170deg) saturate(250%)`
            : `brightness(${brightness}%) contrast(${contrast}%)`,
        }}
      >
        <img
          src={selectedImage.url}
          alt={selectedImage.label}
          className="w-full h-full object-cover"
        />

        {/* Laser Radar Scanline Sweeping Effect */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-cyan-glow animate-scanline" />
          </div>
        )}

        {/* Thermal Colormap Legend Bar (Shown when thermal heatmap mode is active) */}
        {isThermalHeatmap && (
          <div className="absolute top-16 left-16 z-20 p-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-rose-500/40 text-[10px] font-mono text-slate-200 flex items-center gap-2">
            <span>Thermal Colormap:</span>
            <div className="w-24 h-2.5 rounded bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-rose-600 border border-slate-700" />
            <span>Blue (0cm Edge) → Red ({sample.metrics.maxDepthCm}cm Core)</span>
          </div>
        )}

        {/* Electric Cyan/Red Segmentation Mask SVG Overlay */}
        {showMask && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
            <defs>
              <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={sample.segmentationPath}
              fill={isThermalHeatmap ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 217, 255, 0.18)'}
              stroke={isThermalHeatmap ? '#ef4444' : '#00d9ff'}
              strokeWidth="3.5"
              strokeDasharray="8, 4"
              filter="url(#cyanGlow)"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Bottom Multi-Image Camera Gallery Selector Bar */}
      <div className="relative z-20 p-2 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="text-[11px] font-mono text-slate-400 font-semibold px-2 shrink-0 hidden sm:block">
          Camera Viewports ({gallery.length}):
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end overflow-x-auto">
          {gallery.map((img) => {
            const isSelected = selectedImage.id === img.id;
            return (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all text-left shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-glow'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="flex flex-col text-[10px] pr-1">
                  <span className="font-bold truncate max-w-[100px]">{img.type}</span>
                  <span className="text-[9px] text-slate-400 font-mono truncate max-w-[100px]">{img.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
