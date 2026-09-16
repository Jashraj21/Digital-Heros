import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action = 'verify', phone, code, fullName } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (action === 'send_otp') {
      // In development/test mode, simulate sending OTP (or real Supabase Twilio OTP)
      return NextResponse.json({
        success: true,
        message: `OTP sent to ${phone}`,
        mockOtp: '123456',
      });
    }

    // Verification step
    if (action === 'verify') {
      if (!code || code.length < 4) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit OTP code' }, { status: 400 });
      }

      const { user, subscription } = store.findOrCreatePhoneUser({
        phone,
        fullName,
      });

      return NextResponse.json({
        success: true,
        user,
        subscription,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Phone authentication failed' }, { status: 500 });
  }
}
