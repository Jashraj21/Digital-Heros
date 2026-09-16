'use client';

import React, { useState, useRef } from 'react';
import { getTodayDateString } from '@/lib/utils/dates';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  FileCheck,
} from 'lucide-react';

export function ScoreInputForm({ initialValues = null, onSubmit, onCancel, isSubmitting = false }) {
  const [score, setScore] = useState(initialValues?.score || 36);
  const [playedAt, setPlayedAt] = useState(initialValues?.playedAt || getTodayDateString());
  const [courseName, setCourseName] = useState(initialValues?.courseName || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [proofUrl, setProofUrl] = useState(initialValues?.proofUrl || '');
  const [proofFileName, setUploadedFileName] = useState(initialValues?.proofFileName || '');
  const [proofFileSize, setUploadedFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Quick demo sample scorecards for fast verification/testing
  const sampleScorecards = [
    {
      label: 'Club Official Scorecard',
      url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'IGU / WHS Mobile Card',
      url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'HowDidiDo Handicap Card',
      url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid image (PNG, JPG, WebP) or PDF scorecard.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Scorecard image size must be under 10MB.');
      return;
    }

    setErrorMessage('');
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProofUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveUploadedFile = () => {
    setProofUrl('');
    setUploadedFileName('');
    setUploadedFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        proofUrl: proofUrl || null,
        proofFileName: proofFileName || null,
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

      {/* Auto-Save & Draw Continuity Guarantee */}
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Auto-Save & Draw Persistence Active</span>
          <span className="text-[11px] text-emerald-300/80">
            Once saved, your rolling 5 scores remain permanently active and entered into every monthly prize draw until you log a newer score.
          </span>
        </div>
      </div>

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
          Only one score entry is permitted per round date.
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
          placeholder="e.g. Delhi Golf Club, Royal Calcutta, DLF Golf Course"
          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white text-sm outline-none transition-colors"
        />
      </div>

      {/* Scorecard Proof Image Upload */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Scorecard Photo / Proof Upload (Optional)
          </label>
          <span className="text-[11px] text-slate-400">Photo / Screenshot</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,.pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10'
              : proofUrl
              ? 'border-emerald-500/50 bg-slate-900/90'
              : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/40 hover:bg-slate-800/70'
          }`}
        >
          {proofUrl ? (
            <div className="space-y-2">
              <div className="relative max-h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 mx-auto flex items-center justify-center p-1.5">
                <img src={proofUrl} alt="Scorecard Preview" className="max-h-32 object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveUploadedFile();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 hover:bg-rose-500 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{proofFileName || 'Scorecard attached'}</span>
                {proofFileSize && <span className="text-slate-400 text-[11px]">({proofFileSize})</span>}
              </div>
              <p className="text-[10px] text-slate-400">Click or drag a new image to replace</p>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">
                <span>Upload Scorecard Image</span> or drag & drop here
              </div>
              <p className="text-[11px] text-slate-400">
                Supports camera photo, HowDidiDo, IGU, WHS scorecard exports (Max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Or Quick Sample Scorecard:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {sampleScorecards.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProofUrl(sample.url);
                  setUploadedFileName(sample.label);
                  setUploadedFileSize('Sample Photo');
                }}
                className={`p-1.5 rounded-lg border text-left text-[11px] font-medium transition-all ${
                  proofUrl === sample.url
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1 truncate">
                  <ImageIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{sample.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
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
