'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { CreditCard, Users, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeUsers = users.filter((u) => u.subscription?.status === 'active');
  const monthlyCount = activeUsers.filter((u) => u.subscription?.plan === 'monthly').length;
  const yearlyCount = activeUsers.filter((u) => u.subscription?.plan === 'yearly').length;
  const mrr = monthlyCount * 25.0 + yearlyCount * 20.0;
  const annualRunRate = mrr * 12;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="cyan" size="sm" className="mb-2">
          Subscription Operations (§ 04)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Subscription Metrics & Revenue Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor Monthly Hero and Annual Champion memberships, renewal retention, and revenue streams.
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Paid Members"
          value={formatNumber(activeUsers.length)}
          subtitle="100% in good standing"
          icon={Users}
          glowColor="cyan"
        />

        <StatCard
          title="Estimated MRR"
          value={formatCurrency(mrr)}
          subtitle="Monthly Recurring Revenue"
          icon={TrendingUp}
          glowColor="emerald"
        />

        <StatCard
          title="Annual Run Rate (ARR)"
          value={formatCurrency(annualRunRate)}
          subtitle="Projected 12-Month GMV"
          icon={DollarSign}
          glowColor="gold"
        />

        <StatCard
          title="Annual Plan Adoption"
          value={activeUsers.length > 0 ? `${((yearlyCount / activeUsers.length) * 100).toFixed(0)}%` : '0%'}
          subtitle={`${yearlyCount} Annual Champions`}
          icon={CreditCard}
          glowColor="purple"
        />
      </div>

      {/* Subscriptions Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Member Subscription Register</CardTitle>
            <CardDescription>Real-time lifecycle status of all subscriber billing accounts.</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Rate</th>
                <th className="py-3.5 px-4">Charity Split</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{u.fullName}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.subscription?.plan === 'yearly' ? 'gold' : 'cyan'} size="sm">
                      {u.subscription?.plan === 'yearly' ? 'Annual Champion' : 'Monthly Hero'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">
                    {u.subscription?.plan === 'yearly' ? '₹19,999 / yr' : '₹1,999 / mo'}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-semibold text-emerald-400">{u.charityPercentage}%</span> to{' '}
                    <span className="text-slate-300">{u.selectedCharity}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.subscription?.status === 'active' ? 'emerald' : 'rose'} size="sm">
                      {u.subscription?.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
