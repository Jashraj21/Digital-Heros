import { INITIAL_CHARITIES } from '@/constants/charities';
import { SUBSCRIPTION_PLANS } from '@/constants/subscription';
import { DRAW_TYPES, PRIZE_TIERS } from '@/constants/draw';
import { addScoreWithRollingWindow, computeRollingScores } from '../scores/score-service';
import { runDrawSimulation } from '../draws/draw-engine';
import { processWinnerVerificationAction } from '../winners/verification-service';

// Initial Demo Users
const INITIAL_USERS = [
  {
    id: 'user-admin',
    email: 'admin@digitalheroes.co.in',
    fullName: 'David Sterling (Admin)',
    role: 'admin',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'user-player',
    email: 'player@digitalheroes.co.in',
    fullName: 'Jashraaj Sharma',
    role: 'user',
    phone: '+91 98123 45678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: 'user-2',
    email: 'priya.nair@example.com',
    fullName: 'Priya Nair',
    role: 'user',
    phone: '+91 98234 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: 'user-3',
    email: 'rohit.verma@example.com',
    fullName: 'Rohit Verma',
    role: 'user',
    phone: '+91 98345 67890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: 'user-4',
    email: 'ananya.iyer@example.com',
    fullName: 'Ananya Iyer',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'user-5',
    email: 'arjun.singh@example.com',
    fullName: 'Arjun Singh',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-03-05T00:00:00.000Z',
  },
];

// Initial Subscriptions
const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'sub-player',
    userId: 'user-player',
    plan: 'monthly',
    status: 'active',
    priceAmount: 1999.0,
    currency: 'INR',
    currentPeriodStart: '2026-03-01T00:00:00.000Z',
    currentPeriodEnd: '2026-04-01T00:00:00.000Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: 'sub-2',
    userId: 'user-2',
    plan: 'yearly',
    status: 'active',
    priceAmount: 19999.0,
    currency: 'INR',
    currentPeriodStart: '2026-01-01T00:00:00.000Z',
    currentPeriodEnd: '2027-01-01T00:00:00.000Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: 'sub-3',
    userId: 'user-3',
    plan: 'monthly',
    status: 'active',
    priceAmount: 1999.0,
    currency: 'INR',
    currentPeriodStart: '2026-03-05T00:00:00.000Z',
    currentPeriodEnd: '2026-04-05T00:00:00.000Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: 'sub-4',
    userId: 'user-4',
    plan: 'monthly',
    status: 'active',
    priceAmount: 1999.0,
    currency: 'INR',
    currentPeriodStart: '2026-03-01T00:00:00.000Z',
    currentPeriodEnd: '2026-04-01T00:00:00.000Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'sub-5',
    userId: 'user-5',
    plan: 'yearly',
    status: 'active',
    priceAmount: 19999.0,
    currency: 'INR',
    currentPeriodStart: '2026-01-15T00:00:00.000Z',
    currentPeriodEnd: '2027-01-15T00:00:00.000Z',
    cancelAtPeriodEnd: false,
    createdAt: '2025-03-05T00:00:00.000Z',
  },
];

