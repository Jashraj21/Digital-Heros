'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LotteryBalls } from '@/components/draws/LotteryBalls';
import { ROUTES } from '@/constants/routes';
import {
  Target,
  Trophy,
  Heart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  Dices,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald" size="md">
          Platform Architecture & Mechanics
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          How Digital Heroes Works
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Digital Heroes combines performance tracking in Stableford format, verified monthly lottery draws, and
          automatic charity giving. Here is the full transparent blueprint of our platform engine.
        </p>
      </div>

      {/* 1. SCORE MANAGEMENT & 5-SCORE ROLLING MECHANISM (§ 05) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">1. Score Entry & 5-Score Rolling Engine (§ 05)</h2>
            <p className="text-xs text-slate-400">Stableford scoring (1–45) with automatic FIFO rolling window</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Stableford Scoring (1 - 45)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whenever you play a golf round, log your total Stableford points (1 to 45) and the date played. Stableford
              rewards positive play regardless of handicap.
            </p>
          </Card>

          <Card className="border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Rolling 5 Window (FIFO)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The system retains your latest 5 rounds in reverse chronological order. When you add a 6th round, it
              automatically rolls out the oldest score while keeping your history.
            </p>
          </Card>

          <Card className="border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">One Entry Per Date Rule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only one score entry is permitted per date. Duplicate entries are strictly prevented; existing dates may
              only be edited or deleted to preserve audit integrity.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. PRIZE POOL TIERS & ROLLOVER LOGIC (§ 06 & § 07) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">2. Prize Pool Logic & Rollover Jackpots (§ 07)</h2>
            <p className="text-xs text-slate-400">Pre-defined distribution across 3, 4 & 5-match tiers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 5-Match */}
          <Card className="border border-slate-800 bg-slate-900">
            <Badge variant="gold" size="sm" className="mb-3">
              Jackpot Tier
            </Badge>
            <h3 className="text-xl font-black text-white">5-Number Match</h3>
            <div className="text-3xl font-black text-amber-400 my-2">40% Pool Share</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Matches all 5 of your rolling scores against the 5 winning drawn balls.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>Rollover: YES — Carries forward if unclaimed!</span>
            </div>
          </Card>

          {/* 4-Match */}
          <Card className="border border-slate-800 bg-slate-900">
            <Badge variant="cyan" size="sm" className="mb-3">
              Major Tier
            </Badge>
            <h3 className="text-xl font-black text-white">4-Number Match</h3>
            <div className="text-3xl font-black text-cyan-400 my-2">35% Pool Share</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Matches any 4 of your rolling scores. Prize is split equally among all 4-match winners in the draw.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold">
              <span>Rollover: No (Fully allocated each month)</span>
            </div>
          </Card>

          {/* 3-Match */}
          <Card className="border border-slate-800 bg-slate-900">
            <Badge variant="emerald" size="sm" className="mb-3">
              Community Tier
            </Badge>
            <h3 className="text-xl font-black text-white">3-Number Match</h3>
            <div className="text-3xl font-black text-emerald-400 my-2">25% Pool Share</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Matches any 3 of your rolling scores. Prize is split equally among all 3-match winners in the draw.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-semibold">
              <span>Rollover: No (Fully allocated each month)</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. DRAW MECHANISMS: RANDOM VS ALGORITHMIC (§ 06) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">3. Dual Draw Mechanics (§ 06)</h2>
            <p className="text-xs text-slate-400">Transparent lottery options configured by the administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Dices className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Random Logic (Standard Lottery)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates 5 unique numbers between 1 and 45 chosen uniformly at random. Every number from 1 to 45 has an
              equal probability of being drawn.
            </p>
          </Card>

          <Card className="p-6 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Algorithmic Logic (Frequency Weighted)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weights the probability of drawn numbers based on the aggregate distribution of scores submitted by active
              subscribers during the month, boosting community match dynamics.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. CHARITY IMPACT MODEL & INDEPENDENT DONATIONS (§ 08) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">4. Charitable Impact Model (§ 08)</h2>
            <p className="text-xs text-slate-400">Guaranteed minimum 10% direct charity allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Charity Selection at Signup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every golfer selects a vetted grassroots cause during registration or anytime via the dashboard.
            </p>
          </Card>

          <Card className="p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Voluntary Boosts (10% - 50%)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribers can voluntarily raise their contribution level from the 10% minimum up to 50% anytime.
            </p>
          </Card>

          <Card className="p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Independent Donations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supporters can make direct, one-off donations to any listed charity without being tied to gameplay.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. WINNER VERIFICATION & PAYOUT PROCESS (§ 09) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">5. Winner Verification & Direct Payouts (§ 09)</h2>
            <p className="text-xs text-slate-400">Independent handicap verification before funds release</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-emerald-400 block mb-1">Step 1: Upload Proof</span>
              <p className="text-slate-300">
                Winners upload a screenshot of their 5 scores from their official golf app (Golf Ireland, WHS, HowDidiDo).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Step 2: Admin Audit</span>
              <p className="text-slate-300">
                Administrators verify that the dates and Stableford points match the verified handicap submission.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-amber-400 block mb-1">Step 3: Instant Payout</span>
              <p className="text-slate-300">
                Approved winnings transition from Pending to Paid and are disbursed directly to the winner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link href={ROUTES.REGISTER}>
          <Button variant="primary" size="xl">
            <span>Join Digital Heroes Today</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
