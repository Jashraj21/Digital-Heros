import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay/server';
import { SUBSCRIPTION_PLANS } from '@/constants/subscription';

export async function POST(req) {
  try {
    const body = await req.json();
    const { plan = 'monthly', type = 'subscription', amount, charityId, userId = 'user-player', userEmail } = body;

    let finalAmount = 1999;
    if (type === 'subscription') {
      finalAmount = plan === 'yearly' ? SUBSCRIPTION_PLANS.yearly.price : SUBSCRIPTION_PLANS.monthly.price;
    } else if (type === 'donation') {
      finalAmount = Number(amount) || 500;
    }

    const receipt = `dh_${type.slice(0, 3)}_${Date.now()}`;
    const notes = {
      type,
      plan: type === 'subscription' ? plan : undefined,
      userId,
      userEmail: userEmail || 'player@digitalheroes.co.in',
      charityId: charityId || undefined,
    };

    const order = await createRazorpayOrder({
      amount: finalAmount,
      currency: 'INR',
      receipt,
      notes,
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create Razorpay order' }, { status: 500 });
  }
}