// Initial Golf Scores (Stableford 1-45, dated)
const INITIAL_SCORES = [
  // user-player scores (5 active rolling scores + 1 older archived)
  { id: 'sc-1', userId: 'user-player', score: 38, playedAt: '2026-03-12', courseName: 'Delhi Golf Club', notes: 'Great back nine, 4 birdies.', isRollingActive: true, createdAt: '2026-03-12T18:00:00.000Z' },
  { id: 'sc-2', userId: 'user-player', score: 42, playedAt: '2026-03-08', courseName: 'Royal Calcutta Golf Club', notes: 'Personal best Stableford of the season!', isRollingActive: true, createdAt: '2026-03-08T17:30:00.000Z' },
  { id: 'sc-3', userId: 'user-player', score: 35, playedAt: '2026-03-01', courseName: 'Karnataka Golf Association (KGA)', notes: 'Breezy conditions, steady putts.', isRollingActive: true, createdAt: '2026-03-01T16:00:00.000Z' },
  { id: 'sc-4', userId: 'user-player', score: 39, playedAt: '2026-02-22', courseName: 'Bombay Presidency Golf Club', notes: 'Solid iron play all afternoon.', isRollingActive: true, createdAt: '2026-02-22T15:45:00.000Z' },
  { id: 'sc-5', userId: 'user-player', score: 36, playedAt: '2026-02-14', courseName: 'DLF Golf & Country Club', notes: 'Clean card, 2 sand saves.', isRollingActive: true, createdAt: '2026-02-14T16:20:00.000Z' },
  { id: 'sc-0', userId: 'user-player', score: 31, playedAt: '2026-01-30', courseName: 'Jaypee Greens Golf Resort', notes: 'Tricky greens.', isRollingActive: false, createdAt: '2026-01-30T15:00:00.000Z' },

  // user-2 scores
  { id: 'sc-21', userId: 'user-2', score: 38, playedAt: '2026-03-10', courseName: 'Oxford Golf Resort', isRollingActive: true, createdAt: '2026-03-10T14:00:00.000Z' },
  { id: 'sc-22', userId: 'user-2', score: 42, playedAt: '2026-03-04', courseName: 'Prestige Golfshire', isRollingActive: true, createdAt: '2026-03-04T14:00:00.000Z' },
  { id: 'sc-23', userId: 'user-2', score: 35, playedAt: '2026-02-26', courseName: 'Classic Golf Resort', isRollingActive: true, createdAt: '2026-02-26T14:00:00.000Z' },
  { id: 'sc-24', userId: 'user-2', score: 39, playedAt: '2026-02-18', courseName: 'Kalhaar Blues & Greens', isRollingActive: true, createdAt: '2026-02-18T14:00:00.000Z' },
  { id: 'sc-25', userId: 'user-2', score: 28, playedAt: '2026-02-10', courseName: 'Poona Club Golf Course', isRollingActive: true, createdAt: '2026-02-10T14:00:00.000Z' },

  // user-3 scores
  { id: 'sc-31', userId: 'user-3', score: 38, playedAt: '2026-03-11', courseName: 'Chandigarh Golf Club', isRollingActive: true, createdAt: '2026-03-11T14:00:00.000Z' },
  { id: 'sc-32', userId: 'user-3', score: 42, playedAt: '2026-03-05', courseName: 'Willingdon Sports Club', isRollingActive: true, createdAt: '2026-03-05T14:00:00.000Z' },
  { id: 'sc-33', userId: 'user-3', score: 35, playedAt: '2026-02-27', courseName: 'Noida Golf Course', isRollingActive: true, createdAt: '2026-02-27T14:00:00.000Z' },
  { id: 'sc-34', userId: 'user-3', score: 24, playedAt: '2026-02-15', courseName: 'Clover Greens', isRollingActive: true, createdAt: '2026-02-15T14:00:00.000Z' },
  { id: 'sc-35', userId: 'user-3', score: 19, playedAt: '2026-02-08', courseName: 'Tollygunge Club', isRollingActive: true, createdAt: '2026-02-08T14:00:00.000Z' },
];

// Initial Charity Preferences (PRD § 08)
const INITIAL_PREFERENCES = [
  { userId: 'user-player', charityId: 'charity-1', contributionPercentage: 15, updatedAt: '2026-03-01T00:00:00.000Z' },
  { userId: 'user-2', charityId: 'charity-2', contributionPercentage: 20, updatedAt: '2026-02-15T00:00:00.000Z' },
  { userId: 'user-3', charityId: 'charity-3', contributionPercentage: 10, updatedAt: '2026-02-20T00:00:00.000Z' },
  { userId: 'user-4', charityId: 'charity-1', contributionPercentage: 25, updatedAt: '2026-03-01T00:00:00.000Z' },
  { userId: 'user-5', charityId: 'charity-4', contributionPercentage: 10, updatedAt: '2026-03-05T00:00:00.000Z' },
];

