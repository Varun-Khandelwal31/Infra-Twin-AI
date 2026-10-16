import { NextRequest, NextResponse } from 'next/server';
import { INSPECTION_SAMPLES, CONTRACTOR_SLA_SAMPLES, createCustomInspection } from '@/lib/mockInference';

export async function GET() {
  return NextResponse.json({
    inspections: INSPECTION_SAMPLES,
    slaVerifications: CONTRACTOR_SLA_SAMPLES,
    pipeline: {
      segmentationModel: 'YOLOv8-Seg (yolov8n-seg.pt)',
      depthModel: 'Depth Anything (LiheYoung/depth-anything-small-hf)',
      status: 'active',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const roadName = (formData.get('roadName') as string) || 'Custom Drone Inspection Road';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Try sending to Python FastAPI backend at port 8000
    try {
      const pyFormData = new FormData();
      pyFormData.append('file', file);

      const pyRes = await fetch('http://localhost:8000/api/v1/inspect', {
        method: 'POST',
        body: pyFormData,
      });

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        const customInspection = createCustomInspection(
          URL.createObjectURL(file),
          roadName,
          pyData.metrics
        );
        return NextResponse.json({
          success: true,
          source: 'python_yolov8_seg_depth_anything',
          inspection: {
            ...customInspection,
            segmentationPath: pyData.segmentationPath || customInspection.segmentationPath,
            depthGrid: pyData.depthGrid || customInspection.depthGrid,
          },
        });
      }
    } catch (pyErr) {
      console.warn('Python backend offline or starting up, using Node volumetric fallback:', pyErr);
    }

    // Fallback Next.js Volumetric Calculation
    const customInspection = createCustomInspection(
      URL.createObjectURL(file),
      roadName
    );

    return NextResponse.json({
      success: true,
      source: 'volumetric_fallback_engine',
      inspection: customInspection,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Inspection failed' }, { status: 500 });
  }
}
