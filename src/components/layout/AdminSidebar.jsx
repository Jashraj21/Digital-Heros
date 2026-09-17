'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Users,
  CreditCard,
  Sparkles,
  HeartHandshake,
  Award,
  BarChart3,
  ExternalLink,
  Receipt,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.ADMIN, label: 'Analytics & Overview', icon: BarChart3 },
    { href: ROUTES.ADMIN_ORDERS, label: 'Orders & Payments', icon: Receipt, badge: 'INR' },
    { href: ROUTES.ADMIN_USERS, label: '01 User Management', icon: Users, desc: 'Profiles, Scores & Subs' },
    { href: ROUTES.ADMIN_DRAWS, label: '02 Draw Engine', icon: Sparkles, badge: 'Simulation' },
    { href: ROUTES.ADMIN_CHARITIES, label: '03 Charities & Events', icon: HeartHandshake },
    { href: ROUTES.ADMIN_WINNERS, label: '04 Winner Verification', icon: Award, badge: 'Queue' },
    { href: ROUTES.ADMIN_SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard },
    { href: ROUTES.ADMIN_REPORTS, label: '05 Reports & Exports', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Admin Surface Banner (§ 11) */}
      <div className="rounded-3xl p-5 border border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Admin Console</h4>
            <Badge variant="cyan" size="sm" className="mt-1">
              Platform Authority
            </Badge>
          </div>
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
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant={isActive ? 'cyan' : 'default'} size="sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Public Link */}
      <div className="p-3">
        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>View Public Platform</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
