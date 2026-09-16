import { DRAW_TYPES, PRIZE_TIERS, SCORE_RULES } from '@/constants/draw';
import { evaluateDrawMatch } from './draw-rules';
import { calculatePrizeDistribution } from '../prizes/prize-calculator';

/**
 * Generates 5 unique random numbers between 1 and 45 (Standard lottery style)
 * @returns {number[]} Array of 5 sorted unique numbers
 */
export function generateRandomDrawNumbers() {
  const numbers = new Set();
  while (numbers.size < SCORE_RULES.REQUIRED_SCORE_COUNT) {
    const num = Math.floor(Math.random() * (SCORE_RULES.MAX_SCORE - SCORE_RULES.MIN_SCORE + 1)) + SCORE_RULES.MIN_SCORE;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Generates 5 unique numbers weighted by the frequency of active scores among subscribers
 * @param {Array<{ submittedScores: number[] }>} subscriberEntries - List of active subscriber entries
 * @returns {number[]} Array of 5 sorted unique numbers
 */
export function generateAlgorithmicDrawNumbers(subscriberEntries = []) {
  // Build frequency map for numbers 1 to 45
  const frequencyMap = {};
  for (let i = SCORE_RULES.MIN_SCORE; i <= SCORE_RULES.MAX_SCORE; i++) {
    frequencyMap[i] = 1; // baseline smoothing weight
  }

  // Count occurrences in active subscriber submissions
  for (const entry of subscriberEntries) {
    if (Array.isArray(entry.submittedScores)) {
      for (const score of entry.submittedScores) {
        const num = Number(score);
        if (num >= SCORE_RULES.MIN_SCORE && num <= SCORE_RULES.MAX_SCORE) {
          frequencyMap[num] = (frequencyMap[num] || 1) + 3; // Boost weight
        }
      }
    }
  }

  const selectedNumbers = new Set();
  const availablePool = [];

  // Populate weighted wheel
  for (let num = SCORE_RULES.MIN_SCORE; num <= SCORE_RULES.MAX_SCORE; num++) {
    const weight = frequencyMap[num] || 1;
    for (let w = 0; w < weight; w++) {
      availablePool.push(num);
    }
  }

  while (selectedNumbers.size < SCORE_RULES.REQUIRED_SCORE_COUNT) {
    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const chosen = availablePool[randomIndex];
    selectedNumbers.add(chosen);
  }

  return Array.from(selectedNumbers).sort((a, b) => a - b);
}

/**
 * Runs a complete draw simulation for admin preview or official execution
 * @param {Object} params
 * @param {string} [params.drawType='random'] - 'random' or 'algorithmic'
 * @param {number[]} [params.forcedWinningNumbers] - Optional predetermined winning numbers for deterministic testing
 * @param {Array} params.subscribers - List of active subscribers with their rolling 5 scores
 * @param {number} params.monthlyPrizePool - Fresh monthly prize pool (e.g. ₹1,000 per subscriber)
 * @param {number} [params.jackpotBroughtForward=0] - Accumulated rollover
 * @returns {Object} Full simulation outcome
 */
export function runDrawSimulation({
  drawType = DRAW_TYPES.RANDOM,
  forcedWinningNumbers = null,
  subscribers = [],
  monthlyPrizePool = 0,
  jackpotBroughtForward = 0,
}) {
  // 1. Filter eligible subscribers (must have active subscription and 5 rolling scores)
  const eligibleEntries = subscribers
    .filter((sub) => {
      const scores = sub.activeScores || sub.submittedScores || [];
      return scores.length === SCORE_RULES.REQUIRED_SCORE_COUNT;
    })
    .map((sub) => ({
      userId: sub.id || sub.userId,
      userName: sub.fullName || sub.name || 'Anonymous Hero',
      userEmail: sub.email || '',
      submittedScores: (sub.activeScores || sub.submittedScores).map((s) => (typeof s === 'object' ? s.score : s)),
    }));

  // 2. Generate winning numbers based on draw logic
  let winningNumbers = [];
  if (Array.isArray(forcedWinningNumbers) && forcedWinningNumbers.length === SCORE_RULES.REQUIRED_SCORE_COUNT) {
    winningNumbers = [...forcedWinningNumbers].sort((a, b) => a - b);
  } else if (drawType === DRAW_TYPES.ALGORITHMIC) {
    winningNumbers = generateAlgorithmicDrawNumbers(eligibleEntries);
  } else {
    winningNumbers = generateRandomDrawNumbers();
  }

  // 3. Evaluate each subscriber's match against winning numbers
  const winnersByTier = {
    [PRIZE_TIERS.FIVE_MATCH]: [],
    [PRIZE_TIERS.FOUR_MATCH]: [],
    [PRIZE_TIERS.THREE_MATCH]: [],
  };

  const processedEntries = eligibleEntries.map((entry) => {
    const evaluation = evaluateDrawMatch(entry.submittedScores, winningNumbers);
    const entryResult = {
      ...entry,
      matchesCount: evaluation.matchesCount,
      matchedNumbers: evaluation.matchedNumbers,
      prizeTier: evaluation.tier,
      prizeAmount: 0,
    };

    if (evaluation.tier && winnersByTier[evaluation.tier]) {
      winnersByTier[evaluation.tier].push(entryResult);
    }

    return entryResult;
  });

  // 4. Calculate prize pool distribution & equal splits
  const prizeDistribution = calculatePrizeDistribution({
    monthlyPrizePool,
    jackpotBroughtForward,
    winnersByTier,
  });

  // 5. Assign exact payout amounts to individual winning entries
  const allWinners = [];
  for (const tier of [PRIZE_TIERS.FIVE_MATCH, PRIZE_TIERS.FOUR_MATCH, PRIZE_TIERS.THREE_MATCH]) {
    const tierSummary = prizeDistribution.tierSummaries[tier];
    const tierWinners = winnersByTier[tier];

    for (const winner of tierWinners) {
      winner.prizeAmount = tierSummary.payoutPerWinner;
      allWinners.push({
        tier,
        userId: winner.userId,
        userName: winner.userName,
        userEmail: winner.userEmail,
        submittedScores: winner.submittedScores,
        matchedNumbers: winner.matchedNumbers,
        prizeAmount: tierSummary.payoutPerWinner,
      });
    }
  }

  return {
    drawType,
    winningNumbers,
    totalFreshPool: prizeDistribution.totalFreshPool,
    jackpotBroughtForward: prizeDistribution.jackpotBroughtForward,
    totalEffectivePool: prizeDistribution.totalEffectivePool,
    jackpotCarriedForward: prizeDistribution.jackpotCarriedForward,
    totalSubscribersCount: subscribers.length,
    eligibleEntriesCount: eligibleEntries.length,
    tierSummaries: prizeDistribution.tierSummaries,
    winners: allWinners,
    processedEntries,
  };
}
