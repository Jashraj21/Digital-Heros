import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      orderId,
      paymentId,
      signature,
      type = 'subscription',
      plan = 'monthly',
      userId = 'user-player',
      charityId,
      amount,
      donorName,
      message,
    } = body;

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Razorpay signature' }, { status: 400 });
    }

    if (type === 'subscription') {
      const updatedSub = store.updateSubscription(userId, {
        plan,
        status: 'active',
        cancelAtPeriodEnd: false,
      });

      const orderRecord = store.addOrder({
        userId,
        type: 'subscription',
        plan,
        amount: plan === 'yearly' ? 19999 : 1999,
        paymentId,
        orderId,
        paymentMethod: 'Razorpay Verified',
      });

      return NextResponse.json({
        success: true,
        verified: true,
        type: 'subscription',
        subscription: updatedSub,
        order: orderRecord,
        paymentId,
        message: `Successfully activated ${plan === 'yearly' ? 'Annual Champion' : 'Monthly Hero'} subscription via Razorpay!`,
      });
    }

    if (type === 'donation') {
      const donation = store.addDonation({
        userId,
        charityId,
        amount: Number(amount),
        donorName: donorName || 'Razorpay Supporter',
        message: message || 'Direct donation via Razorpay',
      });

      const orderRecord = store.addOrder({
        userId,
        type: 'donation',
        charityId,
        amount: Number(amount),
        donorName,
        paymentId,
        orderId,
        paymentMethod: 'Razorpay Verified',
      });

      return NextResponse.json({
        success: true,
        verified: true,
        type: 'donation',
        donation,
        order: orderRecord,
        paymentId,
        message: 'Direct charity donation verified and recorded via Razorpay!',
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
