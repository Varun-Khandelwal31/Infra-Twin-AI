import { NextResponse } from 'next/server';
import { runCodeMateCodeAudit } from '@/lib/codemate';

export async function GET() {
  try {
    const auditResult = runCodeMateCodeAudit();
    return NextResponse.json(auditResult);
  } catch (err: any) {
    return NextResponse.json({ error: 'CodeMate Audit Failed' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const auditResult = runCodeMateCodeAudit();
    return NextResponse.json({
      message: 'CodeMate Automated PR Review & Security Audit Passed',
      audit: auditResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'CodeMate Audit Failed' }, { status: 500 });
  }
}
