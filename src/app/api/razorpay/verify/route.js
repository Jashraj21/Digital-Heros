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
      const isYearly = plan === 'yearly';
      const updatedSub = store.updateSubscription(userId, {
        plan,
        status: 'active',
        isAutopay: true,
        mandateStatus: 'active',
        mandateType: 'UPI Autopay / e-Mandate',
        frequency: isYearly ? 'yearly' : 'monthly',
        cancelAtPeriodEnd: false,
      });

      const orderRecord = store.addOrder({
        userId,
        userName: body.userName || 'Jashraaj Sharma',
        userEmail: body.userEmail || 'jashraaj@gmail.com',
        type: 'subscription',
        plan,
        isAutopay: true,
        mandateStatus: 'active',
        itemDescription: isYearly ? 'Annual Champion Golfer Membership (Autopay)' : 'Monthly Hero Golfer Membership (Autopay)',
        amount: isYearly ? 19999 : 1999,
        paymentId,
        orderId,
        paymentMethod: body.paymentMethod || 'UPI Autopay / e-Mandate (Razorpay)',
      });

      return NextResponse.json({
        success: true,
        verified: true,
        type: 'subscription',
        isAutopay: true,
        subscription: updatedSub,
        order: orderRecord,
        paymentId,
        message: `Successfully activated ${isYearly ? 'Annual Champion' : 'Monthly Hero'} subscription with Razorpay Autopay!`,
      });
    }

    if (type === 'donation') {
      const donation = store.addDonation({
        userId,
        charityId,
        amount: Number(amount),
        donorName: donorName || body.userName || 'Razorpay Supporter',
        message: message || 'Direct donation via Razorpay',
      });

      const orderRecord = store.addOrder({
        userId,
        userName: donorName || body.userName || 'Jashraaj Sharma',
        userEmail: body.userEmail || body.donorEmail || 'jashraaj@gmail.com',
        type: 'donation',
        charityId,
        amount: Number(amount),
        paymentId,
        orderId,
        paymentMethod: body.paymentMethod || 'UPI / Razorpay Verified',
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
