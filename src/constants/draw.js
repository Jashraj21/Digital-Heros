export const PRIZE_TIERS = {
  FIVE_MATCH: '5_match',
  FOUR_MATCH: '4_match',
  THREE_MATCH: '3_match',
};

export const PRIZE_TIER_CONFIG = {
  [PRIZE_TIERS.FIVE_MATCH]: {
    id: '5_match',
    matchesRequired: 5,
    label: '5-Number Match (Jackpot)',
    shortLabel: '5-Match Jackpot',
    poolSharePercentage: 40, // 40% of pool
    allowsRollover: true,
    description: '40% of prize pool + any unclaimed rollover jackpot',
  },
  [PRIZE_TIERS.FOUR_MATCH]: {
    id: '4_match',
    matchesRequired: 4,
    label: '4-Number Match Tier',
    shortLabel: '4-Match Tier',
    poolSharePercentage: 35, // 35% of pool
    allowsRollover: false,
    description: '35% of prize pool, split equally among 4-match winners',
  },
  [PRIZE_TIERS.THREE_MATCH]: {
    id: '3_match',
    matchesRequired: 3,
    label: '3-Number Match Tier',
    shortLabel: '3-Match Tier',
    poolSharePercentage: 25, // 25% of pool
    allowsRollover: false,
    description: '25% of prize pool, split equally among 3-match winners',
  },
};

export const SCORE_RULES = {
  MIN_SCORE: 1,
  MAX_SCORE: 45,
  REQUIRED_SCORE_COUNT: 5,
};

export const DRAW_TYPES = {
  RANDOM: 'random',
  ALGORITHMIC: 'algorithmic',
};
