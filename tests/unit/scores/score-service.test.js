import { describe, it, expect } from 'vitest';
import {
  computeRollingScores,
  addScoreWithRollingWindow,
  calculateScoreMetrics,
  sortScoresReverseChronological,
} from '@/lib/scores/score-service';

describe('Score Service & 5-Score Rolling Logic (§ 05)', () => {
  it('sorts scores in reverse chronological order (most recent first)', () => {
    const rawScores = [
      { id: '1', score: 32, playedAt: '2026-01-10' },
      { id: '2', score: 40, playedAt: '2026-03-12' },
      { id: '3', score: 36, playedAt: '2026-02-05' },
    ];
    const sorted = sortScoresReverseChronological(rawScores);
    expect(sorted[0].playedAt).toBe('2026-03-12');
    expect(sorted[1].playedAt).toBe('2026-02-05');
    expect(sorted[2].playedAt).toBe('2026-01-10');
  });

  it('retains only the latest 5 scores as active rolling and automatically archives older ones', () => {
    const sixScores = [
      { id: '1', score: 30, playedAt: '2026-01-01' }, // Oldest -> should be archived
      { id: '2', score: 32, playedAt: '2026-01-15' },
      { id: '3', score: 35, playedAt: '2026-02-01' },
      { id: '4', score: 38, playedAt: '2026-02-15' },
      { id: '5', score: 41, playedAt: '2026-03-01' },
      { id: '6', score: 44, playedAt: '2026-03-10' }, // Newest
    ];

    const { activeScores, archivedScores } = computeRollingScores(sixScores);
    expect(activeScores).toHaveLength(5);
    expect(archivedScores).toHaveLength(1);

    // Active scores should be latest 5 (ids 6, 5, 4, 3, 2)
    const activeIds = activeScores.map((s) => s.id);
    expect(activeIds).toEqual(['6', '5', '4', '3', '2']);
    expect(archivedScores[0].id).toBe('1');
    expect(archivedScores[0].isRollingActive).toBe(false);
  });

  it('automatically rolls out the oldest score when adding a 6th score', () => {
    const existingFive = [
      { id: 's1', score: 30, playedAt: '2026-01-05', isRollingActive: true },
      { id: 's2', score: 33, playedAt: '2026-01-20', isRollingActive: true },
      { id: 's3', score: 36, playedAt: '2026-02-05', isRollingActive: true },
      { id: 's4', score: 39, playedAt: '2026-02-20', isRollingActive: true },
      { id: 's5', score: 42, playedAt: '2026-03-01', isRollingActive: true },
    ];

    const result = addScoreWithRollingWindow(
      { score: 45, playedAt: '2026-03-14', courseName: 'Wentworth' },
      existingFive
    );

    expect(result.success).toBe(true);
    expect(result.activeScores).toHaveLength(5);
    expect(result.replacedScore.id).toBe('s1'); // s1 was the oldest and dropped out
    expect(result.activeScores[0].score).toBe(45);
  });

  it('calculates metrics correctly for active scores', () => {
    const active = [
      { score: 30 },
      { score: 35 },
      { score: 40 },
      { score: 45 },
      { score: 40 },
    ];
    const metrics = calculateScoreMetrics(active);
    expect(metrics.count).toBe(5);
    expect(metrics.averageScore).toBe(38.0);
    expect(metrics.bestScore).toBe(45);
    expect(metrics.isEligibleForDraw).toBe(true);
    expect(metrics.numbersForDraw).toEqual([30, 35, 40, 45, 40]);
  });
});
