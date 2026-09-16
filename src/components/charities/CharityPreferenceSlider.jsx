'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import { calculateCharityContribution } from '@/lib/charities/contribution-calculator';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export function CharityPreferenceSlider({
  charity,
  percentage = 10,
  onChangePercentage,
  subscriptionAmount = 25.0,
  planInterval = 'month',
}) {
  const calc = calculateCharityContribution({
    subscriptionAmount,
    contributionPercentage: percentage,
    interval: planInterval,
  });

  return (
    <Card className="border border-slate-800 bg-slate-900">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
            <CardTitle>Charity Contribution Percentage (§ 08)</CardTitle>
          </div>
          <CardDescription>
            Minimum 10% is guaranteed from every subscription. You can voluntarily boost your contribution to accelerate
            grassroots impact.
          </CardDescription>
        </div>
      </CardHeader>

      <div className="space-y-6">
        {/* Selected Charity Banner */}
        {charity && (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={charity.logoUrl} alt={charity.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-white text-sm">{charity.name}</h4>
                <p className="text-xs text-slate-400">{charity.category}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Recipient Confirmed ✓</span>
          </div>
        )}

        {/* Interactive Percentage Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contribution Level (Min 10%)
            </span>
            <span className="text-2xl font-black text-emerald-400">{percentage}%</span>
          </div>

          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={percentage}
            onChange={(e) => onChangePercentage(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
            <span>10% (Default)</span>
            <span>20% (Hero)</span>
            <span>35% (Champion)</span>
            <span>50% (Legend)</span>
          </div>
        </div>

        {/* Live Financial Calculation Box */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Per Payment</span>
            <span className="text-lg font-black text-white mt-1">{formatCurrency(calc.charityAmount)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Impact</span>
            <span className="text-lg font-black text-emerald-400 mt-1">{formatCurrency(calc.monthlyEquivalent)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Impact</span>
            <span className="text-lg font-black text-amber-400 mt-1">{formatCurrency(calc.yearlyEquivalent)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
