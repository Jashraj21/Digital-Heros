import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { DRAW_TYPES } from '@/constants/draw';

export async function POST(req) {
  try {
    const { drawType = DRAW_TYPES.RANDOM, monthlyPrizePool = 15000, winningNumbers = null } = await req.json();

    const simulation = store.simulateDraw({
      drawType,
      monthlyPrizePool: Number(monthlyPrizePool) || 15000,
      forcedWinningNumbers: winningNumbers,
    });

    return NextResponse.json({
      success: true,
      simulation,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
