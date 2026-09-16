import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const { userId, charityId, amount, donorName, donorEmail, message } = await req.json();

    if (!charityId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid charity ID and donation amount are required' }, { status: 400 });
    }

    const donation = store.addDonation({
      userId,
      charityId,
      amount: Number(amount),
      donorName,
      donorEmail,
      message,
      source: 'direct_donation',
    });

    return NextResponse.json({
      success: true,
      donation,
      message: 'Thank you for your generous direct donation!',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
