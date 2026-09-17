import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const { email, password, fullName, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { user, subscription } = store.findOrCreateEmailUser({
      email,
      fullName,
      password,
      role,
    });

    return NextResponse.json({ success: true, user, subscription });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
