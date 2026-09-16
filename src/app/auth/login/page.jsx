'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { Trophy, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = (role) => {
    const user = loginAsDemo(role);
    if (user.role === 'admin') {
      router.push(ROUTES.ADMIN);
    } else {
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">
              DIGITAL<span className="text-emerald-400">HEROES</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to manage your scores, draws, and charity giving</p>
        </div>

        {/* 1-Click Fast Evaluator Switcher Card */}
        <Card className="p-4 border border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Selection Test Evaluators</span>
            </span>
            <Badge variant="emerald" size="sm">
              1-Click Login
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('user')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Subscriber Demo</span>
              </div>
              <p className="text-[10px] text-slate-400">player@digitalheroes.co.in</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Demo</span>
              </div>
              <p className="text-[10px] text-slate-400">admin@digitalheroes.co.in</p>
            </button>
          </div>
        </Card>

        {/* Standard Login Form */}
        <Card className="p-6 border border-slate-800">
          <SocialLoginButtons onError={(err) => setErrorMessage(err)} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
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
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <Button variant="primary" type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Don&apos;t have an account yet? </span>
            <Link href={ROUTES.REGISTER} className="font-bold text-emerald-400 hover:underline">
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
