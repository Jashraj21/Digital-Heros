import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const { userId = 'user-player', isAutopay } = await req.json();

    const currentSub = store.getSubscription(userId);
    if (!currentSub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    const updated = store.updateSubscription(userId, {
      isAutopay: Boolean(isAutopay),
      mandateStatus: isAutopay ? 'active' : 'paused',
      cancelAtPeriodEnd: !isAutopay,
    });

    return NextResponse.json({
      success: true,
      subscription: updated,
      message: isAutopay
        ? 'Autopay recurring billing activated via Razorpay e-Mandate.'
        : 'Autopay recurring billing paused. Subscription will not auto-renew.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update autopay status' }, { status: 500 });
  }
}
