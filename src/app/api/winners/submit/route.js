import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { validateWinnerProofSubmission } from '@/lib/winners/verification-service';

export async function POST(req) {
  try {
    const { verificationId, proofUrl, proofNotes } = await req.json();

    const validation = validateWinnerProofSubmission({ proofUrl });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updated = store.submitWinnerProof(verificationId, { proofUrl, proofNotes });
    return NextResponse.json({
      success: true,
      verification: updated,
      message: 'Proof submitted successfully. An administrator will review your claim within 24-48 hours.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
