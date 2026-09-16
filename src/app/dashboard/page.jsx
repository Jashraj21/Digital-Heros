'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { RollingScoreVisualizer } from '@/components/scores/RollingScoreVisualizer';
import { ScoreInputForm } from '@/components/scores/ScoreInputForm';
import { Modal } from '@/components/ui/Modal';
import { LotteryBalls } from '@/components/draws/LotteryBalls';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import {
  Trophy,
  Target,
  Heart,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Upload,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user, subscription } = useAuth();
  const [scoresData, setScoresData] = useState({ activeScores: [], archivedScores: [], metrics: {} });
  const [charityData, setCharityData] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      // 1. Scores
      const scoresRes = await fetch(`/api/scores?userId=${user.id}`);
      const scoresJson = await scoresRes.json();
      setScoresData(scoresJson);

      // 2. Charity preference
      const charityRes = await fetch(`/api/charities/preference?userId=${user.id}`);
      const charityJson = await charityRes.json();
      setCharityData(charityJson);

      // 3. Latest Draw
      const drawRes = await fetch('/api/draws?latest=true');
      const drawJson = await drawRes.json();
      setLatestDraw(drawJson.draw);

      // 4. Verifications / Winnings
      const verRes = await fetch(`/api/winners?userId=${user.id}`);
      const verJson = await verRes.json();
      setVerifications(verJson.verifications || []);
    } catch (e) {
      console.error('Error loading dashboard:', e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleAddScore = async (scoreInput) => {
    setIsSubmittingScore(true);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...scoreInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add score');
      setIsAddScoreModalOpen(false);
      fetchDashboardData();
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const totalWon = verifications.reduce((acc, v) => acc + Number(v.prizeAmount || 0), 0);
  const pendingClaims = verifications.filter((v) => v.verificationStatus === 'pending' || v.payoutStatus === 'pending');

  return (
    <div className="space-y-8">
      {/* Welcome Banner (§ 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {user?.fullName || 'Hero'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Your golf rounds are actively supporting{' '}
            <strong className="text-emerald-400">{charityData?.charity?.name || 'grassroots charity'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" onClick={() => setIsAddScoreModalOpen(true)}>
            + Log Golf Score
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid (§ 10: Subscription, Draw Participation, Charity, Winnings) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Subscription Status"
          value={subscription?.status === 'active' ? 'Active' : 'Inactive'}
          subtitle={`Renewal: 1st of Next Month • ${subscription?.plan === 'yearly' ? 'Annual (₹19,999/yr)' : 'Monthly (₹1,999/mo)'}`}
          icon={CheckCircle2}
          glowColor="emerald"
        />

        <StatCard
          title="Draw Participation"
          value={scoresData.metrics?.isEligibleForDraw ? 'Qualified (5/5)' : `${scoresData.activeScores?.length || 0}/5 Rounds`}
          subtitle="Entered in Next Draw: ₹1,50,000 Jackpot"
          icon={Target}
          glowColor="cyan"
        />

        <StatCard
          title="Charity Giving"
          value={`${charityData?.preference?.contributionPercentage || 10}%`}
          subtitle={charityData?.charity?.name ? charityData.charity.name.slice(0, 20) : '10% Minimum Ring-Fenced'}
          icon={Heart}
          glowColor="rose"
        />

        <StatCard
          title="Total Won"
          value={formatCurrency(totalWon)}
          subtitle={pendingClaims.length > 0 ? `${pendingClaims.length} Pending Proof / Payout` : 'Payment Status: Paid ✓'}
          icon={Trophy}
          glowColor="gold"
        />
      </div>

      {/* 5-SCORE ROLLING VISUALIZER (§ 05 & § 10) */}
      <RollingScoreVisualizer
        activeScores={scoresData.activeScores}
        metrics={scoresData.metrics}
        onOpenAddModal={() => setIsAddScoreModalOpen(true)}
      />

      {/* Two Column Grid: Upcoming Draw & Charity Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest / Upcoming Draw Card */}
        <Card className="flex flex-col justify-between border border-slate-800">
          <div>
            <CardHeader>
              <div>
                <Badge variant="gold" size="sm" className="mb-1">
                  Monthly Cadence (§ 06)
                </Badge>
                <CardTitle>Latest Draw Results & Matches</CardTitle>
                <CardDescription>
                  {latestDraw ? `Draw #${latestDraw.drawNumber} · ${latestDraw.monthYear}` : 'Next draw approaching'}
                </CardDescription>
              </div>
            </CardHeader>

            {latestDraw && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Winning Numbers</span>
                  <LotteryBalls
                    numbers={latestDraw.winningNumbers}
                    matchedNumbers={scoresData.metrics?.numbersForDraw || []}
                    size="md"
                    showLabels={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-slate-400 block">Total Pool</span>
                    <span className="font-extrabold text-white text-base">
                      {formatCurrency(latestDraw.totalPoolAmount)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-slate-400 block">Rollover Jackpot</span>
                    <span className="font-extrabold text-amber-400 text-base">
                      {formatCurrency(latestDraw.jackpotCarriedForward || latestDraw.jackpotBroughtForward)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Match 3, 4, or 5 to win</span>
            <Link href={ROUTES.DRAWS} className="font-bold text-emerald-400 hover:text-emerald-300">
              View My Draw Entries →
            </Link>
          </div>
        </Card>

        {/* Selected Charity & Impact Card (§ 08 & § 10) */}
        <Card className="flex flex-col justify-between border border-slate-800">
          <div>
            <CardHeader>
              <div>
                <Badge variant="emerald" size="sm" className="mb-1">
                  Social Impact (§ 08)
                </Badge>
                <CardTitle>Your Chosen Cause</CardTitle>
                <CardDescription>Direct beneficiary of your monthly membership fee</CardDescription>
              </div>
            </CardHeader>

            {charityData?.charity ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-4">
                  <img
                    src={charityData.charity.logoUrl}
                    alt={charityData.charity.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{charityData.charity.name}</h4>
                    <p className="text-xs text-slate-400">{charityData.charity.category}</p>
                    <span className="text-xs font-semibold text-emerald-400 mt-1 inline-block">
                      {charityData.preference.contributionPercentage}% of your subscription
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {charityData.charity.missionStatement}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Loading charity details...</p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Want to adjust your %?</span>
            <Link href={ROUTES.CHARITY} className="font-bold text-emerald-400 hover:text-emerald-300">
              Manage Charity Giving →
            </Link>
          </div>
        </Card>
      </div>

      {/* Add Score Modal */}
      <Modal
        isOpen={isAddScoreModalOpen}
        onClose={() => setIsAddScoreModalOpen(false)}
        title="Enter Golf Round (§ 05)"
        description="Log your Stableford points (1-45). Your 5 most recent rounds automatically form your rolling draw numbers."
      >
        <ScoreInputForm
          onSubmit={handleAddScore}
          onCancel={() => setIsAddScoreModalOpen(false)}
          isSubmitting={isSubmittingScore}
        />
      </Modal>
    </div>
  );
}
