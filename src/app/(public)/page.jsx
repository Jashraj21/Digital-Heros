'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LotteryBalls } from '@/components/draws/LotteryBalls';
import { CharityCard } from '@/components/charities/CharityCard';
import { CharityDonationModal } from '@/components/charities/CharityDonationModal';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  Heart,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalCharityRaised: 89180,
    currentJackpotRollover: 15000,
    activeSubscribers: 1200,
  });
  const [charities, setCharities] = useState([]);
  const [selectedCharityForDonation, setSelectedCharityForDonation] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((e) => console.error(e));

    fetch('/api/charities?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.charities) setCharities(data.charities.slice(0, 3));
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. EMOTION-DRIVEN HERO SECTION (§ 12) */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Emotional Mission Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-slate-800 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>A New Era of Purpose-Driven Sport</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>10%+ Directly Empowers Charity</span>
          </div>

          {/* Main Headline (PRD § 12: Leading with charitable impact, not sport) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Every Round You Play <br />
            <span className="text-emerald-400">
              Empowers Real Lives.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Track your golf scores in Stableford format, direct part of your membership to life-changing causes, and
            qualify for audited monthly cash prize pools up to <strong className="text-white">₹1,50,000+</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button variant="primary" size="xl" className="w-full sm:w-auto gap-3 text-base">
                <Flame className="w-5 h-5 fill-current" />
                <span>Join & Select Your Cause</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href={ROUTES.HOW_IT_WORKS} className="w-full sm:w-auto">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto text-base">
                <span>See How Draws Work</span>
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Charity Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Handicap Score Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Guaranteed Jackpot Rollovers</span>
            </div>
          </div>
        </div>

        {/* LIVE MONTHLY JACKPOT BANNER WIDGET */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900 shadow-xl relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <Badge variant="gold" size="md" className="mb-2">
                <Zap className="w-3.5 h-3.5 mr-1" />
                Live Monthly Pool (§ 06 & § 07)
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Current Cash Jackpot</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Generated from active memberships + accumulated rollover. Split across 3, 4 & 5-match tiers.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ₹1,50,000.00
              </div>
              <span className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Includes ₹50,000 Jackpot Rollover
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold text-slate-400">Winning Numbers Demo:</span>
              <LotteryBalls numbers={[35, 36, 38, 39, 42]} size="sm" />
            </div>
            <Link href={ROUTES.HOW_IT_WORKS}>
              <span className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Learn 40% / 35% / 25% distribution breakdown →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THREE-STEP INTERACTIVE WORKFLOW (§ 01.1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="cyan" size="md">
            Simple Gameplay
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Digital Heroes Works
          </h2>
          <p className="text-sm text-slate-400">
            Four seamless steps turning your regular weekend golf rounds into community support and cash rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Subscribe & Pick Cause',
              desc: 'Choose a monthly or yearly plan. Select a grassroots charity and set your contribution (10% to 50%).',
              icon: Heart,
              color: 'text-rose-400',
              borderColor: 'border-rose-500/20',
            },
            {
              step: '02',
              title: 'Enter 5 Golf Scores',
              desc: 'Log your Stableford points (1-45). The platform automatically maintains your 5 latest rolling scores.',
              icon: Target,
              color: 'text-emerald-400',
              borderColor: 'border-emerald-500/20',
            },
            {
              step: '03',
              title: 'Monthly Cash Draws',
              desc: 'Your 5 rolling numbers participate in monthly random or algorithmic draws for 3, 4 & 5-match prize tiers.',
              icon: Trophy,
              color: 'text-amber-400',
              borderColor: 'border-amber-500/20',
            },
            {
              step: '04',
              title: 'Audit & Fast Payout',
              desc: 'Winners simply upload a scorecard screenshot for quick admin approval and instant direct payout.',
              icon: ShieldCheck,
              color: 'text-cyan-400',
              borderColor: 'border-cyan-500/20',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className={`p-6 border ${item.borderColor} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-600">{item.step}</span>
                    <div className={`p-2.5 rounded-xl bg-slate-800/80 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. CHARITY SPOTLIGHT SECTION (§ 08.2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="emerald" size="md" className="mb-2">
              Grassroots Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Causes & Charity Days
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore the vetted organisations transforming communities through golf mentoring, adaptive sports, and
              conservation.
            </p>
          </div>
          <Link href={ROUTES.CHARITIES}>
            <Button variant="outline" size="md">
              <span>View Full Directory</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Charity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              onOpenDonateModal={(c) => setSelectedCharityForDonation(c)}
            />
          ))}
        </div>
      </section>

      {/* 4. PLATFORM IMPACT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 border border-slate-800 bg-slate-900 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Charity Impact</span>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400">
                {formatCurrency(stats.totalCharityRaised)}
              </p>
              <p className="text-xs text-slate-400">Delivered directly to vetted partners</p>
            </div>
            <div className="space-y-2 pt-6 sm:pt-0">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Golfer Community</span>
              <p className="text-4xl sm:text-5xl font-black text-white">{formatNumber(stats.totalUsers)}+</p>
              <p className="text-xs text-slate-400">Active golfers tracking scores & giving back</p>
            </div>
            <div className="space-y-2 pt-6 sm:pt-0">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Prize Pools Awarded</span>
              <p className="text-4xl sm:text-5xl font-black text-amber-400">₹12,00,000+</p>
              <p className="text-xs text-slate-400">Distributed across 3, 4 & 5-match tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION (§ 12) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl p-8 sm:p-14 border border-slate-800 bg-slate-900 shadow-xl relative space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Make Every Swing Count?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of golfers transforming their rounds into life-changing support for charity while qualifying
            for monthly jackpots.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Get Started for ₹1,999/month
              </Button>
            </Link>
            <Link href={ROUTES.PRICING} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Compare Yearly Savings (Save 17%)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Donation Modal */}
      {selectedCharityForDonation && (
        <CharityDonationModal
          isOpen={Boolean(selectedCharityForDonation)}
          onClose={() => setSelectedCharityForDonation(null)}
          charity={selectedCharityForDonation}
        />
      )}
    </div>
  );
}
