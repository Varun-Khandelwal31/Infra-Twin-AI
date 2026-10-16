'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Calendar,
  Layers,
  Activity,
  ExternalLink,
  Bot,
  Globe,
  Info,
  HelpCircle,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export interface RoadFeature {
  id: string;
  name: string;
  city: string;
  ward: string;
  status: string;
  trafficVolume: string;
  potholesCount: number;
  inspectionId: string;
  historicalScores: number[];
  coordinates: [number, number][]; // [lng, lat]
}

function parseGeoJSONFeatures(geojson: any): RoadFeature[] {
  if (!geojson || !Array.isArray(geojson.features)) return [];
  return geojson.features.map((f: any) => ({
    id: f.id || f.properties?.id || `road-${Math.random()}`,
    name: f.properties?.name || 'Unknown Pavement Stretch',
    city: f.properties?.city || 'Delhi',
    ward: f.properties?.ward || 'Municipal Zone',
    status: f.properties?.status || 'Fair',
    trafficVolume: f.properties?.trafficVolume || '4,500 PCU/hr',
    potholesCount: f.properties?.potholesCount ?? 0,
    inspectionId: f.properties?.inspectionId || 'IR-2025-05-27-1045',
    historicalScores: f.properties?.historicalScores || [80, 78, 75, 72, 70, 68],
    coordinates: f.geometry?.coordinates || [],
  }));
}

export interface ScannedPotholePin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: 'Delhi' | 'Mumbai' | 'Bengaluru' | 'Hyderabad' | 'Pune' | 'Chennai' | 'Kolkata' | 'Expressways';
  color: 'green' | 'yellow' | 'red';
  status: 'Good' | 'Fair' | 'Critical';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  areaSqm: number;
  maxDepthCm: number;
  volumeCum: number;
  sampleId: string;
}

const PAN_INDIA_PINS: ScannedPotholePin[] = [
  // Delhi NCR
  {
    id: 'pin-del-1',
    name: 'Outer Ring Road (IIT Flyover)',
    lat: 28.5480,
    lng: 77.1850,
    city: 'Delhi',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 4.1,
    maxDepthCm: 18.2,
    volumeCum: 0.746,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-del-2',
    name: 'Connaught Place Outer Circle',
    lat: 28.6330,
    lng: 77.2140,
    city: 'Delhi',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 2.5,
    maxDepthCm: 15.0,
    volumeCum: 0.375,
    sampleId: 'sample-1',
  },
  {
    id: 'pin-del-3',
    name: 'Dwarka Expressway Sector 21',
    lat: 28.5520,
    lng: 77.0580,
    city: 'Delhi',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.7,
    maxDepthCm: 3.5,
    volumeCum: 0.024,
    sampleId: 'sample-3',
  },

  // Mumbai MMR
  {
    id: 'pin-bom-1',
    name: 'Western Express Highway (Andheri Flyover)',
    lat: 19.1240,
    lng: 72.8580,
    city: 'Mumbai',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 5.8,
    maxDepthCm: 19.5,
    volumeCum: 1.131,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-bom-2',
    name: 'Bandra-Worli Sea Link Approach',
    lat: 19.0300,
    lng: 72.8160,
    city: 'Mumbai',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.9,
    maxDepthCm: 4.0,
    volumeCum: 0.036,
    sampleId: 'sample-3',
  },
  {
    id: 'pin-bom-3',
    name: 'Eastern Freeway Chembur Elevated',
    lat: 19.0620,
    lng: 72.8940,
    city: 'Mumbai',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 2.9,
    maxDepthCm: 11.0,
    volumeCum: 0.319,
    sampleId: 'sample-1',
  },

  // Bengaluru
  {
    id: 'pin-blr-1',
    name: 'Outer Ring Road (Bellandur EcoSpace)',
    lat: 12.9380,
    lng: 77.6830,
    city: 'Bengaluru',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 6.2,
    maxDepthCm: 21.0,
    volumeCum: 1.302,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-blr-2',
    name: 'Silk Board Junction Flyover Ramp',
    lat: 12.9180,
    lng: 77.6250,
    city: 'Bengaluru',
    color: 'red',
    status: 'Critical',
    severity: 'High',
    areaSqm: 4.3,
    maxDepthCm: 16.5,
    volumeCum: 0.709,
    sampleId: 'sample-1',
  },
  {
    id: 'pin-blr-3',
    name: 'Electronic City Elevated Highway',
    lat: 12.8620,
    lng: 77.6520,
    city: 'Bengaluru',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.8,
    maxDepthCm: 3.8,
    volumeCum: 0.030,
    sampleId: 'sample-3',
  },

  // Hyderabad
  {
    id: 'pin-hyd-1',
    name: 'HITEC City Cyber Towers Corridor',
    lat: 17.4470,
    lng: 78.3820,
    city: 'Hyderabad',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.4,
    maxDepthCm: 14.0,
    volumeCum: 0.476,
    sampleId: 'sample-1',
  },
  {
    id: 'pin-hyd-2',
    name: 'Nehru Outer Ring Road (Gachibowli)',
    lat: 17.4200,
    lng: 78.3580,
    city: 'Hyderabad',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.6,
    maxDepthCm: 3.2,
    volumeCum: 0.019,
    sampleId: 'sample-3',
  },

  // Pune
  {
    id: 'pin-pun-1',
    name: 'Hinjewadi IT Park Phase 1 Main Road',
    lat: 18.5880,
    lng: 73.7460,
    city: 'Pune',
    color: 'red',
    status: 'Critical',
    severity: 'High',
    areaSqm: 4.8,
    maxDepthCm: 17.5,
    volumeCum: 0.840,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-pun-2',
    name: 'FC Road Deccan Gymkhana',
    lat: 18.5186,
    lng: 73.8415,
    city: 'Pune',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 2.3,
    maxDepthCm: 9.5,
    volumeCum: 0.218,
    sampleId: 'sample-1',
  },

  // Chennai
  {
    id: 'pin-maa-1',
    name: 'OMR IT Expressway (Sholinganallur)',
    lat: 12.9000,
    lng: 80.2430,
    city: 'Chennai',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.9,
    maxDepthCm: 15.0,
    volumeCum: 0.585,
    sampleId: 'sample-1',
  },
  {
    id: 'pin-maa-2',
    name: 'GST Road Guindy Kathipara Junction',
    lat: 12.9960,
    lng: 80.1980,
    city: 'Chennai',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 5.2,
    maxDepthCm: 20.0,
    volumeCum: 1.040,
    sampleId: 'sample-2',
  },

  // Kolkata
  {
    id: 'pin-ccu-1',
    name: 'EM Bypass Salt Lake Sector V',
    lat: 22.5480,
    lng: 88.3980,
    city: 'Kolkata',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 4.5,
    maxDepthCm: 16.0,
    volumeCum: 0.720,
    sampleId: 'sample-1',
  },
];

