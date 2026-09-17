'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';
import { User, CreditCard, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, subscription, refreshSession, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePlanToggle = async () => {
    if (!user) return;
    setIsUpdating(true);
    setSuccessMsg('');
    const newPlan = subscription?.plan === 'monthly' ? 'yearly' : 'monthly';

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          plan: newPlan,
          status: 'active',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(`Switched to ${newPlan === 'yearly' ? 'Annual Champion' : 'Monthly Hero'} successfully!`);
      if (refreshSession) refreshSession();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;
    setIsUpdating(true);
    setSuccessMsg('');
    const newStatus = subscription?.status === 'active' ? 'canceled' : 'active';

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          status: newStatus,
          cancelAtPeriodEnd: newStatus === 'canceled',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(`Subscription status updated to: ${newStatus}`);
      if (refreshSession) refreshSession();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="default" size="sm" className="mb-2">
          Account Settings
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Profile & Membership Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, subscription plan lifecycle, and payment settings.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Details */}
      <Card className="p-6 sm:p-8">
        <CardHeader>
          <div>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Your registered contact and identity details.</CardDescription>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
            <p className="font-bold text-white text-base">{user?.fullName || 'Hero Player'}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
            <p className="font-bold text-white text-base">{user?.email || 'player@example.com'}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Account Role</label>
            <Badge variant="emerald" size="sm">
              {user?.role === 'admin' ? 'Administrator' : 'Registered Subscriber'}
            </Badge>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-800 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </Button>
        </div>
      </Card>

      {/* Subscription Lifecycle Management (§ 04) */}
      <Card className="p-6 sm:p-8 border border-slate-800 bg-slate-900">
        <CardHeader>
          <div>
            <CardTitle>Subscription Plan & Lifecycle (§ 04)</CardTitle>
            <CardDescription>
              Real-time subscription management. Switch intervals, renew, or cancel anytime.
            </CardDescription>
          </div>
          <Badge variant={subscription?.status === 'active' ? 'emerald' : 'rose'} size="md">
            {subscription?.status?.toUpperCase() || 'ACTIVE'}
          </Badge>
        </CardHeader>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
              <p className="text-2xl font-black text-white mt-0.5">
                {subscription?.plan === 'yearly' ? 'Annual Champion (₹19,999/yr)' : 'Monthly Hero (₹1,999/mo)'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {subscription?.plan === 'yearly'
                  ? 'Saving 20% compared to monthly billing.'
                  : 'Flexible month-to-month access.'}
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={handlePlanToggle}
              isLoading={isUpdating}
            >
              Switch to {subscription?.plan === 'monthly' ? 'Annual (Save 20%)' : 'Monthly'}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Razorpay Autopay (Recurring Mandate)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {subscription?.isAutopay !== false
                    ? '⚡ Active: Automatically renews on 1st of month. Draw entries stay active.'
                    : 'Paused: Autopay is currently off. Subscription will expire at period end.'}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const newAutopayState = !(subscription?.isAutopay !== false);
                setIsUpdating(true);
                try {
                  const res = await fetch('/api/subscriptions/autopay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user?.id || 'user-player',
                      isAutopay: newAutopayState,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setSuccessMsg(data.message);
                    if (refreshSession) refreshSession();
                  }
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsUpdating(false);
                }
              }}
              isLoading={isUpdating}
              className={`text-xs ${
                subscription?.isAutopay !== false
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
                  : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              {subscription?.isAutopay !== false ? 'Pause Autopay' : '⚡ Enable Autopay'}
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span>Next billing period: </span>
              <strong className="text-slate-200">1st of Next Month</strong>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-700 hover:border-cyan-500 hover:text-cyan-400">
                  <CreditCard className="w-3.5 h-3.5" />
                  View Orders & Invoices
                </Button>
              </Link>
              <Button
                variant={subscription?.status === 'active' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleStatusToggle}
                isLoading={isUpdating}
              >
                {subscription?.status === 'active' ? 'Cancel Subscription' : 'Reactivate Subscription'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
