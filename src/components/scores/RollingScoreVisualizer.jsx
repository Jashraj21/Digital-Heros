'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dates';
import {
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  History,
  ShieldCheck,
  Lock,
  Image as ImageIcon,
  Camera,
  X,
  ExternalLink,
} from 'lucide-react';

export function RollingScoreVisualizer({ activeScores = [], metrics = {}, onOpenAddModal }) {
  const [selectedProofScore, setSelectedProofScore] = useState(null);
  const count = activeScores.length;
  const needed = Math.max(0, 5 - count);
  const isComplete = count === 5 && metrics.isEligibleForDraw;

  return (
    <>
      <Card className="border border-slate-800 bg-slate-900">
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>Active 5-Score Rolling Set</span>
              </CardTitle>
              <Badge variant={metrics.isEligibleForDraw ? 'emerald' : 'gold'}>
                {metrics.isEligibleForDraw ? 'Auto-Saved & Draw Active (5/5)' : `${count}/5 Entered`}
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
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5"
          >
            <span>+ Log Golf Score</span>
          </button>
        </CardHeader>

        {/* Auto-Save & Permanent Persistence Banner (§ 05) */}
        {isComplete ? (
          <div className="mx-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-white text-sm block">Auto-Saved & Permanently Active for All Draws</span>
                <span className="text-[11px] text-emerald-200/90 leading-relaxed block mt-0.5">
                  These 5 numbers (<strong className="text-white">{metrics.numbersForDraw?.join(', ') || activeScores.map((s) => s.score).join(', ')}</strong>) will automatically enter every monthly jackpot draw without re-entry until you log a newer score.
                </span>
              </div>
            </div>
            <Badge variant="emerald" size="sm" className="hidden sm:flex items-center gap-1 shrink-0 px-3 py-1">
              <Lock className="w-3 h-3" />
              <span>Auto-Saved Forever</span>
            </Badge>
          </div>
        ) : (
          <div className="mx-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Enter <strong className="text-white">{needed} more score{needed > 1 ? 's' : ''}</strong> to complete your 5-score set and lock in automatic entry for all future monthly draws.
              </span>
            </div>
          </div>
        )}

        {/* 5 Rolling Slots Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 my-6 px-6">
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
                    ? 'bg-slate-800/80 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/70'
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
                  <div className="text-center w-full mt-1 space-y-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.courseName || 'Golf Round'}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(item.playedAt)}</p>

                    {/* Scorecard Proof Badge */}
                    {item.proofUrl ? (
                      <button
                        type="button"
                        onClick={() => setSelectedProofScore(item)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-colors"
                        title="View uploaded scorecard proof"
                      >
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>Proof Photo</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic block">Verified Round</span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">Awaiting score</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Metrics & Eligibility Status */}
        <div className="pt-4 border-t border-slate-800 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
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
              <span>Eligible & Auto-Entered in upcoming ₹1,50,000 monthly draw!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Enter {needed} more score{needed > 1 ? 's' : ''} to qualify for the next draw.</span>
            </div>
          )}
        </div>
      </Card>

      {/* Scorecard Proof Lightbox Modal */}
      {selectedProofScore && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedProofScore(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                  {selectedProofScore.score}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedProofScore.courseName || 'Golf Course'}</h4>
                  <span className="text-[11px] text-slate-400">{formatDate(selectedProofScore.playedAt)}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProofScore(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scorecard Image View */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-80 p-2">
              <img
                src={selectedProofScore.proofUrl}
                alt="Scorecard Proof"
                className="max-h-72 w-full object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedProofScore.proofFileName || 'Official Scorecard Verified'}</span>
              </div>
              <Badge variant="emerald" size="sm">
                Score: {selectedProofScore.score} pts
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
