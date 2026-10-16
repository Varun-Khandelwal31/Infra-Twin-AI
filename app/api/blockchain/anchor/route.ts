import { NextResponse } from 'next/server';
import { anchorAuditOnChain } from '@/lib/web3/blockchainService';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = anchorAuditOnChain({
      inspectionId: body.inspectionId || `INSP-${Date.now()}`,
      roadId: body.roadId || 'RD-DEL-48',
      roadName: body.roadName || 'Outer Ring Road (IIT Flyover Corridor)',
      city: body.city || 'Delhi',
      contractor: body.contractor || 'Apex Infraworks Pvt Ltd',
      lat: body.lat ?? 28.548,
      lng: body.lng ?? 77.185,
      areaSqm: body.areaSqm ?? 4.1,
      depthCm: body.depthCm ?? 18.2,
      volumeCum: body.volumeCum ?? 0.746,
      billedVolumeCum: body.billedVolumeCum ?? 1.85,
      materialVariancePct: body.materialVariancePct ?? 14.8,
      compactionDensityPct: body.compactionDensityPct ?? 92.4,
      pciScore: body.pciScore ?? 62,
      isFraud: body.isFraud ?? true,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Inspection telemetry & Section 65B digest cryptographically anchored on Polygon Amoy testnet.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Blockchain anchoring failed' },
      { status: 500 }
    );
  }
}
