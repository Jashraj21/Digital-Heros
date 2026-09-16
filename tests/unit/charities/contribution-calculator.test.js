import { describe, it, expect } from 'vitest';
import { calculateCharityContribution } from '@/lib/charities/contribution-calculator';

describe('Charity Contribution Model (§ 08)', () => {
  it('enforces minimum 10% contribution on subscription fee', () => {
    const result = calculateCharityContribution({
      subscriptionAmount: 25.0,
      contributionPercentage: 5, // Below 10%
      interval: 'month',
    });
    expect(result.percentage).toBe(10);
    expect(result.charityAmount).toBe(2.5);
    expect(result.monthlyEquivalent).toBe(2.5);
    expect(result.yearlyEquivalent).toBe(30.0);
  });

  it('allows user to voluntarily increase contribution percentage', () => {
    const result = calculateCharityContribution({
      subscriptionAmount: 25.0,
      contributionPercentage: 25, // 25% boost
      interval: 'month',
    });
    expect(result.percentage).toBe(25);
    expect(result.charityAmount).toBe(6.25);
    expect(result.yearlyEquivalent).toBe(75.0);
  });

  it('calculates yearly subscription charity contribution correctly', () => {
    const result = calculateCharityContribution({
      subscriptionAmount: 240.0,
      contributionPercentage: 15,
      interval: 'year',
    });
    expect(result.percentage).toBe(15);
    expect(result.charityAmount).toBe(36.0);
    expect(result.monthlyEquivalent).toBe(3.0);
    expect(result.yearlyEquivalent).toBe(36.0);
  });
});
