import { MIN_CHARITY_PERCENTAGE } from '@/constants/subscription';

/**
 * Calculates monthly and annual charity contributions based on subscription price and percentage
 * @param {Object} params
 * @param {number} params.subscriptionAmount - e.g. 25.00/month or 240.00/year
 * @param {number} params.contributionPercentage - Minimum 10%
 * @param {string} [params.interval='month'] - 'month' or 'year'
 * @returns {Object}
 */
export function calculateCharityContribution({
  subscriptionAmount = 25.0,
  contributionPercentage = 10,
  interval = 'month',
}) {
  const percentage = Math.max(MIN_CHARITY_PERCENTAGE, Number(contributionPercentage) || MIN_CHARITY_PERCENTAGE);
  const totalAmount = Math.max(0, Number(subscriptionAmount) || 0);

  const charityAmount = totalAmount * (percentage / 100);
  const monthlyEquivalent = interval === 'year' ? charityAmount / 12 : charityAmount;
  const yearlyEquivalent = interval === 'year' ? charityAmount : charityAmount * 12;

  return {
    percentage,
    charityAmount: Number(charityAmount.toFixed(2)),
    monthlyEquivalent: Number(monthlyEquivalent.toFixed(2)),
    yearlyEquivalent: Number(yearlyEquivalent.toFixed(2)),
  };
}
