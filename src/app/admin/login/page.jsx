'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { ShieldCheck, ArrowRight, AlertCircle, KeyRound, Sparkles, UserCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('admin@digitalheroes.co.in');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await login(email, password);
      window.location.href = ROUTES.ADMIN;
    } catch (err) {
      setErrorMessage(err.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuperadminLogin = () => {
    loginAsDemo('admin');
    window.location.href = ROUTES.ADMIN;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Superadmin Command Surface</span>
          </div>
          <h2 className="text-2xl font-black text-white">Admin Console Sign In</h2>
          <p className="text-xs text-slate-400">
            Authorized administrative access for draw simulations, scorecard audits, and subscriber management.
          </p>
        </div>

        {/* 1-Click Instant Superadmin Login Card */}
        <Card className="p-5 border border-cyan-500/30 bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Fast Evaluator Access</span>
            </span>
            <Badge variant="cyan" size="sm">
              1-Click Instant
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleQuickSuperadminLogin}
            className="w-full p-3.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Sign In as Superadmin (David Sterling)</span>
              </div>
              <p className="text-[11px] text-cyan-300/80">admin@digitalheroes.co.in • Full Authority</p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </Card>

        {/* Manual Admin Login Card */}
        <Card className="p-6 border border-slate-800 bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@digitalheroes.co.in"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <Button variant="cyan" type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
              <span>Enter Admin Command Console</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Looking for Golfer Portal? </span>
            <Link href={ROUTES.LOGIN} className="font-bold text-emerald-400 hover:underline">
              Switch to Player Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
