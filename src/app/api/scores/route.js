import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { calculateScoreMetrics } from '@/lib/scores/score-service';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-player';

    const scoreData = store.getUserScores(userId);
    const metrics = calculateScoreMetrics(scoreData.activeScores);

    return NextResponse.json({
      ...scoreData,
      metrics,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId = 'user-player', score, playedAt, courseName, notes, proofUrl, proofFileName, proofNotes } = body;

    const result = store.addScore(userId, { score, playedAt, courseName, notes, proofUrl, proofFileName, proofNotes });
    const scoreData = store.getUserScores(userId);
    const metrics = calculateScoreMetrics(scoreData.activeScores);

    return NextResponse.json({
      success: true,
      newScore: result.newScore,
      replacedScore: result.replacedScore,
      ...scoreData,
      metrics,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId = 'user-player', scoreId, score, playedAt, courseName, notes, proofUrl, proofFileName, proofNotes } = body;

    if (!scoreId) return NextResponse.json({ error: 'Score ID is required' }, { status: 400 });

    const scoreData = store.editScore(userId, scoreId, { score, playedAt, courseName, notes, proofUrl, proofFileName, proofNotes });
    const metrics = calculateScoreMetrics(scoreData.activeScores);

    return NextResponse.json({
      success: true,
      ...scoreData,
      metrics,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-player';
    const scoreId = searchParams.get('scoreId');

    if (!scoreId) return NextResponse.json({ error: 'Score ID is required' }, { status: 400 });

    const scoreData = store.deleteScore(userId, scoreId);
    const metrics = calculateScoreMetrics(scoreData.activeScores);

    return NextResponse.json({
      success: true,
      ...scoreData,
      metrics,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
