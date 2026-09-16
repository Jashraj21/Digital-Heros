'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { Trophy, ShieldCheck, UserCheck, AlertCircle, ArrowRight, Mail, Smartphone } from 'lucide-react';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { PhoneLoginForm } from '@/components/auth/PhoneLoginForm';

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
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
        window.location.href = ROUTES.ADMIN;
      } else {
        window.location.href = ROUTES.DASHBOARD;
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
      window.location.href = ROUTES.ADMIN;
    } else {
      window.location.href = ROUTES.DASHBOARD;
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
          <p className="text-xs text-slate-400">Sign in with Google, Apple, Facebook, Phone OTP, or Email</p>
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
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.4 0 12.7s.6 4.4 1.6 6.3l3.7-4.3z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z" />
                </svg>
                <span>Jashraaj (Google)</span>
              </div>
              <p className="text-[10px] text-slate-400">jashraaj@gmail.com</p>
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
              <p className="text-[10px] text-cyan-300">admin@admin.in (Pass: password)</p>
            </button>
          </div>
        </Card>

        {/* Standard Login Form */}
        <Card className="p-6 border border-slate-800">
          <SocialLoginButtons onError={(err) => setErrorMessage(err)} />

          {/* Auth Method Switcher: Email vs Phone OTP */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                authMethod === 'email'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                authMethod === 'phone'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Number OTP</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMethod === 'phone' ? (
            <PhoneLoginForm onError={(err) => setErrorMessage(err)} mode="login" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
          )}

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
