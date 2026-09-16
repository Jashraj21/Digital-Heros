import { describe, it, expect } from 'vitest';
import { validateScoreEntry } from '@/lib/scores/score-validation';

describe('Score Validation (§ 05)', () => {
  it('accepts valid Stableford score between 1 and 45 with a valid date', () => {
    const result = validateScoreEntry({ score: 36, playedAt: '2026-03-01' });
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects score below 1', () => {
    const result = validateScoreEntry({ score: 0, playedAt: '2026-03-01' });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must be between 1 and 45');
  });

  it('rejects score above 45', () => {
    const result = validateScoreEntry({ score: 46, playedAt: '2026-03-01' });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must be between 1 and 45');
  });

  it('rejects decimal scores', () => {
    const result = validateScoreEntry({ score: 36.5, playedAt: '2026-03-01' });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('whole number');
  });

  it('rejects duplicate date entry for the same user (§ 05 note: only one score entry per date)', () => {
    const existing = [
      { id: '1', score: 38, playedAt: '2026-03-05' },
      { id: '2', score: 34, playedAt: '2026-03-01' },
    ];
    const result = validateScoreEntry({ score: 40, playedAt: '2026-03-05' }, existing);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Only one score is permitted per date');
  });

  it('allows saving when editing the existing score with the same date', () => {
    const existing = [
      { id: 'score-1', score: 38, playedAt: '2026-03-05' },
    ];
    const result = validateScoreEntry({ score: 40, playedAt: '2026-03-05' }, existing, 'score-1');
    expect(result.isValid).toBe(true);
  });
});
