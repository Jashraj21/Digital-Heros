import { PRIZE_TIERS } from '@/constants/draw';

/**
 * Checks how many of the user's 5 submitted scores match the winning numbers
 * @param {number[]} userScores - Array of 5 numbers submitted by user
 * @param {number[]} winningNumbers - Array of 5 winning numbers drawn
 * @returns {{ matchesCount: number, matchedNumbers: number[], tier: string | null }}
 */
export function evaluateDrawMatch(userScores = [], winningNumbers = []) {
  if (!Array.isArray(userScores) || !Array.isArray(winningNumbers)) {
    return { matchesCount: 0, matchedNumbers: [], tier: null };
  }

  const winningSet = new Set(winningNumbers.map(Number));
  // User scores matched against winning numbers
  // Note: duplicate numbers in user submission match if in winning set
  const matchedNumbers = userScores.filter((num) => winningSet.has(Number(num)));
  const matchesCount = matchedNumbers.length;

  let tier = null;
  if (matchesCount === 5) {
    tier = PRIZE_TIERS.FIVE_MATCH;
  } else if (matchesCount === 4) {
    tier = PRIZE_TIERS.FOUR_MATCH;
  } else if (matchesCount === 3) {
    tier = PRIZE_TIERS.THREE_MATCH;
  }

  return {
    matchesCount,
    matchedNumbers,
    tier,
  };
}

/**
 * Returns user-friendly badge styling and description for a prize tier
 * @param {string|null} tier
 * @returns {Object}
 */
export function getTierBadgeConfig(tier) {
  switch (tier) {
    case PRIZE_TIERS.FIVE_MATCH:
      return {
        label: '5-Match Jackpot Winner',
        color: 'from-amber-400 to-yellow-600 text-slate-950 font-bold',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        share: '40% + Rollover Jackpot',
      };
    case PRIZE_TIERS.FOUR_MATCH:
      return {
        label: '4-Match Tier Winner',
        color: 'from-cyan-400 to-blue-500 text-white font-semibold',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        share: '35% Pool Share',
      };
    case PRIZE_TIERS.THREE_MATCH:
      return {
        label: '3-Match Tier Winner',
        color: 'from-emerald-400 to-teal-600 text-white font-semibold',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        share: '25% Pool Share',
      };
    default:
      return {
        label: 'No Prize',
        color: 'text-slate-400',
        badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
        share: '0%',
      };
  }
}
