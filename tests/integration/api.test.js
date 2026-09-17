import { describe, it, expect } from 'vitest';
import { store } from '@/lib/data/mock-store';
import { calculateScoreMetrics } from '@/lib/scores/score-service';
import { DRAW_TYPES, PRIZE_TIERS } from '@/constants/draw';

describe('End-to-End System & API Integration Tests', () => {
  it('verifies initial seed data is loaded with admin, player, charities, and past draws', () => {
    const admin = store.getUserByEmail('admin@admin.in');
    const adminDh = store.getUserByEmail('admin@digitalheroes.co.in');
    const player = store.getUserByEmail('player@digitalheroes.co.in');
    const charities = store.getAllCharities();
    const draws = store.getAllDraws();

    expect(admin).toBeDefined();
    expect(admin.role).toBe('admin');

    expect(adminDh).toBeDefined();
    expect(adminDh.role).toBe('admin');

    expect(player).toBeDefined();
    expect(player.role).toBe('user');

    expect(charities.length).toBeGreaterThanOrEqual(3);
    expect(draws.length).toBeGreaterThanOrEqual(2);
  });

  it('performs full subscriber score entry lifecycle (add -> rolling 5 update -> delete -> recalculate)', () => {
    const initial = store.getUserScores('user-player');
    expect(initial.activeScores).toHaveLength(5);

    const addResult = store.addScore('user-player', {
      score: 44,
      playedAt: '2026-03-15',
      courseName: 'Royal Troon',
      notes: 'Testing rolling addition',
    });

    expect(addResult.activeScores).toHaveLength(5);
    expect(addResult.newScore.score).toBe(44);
    expect(addResult.activeScores[0].score).toBe(44);

    const afterDelete = store.deleteScore('user-player', addResult.newScore.id);
    expect(afterDelete.activeScores).toHaveLength(5);
  });

  it('performs full charity preference & direct donation workflow (§ 08)', () => {
    const updatedPref = store.setCharityPreference('user-player', 'charity-2', 25);
    expect(updatedPref.contributionPercentage).toBe(25);
    expect(updatedPref.charityId).toBe('charity-2');

    const charityBefore = store.getCharityById('charity-2');
    const prevRaised = charityBefore.totalRaised;

    const donation = store.addDonation({
      userId: 'user-player',
      charityId: 'charity-2',
      amount: 75.0,
      donorName: 'James MacIntyre',
      message: 'Keep supporting adaptive golfers!',
    });

    expect(donation.status).toBe('completed');
    const charityAfter = store.getCharityById('charity-2');
    expect(charityAfter.totalRaised).toBe(prevRaised + 75.0);
  });

  it('performs full draw simulation and publishing workflow with jackpot rollover (§ 06 & § 07)', () => {
    const simulation = store.simulateDraw({
      drawType: DRAW_TYPES.ALGORITHMIC,
      monthlyPrizePool: 20000,
    });

    expect(simulation.winningNumbers).toHaveLength(5);
    expect(simulation.totalFreshPool).toBe(20000);
    expect(simulation.tierSummaries[PRIZE_TIERS.FIVE_MATCH].sharePercentage).toBe(40);
    expect(simulation.tierSummaries[PRIZE_TIERS.FOUR_MATCH].sharePercentage).toBe(35);
    expect(simulation.tierSummaries[PRIZE_TIERS.THREE_MATCH].sharePercentage).toBe(25);

    const published = store.publishDraw({
      title: 'April 2026 Test Heroes Draw',
      drawDate: '2026-04-30',
      monthYear: 'April 2026',
      drawType: DRAW_TYPES.RANDOM,
      monthlyPrizePool: 20000,
    });

    expect(published.status).toBe('published');
    expect(published.drawNumber).toBeGreaterThan(100);
  });

  it('performs full winner verification lifecycle (submit proof -> approve -> mark paid) (§ 09)', () => {
    let verifications = store.getAllVerifications();
    if (verifications.length === 0) {
      store.verifications.push({
        id: 'ver-test-1',
        drawId: 'draw-mar-2026',
        drawNumber: 102,
        drawMonthYear: 'March 2026',
        userId: 'user-player',
        userName: 'Jashraaj Sharma',
        userEmail: 'player@digitalheroes.co.in',
        prizeTier: '5_match',
        prizeAmount: 110000.0,
        matchedNumbers: [35, 36, 38, 39, 42],
        submittedScores: [38, 42, 35, 39, 36],
        verificationStatus: 'pending',
        payoutStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      verifications = store.getAllVerifications();
    }
    expect(verifications.length).toBeGreaterThan(0);

    const pendingClaim = verifications.find((v) => v.verificationStatus === 'pending') || verifications[0];

    const withProof = store.submitWinnerProof(pendingClaim.id, {
      proofUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800',
      proofNotes: 'Scorecard verified with golf club secretary',
    });
    expect(withProof.proofUrl).toBeDefined();

    const approved = store.reviewWinnerProof(pendingClaim.id, 'approve', 'user-admin');
    expect(approved.verificationStatus).toBe('approved');

    const paid = store.reviewWinnerProof(pendingClaim.id, 'mark_paid', 'user-admin');
    expect(paid.payoutStatus).toBe('paid');
    expect(paid.paidAt).toBeDefined();
  });

  it('performs social authentication with Google/Facebook/Apple with auto-seeded rolling scores', () => {
    const { user, subscription } = store.findOrCreateSocialUser({
      provider: 'google',
      email: 'jashraaj21@gmail.com',
      fullName: 'Jashraaj Sharma',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('jashraaj21@gmail.com');
    expect(user.fullName).toBe('Jashraaj Sharma');
    expect(user.authProvider).toBe('google');
    expect(subscription).toBeDefined();
    expect(subscription.status).toBe('active');
    expect(subscription.currency).toBe('INR');

    const scores = store.getUserScores(user.id);
    const metrics = calculateScoreMetrics(scores.activeScores);
    expect(scores.activeScores).toHaveLength(5);
    expect(metrics.isEligibleForDraw).toBe(true);
  });

  it('performs phone number OTP authentication with auto-seeded rolling scores and subscription', () => {
    const { user, subscription } = store.findOrCreatePhoneUser({
      phone: '+91 98765 43210',
      fullName: 'Jashraaj Sharma',
    });

    expect(user).toBeDefined();
    expect(user.phone).toBe('+91 98765 43210');
    expect(user.authProvider).toBe('phone');
    expect(subscription).toBeDefined();
    expect(subscription.status).toBe('active');
    expect(subscription.currency).toBe('INR');

    const scores = store.getUserScores(user.id);
    const metrics = calculateScoreMetrics(scores.activeScores);
    expect(scores.activeScores).toHaveLength(5);
    expect(metrics.isEligibleForDraw).toBe(true);
  });

  it('performs email auto-provisioning login with guaranteed 5 rolling scores and active INR subscription', () => {
    const { user, subscription } = store.findOrCreateEmailUser({
      email: 'new.champion@example.com',
      fullName: 'New Champion Golfer',
      password: 'mypassword',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('new.champion@example.com');
    expect(subscription).toBeDefined();
    expect(subscription.status).toBe('active');
    expect(subscription.currency).toBe('INR');

    const scores = store.getUserScores(user.id);
    const metrics = calculateScoreMetrics(scores.activeScores);
    expect(scores.activeScores).toHaveLength(5);
    expect(metrics.isEligibleForDraw).toBe(true);
  });
});
