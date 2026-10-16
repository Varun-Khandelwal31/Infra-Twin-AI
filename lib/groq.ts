import { retrieveIRCContext } from './ircKnowledgeBase';

export interface BOQItem {
  item: string;
  quantity: string;
  unit: string;
  rateINR: number;
  totalINR: number;
}

export interface BOQResponse {
  summary: string;
  distressAreaSqm: number;
  depthCm: number;
  materials: BOQItem[];
  laborAndEquipment: BOQItem[];
  totalCostINR: number;
  estimatedCO2Kg: number;
  ircCitations: string[];
  executionTimeDays: number;
  source?: 'live' | 'simulated';
  metaCodeAiModel?: string;
}

export async function generateBOQWithLlama(
  prompt: string,
  inspectionContext?: any,
  selectedModel: string = 'llama-3.3-70b-versatile'
): Promise<BOQResponse> {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  const ircContext = retrieveIRCContext(prompt + ' ' + (inspectionContext?.distressType || 'pothole'));

  if (apiKey) {
    try {
      const isCodeMetaAi = selectedModel.includes('codellama');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: isCodeMetaAi
                ? `You are Code Meta AI (Code Llama Specialist) assigned to Nirman Copilot. Synthesize zero-syntax-error structured JSON Bill of Quantities matching this exact schema:
{
  "summary": "string explaining technical rationale",
  "distressAreaSqm": number,
  "depthCm": number,
  "materials": [{"item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "laborAndEquipment": [{"item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "totalCostINR": number,
  "estimatedCO2Kg": number,
  "ircCitations": ["string"],
  "executionTimeDays": number
}

IRC Compliance Grounding:
${ircContext}`
                : `You are Nirman Copilot, an AI Road Infrastructure Engineer trained on Indian Road Congress (IRC) standards.
Always generate a JSON object matching this schema:
{
  "summary": "string explaining technical rationale",
  "distressAreaSqm": number,
  "depthCm": number,
  "materials": [{"item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "laborAndEquipment": [{"item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "totalCostINR": number,
  "estimatedCO2Kg": number,
  "ircCitations": ["string"],
  "executionTimeDays": number
}

Use these IRC Grounding Clauses for compliance:
${ircContext}`,
            },
            {
              role: 'user',
              content: `User prompt: ${prompt}\nInspection Data: ${JSON.stringify(inspectionContext || {})}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as BOQResponse;
          parsed.source = 'live';
          parsed.metaCodeAiModel = selectedModel;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Groq API call fallback triggered:', err);
    }
  }

  // Dynamic Pan-India Prompt Parsing
  let parsedRoadName = inspectionContext?.roadName || 'National Highway Corridor';
  let area = inspectionContext?.metrics?.areaSqm || 2.5;
  let depth = inspectionContext?.metrics?.maxDepthCm || 15;

  // Extract custom location name from user prompt
  const forMatch = prompt.match(/for\s+([^(,]+)/i);
  if (forMatch && forMatch[1] && forMatch[1].trim().length > 2) {
    parsedRoadName = forMatch[1].trim();
  }

  // Extract custom area if present in prompt
  const areaMatch = prompt.match(/area[:\s]+([\d.]+)\s*(sqm|m2|m²)?/i);
  if (areaMatch && areaMatch[1]) {
    const parsedArea = parseFloat(areaMatch[1]);
    if (!isNaN(parsedArea) && parsedArea > 0) area = parsedArea;
  }

  // Extract custom depth if present in prompt
  const depthMatch = prompt.match(/depth[:\s]+([\d.]+)\s*(cm)?/i);
  if (depthMatch && depthMatch[1]) {
    const parsedDepth = parseFloat(depthMatch[1]);
    if (!isNaN(parsedDepth) && parsedDepth > 0) depth = parsedDepth;
  }

  const volume = Number(((area * (depth / 100))).toFixed(3));

  const bitumenTon = (volume * 2.4 * 0.052).toFixed(3); // 5.2% bitumen VG-30 content
  const aggregateTon = (volume * 2.4 * 0.82).toFixed(2);
  const tackCoatL = (area * 0.55).toFixed(1);
  const emulsionL = (area * 6.5).toFixed(1);

  const matBitumenCost = Math.round(parseFloat(bitumenTon) * 64000);
  const matAggCost = Math.round(parseFloat(aggregateTon) * 1650);
  const matTackCost = Math.round(parseFloat(tackCoatL) * 98);
  const matEmulsionCost = Math.round(area * 145);

  const laborCutterCost = Math.round(3500 + area * 250);
  const laborRollerCost = Math.round(6500 + volume * 1800);
  const laborCrewCost = Math.round(4800 + area * 320);

  const totalMaterials = matBitumenCost + matAggCost + matTackCost + matEmulsionCost;
  const totalLabor = laborCutterCost + laborRollerCost + laborCrewCost;
  const totalCost = totalMaterials + totalLabor;
  const co2Estimate = Math.round(volume * 380); // ~380 kg CO2e per m3 asphalt work

  return {
    summary: `BOQ generated in accordance with IRC:82-2023 for ${parsedRoadName} (${area} sq.m surface area, ${depth}cm depth). Recommends full-depth mechanical milling, tack coat sealing (MoRTH 3000), and 2-layer VG-30 Bituminous Concrete (BC) compaction.`,
    distressAreaSqm: area,
    depthCm: depth,
    materials: [
      { item: 'VG-30 Bitumen Mix (BC Type II)', quantity: `${bitumenTon} Ton`, unit: 'Ton', rateINR: 64000, totalINR: matBitumenCost },
      { item: 'Graded Crushed Aggregate (10-20mm)', quantity: `${aggregateTon} Ton`, unit: 'Ton', rateINR: 1650, totalINR: matAggCost },
      { item: 'Bitumen Emulsion RS-1 (Tack Coat)', quantity: `${tackCoatL} Liters`, unit: 'Liter', rateINR: 98, totalINR: matTackCost },
      { item: 'Polymer Modified Binder (PMB-40)', quantity: `${(area * 0.45).toFixed(1)} Kg`, unit: 'Kg', rateINR: 320, totalINR: matEmulsionCost },
    ],
    laborAndEquipment: [
      { item: 'Mechanical Saw Cutter & Milling Crew', quantity: '1 Shift', unit: 'Shift', rateINR: laborCutterCost, totalINR: laborCutterCost },
      { item: 'Vibratory Mini-Roller (3-Ton MDD 98%)', quantity: '1 Shift', unit: 'Shift', rateINR: laborRollerCost, totalINR: laborRollerCost },
      { item: 'Skilled Roadwork Technicians (4 pxx)', quantity: '1 Day', unit: 'Day', rateINR: laborCrewCost, totalINR: laborCrewCost },
    ],
    totalCostINR: totalCost,
    estimatedCO2Kg: co2Estimate,
    ircCitations: [
      'IRC:82-2023 Section 4.3.2 (Full-Depth Patch Repair Standard)',
      'IRC:82-2023 Section 5.1.4 (Edge Sealing & 98% Density Compaction)',
      'MoRTH Section 3000 Clause 3004.3 (Sub-grade Density & Tack Coat Standards)',
      'IRC:37-2018 (Guidelines for Design of Flexible Pavements)',
    ],
    executionTimeDays: area > 5 ? 2 : 1,
    source: 'simulated',
    metaCodeAiModel: selectedModel,
  };
}

