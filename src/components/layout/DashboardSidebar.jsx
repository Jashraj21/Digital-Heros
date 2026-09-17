'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutDashboard,
  Target,
  HeartHandshake,
  Trophy,
  Award,
  Settings,
  Sparkles,
  ChevronRight,
  Zap,
  CreditCard,
  Receipt,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, subscription } = useAuth();

  const navItems = [
    { href: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { href: ROUTES.SCORES, label: 'My Golf Scores', icon: Target, badge: '5 Rolling' },
    { href: ROUTES.CHARITY, label: 'Charity Giving', icon: HeartHandshake },
    { href: ROUTES.DRAWS, label: 'Monthly Draws', icon: Trophy },
    { href: ROUTES.WINNINGS, label: 'Winnings & Proof', icon: Award },
    { href: ROUTES.ORDERS, label: 'Payments & Orders', icon: Receipt, badge: 'INR' },
    { href: ROUTES.SETTINGS, label: 'Settings & Plan', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Subscriber Card Status (§ 10) */}
      <div className="rounded-3xl p-5 border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=player'}
            alt="Avatar"
            className="w-12 h-12 rounded-2xl border-2 border-slate-700 object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-white truncate text-base">{user?.fullName || 'Hero Player'}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={subscription?.status === 'active' ? 'emerald' : 'rose'} size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                {subscription?.status === 'active' ? 'Active Member' : 'Inactive'}
              </Badge>
              <span className="text-[11px] text-slate-400 capitalize font-medium">
                {subscription?.plan || 'Monthly'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Renewal:</span>
          <span className="font-semibold text-slate-200">1st of Next Month</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="rounded-3xl p-2.5 space-y-1 border border-slate-800 bg-slate-900">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant={isActive ? 'emerald' : 'default'} size="sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live Jackpot Callout */}
      <div className="rounded-3xl p-5 border border-slate-800 bg-slate-900 text-center">
        <div className="inline-flex p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-2 border border-amber-500/20">
          <Zap className="w-5 h-5" />
        </div>
        <p className="text-xs uppercase font-bold text-amber-400 tracking-wider">Next Month Draw</p>
        <p className="text-2xl font-black text-white mt-1">₹1,50,000.00</p>
        <p className="text-xs text-slate-400 mt-1">5-Match Jackpot + Rollover</p>
      </div>
    </aside>
  );
}
