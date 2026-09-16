import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const latestOnly = searchParams.get('latest') === 'true';

    if (id) {
      const draw = store.getDrawById(id);
      if (!draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
      return NextResponse.json({ draw });
    }

    if (latestOnly) {
      const latest = store.getLatestPublishedDraw();
      return NextResponse.json({ draw: latest });
    }

    const draws = store.getAllDraws();
    return NextResponse.json({ draws, total: draws.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
