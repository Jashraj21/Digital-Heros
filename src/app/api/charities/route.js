import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { filterCharities } from '@/lib/charities/charity-service';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'All Categories';
    const search = searchParams.get('search') || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    let charities = store.getAllCharities();
    if (featuredOnly) {
      charities = charities.filter((c) => c.featured);
    }
    const filtered = filterCharities(charities, { category, search });

    return NextResponse.json({
      charities: filtered,
      total: filtered.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newCharity = store.createCharity(body);
    return NextResponse.json({ success: true, charity: newCharity });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
