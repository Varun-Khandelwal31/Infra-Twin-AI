import { NextResponse } from 'next/server';

export async function GET() {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      // ================= DELHI NCR =================
      {
        type: 'Feature',
        id: 'road-1',
        properties: {
          id: 'road-1',
          name: 'Connaught Place Outer Circle',
          city: 'Delhi',
          ward: 'Ward 34 - NDMC',
          healthScore: 74,
          status: 'Fair',
          trafficVolume: '4,200 PCU/hr',
          potholesCount: 3,
          inspectionId: 'IR-2025-05-27-1045',
          historicalScores: [88, 85, 81, 78, 76, 74],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.214, 28.633],
            [77.218, 28.635],
            [77.221, 28.632],
            [77.219, 28.628],
            [77.214, 28.630],
            [77.214, 28.633],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-2',
        properties: {
          id: 'road-2',
          name: 'Barakhamba Road Arterial',
          city: 'Delhi',
          ward: 'Ward 34 - NDMC',
          healthScore: 45,
          status: 'Critical',
          trafficVolume: '6,800 PCU/hr',
          potholesCount: 7,
          inspectionId: 'IR-2025-05-30-1120',
          historicalScores: [75, 68, 60, 54, 48, 45],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.221, 28.632],
            [77.226, 28.629],
            [77.232, 28.626],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-4',
        properties: {
          id: 'road-4',
          name: 'Outer Ring Road (IIT Flyover Stretch)',
          city: 'Delhi',
          ward: 'Ward 12 - South Delhi',
          healthScore: 38,
          status: 'Critical',
          trafficVolume: '9,400 PCU/hr',
          potholesCount: 12,
          inspectionId: 'IR-2025-05-28-1092',
          historicalScores: [68, 62, 54, 47, 41, 38],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.185, 28.548],
            [77.193, 28.546],
            [77.202, 28.544],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-5',
        properties: {
          id: 'road-5',
          name: 'Dwarka Expressway Sector 21',
          city: 'Delhi',
          ward: 'Ward 08 - Dwarka',
          healthScore: 92,
          status: 'Good',
          trafficVolume: '5,600 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-2025-05-29-1104',
          historicalScores: [98, 97, 95, 94, 93, 92],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.050, 28.555],
            [77.058, 28.552],
            [77.065, 28.548],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-6',
        properties: {
          id: 'road-6',
          name: 'NH-48 Mahipalpur Flyover Segment',
          city: 'Delhi',
          ward: 'Ward 14 - Airport Zone',
          healthScore: 58,
          status: 'Fair',
          trafficVolume: '11,200 PCU/hr',
          potholesCount: 5,
          inspectionId: 'IR-2025-05-26-1011',
          historicalScores: [82, 77, 71, 66, 62, 58],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.115, 28.538],
            [77.125, 28.542],
            [77.135, 28.545],
          ],
        },
      },

      // ================= MUMBAI (MMR) =================
      {
        type: 'Feature',
        id: 'road-mumbai-1',
        properties: {
          id: 'road-mumbai-1',
          name: 'Western Express Highway (Andheri Flyover)',
          city: 'Mumbai',
          ward: 'K-East Ward - Mumbai Suburban',
          healthScore: 42,
          status: 'Critical',
          trafficVolume: '14,800 PCU/hr',
          potholesCount: 9,
          inspectionId: 'IR-BOM-2025-06-01',
          historicalScores: [74, 66, 58, 51, 46, 42],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.855, 19.112],
            [72.858, 19.124],
            [72.862, 19.138],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-mumbai-2',
        properties: {
          id: 'road-mumbai-2',
          name: 'Bandra-Worli Sea Link Approach',
          city: 'Mumbai',
          ward: 'H-West Ward - Bandra',
          healthScore: 89,
          status: 'Good',
          trafficVolume: '8,900 PCU/hr',
          potholesCount: 1,
          inspectionId: 'IR-BOM-2025-06-02',
          historicalScores: [95, 94, 92, 91, 90, 89],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.819, 19.043],
            [72.816, 19.030],
            [72.813, 19.018],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-mumbai-3',
        properties: {
          id: 'road-mumbai-3',
          name: 'Eastern Freeway Chembur Elevated Stretch',
          city: 'Mumbai',
          ward: 'M-West Ward - Chembur',
          healthScore: 66,
          status: 'Fair',
          trafficVolume: '9,200 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-BOM-2025-06-03',
          historicalScores: [85, 80, 75, 71, 68, 66],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.889, 19.048],
            [72.894, 19.062],
            [72.901, 19.075],
          ],
        },
      },

      // ================= BENGALURU =================
      {
        type: 'Feature',
        id: 'road-blr-1',
        properties: {
          id: 'road-blr-1',
          name: 'Outer Ring Road (Bellandur-Marathahalli)',
          city: 'Bengaluru',
          ward: 'Mahadevapura Zone - BBMP',
          healthScore: 35,
          status: 'Critical',
          trafficVolume: '16,200 PCU/hr',
          potholesCount: 14,
          inspectionId: 'IR-BLR-2025-06-04',
          historicalScores: [65, 58, 49, 42, 38, 35],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.674, 12.929],
            [77.683, 12.938],
            [77.695, 12.952],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-blr-2',
        properties: {
          id: 'road-blr-2',
          name: 'Silk Board Junction Flyover Ramp',
          city: 'Bengaluru',
          ward: 'BTM Layout Zone - BBMP',
          healthScore: 48,
          status: 'Critical',
          trafficVolume: '18,500 PCU/hr',
          potholesCount: 8,
          inspectionId: 'IR-BLR-2025-06-05',
          historicalScores: [72, 65, 59, 54, 50, 48],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.618, 12.917],
            [77.625, 12.918],
            [77.632, 12.919],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-blr-3',
        properties: {
          id: 'road-blr-3',
          name: 'Electronic City Elevated Expressway',
          city: 'Bengaluru',
          ward: 'Bommanahalli Zone - NHAI',
          healthScore: 91,
          status: 'Good',
          trafficVolume: '10,400 PCU/hr',
          potholesCount: 1,
          inspectionId: 'IR-BLR-2025-06-06',
          historicalScores: [96, 95, 94, 93, 92, 91],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.638, 12.879],
            [77.652, 12.862],
            [77.665, 12.845],
          ],
        },
      },

      // ================= HYDERABAD =================
      {
        type: 'Feature',
        id: 'road-hyd-1',
        properties: {
          id: 'road-hyd-1',
          name: 'HITEC City Cyber Towers Main Corridor',
          city: 'Hyderabad',
          ward: 'Serilingampally Zone - GHMC',
          healthScore: 78,
          status: 'Fair',
          trafficVolume: '12,100 PCU/hr',
          potholesCount: 3,
          inspectionId: 'IR-HYD-2025-06-07',
          historicalScores: [90, 87, 84, 82, 80, 78],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.375, 17.450],
            [78.382, 17.447],
            [78.390, 17.444],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-hyd-2',
        properties: {
          id: 'road-hyd-2',
          name: 'Nehru Outer Ring Road (Gachibowli Junction)',
          city: 'Hyderabad',
          ward: 'Rajendranagar Zone - HMDA',
          healthScore: 94,
          status: 'Good',
          trafficVolume: '8,700 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-HYD-2025-06-08',
          historicalScores: [98, 97, 96, 95, 95, 94],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.348, 17.432],
            [78.358, 17.420],
            [78.368, 17.408],
          ],
        },
      },

      // ================= PUNE =================
      {
        type: 'Feature',
        id: 'road-pune-1',
        properties: {
          id: 'road-pune-1',
          name: 'Hinjewadi IT Park Phase 1 Main Road',
          city: 'Pune',
          ward: 'PCMC IT Zone',
          healthScore: 49,
          status: 'Critical',
          trafficVolume: '13,200 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-PUN-2025-06-09',
          historicalScores: [76, 70, 63, 57, 52, 49],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.738, 18.591],
            [73.746, 18.588],
            [73.755, 18.585],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-pune-2',
        properties: {
          id: 'road-pune-2',
          name: 'Pune-Satara Highway Katraj Bypass',
          city: 'Pune',
          ward: 'PMC South Zone - NHAI',
          healthScore: 61,
          status: 'Fair',
          trafficVolume: '11,800 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-PUN-2025-06-10',
          historicalScores: [83, 78, 73, 68, 64, 61],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.855, 18.452],
            [73.859, 18.441],
            [73.864, 18.430],
          ],
        },
      },

      // ================= CHENNAI =================
      {
        type: 'Feature',
        id: 'road-chn-1',
        properties: {
          id: 'road-chn-1',
          name: 'Old Mahabalipuram Road (OMR IT Corridor)',
          city: 'Chennai',
          ward: 'Sholinganallur Zone - Greater Chennai Corp',
          healthScore: 72,
          status: 'Fair',
          trafficVolume: '11,400 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-MAA-2025-06-11',
          historicalScores: [88, 84, 80, 77, 74, 72],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.245, 12.915],
            [80.243, 12.900],
            [80.240, 12.885],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-chn-2',
        properties: {
          id: 'road-chn-2',
          name: 'Grand Southern Trunk (GST) Road Guindy Flyover',
          city: 'Chennai',
          ward: 'Alandur Zone - NHAI',
          healthScore: 41,
          status: 'Critical',
          trafficVolume: '15,200 PCU/hr',
          potholesCount: 11,
          inspectionId: 'IR-MAA-2025-06-12',
          historicalScores: [70, 63, 56, 50, 45, 41],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.208, 13.008],
            [80.198, 12.996],
            [80.188, 12.984],
          ],
        },
      },

      // ================= KOLKATA =================
      {
        type: 'Feature',
        id: 'road-kol-1',
        properties: {
          id: 'road-kol-1',
          name: 'Eastern Metropolitan (EM) Bypass Salt Lake',
          city: 'Kolkata',
          ward: 'Bidhannagar Municipal Corp',
          healthScore: 54,
          status: 'Fair',
          trafficVolume: '10,900 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-CCU-2025-06-13',
          historicalScores: [79, 73, 67, 62, 58, 54],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [88.405, 22.565],
            [88.398, 22.548],
            [88.392, 22.532],
          ],
        },
      },
    ],
  };

  return NextResponse.json(geojson);
}
