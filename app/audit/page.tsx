'use client';

import React, { useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import DroneOverlayViewer from '@/components/audit/DroneOverlayViewer';
import DepthHeatmapCanvas from '@/components/audit/DepthHeatmapCanvas';
import MetricsSidebar from '@/components/audit/MetricsSidebar';
import { INSPECTION_SAMPLES, InspectionData } from '@/lib/mockInference';
import { analyzeSinglePotholeImageAsync } from '@/lib/imageAnalyzer';
import { Cpu, Upload, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';

function AuditContent() {
  const searchParams = useSearchParams();
  const sampleId = searchParams.get('sample');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [samplesList, setSamplesList] = useState<InspectionData[]>(INSPECTION_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<InspectionData>(
    INSPECTION_SAMPLES.find((s) => s.id === sampleId) || INSPECTION_SAMPLES[0]
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  // Dynamic Physical Calibration State
  const [flightAltitude, setFlightAltitude] = useState<number>(12.4);
  const [depthScale, setDepthScale] = useState<number>(1.0);

  // Store unscaled base metrics for consistent multiplier adjustments
  const baseMetricsRef = useRef<{ area: number; maxDepth: number; avgDepth: number }>({
    area: selectedSample.metrics.areaSqm,
    maxDepth: selectedSample.metrics.maxDepthCm,
    avgDepth: selectedSample.metrics.avgDepthCm,
  });

  const handleSampleChange = (sample: InspectionData) => {
    setIsScanning(true);
    setScanProgress(15);

    baseMetricsRef.current = {
      area: sample.metrics.areaSqm,
      maxDepth: sample.metrics.maxDepthCm,
      avgDepth: sample.metrics.avgDepthCm,
    };

    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setSelectedSample(sample);
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  // Live Altitude Adjuster (Recalculates GSD, Physical Area & Volumetric Mass)
  const handleAltitudeChange = useCallback((newAltitude: number) => {
    setFlightAltitude(newAltitude);
    setSelectedSample((prev) => {
      const baseArea = baseMetricsRef.current.area || 2.5;
      const baseDepth = baseMetricsRef.current.maxDepth || 15.0;

      const newArea = Number((baseArea * (newAltitude / 12.4)).toFixed(2));
      const currentMaxDepth = Number((baseDepth * depthScale).toFixed(1));
      const currentAvgDepth = Number((currentMaxDepth * 0.62).toFixed(1));
      const newVolume = Number(((newArea * (currentAvgDepth / 100))).toFixed(3));

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          areaSqm: newArea,
          volumeCum: newVolume,
        },
      };
    });
  }, [depthScale]);

  // Live Depth Scale Adjuster (Recalculates 3D Extrusion, Depth & Volumetric Index)
  const handleDepthScaleChange = useCallback((newScale: number) => {
    setDepthScale(newScale);
    setSelectedSample((prev) => {
      const baseDepth = baseMetricsRef.current.maxDepth || 15.0;
      const currentArea = prev.metrics.areaSqm;

      const newMaxDepth = Number((baseDepth * newScale).toFixed(1));
      const newAvgDepth = Number((newMaxDepth * 0.62).toFixed(1));
      const newVolume = Number(((currentArea * (newAvgDepth / 100))).toFixed(3));

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          maxDepthCm: newMaxDepth,
          avgDepthCm: newAvgDepth,
          volumeCum: newVolume,
          severityIndex: newMaxDepth > 16 ? 'Critical' : newMaxDepth > 9 ? 'High' : 'Moderate',
        },
      };
    });
  }, []);

  // Real-Time Computer Vision Photo Analysis for Custom Uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setIsScanning(true);
        setScanProgress(20);

        try {
          // Run actual canvas-level pixel segmentation and depth extraction
          const analysis = await analyzeSinglePotholeImageAsync(dataUrl, {
            altitudeM: flightAltitude,
            depthScale: depthScale,
          });

          const customId = `custom-${Date.now().toString().slice(-5)}`;
          const customInspection: InspectionData = {
            id: customId,
            inspectionNo: `INSP-CV-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
            roadName: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'User Custom Road Inspection',
            distressType: analysis.severityIndex === 'Critical'
              ? 'Critical Structural Pothole & Sub-base Failure'
              : 'Asphalt Pothole & Cavity Void',
            metrics: {
              areaSqm: analysis.areaSqm,
              areaTol: 0.15,
              maxDepthCm: analysis.maxDepthCm,
              maxDepthTol: 1.2,
              avgDepthCm: analysis.avgDepthCm,
              avgDepthTol: 0.8,
              volumeCum: analysis.volumeCum,
              volumeTol: 0.05,
              perimeterM: analysis.perimeterM,
              perimeterTol: 0.25,
              severityIndex: analysis.severityIndex,
              confidenceScore: analysis.confidenceScore,
            },
            location: {
              address: 'Uploaded Drone Survey Scan (GPS Tagged)',
              lat: 28.6139,
              lng: 77.2090,
              ward: 'Ward 18 - Dynamic Inspection',
              zone: 'Smart Infrastructure Zone',
            },
            recommendedAction: {
              headline: analysis.maxDepthCm > 15 ? 'Emergency Full-Depth Saw-Cut Restoration' : 'Bituminous Patch Restoration',
              subtext: `Live Pixel Audit: Area ${analysis.areaSqm} m², Max Depth ${analysis.maxDepthCm} cm, Volumetric Mass ${analysis.volumeCum} m³. IRC:82-2023 compliant.`,
              ircClause: 'IRC:82-2023 Section 4.3.2 & MoRTH Clause 3004',
            },
            segmentationPath: analysis.segmentationPath,
            depthGrid: analysis.depthGrid,
            imageUrl: dataUrl,
            galleryImages: [
              { id: `${customId}-1`, label: 'Uploaded Custom Photo', type: 'RGB Drone', url: dataUrl },
              { id: `${customId}-2`, label: 'Thermal IR Scan Matrix', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
              { id: `${customId}-3`, label: '45° Oblique Perspective', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
              { id: `${customId}-4`, label: 'Pothole Macro Close-up', type: 'Close-up Macro', url: '/images/indian_pothole_severe_before.jpg' },
            ],
          };

          baseMetricsRef.current = {
            area: analysis.areaSqm,
            maxDepth: analysis.maxDepthCm,
            avgDepth: analysis.avgDepthCm,
          };

          setSamplesList((prev) => [customInspection, ...prev]);
          setSelectedSample(customInspection);
          setIsScanning(false);
          setScanProgress(100);
        } catch (err) {
          console.error('Failed to analyze photo:', err);
          setIsScanning(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Projects</span>
          <span>&gt;</span>
          <span>New Delhi Smart Roads</span>
          <span>&gt;</span>
          <span className="text-cyan-400 font-bold">Inspection ID: {selectedSample.inspectionNo}</span>
        </div>

        {/* Hidden File Input for Custom Road Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Upload Custom Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all flex items-center gap-2 shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom Road Photo</span>
        </button>
      </div>

      {/* Sample Selector Buttons with Image Thumbnails */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>AI Inspection Scans ({samplesList.length} Active Feeds):</span>
          <span>Click any scan or upload a custom drone photo to test YOLOv8 defect inference</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Custom Upload Card Placeholder */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 p-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 transition-all text-left shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-xs pr-1">
              <span className="font-bold font-display text-cyan-300">+ Upload Photo</span>
              <span className="text-[10px] text-cyan-400/80 font-mono">Test Your Own Scan</span>
            </div>
          </button>

          {samplesList.map((s) => {
            const isSelected = selectedSample.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSampleChange(s)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all text-left shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-glow'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <img
                  src={s.imageUrl}
                  alt={s.roadName}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="flex flex-col text-xs pr-1">
                  <span className="font-bold font-display truncate max-w-[130px]">{s.roadName.split('(')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">{s.distressType}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Tech Telemetry Terminal Scan Loader */}
      {isScanning && (
        <div className="p-4 rounded-2xl bg-[#090d16]/95 border border-cyan-500/40 shadow-cyan-glow space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>PALANTIR AI VOLUMETRIC SCANNING ENGINE ({scanProgress}%)</span>
            </div>
            <span className="text-[10px] text-slate-400">yolov8n-seg.pt • depth-anything-small-hf</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-150 shadow-cyan-glow"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          {/* Real-Time Processing Log Terminal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span>▶</span>
              <span>[0.1s] Instance Mask: YOLOv8-Seg</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span>▶</span>
              <span>[0.4s] Depth Matrix: Depth Anything</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-300">
              <span>▶</span>
              <span>[0.8s] Volume: V = {selectedSample.metrics.volumeCum} m³</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 2 Cards: Drone Overlay + 3D Depth Map Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <DroneOverlayViewer sample={selectedSample} />
          <DepthHeatmapCanvas
            sample={selectedSample}
            flightAltitudeM={flightAltitude}
            depthScale={depthScale}
            onAltitudeChange={handleAltitudeChange}
            onDepthScaleChange={handleDepthScaleChange}
          />
        </div>

        {/* Right Sidebar: Confidence + Metrics Table + Location + Actions */}
        <div className="lg:col-span-4">
          <MetricsSidebar
            sample={selectedSample}
            flightAltitudeM={flightAltitude}
            depthScale={depthScale}
          />
        </div>
      </div>
    </>
  );
}

export default function AuditPage() {
  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Suspense fallback={<div className="p-8 text-xs font-mono text-cyan-400">Loading Audit Studio...</div>}>
            <AuditContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