// Initial Draws in INR
const INITIAL_DRAWS = [
  {
    id: 'draw-feb-2026',
    drawNumber: 101,
    title: 'February 2026 Heroes Prize Draw',
    drawDate: '2026-02-28',
    monthYear: 'February 2026',
    drawType: 'random',
    winningNumbers: [14, 22, 33, 39, 44],
    totalPoolAmount: 125000.0,
    jackpotBroughtForward: 0.0,
    jackpotCarriedForward: 50000.0, // 5-match unclaimed -> carried forward in INR
    status: 'published',
    publishedAt: '2026-02-28T20:00:00.000Z',
    subscribersCount: 1000,
    tierSummaries: {
      '5_match': { tier: '5_match', label: '5-Number Match (Jackpot)', sharePercentage: 40, allocatedAmount: 50000, rolloverFromPrevious: 0, totalTierPool: 50000, winnerCount: 0, payoutPerWinner: 0, carriedForward: 50000 },
      '4_match': { tier: '4_match', label: '4-Number Match Tier', sharePercentage: 35, allocatedAmount: 43750, rolloverFromPrevious: 0, totalTierPool: 43750, winnerCount: 5, payoutPerWinner: 8750, carriedForward: 0 },
      '3_match': { tier: '3_match', label: '3-Number Match Tier', sharePercentage: 25, allocatedAmount: 31250, rolloverFromPrevious: 0, totalTierPool: 31250, winnerCount: 25, payoutPerWinner: 1250, carriedForward: 0 },
    },
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'draw-mar-2026',
    drawNumber: 102,
    title: 'March 2026 Heroes Prize Draw',
    drawDate: '2026-03-31',
    monthYear: 'March 2026',
    drawType: 'random',
    winningNumbers: [35, 36, 38, 39, 42], // Matches player's scores!
    totalPoolAmount: 150000.0,
    jackpotBroughtForward: 50000.0, // Brought forward from Feb draw!
    jackpotCarriedForward: 0.0,
    status: 'published',
    publishedAt: '2026-03-15T12:00:00.000Z',
    subscribersCount: 1200,
    tierSummaries: {
      '5_match': { tier: '5_match', label: '5-Number Match (Jackpot)', sharePercentage: 40, allocatedAmount: 60000, rolloverFromPrevious: 50000, totalTierPool: 110000, winnerCount: 1, payoutPerWinner: 110000, carriedForward: 0 },
      '4_match': { tier: '4_match', label: '4-Number Match Tier', sharePercentage: 35, allocatedAmount: 52500, rolloverFromPrevious: 0, totalTierPool: 52500, winnerCount: 1, payoutPerWinner: 52500, carriedForward: 0 },
      '3_match': { tier: '3_match', label: '3-Number Match Tier', sharePercentage: 25, allocatedAmount: 37500, rolloverFromPrevious: 0, totalTierPool: 37500, winnerCount: 1, payoutPerWinner: 37500, carriedForward: 0 },
    },
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

// Initial Draw Entries
const INITIAL_DRAW_ENTRIES = [
  {
    id: 'entry-player-mar',
    drawId: 'draw-mar-2026',
    userId: 'user-player',
    userName: 'Jashraaj Sharma',
    userEmail: 'player@digitalheroes.co.in',
    submittedScores: [38, 42, 35, 39, 36],
    matchesCount: 5,
    matchedNumbers: [35, 36, 38, 39, 42],
    prizeTier: '5_match',
    prizeAmount: 110000.0,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'entry-user2-mar',
    drawId: 'draw-mar-2026',
    userId: 'user-2',
    userName: 'Priya Nair',
    userEmail: 'priya.nair@example.com',
    submittedScores: [38, 42, 35, 39, 28],
    matchesCount: 4,
    matchedNumbers: [35, 38, 39, 42],
    prizeTier: '4_match',
    prizeAmount: 52500.0,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'entry-user3-mar',
    drawId: 'draw-mar-2026',
    userId: 'user-3',
    userName: 'Rohit Verma',
    userEmail: 'rohit.verma@example.com',
    submittedScores: [38, 42, 35, 24, 19],
    matchesCount: 3,
    matchedNumbers: [35, 38, 42],
    prizeTier: '3_match',
    prizeAmount: 37500.0,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

// Initial Winner Verifications in INR (§ 09)
const INITIAL_VERIFICATIONS = [
  {
    id: 'ver-1',
    drawEntryId: 'entry-player-mar',
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
    proofUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Official Indian Golf Union (IGU) / WHS Handicap scorecard verified for the 5 rounds.',
    verificationStatus: 'pending', // Waiting for Admin approval!
    payoutStatus: 'pending',
    createdAt: '2026-03-15T13:00:00.000Z',
    updatedAt: '2026-03-15T13:00:00.000Z',
  },
  {
    id: 'ver-2',
    drawEntryId: 'entry-user2-mar',
    drawId: 'draw-mar-2026',
    drawNumber: 102,
    drawMonthYear: 'March 2026',
    userId: 'user-2',
    userName: 'Priya Nair',
    userEmail: 'priya.nair@example.com',
    prizeTier: '4_match',
    prizeAmount: 52500.0,
    matchedNumbers: [35, 38, 39, 42],
    submittedScores: [38, 42, 35, 39, 28],
    proofUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    proofNotes: 'Club tournament scorecard export attached.',
    verificationStatus: 'approved',
    payoutStatus: 'paid',
    reviewedBy: 'user-admin',
    reviewedAt: '2026-03-15T14:30:00.000Z',
    paidAt: '2026-03-15T15:00:00.000Z',
    createdAt: '2026-03-15T13:10:00.000Z',
    updatedAt: '2026-03-15T15:00:00.000Z',
  },
];

// Initial Direct Charity Donations in INR (§ 08)
const INITIAL_DONATIONS = [
  {
    id: 'don-1',
    userId: 'user-player',
    donorName: 'Jashraaj Sharma',
    donorEmail: 'player@digitalheroes.co.in',
    charityId: 'charity-1',
    amount: 2500.0,
    source: 'direct_donation',
    status: 'completed',
    message: 'Keep inspiring our junior players!',
    createdAt: '2026-03-02T10:00:00.000Z',
  },
  {
    id: 'don-2',
    userId: 'user-2',
    donorName: 'Priya Nair',
    donorEmail: 'priya.nair@example.com',
    charityId: 'charity-2',
    amount: 5000.0,
    source: 'direct_donation',
    status: 'completed',
    message: 'Thank you for your service and dedication to adaptive golf.',
    createdAt: '2026-03-05T14:30:00.000Z',
  },
];

/**
 * Singleton State Store for application runtime
 */
class DigitalHeroesStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.subscriptions = [...INITIAL_SUBSCRIPTIONS];
    this.scores = [...INITIAL_SCORES];
    this.charities = [...INITIAL_CHARITIES];
    this.preferences = [...INITIAL_PREFERENCES];
    this.draws = [...INITIAL_DRAWS];
    this.drawEntries = [...INITIAL_DRAW_ENTRIES];
    this.verifications = [...INITIAL_VERIFICATIONS];
    this.donations = [...INITIAL_DONATIONS];
  }

  // --- USER METHODS ---
  getUserById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getAllUsers() {
    return this.users.map((u) => {
      const sub = this.getSubscription(u.id);
      const scores = this.getUserScores(u.id);
      const pref = this.getCharityPreference(u.id);
      const charity = pref ? this.getCharityById(pref.charityId) : null;
      return {
        ...u,
        subscription: sub,
        scoresCount: scores.activeScores.length,
        selectedCharity: charity ? charity.name : 'Not Selected',
        charityPercentage: pref ? pref.contributionPercentage : 10,
      };
    });
  }

  createUser({ email, fullName, role = 'user', phone, charityId, contributionPercentage = 10, plan = 'monthly' }) {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      phone: phone || '',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    // Create subscription
    const newSub = {
      id: `sub-${Date.now()}`,
      userId: newUser.id,
      plan,
      status: 'active',
      priceAmount: plan === 'yearly' ? 19999.0 : 1999.0,
      currency: 'INR',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
    };
    this.subscriptions.push(newSub);

    // Create charity preference
    if (charityId) {
      this.preferences.push({
        userId: newUser.id,
        charityId,
        contributionPercentage: Math.max(10, contributionPercentage),
        updatedAt: new Date().toISOString(),
      });
    }

    return newUser;
  }

  findOrCreateSocialUser({ provider, email, fullName, avatarUrl }) {
    const userEmail = email || `${provider}.user@digitalheroes.co.in`;
    let user = this.getUserByEmail(userEmail);
    if (!user) {
      user = {
        id: `user-${provider}-${Date.now()}`,
        email: userEmail,
        fullName: fullName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} Hero`,
        role: 'user',
        phone: '+91 98765 43210',
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
        authProvider: provider,
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);

      // Create active subscription in INR
      const newSub = {
        id: `sub-${provider}-${Date.now()}`,
        userId: user.id,
        plan: 'monthly',
        status: 'active',
        priceAmount: 1999.0,
        currency: 'INR',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString(),
      };
      this.subscriptions.push(newSub);

      // Create default charity preference
      this.preferences.push({
        userId: user.id,
        charityId: 'charity-1',
        contributionPercentage: 15,
        updatedAt: new Date().toISOString(),
      });

      // Seed 5 rolling scores so the social user is immediately draw eligible
      const defaultScores = [
        { score: 38, playedAt: '2026-03-14', courseName: 'Delhi Golf Club', notes: 'Social Login Round 1' },
        { score: 41, playedAt: '2026-03-10', courseName: 'Royal Calcutta Golf Club', notes: 'Social Login Round 2' },
        { score: 36, playedAt: '2026-03-05', courseName: 'Karnataka Golf Association', notes: 'Social Login Round 3' },
        { score: 40, playedAt: '2026-02-28', courseName: 'Bombay Presidency Golf Club', notes: 'Social Login Round 4' },
        { score: 37, playedAt: '2026-02-20', courseName: 'DLF Golf & Country Club', notes: 'Social Login Round 5' },
      ];

      defaultScores.forEach((s) => {
        this.addScore(user.id, s);
      });
    }

    const subscription = this.getSubscription(user.id);
    return { user, subscription };
  }

  // --- SUBSCRIPTION METHODS ---
  getSubscription(userId) {
    return this.subscriptions.find((s) => s.userId === userId) || null;
  }

  updateSubscription(userId, { plan, status, cancelAtPeriodEnd }) {
    const subIndex = this.subscriptions.findIndex((s) => s.userId === userId);
    if (subIndex === -1) {
      const newSub = {
        id: `sub-${Date.now()}`,
        userId,
        plan: plan || 'monthly',
        status: status || 'active',
        priceAmount: plan === 'yearly' ? 19999.0 : 1999.0,
        currency: 'INR',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: cancelAtPeriodEnd || false,
        createdAt: new Date().toISOString(),
      };
      this.subscriptions.push(newSub);
      return newSub;
    }

    const current = this.subscriptions[subIndex];
    const updated = {
      ...current,
      plan: plan || current.plan,
      status: status || current.status,
      priceAmount: (plan || current.plan) === 'yearly' ? 19999.0 : 1999.0,
      cancelAtPeriodEnd: cancelAtPeriodEnd !== undefined ? cancelAtPeriodEnd : current.cancelAtPeriodEnd,
      updatedAt: new Date().toISOString(),
    };
    this.subscriptions[subIndex] = updated;
    return updated;
  }

  // --- SCORE METHODS (PRD § 05) ---
  getUserScores(userId) {
    const userScores = this.scores.filter((s) => s.userId === userId);
    return computeRollingScores(userScores);
  }

  addScore(userId, scoreInput) {
    const userScores = this.scores.filter((s) => s.userId === userId);
    const result = addScoreWithRollingWindow(scoreInput, userScores);
    if (!result.success) {
      throw new Error(result.error);
    }

    const newScore = {
      ...result.newScore,
      userId,
    };

    // Remove existing user scores and insert updated set
    this.scores = this.scores.filter((s) => s.userId !== userId);
    const { allProcessedScores } = computeRollingScores([...userScores, newScore]);
    allProcessedScores.forEach((s) => (s.userId = userId));
    this.scores.push(...allProcessedScores);

    return {
      newScore,
      activeScores: computeRollingScores(this.scores.filter((s) => s.userId === userId)).activeScores,
      replacedScore: result.replacedScore,
    };
  }

  deleteScore(userId, scoreId) {
    this.scores = this.scores.filter((s) => !(s.userId === userId && s.id === scoreId));
    const userScores = this.scores.filter((s) => s.userId === userId);
    const { allProcessedScores } = computeRollingScores(userScores);
    this.scores = this.scores.filter((s) => s.userId !== userId);
    allProcessedScores.forEach((s) => (s.userId = userId));
    this.scores.push(...allProcessedScores);
    return this.getUserScores(userId);
  }

  editScore(userId, scoreId, update) {
    const existing = this.scores.find((s) => s.id === scoreId && s.userId === userId);
    if (!existing) throw new Error('Score not found');

    this.scores = this.scores.map((s) => {
      if (s.id === scoreId) {
        return {
          ...s,
          score: update.score !== undefined ? Number(update.score) : s.score,
          playedAt: update.playedAt || s.playedAt,
          courseName: update.courseName || s.courseName,
          notes: update.notes !== undefined ? update.notes : s.notes,
        };
      }
      return s;
    });

    const userScores = this.scores.filter((s) => s.userId === userId);
    const { allProcessedScores } = computeRollingScores(userScores);
    this.scores = this.scores.filter((s) => s.userId !== userId);
    allProcessedScores.forEach((s) => (s.userId = userId));
    this.scores.push(...allProcessedScores);

    return this.getUserScores(userId);
  }

  // --- CHARITY METHODS (PRD § 08) ---
  getAllCharities() {
    return [...this.charities];
  }

  getCharityById(id) {
    return this.charities.find((c) => c.id === id || c.slug === id) || null;
  }

  createCharity(charityData) {
    const newCharity = {
      id: `charity-${Date.now()}`,
      slug: charityData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      totalRaised: 0,
      supporterCount: 0,
      events: charityData.events || [],
      featured: charityData.featured || false,
      createdAt: new Date().toISOString(),
      ...charityData,
    };
    this.charities.push(newCharity);
    return newCharity;
  }

  updateCharity(id, update) {
    const idx = this.charities.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Charity not found');
    this.charities[idx] = { ...this.charities[idx], ...update, updatedAt: new Date().toISOString() };
    return this.charities[idx];
  }

  deleteCharity(id) {
    this.charities = this.charities.filter((c) => c.id !== id);
    return true;
  }

  getCharityPreference(userId) {
    return this.preferences.find((p) => p.userId === userId) || null;
  }

  setCharityPreference(userId, charityId, contributionPercentage = 10) {
    const percentage = Math.max(10, Number(contributionPercentage) || 10);
    const idx = this.preferences.findIndex((p) => p.userId === userId);
    if (idx >= 0) {
      this.preferences[idx] = {
        userId,
        charityId,
        contributionPercentage: percentage,
        updatedAt: new Date().toISOString(),
      };
      return this.preferences[idx];
    }
    const newPref = {
      userId,
      charityId,
      contributionPercentage: percentage,
      updatedAt: new Date().toISOString(),
    };
    this.preferences.push(newPref);
    return newPref;
  }

  addDonation({ userId, charityId, amount, donorName, donorEmail, message, source = 'direct_donation' }) {
    const donation = {
      id: `don-${Date.now()}`,
      userId,
      charityId,
      amount: Number(amount),
      donorName: donorName || 'Generous Hero',
      donorEmail: donorEmail || '',
      message: message || '',
      source,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    this.donations.push(donation);

    // Update charity raised total
    const charity = this.getCharityById(charityId);
    if (charity) {
      charity.totalRaised += Number(amount);
      charity.supporterCount += 1;
    }

    return donation;
  }

  getDonationsByCharity(charityId) {
    return this.donations.filter((d) => d.charityId === charityId);
  }

  getUserDonations(userId) {
    return this.donations.filter((d) => d.userId === userId);
  }

  // --- DRAW METHODS (PRD § 06, § 07) ---
  getAllDraws() {
    return [...this.draws].sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
  }

  getDrawById(id) {
    return this.draws.find((d) => d.id === id || String(d.drawNumber) === String(id)) || null;
  }

  getLatestPublishedDraw() {
    const published = this.draws
      .filter((d) => d.status === 'published')
      .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
    return published[0] || null;
  }

  getSubscriberSubmissionsForDraw() {
    return this.users
      .filter((u) => {
        const sub = this.getSubscription(u.id);
        return sub && sub.status === 'active';
      })
      .map((u) => {
        const { activeScores } = this.getUserScores(u.id);
        return {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          activeScores,
          submittedScores: activeScores.map((s) => s.score),
        };
      })
      .filter((u) => u.submittedScores.length === 5);
  }

  simulateDraw({ drawType = DRAW_TYPES.RANDOM, monthlyPrizePool = 150000, forcedWinningNumbers = null }) {
    const subscribers = this.getSubscriberSubmissionsForDraw();
    const latestPublished = this.getLatestPublishedDraw();
    const jackpotBroughtForward = latestPublished ? latestPublished.jackpotCarriedForward : 0;

    return runDrawSimulation({
      drawType,
      forcedWinningNumbers,
      subscribers,
      monthlyPrizePool,
      jackpotBroughtForward,
    });
  }

  publishDraw({ title, drawDate, monthYear, drawType = DRAW_TYPES.RANDOM, monthlyPrizePool = 150000, winningNumbers = null }) {
    const simulation = this.simulateDraw({
      drawType,
      monthlyPrizePool,
      forcedWinningNumbers: winningNumbers,
    });

    const nextDrawNumber = (this.draws.length > 0 ? Math.max(...this.draws.map((d) => d.drawNumber)) : 100) + 1;

    const newDraw = {
      id: `draw-${Date.now()}`,
      drawNumber: nextDrawNumber,
      title: title || `${monthYear || 'Monthly'} Heroes Prize Draw`,
      drawDate: drawDate || new Date().toISOString().split('T')[0],
      monthYear: monthYear || 'Current Month',
      drawType: simulation.drawType,
      winningNumbers: simulation.winningNumbers,
      totalPoolAmount: simulation.totalEffectivePool,
      jackpotBroughtForward: simulation.jackpotBroughtForward,
      jackpotCarriedForward: simulation.jackpotCarriedForward,
      status: 'published',
      publishedAt: new Date().toISOString(),
      subscribersCount: simulation.eligibleEntriesCount,
      tierSummaries: simulation.tierSummaries,
      createdAt: new Date().toISOString(),
    };

    this.draws.push(newDraw);

    // Save individual entries & create winner verifications for all winners
    simulation.processedEntries.forEach((entry) => {
      const drawEntry = {
        id: `entry-${newDraw.id}-${entry.userId}`,
        drawId: newDraw.id,
        userId: entry.userId,
        userName: entry.userName,
        userEmail: entry.userEmail,
        submittedScores: entry.submittedScores,
        matchesCount: entry.matchesCount,
        matchedNumbers: entry.matchedNumbers,
        prizeTier: entry.prizeTier,
        prizeAmount: entry.prizeAmount,
        createdAt: new Date().toISOString(),
      };
      this.drawEntries.push(drawEntry);

      if (entry.prizeTier) {
        this.verifications.push({
          id: `ver-${Date.now()}-${entry.userId}`,
          drawEntryId: drawEntry.id,
          drawId: newDraw.id,
          drawNumber: newDraw.drawNumber,
          drawMonthYear: newDraw.monthYear,
          userId: entry.userId,
          userName: entry.userName,
          userEmail: entry.userEmail,
          prizeTier: entry.prizeTier,
          prizeAmount: entry.prizeAmount,
          matchedNumbers: entry.matchedNumbers,
          submittedScores: entry.submittedScores,
          verificationStatus: 'pending',
          payoutStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return newDraw;
  }

  // --- WINNER VERIFICATION METHODS (PRD § 09) ---
  getAllVerifications() {
    return [...this.verifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getVerificationsByUser(userId) {
    return this.verifications.filter((v) => v.userId === userId);
  }

  submitWinnerProof(verificationId, { proofUrl, proofNotes }) {
    const idx = this.verifications.findIndex((v) => v.id === verificationId);
    if (idx === -1) throw new Error('Verification record not found');
    this.verifications[idx] = {
      ...this.verifications[idx],
      proofUrl,
      proofNotes: proofNotes || '',
      verificationStatus: 'pending',
      updatedAt: new Date().toISOString(),
    };
    return this.verifications[idx];
  }

  reviewWinnerProof(verificationId, action, adminId = 'user-admin', rejectionReason = '') {
    const idx = this.verifications.findIndex((v) => v.id === verificationId);
    if (idx === -1) throw new Error('Verification record not found');
    const updated = processWinnerVerificationAction(this.verifications[idx], action, adminId, rejectionReason);
    this.verifications[idx] = updated;
    return updated;
  }

  // --- PLATFORM ANALYTICS & STATS (§ 11) ---
  getPlatformStats() {
    const totalUsers = this.users.length;
    const activeSubscribers = this.subscriptions.filter((s) => s.status === 'active').length;
    const totalPrizeDistributed = this.verifications
      .filter((v) => v.payoutStatus === 'paid')
      .reduce((acc, v) => acc + Number(v.prizeAmount), 0);
    const totalCharityRaised = this.charities.reduce((acc, c) => acc + Number(c.totalRaised), 0);
    const latestPublished = this.getLatestPublishedDraw();
    const currentJackpotRollover = latestPublished ? latestPublished.jackpotCarriedForward : 0;
    const pendingVerificationsCount = this.verifications.filter((v) => v.verificationStatus === 'pending').length;

    return {
      totalUsers,
      activeSubscribers,
      totalPrizeDistributed,
      totalCharityRaised,
      currentJackpotRollover,
      pendingVerificationsCount,
      totalDrawsConducted: this.draws.filter((d) => d.status === 'published').length,
    };
  }
}

// Global singleton instance
const globalForStore = global;
if (!globalForStore.__digitalHeroesStore) {
  globalForStore.__digitalHeroesStore = new DigitalHeroesStore();
} else {
  Object.setPrototypeOf(globalForStore.__digitalHeroesStore, DigitalHeroesStore.prototype);
}
export const store = globalForStore.__digitalHeroesStore;
