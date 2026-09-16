import { describe, it, expect } from 'vitest';
import {
  generateRandomDrawNumbers,
  generateAlgorithmicDrawNumbers,
  runDrawSimulation,
} from '@/lib/draws/draw-engine';
import { evaluateDrawMatch } from '@/lib/draws/draw-rules';
import { DRAW_TYPES, PRIZE_TIERS } from '@/constants/draw';

describe('Draw Engine & Matching Rules (§ 06)', () => {
  it('generates 5 unique numbers in ascending order within range 1 to 45', () => {
    const numbers = generateRandomDrawNumbers();
    expect(numbers).toHaveLength(5);
    const uniqueSet = new Set(numbers);
    expect(uniqueSet.size).toBe(5);
    numbers.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(45);
    });
    // Verify ascending order
    for (let i = 0; i < numbers.length - 1; i++) {
      expect(numbers[i]).toBeLessThan(numbers[i + 1]);
    }
  });

  it('correctly evaluates 5-match, 4-match, 3-match, and sub-3 match cases', () => {
    const winning = [10, 20, 30, 40, 45];

    // 5 matches
    const r5 = evaluateDrawMatch([10, 20, 30, 40, 45], winning);
    expect(r5.matchesCount).toBe(5);
    expect(r5.tier).toBe(PRIZE_TIERS.FIVE_MATCH);

    // 4 matches
    const r4 = evaluateDrawMatch([10, 20, 30, 40, 1], winning);
    expect(r4.matchesCount).toBe(4);
    expect(r4.tier).toBe(PRIZE_TIERS.FOUR_MATCH);

    // 3 matches
    const r3 = evaluateDrawMatch([10, 20, 30, 2, 3], winning);
    expect(r3.matchesCount).toBe(3);
    expect(r3.tier).toBe(PRIZE_TIERS.THREE_MATCH);

    // 2 matches -> no tier
    const r2 = evaluateDrawMatch([10, 20, 1, 2, 3], winning);
    expect(r2.matchesCount).toBe(2);
    expect(r2.tier).toBeNull();
  });

  it('runs complete draw simulation correctly with multiple subscribers', () => {
    const subscribers = [
      { id: 'sub-1', fullName: 'Alice Hero', submittedScores: [10, 20, 30, 40, 45] }, // 5 match
      { id: 'sub-2', fullName: 'Bob Hero', submittedScores: [10, 20, 30, 40, 1] },   // 4 match
      { id: 'sub-3', fullName: 'Charlie Hero', submittedScores: [10, 20, 30, 2, 3] }, // 3 match
      { id: 'sub-4', fullName: 'Dave Hero', submittedScores: [1, 2, 3, 4, 5] },       // 0 match
    ];

    const simulation = runDrawSimulation({
      drawType: DRAW_TYPES.RANDOM,
      forcedWinningNumbers: [10, 20, 30, 40, 45],
      subscribers,
      monthlyPrizePool: 10000,
      jackpotBroughtForward: 2000,
    });

    expect(simulation.eligibleEntriesCount).toBe(4);
    expect(simulation.tierSummaries[PRIZE_TIERS.FIVE_MATCH].winnerCount).toBe(1);
    expect(simulation.tierSummaries[PRIZE_TIERS.FIVE_MATCH].payoutPerWinner).toBe(6000); // ₹4,000 + ₹2,000 rollover
    expect(simulation.tierSummaries[PRIZE_TIERS.FOUR_MATCH].winnerCount).toBe(1);
    expect(simulation.tierSummaries[PRIZE_TIERS.FOUR_MATCH].payoutPerWinner).toBe(3500);
    expect(simulation.tierSummaries[PRIZE_TIERS.THREE_MATCH].winnerCount).toBe(1);
    expect(simulation.tierSummaries[PRIZE_TIERS.THREE_MATCH].payoutPerWinner).toBe(2500);
    expect(simulation.winners).toHaveLength(3);
  });
});
