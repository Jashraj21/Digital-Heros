import { describe, it, expect } from 'vitest';
import { calculatePrizeDistribution } from '@/lib/prizes/prize-calculator';
import { PRIZE_TIERS } from '@/constants/draw';

describe('Prize Pool Logic & Tier Distributions (§ 07)', () => {
  it('correctly splits ₹10,000 monthly prize pool into 40% / 35% / 25%', () => {
    const result = calculatePrizeDistribution({
      monthlyPrizePool: 10000,
      jackpotBroughtForward: 0,
      winnersByTier: {
        [PRIZE_TIERS.FIVE_MATCH]: [{ id: 'w1' }],
        [PRIZE_TIERS.FOUR_MATCH]: [{ id: 'w2' }],
        [PRIZE_TIERS.THREE_MATCH]: [{ id: 'w3' }],
      },
    });

    expect(result.tierSummaries[PRIZE_TIERS.FIVE_MATCH].allocatedAmount).toBe(4000); // 40%
    expect(result.tierSummaries[PRIZE_TIERS.FOUR_MATCH].allocatedAmount).toBe(3500); // 35%
    expect(result.tierSummaries[PRIZE_TIERS.THREE_MATCH].allocatedAmount).toBe(2500); // 25%
  });

  it('splits tier prize equally among multiple winners in the same tier', () => {
    const result = calculatePrizeDistribution({
      monthlyPrizePool: 10000,
      jackpotBroughtForward: 0,
      winnersByTier: {
        [PRIZE_TIERS.FIVE_MATCH]: [{ id: 'w1' }, { id: 'w2' }], // 2 winners -> ₹4,000 / 2 = ₹2,000 each
        [PRIZE_TIERS.FOUR_MATCH]: [{ id: 'w3' }, { id: 'w4' }, { id: 'w5' }, { id: 'w6' }, { id: 'w7' }], // 5 winners -> ₹3,500 / 5 = ₹700 each
        [PRIZE_TIERS.THREE_MATCH]: [{ id: 'w8' }, { id: 'w9' }], // 2 winners -> ₹2,500 / 2 = ₹1,250 each
      },
    });

    expect(result.tierSummaries[PRIZE_TIERS.FIVE_MATCH].payoutPerWinner).toBe(2000);
    expect(result.tierSummaries[PRIZE_TIERS.FOUR_MATCH].payoutPerWinner).toBe(700);
    expect(result.tierSummaries[PRIZE_TIERS.THREE_MATCH].payoutPerWinner).toBe(1250);
  });

  it('carries forward the 5-match jackpot if unclaimed (0 winners), plus brought-forward rollover', () => {
    const result = calculatePrizeDistribution({
      monthlyPrizePool: 10000,
      jackpotBroughtForward: 5000, // Previous rollover
      winnersByTier: {
        [PRIZE_TIERS.FIVE_MATCH]: [], // 0 winners -> ₹4,000 + ₹5,000 rolls over
        [PRIZE_TIERS.FOUR_MATCH]: [{ id: 'w1' }],
        [PRIZE_TIERS.THREE_MATCH]: [{ id: 'w2' }],
      },
    });

    expect(result.tierSummaries[PRIZE_TIERS.FIVE_MATCH].totalTierPool).toBe(9000); // 4000 + 5000
    expect(result.tierSummaries[PRIZE_TIERS.FIVE_MATCH].winnerCount).toBe(0);
    expect(result.jackpotCarriedForward).toBe(9000);
    expect(result.tierSummaries[PRIZE_TIERS.FIVE_MATCH].carriedForward).toBe(9000);
  });

  it('does NOT rollover unclaimed 4-match or 3-match tiers (PRD § 07 rule: only 5-match has rollover)', () => {
    const result = calculatePrizeDistribution({
      monthlyPrizePool: 10000,
      jackpotBroughtForward: 0,
      winnersByTier: {
        [PRIZE_TIERS.FIVE_MATCH]: [{ id: 'w1' }], // 1 winner -> gets ₹4,000
        [PRIZE_TIERS.FOUR_MATCH]: [], // 0 winners
        [PRIZE_TIERS.THREE_MATCH]: [], // 0 winners
      },
    });

    expect(result.jackpotCarriedForward).toBe(0); // 5-match won, so rollover is 0
    expect(result.tierSummaries[PRIZE_TIERS.FOUR_MATCH].carriedForward).toBe(0);
    expect(result.tierSummaries[PRIZE_TIERS.THREE_MATCH].carriedForward).toBe(0);
  });
});
