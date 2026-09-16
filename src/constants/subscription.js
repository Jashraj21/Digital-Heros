export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Hero',
    interval: 'month',
    price: 1999.0,
    formattedPrice: '₹1,999.00 / month',
    charityPercentageDefault: 10,
    prizePoolContribution: 999.5, // 50% of fee goes to monthly prize pool
    features: [
      'Automatic entry into monthly prize draws',
      'Stableford 5-score rolling tracker',
      'Minimum 10% direct charity contribution',
      'Option to boost charity giving anytime',
      'Eligibility for 3, 4 & 5-number cash jackpots',
      'Verified winner payouts & audit trail',
    ],
  },
  yearly: {
    id: 'yearly',
    name: 'Annual Champion',
    interval: 'year',
    price: 19999.0, // Save ~17% compared to monthly
    formattedPrice: '₹19,999.00 / year',
    charityPercentageDefault: 10,
    prizePoolContribution: 10000.0,
    features: [
      'Full 12-month access & all monthly draws',
      'Discounted annual rate (Save over ₹3,900/yr)',
      'Stableford 5-score rolling tracker',
      'Guaranteed continuous charity support',
      'Priority winner verification processing',
      'Dedicated digital badge & impact reports',
    ],
    savingsBadge: 'Save 17%',
  },
};

export const MIN_CHARITY_PERCENTAGE = 10;
export const MAX_CHARITY_PERCENTAGE = 50;
export const DEFAULT_PRIZE_POOL_PORTION = 0.5; // 50% of subscription revenue
export const DEFAULT_CHARITY_PORTION = 0.1; // 10% minimum
export const DEFAULT_OPS_PORTION = 0.4; // 40% platform operations & gateway
