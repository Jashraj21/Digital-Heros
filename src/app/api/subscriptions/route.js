import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-player';

    const subscription = store.getSubscription(userId);
    return NextResponse.json({ subscription });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId = 'user-player', plan, status, cancelAtPeriodEnd } = await req.json();

    const updated = store.updateSubscription(userId, { plan, status, cancelAtPeriodEnd });
    return NextResponse.json({
      success: true,
      subscription: updated,
      message: 'Subscription updated successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
