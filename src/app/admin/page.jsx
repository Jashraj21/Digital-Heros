'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { DrawSimulatorModal } from '@/components/draws/DrawSimulatorModal';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  Users,
  Trophy,
  Heart,
  Sparkles,
  Award,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            Administrator Control (§ 11)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Operations & KPI Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management overview of subscribers, charity distributions, draw engine simulation, and winner
            audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="cyan" size="md" onClick={() => setIsSimulatorOpen(true)}>
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Launch Draw Simulator</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid (§ 11: Total users, prize pool, charity totals, draw stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subscribers"
          value={stats ? formatNumber(stats.totalUsers) : '...'}
          subtitle={`${stats?.activeSubscribers || 0} Active Monthly/Annual`}
          icon={Users}
          glowColor="cyan"
        />

        <StatCard
          title="Total Charity Impact"
          value={stats ? formatCurrency(stats.totalCharityRaised) : '...'}
          subtitle="Direct Grants to Causes"
          icon={Heart}
          glowColor="rose"
        />

        <StatCard
          title="Jackpot Rollover"
          value={stats ? formatCurrency(stats.currentJackpotRollover) : '...'}
          subtitle="Carried Forward to Next Draw"
          icon={Zap}
          glowColor="gold"
        />

        <StatCard
          title="Pending Proof Queue"
          value={stats ? String(stats.pendingVerificationsCount) : '...'}
          subtitle="Scorecard Audits Awaiting Review"
          icon={Award}
          glowColor="emerald"
        />
      </div>

      {/* Quick Action Control Surfaces Grid (§ 11) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 01 User Management */}
        <Card className="p-6 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">01 User Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View registered golfer profiles, inspect and edit Stableford rounds, and manage subscription statuses.
            </p>
          </div>
          <div className="pt-6">
            <Link href={ROUTES.ADMIN_USERS}>
              <Button variant="outline" size="sm" className="w-full">
                <span>Manage Users & Scores</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* 02 Draw Engine */}
        <Card className="p-6 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">02 Draw Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Run Random or Algorithmic simulations, preview winner distributions and rollovers, and publish official
              monthly draws.
            </p>
          </div>
          <div className="pt-6">
            <Link href={ROUTES.ADMIN_DRAWS}>
              <Button variant="primary" size="sm" className="w-full">
                <span>Configure & Run Draws</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* 04 Winner Verification Queue */}
        <Card className="p-6 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">04 Winner Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit submitted scorecard proof screenshots, approve or reject claims, and mark payouts as completed.
            </p>
          </div>
          <div className="pt-6">
            <Link href={ROUTES.ADMIN_WINNERS}>
              <Button variant="gold" size="sm" className="w-full">
                <span>Open Verification Queue</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Simulator Modal */}
      <DrawSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onPublishSuccess={() => fetchStats()}
      />
    </div>
  );
}
