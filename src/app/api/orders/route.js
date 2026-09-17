import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if ((userId && userId !== 'all') || email) {
      const orders = store.getOrdersByUser(userId, email);
      return NextResponse.json({ success: true, orders });
    }

    const orders = store.getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newOrder = store.addOrder(body);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to record order' }, { status: 500 });
  }
}
