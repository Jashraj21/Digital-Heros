import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const { email, fullName, password, phone, charityId, contributionPercentage, plan } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    const newUser = store.createUser({
      email,
      fullName,
      phone,
      charityId: charityId || 'charity-1',
      contributionPercentage: contributionPercentage || 10,
      plan: plan || 'monthly',
    });

    const subscription = store.getSubscription(newUser.id);
    return NextResponse.json({ user: newUser, subscription });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
