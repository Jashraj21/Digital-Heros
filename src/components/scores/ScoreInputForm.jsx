'use client';

import React, { useState } from 'react';
import { getTodayDateString } from '@/lib/utils/dates';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export function ScoreInputForm({ initialValues = null, onSubmit, onCancel, isSubmitting = false }) {
  const [score, setScore] = useState(initialValues?.score || 36);
  const [playedAt, setPlayedAt] = useState(initialValues?.playedAt || getTodayDateString());
  const [courseName, setCourseName] = useState(initialValues?.courseName || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      setErrorMessage('Stableford score must be a whole number between 1 and 45.');
      return;
    }

    if (!playedAt) {
      setErrorMessage('Please specify the date of the golf round.');
      return;
    }

    try {
      await onSubmit({
        score: numScore,
        playedAt,
        courseName: courseName.trim() || 'Golf Club Round',
        notes: notes.trim(),
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save score.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stableford Score Field (1-45) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Stableford Score (1 - 45)
          </label>
          <span className="text-xs text-emerald-400 font-bold">{score} Points</span>
        </div>
        <input
          type="number"
          min="1"
          max="45"
          required
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white font-bold text-lg outline-none transition-colors"
          placeholder="e.g. 36"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Standard Stableford scoring format across 18 holes (PRD § 05).
        </p>
      </div>

      {/* Date Field (§ 05: One score entry per date) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Round Date
        </label>
        <input
          type="date"
          required
          max={getTodayDateString()}
          value={playedAt}
          onChange={(e) => setPlayedAt(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white text-sm outline-none transition-colors"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Only one score entry is permitted per date.
        </p>
      </div>

      {/* Course Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Golf Course / Venue (Optional)
        </label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g. St Andrews, Sunningdale, Local Club"
          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white text-sm outline-none transition-colors"
        />
      </div>

      {/* Round Notes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Round Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Great putting on back nine, windy afternoon"
          className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white text-sm outline-none transition-colors"
        />
      </div>

      {/* Form Buttons */}
      <div className="pt-3 flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Update Score' : 'Save Score to Rolling Set'}
        </Button>
      </div>
    </form>
  );
}
