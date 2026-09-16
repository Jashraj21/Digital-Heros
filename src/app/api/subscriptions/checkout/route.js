import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/server';

export async function POST(req) {
  try {
    const { plan, userId, userEmail } = await req.json();

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/dashboard?checkout_status=success`;
    const cancelUrl = `${origin}/pricing?checkout_status=cancelled`;

    const result = await createCheckoutSession({
      plan,
      userId: userId || 'user-player',
      userEmail: userEmail || 'player@digitalheroes.co.in',
      successUrl,
      cancelUrl,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
