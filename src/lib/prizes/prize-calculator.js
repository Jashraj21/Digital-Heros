import { PRIZE_TIERS, PRIZE_TIER_CONFIG } from '@/constants/draw';

/**
 * Computes prize pool allocations across the 3 prize tiers
 * @param {Object} params
 * @param {number} params.monthlyPrizePool - Fresh prize pool amount for this month (e.g. 50% of subscriber fees)
 * @param {number} [params.jackpotBroughtForward=0] - Accumulated jackpot rollover from previous draws
 * @param {Object} params.winnersByTier - Count or array of winners for each tier { '5_match': [...], '4_match': [...], '3_match': [...] }
 * @returns {Object}
 */
export function calculatePrizeDistribution({
  monthlyPrizePool = 0,
  jackpotBroughtForward = 0,
  winnersByTier = {
    [PRIZE_TIERS.FIVE_MATCH]: [],
    [PRIZE_TIERS.FOUR_MATCH]: [],
    [PRIZE_TIERS.THREE_MATCH]: [],
  },
}) {
  const pool = Math.max(0, Number(monthlyPrizePool) || 0);
  const rolloverIn = Math.max(0, Number(jackpotBroughtForward) || 0);

  // Pool allocations based on PRD § 07 (40%, 35%, 25%)
  const fiveMatchAllocated = pool * (PRIZE_TIER_CONFIG[PRIZE_TIERS.FIVE_MATCH].poolSharePercentage / 100);
  const fourMatchAllocated = pool * (PRIZE_TIER_CONFIG[PRIZE_TIERS.FOUR_MATCH].poolSharePercentage / 100);
  const threeMatchAllocated = pool * (PRIZE_TIER_CONFIG[PRIZE_TIERS.THREE_MATCH].poolSharePercentage / 100);

  // Total 5-match jackpot pool includes rollover brought forward
  const fiveMatchTotalPool = fiveMatchAllocated + rolloverIn;

  const fiveWinners = Array.isArray(winnersByTier[PRIZE_TIERS.FIVE_MATCH])
    ? winnersByTier[PRIZE_TIERS.FIVE_MATCH]
    : [];
  const fourWinners = Array.isArray(winnersByTier[PRIZE_TIERS.FOUR_MATCH])
    ? winnersByTier[PRIZE_TIERS.FOUR_MATCH]
    : [];
  const threeWinners = Array.isArray(winnersByTier[PRIZE_TIERS.THREE_MATCH])
    ? winnersByTier[PRIZE_TIERS.THREE_MATCH]
    : [];

  const fiveWinnersCount = fiveWinners.length;
  const fourWinnersCount = fourWinners.length;
  const threeWinnersCount = threeWinners.length;

  // Equal split calculation per winner in each tier
  const payoutPerFiveWinner = fiveWinnersCount > 0 ? fiveMatchTotalPool / fiveWinnersCount : 0;
  const payoutPerFourWinner = fourWinnersCount > 0 ? fourMatchAllocated / fourWinnersCount : 0;
  const payoutPerThreeWinner = threeWinnersCount > 0 ? threeMatchAllocated / threeWinnersCount : 0;

  // Rollover logic: If 0 winners in 5_match, the entire 5_match pool (allocation + previous rollover) carries forward!
  const jackpotCarriedForward = fiveWinnersCount === 0 ? fiveMatchTotalPool : 0;

  return {
    totalFreshPool: pool,
    jackpotBroughtForward: rolloverIn,
    totalEffectivePool: pool + rolloverIn,
    jackpotCarriedForward,
    tierSummaries: {
      [PRIZE_TIERS.FIVE_MATCH]: {
        tier: PRIZE_TIERS.FIVE_MATCH,
        label: PRIZE_TIER_CONFIG[PRIZE_TIERS.FIVE_MATCH].label,
        sharePercentage: 40,
        allocatedAmount: fiveMatchAllocated,
        rolloverFromPrevious: rolloverIn,
        totalTierPool: fiveMatchTotalPool,
        winnerCount: fiveWinnersCount,
        payoutPerWinner: Number(payoutPerFiveWinner.toFixed(2)),
        carriedForward: jackpotCarriedForward,
      },
      [PRIZE_TIERS.FOUR_MATCH]: {
        tier: PRIZE_TIERS.FOUR_MATCH,
        label: PRIZE_TIER_CONFIG[PRIZE_TIERS.FOUR_MATCH].label,
        sharePercentage: 35,
        allocatedAmount: fourMatchAllocated,
        rolloverFromPrevious: 0,
        totalTierPool: fourMatchAllocated,
        winnerCount: fourWinnersCount,
        payoutPerWinner: Number(payoutPerFourWinner.toFixed(2)),
        carriedForward: 0,
      },
      [PRIZE_TIERS.THREE_MATCH]: {
        tier: PRIZE_TIERS.THREE_MATCH,
        label: PRIZE_TIER_CONFIG[PRIZE_TIERS.THREE_MATCH].label,
        sharePercentage: 25,
        allocatedAmount: threeMatchAllocated,
        rolloverFromPrevious: 0,
        totalTierPool: threeMatchAllocated,
        winnerCount: threeWinnersCount,
        payoutPerWinner: Number(payoutPerThreeWinner.toFixed(2)),
        carriedForward: 0,
      },
    },
  };
}