export type CityRegion =
  | 'All India'
  | 'Delhi'
  | 'Mumbai'
  | 'Bengaluru'
  | 'Hyderabad'
  | 'Pune'
  | 'Chennai'
  | 'Kolkata';

const CITY_COORDINATES: Record<CityRegion, { center: [number, number]; zoom: number }> = {
  'All India': { center: [78.9629, 20.5937], zoom: 4.8 },
  'Delhi': { center: [77.2167, 28.6315], zoom: 12 },
  'Mumbai': { center: [72.8580, 19.0760], zoom: 12 },
  'Bengaluru': { center: [77.6400, 12.9400], zoom: 12 },
  'Hyderabad': { center: [78.3750, 17.4400], zoom: 12.5 },
  'Pune': { center: [73.8567, 18.5204], zoom: 12 },
  'Chennai': { center: [80.2200, 12.9600], zoom: 12 },
  'Kolkata': { center: [88.3980, 22.5480], zoom: 12 },
};

const MAP_STYLES = [
  { id: 'dark', label: 'Mapbox / OSM Dark', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  { id: 'osm', label: 'OpenStreetMap Standard', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
  { id: 'light', label: 'OpenStreetMap Light', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
];

export default function SpatialMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);

  const [roads, setRoads] = useState<RoadFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(5); // June
  const [selectedRoad, setSelectedRoad] = useState<RoadFeature | null>(null);
  const [currentRegion, setCurrentRegion] = useState<CityRegion>('Delhi');
  const [currentStyle, setCurrentStyle] = useState('dark');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Fetch roads GeoJSON on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/roads')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch road networks`);
        return res.json();
      })
      .then((geojson) => {
        const parsed = parseGeoJSONFeatures(geojson);
        setRoads(parsed);
        if (parsed.length > 0) {
          setSelectedRoad(parsed[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching /api/roads:', err);
        setError(err?.message || 'Failed to load road networks');
        setLoading(false);
      });
  }, []);

  // Construct GeoJSON FeatureCollection with temporal scores
  const getGeoJSON = (monthIdx: number, roadList: RoadFeature[]) => {
    return {
      type: 'FeatureCollection',
      features: roadList.map((road) => {
        const score = road.historicalScores[monthIdx] ?? 70;
        return {
          type: 'Feature',
          id: road.id,
          properties: {
            id: road.id,
            name: road.name,
            city: road.city,
            ward: road.ward,
            healthScore: score,
            trafficVolume: road.trafficVolume,
            potholesCount: road.potholesCount,
          },
          geometry: {
            type: 'LineString',
            coordinates: road.coordinates,
          },
        };
      }),
    };
  };

  // Add Vector Layers & Pins to Map
  const addMapLayersAndMarkers = (map: maplibregl.Map, monthIdx: number, roadList: RoadFeature[]) => {
    // Check if source exists
    if (!map.getSource('roads-source')) {
      map.addSource('roads-source', {
        type: 'geojson',
        data: getGeoJSON(monthIdx, roadList) as any,
      });

      // Add Color Coded Road Network Layer (PCI Health)
      map.addLayer({
        id: 'roads-line-layer',
        type: 'line',
        source: 'roads-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': [
            'step',
            ['get', 'healthScore'],
            '#ef4444', 50,
            '#f59e0b', 80,
            '#10b981',
          ],
          'line-width': 5,
        },
      });

      // Click event on road lines
      map.on('click', 'roads-line-layer', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const matched = roadList.find((r) => r.id === feat.id || r.name === feat.properties?.name);
        if (matched) {
          setSelectedRoad(matched);
        }
      });

      map.on('mouseenter', 'roads-line-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'roads-line-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    // Add Red/Yellow/Green Scanned Pothole Pins with Interactive Popups
    PAN_INDIA_PINS.forEach((pin) => {
      const el = document.createElement('div');
      el.className = 'custom-map-pin cursor-pointer transition-transform transform hover:scale-125';

      let badgeBg = '#10b981';
      let borderGlow = '0 0 12px rgba(16, 185, 129, 0.8)';
      if (pin.color === 'red') {
        badgeBg = '#ef4444';
        borderGlow = '0 0 14px rgba(239, 68, 68, 0.9)';
      } else if (pin.color === 'yellow') {
        badgeBg = '#f59e0b';
        borderGlow = '0 0 12px rgba(245, 158, 11, 0.8)';
      }

      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${badgeBg};
          border: 2px solid #ffffff;
          box-shadow: ${borderGlow};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: bold;
          font-size: 12px;
        ">📍</div>
      `;

      el.addEventListener('click', () => {
        if (activePopupRef.current) {
          activePopupRef.current.remove();
        }

        const isRed = pin.color === 'red';
        const popupNode = document.createElement('div');
        popupNode.className = 'p-3 text-slate-100 font-sans max-w-xs';
        popupNode.innerHTML = `
          <div style="background: #090d16; border: 1px solid ${isRed ? 'rgba(239,68,68,0.5)' : 'rgba(0,217,255,0.4)'}; padding: 14px; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.85);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: bold; font-size: 12px; color: #fff;">${pin.name}</span>
              <span style="background: ${isRed ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${isRed ? '#f87171' : '#34d399'}; border: 1px solid ${isRed ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
                ${pin.status} (${pin.severity})
              </span>
            </div>
            
            <div style="font-family: monospace; font-size: 11px; background: rgba(15,23,42,0.85); border: 1px solid rgba(51,65,85,0.6); padding: 8px; border-radius: 8px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Distress Area:</span>
                <strong style="color: #f1f5f9;">${pin.areaSqm} m²</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Void Depth:</span>
                <strong style="color: ${isRed ? '#f87171' : '#fbbf24'};">${pin.maxDepthCm} cm</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Volumetric Mass:</span>
                <strong style="color: #38bdf8;">${pin.volumeCum} m³</strong>
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <a href="/audit?sample=${pin.sampleId}" style="flex: 1; background: #0f172a; border: 1px solid #334155; color: #38bdf8; text-align: center; padding: 7px; border-radius: 8px; font-size: 10px; font-weight: bold; text-decoration: none;">3D LiDAR Audit</a>
              <a href="/copilot?sample=${pin.sampleId}" style="flex: 1; background: linear-gradient(to right, #06b6d4, #2563eb); color: #090d16; text-align: center; padding: 7px; border-radius: 8px; font-size: 10px; font-weight: bold; text-decoration: none;">GenAI BOQ</a>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
          .setLngLat([pin.lng, pin.lat])
          .setDOMContent(popupNode)
          .addTo(map);

        activePopupRef.current = popup;
      });

      new maplibregl.Marker(el)
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
    });
  };

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading || roads.length === 0) return;

    const initialCoord = CITY_COORDINATES[currentRegion] || CITY_COORDINATES['Delhi'];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[0].url,
      center: initialCoord.center,
      zoom: initialCoord.zoom,
      pitch: 45,
      bearing: -15,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      addMapLayersAndMarkers(map, selectedMonthIdx, roads);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loading, roads]);

  // Fly to region on switch
  const handleRegionSwitch = (region: CityRegion) => {
    setCurrentRegion(region);
    const target = CITY_COORDINATES[region];
    if (mapRef.current && target) {
      mapRef.current.flyTo({
        center: target.center,
        zoom: target.zoom,
        pitch: region === 'All India' ? 15 : 48,
        duration: 1800,
      });
    }

    // Auto-select road in that region if exists
    const matchingRoad = roads.find((r) => r.city.toLowerCase() === region.toLowerCase());
    if (matchingRoad) {
      setSelectedRoad(matchingRoad);
    }
  };

  // Update map source on temporal slider month change or roads update
  useEffect(() => {
    if (!mapRef.current || roads.length === 0) return;
    const map = mapRef.current;
    if (map.isStyleLoaded()) {
      const source = map.getSource('roads-source') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(getGeoJSON(selectedMonthIdx, roads) as any);
      }
    }
  }, [selectedMonthIdx, roads]);

  // Handle Style Switch
  const handleStyleChange = (styleObj: typeof MAP_STYLES[0]) => {
    setCurrentStyle(styleObj.id);
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.setStyle(styleObj.url);
    map.once('style.load', () => {
      addMapLayersAndMarkers(map, selectedMonthIdx, roads);
    });
  };

  // Fly to selected road
  const handleSelectRoad = (road: RoadFeature) => {
    setSelectedRoad(road);
    if (mapRef.current && road.coordinates.length > 0) {
      const [lng, lat] = road.coordinates[0];
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        pitch: 50,
        duration: 1500,
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-6rem)] rounded-2xl border border-cyan-500/20 bg-[#0a0e17] p-8 flex flex-col items-center justify-center space-y-4">
        <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
        <div className="text-sm font-mono font-bold text-white">
          Fetching Pan-India GeoJSON Road Networks &amp; Autonomous Telemetry...
        </div>
        <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-6rem)] rounded-2xl border border-rose-500/30 bg-[#0a0e17] p-8 flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          ⚠️ {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const currentScore = selectedRoad ? selectedRoad.historicalScores[selectedMonthIdx] : 0;
  const trendData = selectedRoad
    ? MONTHS.map((m, idx) => ({
        month: m,
        score: selectedRoad.historicalScores[idx],
      }))
    : [];

  const visibleRoads = currentRegion === 'All India'
    ? roads
    : roads.filter((r) => r.city.toLowerCase() === currentRegion.toLowerCase());

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-cyan-500/20 shadow-glass bg-[#0a0e17]">
      {/* Map Container */}
      <div className="relative flex-1 h-full min-h-[450px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* TOP CONTROLS: Pan-India Quick-Switcher & How Map Works Button */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {/* Pan-India Cities & Expressways Pills */}
            <div className="flex items-center bg-slate-900/95 p-1 rounded-xl border border-cyan-500/40 text-xs font-mono shadow-2xl backdrop-blur-xl">
              {(['All India', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'] as CityRegion[]).map((reg) => (
                <button
                  key={reg}
                  onClick={() => handleRegionSwitch(reg)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all font-bold text-xs flex items-center gap-1',
                    currentRegion === reg
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {reg === 'All India' ? '🇮🇳 Pan-India' : `📍 ${reg}`}
                </button>
              ))}
            </div>

            {/* How to Read This Map Toggle Button */}
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-glass backdrop-blur-xl transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>How This Map Works</span>
              {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Map Style Selector Pills */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs pointer-events-auto backdrop-blur-xl">
            {MAP_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStyleChange(s)}
                className={cn(
                  'px-2.5 py-1 rounded-lg transition-all font-medium',
                  currentStyle === s.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {s.label.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* INTERACTIVE GUIDE COLLAPSIBLE OVERLAY */}
        {isGuideOpen && (
          <div className="absolute top-16 left-4 z-30 max-w-lg p-4 rounded-2xl bg-slate-950/95 border-2 border-cyan-500/50 text-slate-200 text-xs font-sans shadow-2xl backdrop-blur-2xl animate-fadeIn space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white font-mono uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Pan-India Spatial Digital Twin Guide</span>
              </span>
              <button onClick={() => setIsGuideOpen(false)} className="text-slate-400 hover:text-white font-mono">✕</button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              This spatial digital twin tracks real-time pavement health (PCI), drone LiDAR pothole detections, and seasonal degradation across Indian national corridors and metro roads.
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300">
                <strong className="block text-white">🔴 Red (&lt;50 PCI)</strong>
                Critical pothole cavity (&gt;15cm depth). Immediate work order required.
              </div>
              <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-300">
                <strong className="block text-white">🟡 Yellow (50-80)</strong>
                Moderate rutting &amp; cracking (5-15cm). Slated for micro-surfacing.
              </div>
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300">
                <strong className="block text-white">🟢 Green (&gt;80 PCI)</strong>
                Compliant, newly sealed asphalt surface (IRC:82 standards).
              </div>
            </div>

            <div className="text-[10px] font-mono text-cyan-400 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>📍 Click any road or pin to inspect 3D metrics</span>
              <span>📅 Use bottom slider to simulate monsoon wear</span>
            </div>
          </div>
        )}

        {/* Selected City Road Corridors Selector */}
        <div className="absolute top-16 left-4 z-10 flex flex-wrap gap-2 max-w-xl">
          {visibleRoads.map((road) => {
            const score = road.historicalScores[selectedMonthIdx];
            const isSelected = selectedRoad?.id === road.id;
            let bgStyle = 'border-emerald-500/40 text-emerald-400';
            if (score < 50) bgStyle = 'border-rose-500/40 text-rose-400';
            else if (score < 80) bgStyle = 'border-amber-500/40 text-amber-400';

            return (
              <button
                key={road.id}
                onClick={() => handleSelectRoad(road)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all backdrop-blur-md border',
                  isSelected
                    ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-cyan-glow scale-102'
                    : `bg-slate-900/85 hover:bg-slate-800 ${bgStyle}`
                )}
              >
                {road.name.slice(0, 22)}... ({score})
              </button>
            );
          })}
        </div>

        {/* Bottom Temporal Slider Controls */}
        <div className="absolute bottom-4 left-4 right-4 lg:right-96 z-10 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 shrink-0">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Monsoon Degradation Simulator</span>
          </div>

          <div className="flex-1 max-w-md flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
              {MONTHS[selectedMonthIdx]} 2026
            </span>
            <input
              type="range"
              min={0}
              max={5}
              value={selectedMonthIdx}
              onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono shrink-0">
            <span>Simulates water ingress &amp; axle load wear</span>
          </div>
        </div>
      </div>

      {/* Right Drawer / Popup Panel for Selected Road */}
      {selectedRoad && (
        <div className="w-full lg:w-96 bg-[#111726]/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-cyan-500/20 p-6 flex flex-col justify-between overflow-y-auto shrink-0 z-20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                {selectedRoad.city} • CORRIDOR
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedRoad.ward}</span>
            </div>

            <h2 className="text-lg font-bold text-white font-display mb-1">
              {selectedRoad.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Inspection Ref: {selectedRoad.inspectionId}</span>
            </div>

            {/* Score & Status Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Pavement Condition Index (PCI)</div>
                <div className="text-3xl font-extrabold font-display text-white mt-0.5">
                  {currentScore} <span className="text-xs text-slate-500 font-mono font-normal">/ 100</span>
                </div>
              </div>

              <span
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold font-mono border',
                  currentScore > 80
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : currentScore > 50
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                )}
              >
                {selectedRoad.status}
              </span>
            </div>

            {/* Historical Degradation Line Chart (Recharts) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 font-display mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>6-Month PCI Degradation Trend Line</span>
              </h3>

              <div className="w-full h-36 bg-slate-950/60 rounded-xl p-2 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00d9ff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#00d9ff"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#00d9ff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic & Distress Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Traffic Volume</div>
                <div className="font-bold text-slate-200 font-display mt-0.5">{selectedRoad.trafficVolume}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">AI Detected Potholes</div>
                <div className="font-bold text-rose-400 font-display mt-0.5">{selectedRoad.potholesCount} Critical</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <Link
              href={`/audit?sample=sample-1`}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-cyan-glow transition-all flex items-center justify-center gap-2"
            >
              <span>View Scan in AI Audit Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/copilot?sample=sample-1`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generate IRC:82 BOQ for this Road</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
