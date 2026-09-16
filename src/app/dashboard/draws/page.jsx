'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LotteryBalls } from '@/components/draws/LotteryBalls';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Trophy, Target, Sparkles, CheckCircle2, ArrowRight, Zap, History } from 'lucide-react';

export default function MyDrawsPage() {
  const { user } = useAuth();
  const [draws, setDraws] = useState([]);
  const [scoresData, setScoresData] = useState({ activeScores: [], metrics: {} });
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    Promise.all([
      fetch('/api/draws'),
      fetch(`/api/scores?userId=${user.id}`),
      fetch(`/api/winners?userId=${user.id}`),
    ])
      .then(async ([drawsRes, scoresRes, verRes]) => {
        const dData = await drawsRes.json();
        const sData = await scoresRes.json();
        const vData = await verRes.json();

        setDraws(dData.draws || []);
        setScoresData(sData);
        setVerifications(vData.verifications || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user]);

  const latestDraw = draws.find((d) => d.status === 'published') || null;
  const userNumbers = scoresData.metrics?.numbersForDraw || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="gold" size="sm" className="mb-2">
          Monthly Draw System (§ 06)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Monthly Draws & Entry Numbers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your active 5 rolling Stableford scores are automatically submitted into every monthly prize draw.
        </p>
      </div>

      {/* Active Entry Status Card */}
      <Card className="border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Your Current Draw Entry Numbers
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {scoresData.metrics?.isEligibleForDraw
                ? '5/5 Numbers Locked & Eligible ✓'
                : 'Incomplete Entry Set (Awaiting 5 Scores)'}
            </h2>
          </div>

          <Link href={ROUTES.SCORES}>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-1" />
              Manage Scores
            </Button>
          </Link>
        </div>

        {/* User's 5 Numbers */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center mb-4">
          {userNumbers.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {userNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 text-emerald-300 border border-emerald-500/50 flex items-center justify-center font-black text-xl shadow-lg"
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Auto-Saved & Continuously Active for All Monthly Draws</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active scores found. Log 5 golf rounds to enter.</p>
          )}
        </div>

        {/* Prize Tier Rules (§ 07) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-amber-400 block">5-Match Jackpot (40%)</span>
            <span className="text-slate-400">Includes rollover if unclaimed</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-cyan-400 block">4-Match Tier (35%)</span>
            <span className="text-slate-400">Split equally among 4-match winners</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="font-bold text-emerald-400 block">3-Match Tier (25%)</span>
            <span className="text-slate-400">Split equally among 3-match winners</span>
          </div>
        </div>
      </Card>

      {/* Published Draw Results History */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Historical Draws & Match Results</CardTitle>
            <CardDescription>Compare your numbers against winning combinations drawn in each month.</CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-6 p-6 pt-0">
          {draws.map((draw) => {
            const isPublished = draw.status === 'published';
            const matchedBalls = draw.winningNumbers.filter((n) => userNumbers.includes(n));
            const matchesCount = matchedBalls.length;

            return (
              <div
                key={draw.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-base">
                        Draw #{draw.drawNumber} · {draw.monthYear}
                      </span>
                      <Badge variant="emerald" size="sm">
                        {draw.drawType === 'algorithmic' ? 'Algorithmic' : 'Random Draw'}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(draw.drawDate)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Total Pool:</span>
                    <span className="font-black text-white text-sm">{formatCurrency(draw.totalPoolAmount)}</span>
                  </div>
                </div>

                {/* Winning Balls */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    Official Winning Numbers
                  </span>
                  <LotteryBalls numbers={draw.winningNumbers} matchedNumbers={userNumbers} size="md" />
                </div>

                {/* Result for User */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Your Matches:</span>
                    <Badge variant={matchesCount >= 3 ? 'gold' : 'default'} size="sm">
                      {matchesCount} of 5 Matched ({matchedBalls.join(', ') || 'None'})
                    </Badge>
                  </div>

                  {matchesCount >= 3 && (
                    <Link href={ROUTES.WINNINGS}>
                      <span className="font-bold text-amber-400 hover:underline flex items-center gap-1">
                        <span>Claim Prize & Submit Proof</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
