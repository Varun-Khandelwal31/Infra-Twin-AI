import { NextResponse } from 'next/server';
import { runSwytchcodeDurableWorkflow } from '@/lib/swytchcode';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, inspectionContext } = body;

    const volume_m3 = inspectionContext?.metrics?.volumeCum || 0.375;
    const distress_area_sqm = inspectionContext?.metrics?.areaSqm || 2.5;
    const max_depth_cm = inspectionContext?.metrics?.maxDepthCm || 15.0;

    const formattedPrompt =
      prompt ||
      `Given a pothole with a volume of ${volume_m3} cubic meters, refer to the IRC 83 standards in your database to generate a Bill of Quantities. Output material needed, labor cost, and total estimated cost in INR.`;

    // Try sending to Python RAG Vector DB service at port 8000
    try {
      const pyRes = await fetch('http://localhost:8000/api/v1/copilot/generate-boq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volume_m3,
          distress_area_sqm,
          max_depth_cm,
          road_name: inspectionContext?.roadName || 'Outer Ring Road Stretch',
          prompt: formattedPrompt,
        }),
      });

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        return NextResponse.json(pyData);
      }
    } catch (pyErr) {
      console.warn('Python RAG service offline, falling back to Next.js Swytchcode Durable Pipeline:', pyErr);
    }

    // Run through Swytchcode Durable Workflow Engine
    const workflowResult = await runSwytchcodeDurableWorkflow(formattedPrompt, inspectionContext);

    // Return BOQ with Swytchcode execution metadata attached
    return NextResponse.json({
      ...workflowResult.boq,
      swytchcodeExecutionId: workflowResult.executionId,
      swytchcodeTelemetry: {
        totalDurationMs: workflowResult.totalDurationMs,
        retryAttempts: workflowResult.retryAttempts,
        logs: workflowResult.logs,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to generate BOQ' }, { status: 500 });
  }
}
