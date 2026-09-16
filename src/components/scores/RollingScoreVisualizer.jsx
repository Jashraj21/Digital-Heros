'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dates';
import { Target, Sparkles, AlertCircle, CheckCircle2, History } from 'lucide-react';

export function RollingScoreVisualizer({ activeScores = [], metrics = {}, onOpenAddModal }) {
  const count = activeScores.length;
  const needed = Math.max(0, 5 - count);

  return (
    <Card className="border border-slate-800 bg-slate-900">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Active 5-Score Rolling Set</span>
            </CardTitle>
            <Badge variant={metrics.isEligibleForDraw ? 'emerald' : 'gold'}>
              {metrics.isEligibleForDraw ? 'Draw Ready (5/5)' : `${count}/5 Entered`}
            </Badge>
          </div>
          <CardDescription className="mt-1">
            PRD § 05: Your latest 5 Stableford scores automatically determine your monthly draw entry numbers in
            reverse chronological order.
          </CardDescription>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          + Enter Golf Score
        </button>
      </CardHeader>

      {/* 5 Rolling Slots Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 my-6">
        {[0, 1, 2, 3, 4].map((index) => {
          const item = activeScores[index];
          const isFilled = Boolean(item);
          const isLatest = index === 0 && isFilled;
          const isOldestInActive = index === 4 && isFilled;

          return (
            <div
              key={index}
              className={`relative rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                isFilled
                  ? 'bg-slate-800/80 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/40 border-2 border-dashed border-slate-700/60'
              }`}
            >
              {/* Position Tag */}
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                {isLatest ? '★ Latest' : isOldestInActive ? '⏳ Oldest' : `Slot #${index + 1}`}
              </span>

              {/* Stableford Score Ball */}
              {isFilled ? (
                <div className="my-2 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
                  {item.score}
                </div>
              ) : (
                <div className="my-2 w-14 h-14 rounded-full bg-slate-800/50 border border-slate-700 text-slate-500 flex items-center justify-center font-bold text-lg">
                  --
                </div>
              )}

              {/* Score Meta */}
              {isFilled ? (
                <div className="text-center w-full mt-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{item.courseName || 'Golf Round'}</p>
                  <p className="text-[11px] text-slate-400">{formatDate(item.playedAt)}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Awaiting score</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Metrics & Eligibility Status */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 text-slate-300">
          <div>
            <span className="text-slate-500">Average Stableford: </span>
            <span className="font-bold text-white text-sm">{metrics.averageScore || 0} pts</span>
          </div>
          <div>
            <span className="text-slate-500">Best Score: </span>
            <span className="font-bold text-emerald-400 text-sm">{metrics.bestScore || 0} pts</span>
          </div>
        </div>

        {metrics.isEligibleForDraw ? (
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Eligible for upcoming ₹1,50,000 monthly draw!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Enter {needed} more score{needed > 1 ? 's' : ''} to qualify for the next draw.</span>
          </div>
        )}
      </div>
    </Card>
  );
}
