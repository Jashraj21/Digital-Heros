import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Trophy, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                DIGITAL<span className="text-emerald-400">HEROES</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transforming every round of golf into meaningful social impact. Track your game, support vital causes, and
              qualify for verified monthly cash prize pools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href={ROUTES.HOME} className="hover:text-emerald-400 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href={ROUTES.HOW_IT_WORKS} className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CHARITIES} className="hover:text-emerald-400 transition-colors">
                  Charity Directory
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PRICING} className="hover:text-emerald-400 transition-colors">
                  Membership Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Causes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Charities & Impact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/charities/fairways-for-youth" className="hover:text-emerald-400 transition-colors">
                  Fairways for Youth
                </Link>
              </li>
              <li>
                <Link href="/charities/hero-wings-adaptive-golf" className="hover:text-emerald-400 transition-colors">
                  Hero Wings Adaptive Golf
                </Link>
              </li>
              <li>
                <Link href="/charities/green-greens-foundation" className="hover:text-emerald-400 transition-colors">
                  Green Greens Conservation
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CHARITIES} className="hover:text-emerald-400 transition-colors">
                  Upcoming Charity Golf Days
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Security & Verification</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Score Auditing</span>
              </div>
              <p>
                All draw winnings are subject to independent handicap verification. Minimum 10% of subscription revenue is
                ring-fenced for registered charities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Digital Heroes Co. All rights reserved. Built for selection assignment.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by community golfers giving back</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
