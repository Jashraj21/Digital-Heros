import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const body = await req.json();
    const { provider = 'google', email, fullName, avatarUrl } = body;

    const validProviders = ['google', 'facebook', 'apple', 'github', 'twitter'];
    if (!validProviders.includes(provider.toLowerCase())) {
      return NextResponse.json({ error: 'Unsupported social provider' }, { status: 400 });
    }

    const { user, subscription } = store.findOrCreateSocialUser({
      provider: provider.toLowerCase(),
      email,
      fullName,
      avatarUrl,
    });

    return NextResponse.json({
      success: true,
      provider,
      user,
      subscription,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Social login failed' }, { status: 500 });
  }
}
