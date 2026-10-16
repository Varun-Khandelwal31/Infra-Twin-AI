export interface InspectionMetrics {
  areaSqm: number;
  areaTol: number;
  maxDepthCm: number;
  maxDepthTol: number;
  avgDepthCm: number;
  avgDepthTol: number;
  volumeCum: number;
  volumeTol: number;
  perimeterM: number;
  perimeterTol: number;
  severityIndex: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidenceScore: number;
}

export interface InspectionLocation {
  address: string;
  lat: number;
  lng: number;
  ward: string;
  zone: string;
}

export interface InspectionImage {
  id: string;
  label: string;
  url: string;
  type: 'RGB Drone' | 'Thermal IR' | 'Oblique 45°' | 'Close-up Macro';
}

export interface InspectionData {
  id: string;
  inspectionNo: string;
  timestamp: string;
  roadName: string;
  distressType: string;
  metrics: InspectionMetrics;
  location: InspectionLocation;
  recommendedAction: {
    headline: string;
    subtext: string;
    ircClause: string;
  };
  segmentationPath: string; // SVG path d attribute
  depthGrid: number[][];    // 16x16 grid for WebGL depth map rendering
  imageUrl: string;
  galleryImages: InspectionImage[];
}

export interface MaterialComparison {
  type: string;
  claimed: string;
  used: string;
  variance: string;
  status: 'Within Limit' | 'Exceeded Threshold' | 'Compliant' | 'Fraud Detected';
}

export interface SLAVerificationData {
  id: string;
  project: string;
  roadId: string;
  inspectionId: string;
  date: string;
  repairQualityScore: number;
  status: 'APPROVED' | 'REJECTED' | 'FRAUD_ALERT';
  beforeScan: {
    capturedOn: string;
    area: string;
    path: string;
    imageUrl: string;
  };
  afterScan: {
    capturedOn: string;
    area: string;
    path: string;
    imageUrl: string;
  };
  summaryMetrics: {
    repairQuality: number;
    surfaceSmoothness: number;
    compactionQuality: number;
    edgeCompliance: number;
    drainageCompliance: number;
  };
  aiAnalysisResults: string[];
  materialTable: MaterialComparison[];
  verificationExplanation: string;
}

// Generate realistic depth grid matrix
function generateDepthGrid(maxDepth: number): number[][] {
  const size = 20;
  const grid: number[][] = [];
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 2;

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dist = Math.sqrt((r - cx) ** 2 + (c - cy) ** 2);
      if (dist > maxRadius) {
        row.push(0);
      } else {
        const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
        // Add subtle organic noise
        const noise = (Math.sin(r * 2.5) * Math.cos(c * 2.5)) * 0.15;
        const depth = Math.max(0, maxDepth * (factor + noise));
        row.push(Number(depth.toFixed(1)));
      }
    }
    grid.push(row);
  }
  return grid;
}

