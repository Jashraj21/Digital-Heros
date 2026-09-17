import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function POST(req) {
  try {
    const result = store.resetDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to reset database' }, { status: 500 });
  }
}
