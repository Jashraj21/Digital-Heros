import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const userVerifications = store.getVerificationsByUser(userId);
      return NextResponse.json({ verifications: userVerifications });
    }

    const allVerifications = store.getAllVerifications();
    return NextResponse.json({
      verifications: allVerifications,
      total: allVerifications.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
