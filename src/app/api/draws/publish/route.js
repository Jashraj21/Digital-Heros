import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { DRAW_TYPES } from '@/constants/draw';

export async function POST(req) {
  try {
    const {
      title,
      drawDate,
      monthYear,
      drawType = DRAW_TYPES.RANDOM,
      monthlyPrizePool = 15000,
      winningNumbers = null,
    } = await req.json();

    const newDraw = store.publishDraw({
      title,
      drawDate,
      monthYear,
      drawType,
      monthlyPrizePool: Number(monthlyPrizePool) || 15000,
      winningNumbers,
    });

    return NextResponse.json({
      success: true,
      draw: newDraw,
      message: `Draw #${newDraw.drawNumber} successfully published with ${newDraw.subscribersCount} eligible participants!`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
