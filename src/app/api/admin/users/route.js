import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET() {
  try {
    const users = store.getAllUsers();
    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
