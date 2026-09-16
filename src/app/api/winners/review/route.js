import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const { verificationId, action, adminId = 'user-admin', rejectionReason = '' } = await req.json();

    if (!verificationId || !['approve', 'reject', 'mark_paid'].includes(action)) {
      return NextResponse.json({ error: 'Valid verification ID and action (approve, reject, mark_paid) required' }, { status: 400 });
    }

    const updated = store.reviewWinnerProof(verificationId, action, adminId, rejectionReason);
    return NextResponse.json({
      success: true,
      verification: updated,
      message: `Winner verification status updated to ${updated.verificationStatus} (Payout: ${updated.payoutStatus}).`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
