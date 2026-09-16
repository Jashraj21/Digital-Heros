import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET() {
  try {
    const stats = store.getPlatformStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
