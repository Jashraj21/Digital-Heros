'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Trophy,
  Target,
  HeartHandshake,
  Award,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  UserCheck,
  Zap,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';

export function DashboardNavbar() {
  const pathname = usePathname();
  const { user, subscription, isAdmin, loginAsDemo, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const playerNavLinks = [
    { href: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { href: ROUTES.SCORES, label: 'My Scores', icon: Target },
    { href: ROUTES.CHARITY, label: 'Giving', icon: HeartHandshake },
    { href: ROUTES.DRAWS, label: 'Draws', icon: Trophy },
    { href: ROUTES.WINNINGS, label: 'Winnings', icon: Award },
    { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Player Portal Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                DIGITAL<span className="text-emerald-400">HEROES</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  Player Portal
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Player Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          {playerNavLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Jackpot Pill */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Jackpot:</span>
            <span className="font-extrabold text-amber-400">₹1,50,000</span>
          </div>

          {/* Primary Golfer Action */}
          <Link href={ROUTES.SCORES}>
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Score</span>
            </Button>
          </Link>

          {/* Player Identity & Logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt="Player Avatar"
                className="w-8 h-8 rounded-xl border border-emerald-500/40 object-cover"
              />
              <div className="text-left hidden xl:block">
                <span className="text-xs font-bold text-white block">
                  {user?.fullName || 'Hero Golfer'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block -mt-0.5">
                  {subscription?.plan || 'Monthly'} Member
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link href={ROUTES.SCORES}>
            <Button variant="primary" size="sm" className="text-xs">
              + Log Score
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-b border-slate-800 bg-slate-950 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-semibold">{user?.fullName || 'Golfer'}</span>
            </div>
            <Badge variant="emerald" size="sm">
              {subscription?.plan || 'Monthly'}
            </Badge>
          </div>

          <nav className="flex flex-col space-y-1">
            {playerNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
