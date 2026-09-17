'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Zap,
  Users,
  Search,
  LayoutDashboard,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Award,
  BarChart3,
  UserCheck,
} from 'lucide-react';

export function AdminNavbar() {
  const pathname = usePathname();
  const { user, loginAsDemo, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const adminQuickLinks = [
    { href: ROUTES.ADMIN, label: 'Overview', icon: BarChart3 },
    { href: ROUTES.ADMIN_USERS, label: 'Users & Scores', icon: Users },
    { href: ROUTES.ADMIN_DRAWS, label: 'Draw Engine', icon: Sparkles },
    { href: ROUTES.ADMIN_WINNERS, label: 'Verifications', icon: Award },
    { href: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href={ROUTES.ADMIN} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                DIGITAL<span className="text-cyan-400">HEROES</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                  Admin Command Surface
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Live System Stats Bar (Desktop) */}
        <div className="hidden xl:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-2xl text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">System:</span>
            <span className="font-bold">Live</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Rollover:</span>
            <span className="font-bold text-amber-400">₹1,50,000</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Subscribers:</span>
            <span className="font-bold text-white">1,420</span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Admin Identity Badge */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Admin Avatar"
              className="w-8 h-8 rounded-xl border border-cyan-500/40 object-cover"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-white block">
                {user?.fullName || 'David Sterling'}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block -mt-0.5">
                Superadmin Authority
              </span>
            </div>
          </div>

          {/* Admin Logout Button */}
          <button
            onClick={() => logout('/admin/login')}
            title="Log out from Admin Console"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => logout('/admin/login')}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 border border-slate-800"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
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
        <div className="lg:hidden px-4 pt-2 pb-6 border-b border-cyan-500/30 bg-slate-950 space-y-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
            <span>Admin: {user?.fullName || 'David Sterling'}</span>
            <Badge variant="cyan" size="sm">Superadmin</Badge>
          </div>

          <nav className="flex flex-col space-y-1">
            {adminQuickLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => logout('/admin/login')}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out from Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