export function createCustomInspection(imageUrl: string, title?: string, customMetrics?: Partial<InspectionMetrics>): InspectionData {
  const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();
  const randomId = 'custom-' + Math.random().toString(36).substring(2, 7);
  const randomDepth = customMetrics?.maxDepthCm ?? Number((Math.random() * 12 + 6).toFixed(1));
  const randomArea = customMetrics?.areaSqm ?? Number((Math.random() * 3.5 + 1.2).toFixed(1));
  const randomVol = customMetrics?.volumeCum ?? Number(((randomArea * randomDepth) / 100).toFixed(3));

  const metrics: InspectionMetrics = {
    areaSqm: randomArea,
    areaTol: customMetrics?.areaTol ?? 0.12,
    maxDepthCm: randomDepth,
    maxDepthTol: customMetrics?.maxDepthTol ?? 1.1,
    avgDepthCm: customMetrics?.avgDepthCm ?? Number((randomDepth * 0.6).toFixed(1)),
    avgDepthTol: customMetrics?.avgDepthTol ?? 0.7,
    volumeCum: randomVol,
    volumeTol: customMetrics?.volumeTol ?? 0.04,
    perimeterM: customMetrics?.perimeterM ?? Number((Math.sqrt(randomArea) * 4).toFixed(1)),
    perimeterTol: customMetrics?.perimeterTol ?? 0.2,
    severityIndex: customMetrics?.severityIndex ?? (randomDepth > 14 ? 'Critical' : randomDepth > 9 ? 'High' : 'Moderate'),
    confidenceScore: customMetrics?.confidenceScore ?? Number((96.5 + Math.random() * 3).toFixed(1)),
  };

  return {
    id: randomId,
    inspectionNo: `CUSTOM-SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: timestampStr,
    roadName: title || 'User Uploaded Road Inspection Scan',
    distressType: 'AI Detected Asphalt Pothole & Distress Void',
    metrics: metrics,
    location: {
      address: 'Uploaded Drone Scan Location (GPS Tagged)',
      lat: 28.6139,
      lng: 77.2090,
      ward: 'Ward 22 - Custom Inspection',
      zone: 'Smart City Sector',
    },
    recommendedAction: {
      headline: 'Full-Depth Saw Cut & Bituminous Restoration',
      subtext: `Uploaded scan processed: Area ${randomArea} m², Max Depth ${randomDepth} cm. Full-depth patch repair mandated under IRC:82-2023.`,
      ircClause: 'IRC:82-2023 Section 4.3 (Full-Depth Bituminous Patching Standard)',
    },
    segmentationPath: 'M 170,130 C 240,100 350,110 410,150 C 470,200 450,310 400,380 C 310,420 210,410 160,340 C 120,270 120,180 170,130 Z',
    depthGrid: generateDepthGrid(randomDepth),
    imageUrl: imageUrl,
    galleryImages: [
      { id: `${randomId}-1`, label: 'Uploaded Custom Photo', type: 'RGB Drone', url: imageUrl },
      { id: `${randomId}-2`, label: 'Thermal IR Scan Matrix', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: `${randomId}-3`, label: '45° Oblique View', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
      { id: `${randomId}-4`, label: 'Pothole Macro Close-up', type: 'Close-up Macro', url: '/images/indian_pothole_severe_before.jpg' },
    ],
  };
}

export const INSPECTION_SAMPLES: InspectionData[] = [
  {
    id: 'sample-1',
    inspectionNo: 'IR-2025-05-27-1045',
    timestamp: 'May 27, 2025 10:45 AM',
    roadName: 'Connaught Place Outer Circle',
    distressType: 'Severe Water-Bound Pothole',
    metrics: {
      areaSqm: 2.5,
      areaTol: 0.15,
      maxDepthCm: 15,
      maxDepthTol: 1.2,
      avgDepthCm: 8.6,
      avgDepthTol: 0.8,
      volumeCum: 0.375,
      volumeTol: 0.05,
      perimeterM: 6.8,
      perimeterTol: 0.25,
      severityIndex: 'High',
      confidenceScore: 98.7,
    },
    location: {
      address: 'Connaught Place, New Delhi, 110001',
      lat: 28.6315,
      lng: 77.2167,
      ward: 'Ward 34 - NDMC',
      zone: 'Central Delhi',
    },
    recommendedAction: {
      headline: 'Immediate Repair Required',
      subtext: 'Pothole depth exceeds safety threshold (15cm). Water pooling accelerates sub-base erosion.',
      ircClause: 'IRC:82-2023 Section 4.3 (Full-Depth Bituminous Patching)',
    },
    segmentationPath: 'M 180,140 C 230,110 320,120 370,160 C 420,200 450,270 410,340 C 370,410 270,430 200,380 C 140,330 130,240 150,180 Z',
    depthGrid: generateDepthGrid(15),
    imageUrl: '/images/indian_pothole_severe_before.jpg',
    galleryImages: [
      { id: 'img-1a', label: 'Real Overhead Drone Scan', type: 'RGB Drone', url: '/images/indian_pothole_severe_before.jpg' },
      { id: 'img-1b', label: 'Thermal Infrared Matrix', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-1c', label: '45° Oblique Perspective', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
      { id: 'img-1d', label: 'Pothole Macro Close-Up', type: 'Close-up Macro', url: '/images/indian_road_rutting_closeup.jpg' },
    ],
  },
  {
    id: 'sample-2',
    inspectionNo: 'IR-2025-05-28-1092',
    timestamp: 'May 28, 2025 02:15 PM',
    roadName: 'Outer Ring Road (IIT Flyover)',
    distressType: 'Critical Structural Pothole & Alligator Cracking',
    metrics: {
      areaSqm: 4.1,
      areaTol: 0.20,
      maxDepthCm: 18.2,
      maxDepthTol: 1.5,
      avgDepthCm: 10.4,
      avgDepthTol: 0.9,
      volumeCum: 0.626,
      volumeTol: 0.08,
      perimeterM: 9.4,
      perimeterTol: 0.30,
      severityIndex: 'Critical',
      confidenceScore: 99.1,
    },
    location: {
      address: 'Outer Ring Road Flyover stretch, Hauz Khas, New Delhi',
      lat: 28.5456,
      lng: 77.1928,
      ward: 'Ward 12 - South Delhi',
      zone: 'South Delhi',
    },
    recommendedAction: {
      headline: 'Urgent Structural Reconstruction',
      subtext: 'Severe sub-grade degradation. Full milling and DBM (Dense Bituminous Macadam) overlay mandated.',
      ircClause: 'IRC:37-2018 Guidelines for Flexible Pavement Overlay',
    },
    segmentationPath: 'M 160,120 C 240,90 350,110 420,150 C 480,200 460,320 400,390 C 320,440 210,430 150,360 C 110,290 100,180 160,120 Z',
    depthGrid: generateDepthGrid(18.2),
    imageUrl: '/images/indian_alligator_crack_corridor.jpg',
    galleryImages: [
      { id: 'img-2a', label: 'Aerial Drone Survey', type: 'RGB Drone', url: '/images/indian_alligator_crack_corridor.jpg' },
      { id: 'img-2b', label: 'Alligator Crack Close-up', type: 'Close-up Macro', url: '/images/indian_road_rutting_closeup.jpg' },
      { id: 'img-2c', label: 'Sub-base Moisture IR Scan', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-2d', label: 'Flyover Joint Oblique', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
    ],
  },
  {
    id: 'sample-3',
    inspectionNo: 'IR-2025-05-29-1104',
    timestamp: 'May 29, 2025 11:30 AM',
    roadName: 'Dwarka Sector 21 Highway',
    distressType: 'Longitudinal Rutting & Moderate Depressions',
    metrics: {
      areaSqm: 1.8,
      areaTol: 0.10,
      maxDepthCm: 8.5,
      maxDepthTol: 0.7,
      avgDepthCm: 4.2,
      avgDepthTol: 0.4,
      volumeCum: 0.151,
      volumeTol: 0.02,
      perimeterM: 5.2,
      perimeterTol: 0.18,
      severityIndex: 'Moderate',
      confidenceScore: 96.4,
    },
    location: {
      address: 'Dwarka Expressway Sector 21 Junction, New Delhi',
      lat: 28.5523,
      lng: 77.0581,
      ward: 'Ward 08 - Dwarka',
      zone: 'West Delhi',
    },
    recommendedAction: {
      headline: 'Preventative Bituminous Seal Coating',
      subtext: 'Surface rutting within manageable limits. Tack coat sealing recommended to prevent moisture intrusion.',
      ircClause: 'MoRTH Section 500 Bituminous Surface Treatments',
    },
    segmentationPath: 'M 200,160 C 260,140 310,150 360,180 C 400,220 380,290 350,330 C 300,370 230,360 190,320 C 160,270 160,200 200,160 Z',
    depthGrid: generateDepthGrid(8.5),
    imageUrl: '/images/indian_road_rutting_closeup.jpg',
    galleryImages: [
      { id: 'img-3a', label: 'Highway Sector Scan', type: 'RGB Drone', url: '/images/indian_road_rutting_closeup.jpg' },
      { id: 'img-3b', label: 'Rutting Profile Camera', type: 'Close-up Macro', url: '/images/indian_pothole_severe_before.jpg' },
      { id: 'img-3c', label: 'Asphalt Thermal Gradient', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-3d', label: 'Junction Overview 45°', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
    ],
  },
  {
    id: 'sample-4',
    inspectionNo: 'IR-2025-05-30-1120',
    timestamp: 'May 30, 2025 04:10 PM',
    roadName: 'Barakhamba Road Arterial',
    distressType: 'Sub-base Collapse & Edge Fraying',
    metrics: {
      areaSqm: 3.5,
      areaTol: 0.18,
      maxDepthCm: 16.4,
      maxDepthTol: 1.3,
      avgDepthCm: 9.1,
      avgDepthTol: 0.7,
      volumeCum: 0.495,
      volumeTol: 0.06,
      perimeterM: 8.1,
      perimeterTol: 0.28,
      severityIndex: 'Critical',
      confidenceScore: 98.4,
    },
    location: {
      address: 'Barakhamba Road Metro Corridor, New Delhi',
      lat: 28.6291,
      lng: 77.2264,
      ward: 'Ward 34 - NDMC',
      zone: 'Central Delhi',
    },
    recommendedAction: {
      headline: 'Sub-base Grouting & Saw Cut Patching',
      subtext: 'Deep structural void detected beneath asphalt layer. Requires chemical soil stabilization before resurfacing.',
      ircClause: 'IRC:82-2023 Section 6.2 (Sub-base Stabilization)',
    },
    segmentationPath: 'M 170,130 C 250,100 340,110 400,160 C 450,210 430,330 380,380 C 290,420 200,410 150,340 C 120,270 120,180 170,130 Z',
    depthGrid: generateDepthGrid(16.4),
    imageUrl: '/images/indian_pothole_severe_before.jpg',
    galleryImages: [
      { id: 'img-4a', label: 'Metro Corridor Drone Scan', type: 'RGB Drone', url: '/images/indian_pothole_severe_before.jpg' },
      { id: 'img-4b', label: 'Edge Breakdown Macro', type: 'Close-up Macro', url: '/images/indian_road_rutting_closeup.jpg' },
      { id: 'img-4c', label: 'Sub-base Cavity Thermal', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-4d', label: 'Arterial Traffic Angle', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
    ],
  },
  {
    id: 'sample-5',
    inspectionNo: 'IR-2025-05-31-1145',
    timestamp: 'May 31, 2025 09:20 AM',
    roadName: 'NH-48 Mahipalpur Stretch',
    distressType: 'Transverse Thermal Cracking & Edge Bleeding',
    metrics: {
      areaSqm: 2.1,
      areaTol: 0.12,
      maxDepthCm: 7.2,
      maxDepthTol: 0.6,
      avgDepthCm: 3.8,
      avgDepthTol: 0.3,
      volumeCum: 0.178,
      volumeTol: 0.03,
      perimeterM: 6.1,
      perimeterTol: 0.22,
      severityIndex: 'Moderate',
      confidenceScore: 97.2,
    },
    location: {
      address: 'NH-48 Airport Highway Corridor, New Delhi',
      lat: 28.5382,
      lng: 77.1254,
      ward: 'Ward 14 - Airport Zone',
      zone: 'South-West Delhi',
    },
    recommendedAction: {
      headline: 'Hot-Poured Rubberized Crack Sealing',
      subtext: 'Transverse cracking caused by high thermal expansion. High-modulus sealant required.',
      ircClause: 'IRC:SP:81-2008 Code of Practice for Crack Sealing',
    },
    segmentationPath: 'M 190,150 C 270,120 330,140 380,170 C 420,210 410,280 370,330 C 310,360 220,350 180,310 C 150,260 150,190 190,150 Z',
    depthGrid: generateDepthGrid(7.2),
    imageUrl: '/images/indian_alligator_crack_corridor.jpg',
    galleryImages: [
      { id: 'img-5a', label: 'Highway RGB Overhead', type: 'RGB Drone', url: '/images/indian_alligator_crack_corridor.jpg' },
      { id: 'img-5b', label: 'Thermal Crack Trace', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-5c', label: 'Bitumen Bleeding Close-Up', type: 'Close-up Macro', url: '/images/indian_road_rutting_closeup.jpg' },
      { id: 'img-5d', label: 'Flyover Ramp 45° Perspective', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
    ],
  },
  {
    id: 'sample-mumbai',
    inspectionNo: 'IR-BOM-2025-06-01',
    timestamp: 'Jun 01, 2025 08:30 AM',
    roadName: 'Western Express Highway (Andheri Flyover)',
    distressType: 'Critical Structural Pothole & Water-Logging Void',
    metrics: {
      areaSqm: 5.8,
      areaTol: 0.25,
      maxDepthCm: 19.5,
      maxDepthTol: 1.6,
      avgDepthCm: 11.2,
      avgDepthTol: 0.9,
      volumeCum: 1.131,
      volumeTol: 0.12,
      perimeterM: 11.2,
      perimeterTol: 0.35,
      severityIndex: 'Critical',
      confidenceScore: 99.3,
    },
    location: {
      address: 'Western Express Highway, Andheri East, Mumbai, Maharashtra 400069',
      lat: 19.1240,
      lng: 72.8580,
      ward: 'K-East Ward - Mumbai Suburban',
      zone: 'Western Suburbs',
    },
    recommendedAction: {
      headline: 'Emergency Bituminous Concrete Saw-Cut Restoration',
      subtext: 'High-speed arterial cavity depth (19.5cm) poses severe vehicular rollover hazard. Mandate 2-layer VG-40 heavy compaction under IRC:82-2023.',
      ircClause: 'IRC:82-2023 Section 4.3.2 & MoRTH Clause 3004 (Heavy Axle Compaction)',
    },
    segmentationPath: 'M 150,110 C 230,80 360,100 430,140 C 490,190 470,330 410,400 C 330,450 200,440 140,370 C 100,290 90,170 150,110 Z',
    depthGrid: generateDepthGrid(19.5),
    imageUrl: '/images/indian_pothole_severe_before.jpg',
    galleryImages: [
      { id: 'img-bom-1', label: 'Overhead Drone LiDAR Scan', type: 'RGB Drone', url: '/images/indian_pothole_severe_before.jpg' },
      { id: 'img-bom-2', label: 'Thermal Moisture Infiltration', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
      { id: 'img-bom-3', label: '45° Flyover Traffic Angle', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
    ],
  },
  {
    id: 'sample-blr',
    inspectionNo: 'IR-BLR-2025-06-04',
    timestamp: 'Jun 04, 2025 09:15 AM',
    roadName: 'Outer Ring Road (Bellandur EcoSpace)',
    distressType: 'Severe Sub-grade Subsidence & Aggregate Dislodgement',
    metrics: {
      areaSqm: 6.2,
      areaTol: 0.30,
      maxDepthCm: 21.0,
      maxDepthTol: 1.8,
      avgDepthCm: 12.0,
      avgDepthTol: 1.1,
      volumeCum: 1.302,
      volumeTol: 0.15,
      perimeterM: 12.5,
      perimeterTol: 0.40,
      severityIndex: 'Critical',
      confidenceScore: 99.5,
    },
    location: {
      address: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
      lat: 12.9380,
      lng: 77.6830,
      ward: 'Mahadevapura Zone - BBMP',
      zone: 'East Bengaluru',
    },
    recommendedAction: {
      headline: 'Sub-base Chemical Stabilization & Full-Depth Resurfacing',
      subtext: 'Tech corridor heavy bus traffic accelerated sub-base shearing. Complete 200mm excavation and Dense Bituminous Macadam (DBM) required.',
      ircClause: 'IRC:37-2018 (Guidelines for Design of Flexible Pavements)',
    },
    segmentationPath: 'M 140,100 C 240,70 370,90 440,130 C 500,180 480,340 420,410 C 340,460 190,450 130,380 C 90,300 80,160 140,100 Z',
    depthGrid: generateDepthGrid(21.0),
    imageUrl: '/images/indian_pothole_fraud_after.jpg',
    galleryImages: [
      { id: 'img-blr-1', label: 'Drone Orthomosaic View', type: 'RGB Drone', url: '/images/indian_pothole_fraud_after.jpg' },
      { id: 'img-blr-2', label: 'LiDAR Mesh Pointcloud', type: 'Close-up Macro', url: '/images/indian_pothole_severe_before.jpg' },
    ],
  },
];

export const CONTRACTOR_SLA_SAMPLES: SLAVerificationData[] = [
  {
    id: 'sla-sample-1',
    project: 'New Delhi Smart Roads',
    roadId: 'ND-SR-2025-1587',
    inspectionId: 'INSP-2025-05-27-1045',
    date: 'May 27, 2025 | 10:45 AM',
    repairQualityScore: 92,
    status: 'APPROVED',
    beforeScan: {
      capturedOn: 'May 20, 2025 | 09:15 AM',
      area: '2.45 m²',
      path: 'M 180,140 C 230,110 320,120 370,160 C 420,200 450,270 410,340 C 370,410 270,430 200,380 C 140,330 130,240 150,180 Z',
      imageUrl: '/images/pothole_severe_before.jpg',
    },
    afterScan: {
      capturedOn: 'May 27, 2025 | 10:40 AM',
      area: '2.48 m²',
      path: 'M 182,142 C 232,112 322,122 372,162 C 422,202 452,272 412,342 C 372,412 272,432 202,382 C 142,332 132,242 152,182 Z',
      imageUrl: '/images/pothole_repaired_after.jpg',
    },
    summaryMetrics: {
      repairQuality: 92,
      surfaceSmoothness: 90,
      compactionQuality: 94,
      edgeCompliance: 91,
      drainageCompliance: 93,
    },
    aiAnalysisResults: [
      'Pothole area adequately filled',
      'Surface level compliance achieved',
      'Material compaction within range',
      'No water pooling detected',
      'Meets IRC & Project SLA Standards',
    ],
    materialTable: [
      { type: 'Asphalt Mix (BM)', claimed: '2.80 Ton', used: '2.74 Ton', variance: '-2.14%', status: 'Within Limit' },
      { type: 'Bitumen', claimed: '140.00 Kg', used: '136.80 Kg', variance: '-2.29%', status: 'Within Limit' },
      { type: 'Aggregate', claimed: '2.30 Ton', used: '2.26 Ton', variance: '-1.74%', status: 'Within Limit' },
      { type: 'Emulsion', claimed: '15.00 L', used: '14.60 L', variance: '-2.67%', status: 'Within Limit' },
      { type: 'Total', claimed: '—', used: '—', variance: '-2.21% (Avg)', status: 'Compliant' },
    ],
    verificationExplanation: 'Our AI system analyzed multi-spectral drone imagery, 3D surface models, and material signatures to verify the quality and quantity of the repair work.',
  },
  {
    id: 'sla-sample-2',
    project: 'South Delhi PWD Package 4',
    roadId: 'SD-PK4-2025-8891',
    inspectionId: 'INSP-2025-05-29-2201',
    date: 'May 29, 2025 | 04:20 PM',
    repairQualityScore: 41,
    status: 'FRAUD_ALERT',
    beforeScan: {
      capturedOn: 'May 15, 2025 | 11:00 AM',
      area: '3.80 m²',
      path: 'M 160,120 C 240,90 350,110 420,150 C 480,200 460,320 400,390 C 320,440 210,430 150,360 C 110,290 100,180 160,120 Z',
      imageUrl: '/images/pothole_severe_before.jpg',
    },
    afterScan: {
      capturedOn: 'May 29, 2025 | 03:50 PM',
      area: '1.90 m²',
      path: 'M 200,180 C 260,150 330,170 380,210 C 410,250 400,310 360,350 C 300,390 230,380 190,340 C 160,290 170,220 200,180 Z',
      imageUrl: '/images/pothole_fraud_after.jpg',
    },
    summaryMetrics: {
      repairQuality: 41,
      surfaceSmoothness: 35,
      compactionQuality: 48,
      edgeCompliance: 42,
      drainageCompliance: 38,
    },
    aiAnalysisResults: [
      '✕ Pothole area partially unfilled (45% void remaining)',
      '✕ Sub-base compaction failed IRC 82 standard',
      '✕ Material over-billing detected by 3D volumetric audit',
      '✕ Severe edge fraying & moisture entry risk detected',
    ],
    materialTable: [
      { type: 'Asphalt Mix (BM)', claimed: '6.50 Ton', used: '3.10 Ton', variance: '-52.31%', status: 'Exceeded Threshold' },
      { type: 'Bitumen', claimed: '320.00 Kg', used: '155.00 Kg', variance: '-51.56%', status: 'Exceeded Threshold' },
      { type: 'Aggregate', claimed: '5.10 Ton', used: '2.40 Ton', variance: '-52.94%', status: 'Exceeded Threshold' },
      { type: 'Emulsion', claimed: '35.00 L', used: '18.00 L', variance: '-48.57%', status: 'Exceeded Threshold' },
      { type: 'Total', claimed: '—', used: '—', variance: '-51.34% (Avg)', status: 'Fraud Detected' },
    ],
    verificationExplanation: 'CRITICAL FRAUD WARNING: Contractor claimed 100% full-depth restoration but 3D volumetric scan confirms 51.3% material deficit. Payment clearance has been automatically FROZEN.',
  },
];
