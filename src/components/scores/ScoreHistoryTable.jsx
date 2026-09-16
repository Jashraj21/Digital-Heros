'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dates';
import {
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  History,
  Image as ImageIcon,
  Camera,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export function ScoreHistoryTable({
  activeScores = [],
  archivedScores = [],
  onEdit,
  onDelete,
  isDeletingId = null,
}) {
  const [selectedProofScore, setSelectedProofScore] = useState(null);
  const hasScores = activeScores.length > 0 || archivedScores.length > 0;

  if (!hasScores) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Golf Scores Recorded Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
          Enter your last 5 Stableford scores to become eligible for the monthly cash prize draws and support your
          chosen charity.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Score History & Verification Proofs</CardTitle>
            <CardDescription>
              Displaying all entered Stableford rounds in reverse chronological order. Active 5 scores automatically qualify for all draws.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Status / Slot</th>
                <th className="py-3.5 px-4">Stableford Score</th>
                <th className="py-3.5 px-4">Date Played</th>
                <th className="py-3.5 px-4">Course & Notes</th>
                <th className="py-3.5 px-4">Proof Photo</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Active Rolling 5 Scores */}
              {activeScores.map((score, index) => (
                <tr key={score.id} className="hover:bg-slate-800/40 transition-colors bg-emerald-950/10">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Slot #{index + 1} (Auto-Saved)
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
                        {score.score}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">pts</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(score.playedAt)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white text-xs">{score.courseName || 'Golf Course'}</div>
                    {score.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{score.notes}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    {score.proofUrl ? (
                      <button
                        onClick={() => setSelectedProofScore(score)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Proof</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Scorecard Verified</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(score)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit score"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(score.id)}
                        disabled={isDeletingId === score.id}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete score"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Archived Scores */}
              {archivedScores.map((score) => (
                <tr key={score.id} className="hover:bg-slate-800/40 transition-colors opacity-60">
                  <td className="py-3 px-4">
                    <Badge variant="default" size="sm">
                      Archived
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
                        {score.score}
                      </div>
                      <span className="text-xs text-slate-500">pts</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(score.playedAt)}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{score.courseName || 'Golf Course'}</td>
                  <td className="py-3 px-4">
                    {score.proofUrl ? (
                      <button
                        onClick={() => setSelectedProofScore(score)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] hover:text-white"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Proof</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(score)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="Edit score"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(score.id)}
                        disabled={isDeletingId === score.id}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete score"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base border border-emerald-500/30">
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
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedProofScore.proofFileName || 'Official Scorecard Verified'}</span>
              </div>
              <Badge variant="emerald" size="sm">
                Stableford: {selectedProofScore.score} pts
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
