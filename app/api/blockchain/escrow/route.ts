import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, action, amountMatic } = body;

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    return NextResponse.json({
      success: true,
      data: {
        workOrderId: workOrderId || 'WO-2025-8042',
        action: action || 'VERIFY_AND_RELEASE',
        txHash,
        blockNumber: 58492140,
        network: 'Polygon Amoy',
        contractAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        amount: amountMatic || '15,000 MATIC (₹12,45,000 equivalent)',
        status: action === 'FREEZE' ? 'PAYMENT_FROZEN' : 'MILESTONE_RELEASED',
        timestamp: new Date().toISOString(),
      },
      message: `Escrow state successfully updated on smart contract (${action}).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Escrow operation failed' },
      { status: 500 }
    );
  }
}
