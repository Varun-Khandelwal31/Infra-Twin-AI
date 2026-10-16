export interface IRCClause {
  code: string;
  title: string;
  clauseNo: string;
  content: string;
  application: string;
}

export const IRC_KNOWLEDGE_BASE: IRCClause[] = [
  {
    code: 'IRC:82-2023',
    title: 'Code of Practice for Maintenance of Bituminous Roads',
    clauseNo: 'Section 4.3.2',
    content: 'Pothole repairs shall be executed by cutting the distressed area into rectangular shapes with vertical edges. The hole shall be cleaned of loose material, coated with Bitumen Emulsion RS-1 tack coat at 0.5 kg/sqm, and filled with Bituminous Concrete (BC) or Dense Bituminous Macadam (DBM) in layers not exceeding 50mm compacted thickness.',
    application: 'Standard repair procedure for deep potholes (> 5cm max depth)',
  },
  {
    code: 'IRC:82-2023',
    title: 'Code of Practice for Maintenance of Bituminous Roads',
    clauseNo: 'Section 5.1.4',
    content: 'Edge sealing and compaction along the perimeter of the patch must achieve a minimum of 98% laboratory density. Sealing coat with rapid curing emulsion shall be applied to prevent moisture ingress into the sub-base.',
    application: 'Patch sealing and SLA edge compliance',
  },
  {
    code: 'IRC:37-2018',
    title: 'Guidelines for Design of Flexible Pavements',
    clauseNo: 'Section 6.2',
    content: 'For heavy arterial traffic (> 30 MSA), the minimum bituminous overlay thickness shall be 40mm BC over 75mm DBM with polymer-modified bitumen (CRMB-55 or PMB-40) to mitigate reflective cracking.',
    application: 'Structural overlay specification for arterial roads & highways',
  },
  {
    code: 'MoRTH Section 3000',
    title: 'Ministry of Road Transport & Highways Specifications for Road Works',
    clauseNo: 'Clause 3004.3',
    content: 'Sub-grade soil compaction shall be verified using Nuclear Density Gauge or Sand Replacement Method. Relative compaction of 97% MDD (Maximum Dry Density) is mandatory before applying prime coat.',
    application: 'Sub-grade compaction audit & contractor SLA verification',
  },
  {
    code: 'IRC:SP:84-2014',
    title: 'Manual of Specifications & Standards for Four Laning of Highways',
    clauseNo: 'Section 2.12',
    content: 'Tolerance limit for surface unevenness measured by Bump Integrator shall not exceed 2000 mm/km for Bituminous Concrete surface course.',
    application: 'Surface smoothness SLA score verification',
  },
];

export function retrieveIRCContext(query: string): string {
  const queryLower = query.toLowerCase();
  const matched = IRC_KNOWLEDGE_BASE.filter(
    clause =>
      clause.code.toLowerCase().includes(queryLower) ||
      clause.title.toLowerCase().includes(queryLower) ||
      clause.content.toLowerCase().includes(queryLower) ||
      clause.application.toLowerCase().includes(queryLower)
  );

  const clausesToInclude = matched.length > 0 ? matched : IRC_KNOWLEDGE_BASE.slice(0, 3);

  return clausesToInclude
    .map(
      c => `[Citation: ${c.code} ${c.clauseNo}] ${c.title}: "${c.content}" (Applies to: ${c.application})`
    )
    .join('\n\n');
}
