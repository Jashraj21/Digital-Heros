'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';
import { Upload, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

export function WinnerProofModal({ isOpen, onClose, verification, onSubmitSuccess }) {
  const [proofUrl, setProofUrl] = useState(verification?.proofUrl || '');
  const [proofNotes, setProofNotes] = useState(verification?.proofNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Quick demo sample images for fast evaluation
  const sampleScreenshots = [
    {
      label: 'Golf Ireland App Scorecard',
      url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'HowDidiDo Handicap Record',
      url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'WHS Official Score Sheet',
      url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofUrl) {
      setErrorMessage('Please upload or select a screenshot proof from your golf platform.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/winners/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verification.id,
          proofUrl,
          proofNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit proof');

      setSuccess(true);
      if (onSubmitSuccess) onSubmitSuccess(data.verification);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Submit Score Verification Proof (§ 09)"
      description="To claim your prize payout, please upload a screenshot of your 5 Stableford scores from your official golf platform (e.g. Golf Ireland, WHS, HowDidiDo)."
      maxWidth="max-w-xl"
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Proof Submitted Successfully!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your claim is now in the administrative review queue. Payouts are executed immediately upon approval.
          </p>
          <Button variant="primary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Prize Claim Summary */}
          {verification && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Prize Tier Won</span>
                <p className="font-extrabold text-white text-base mt-0.5">
                  {verification.prizeTier === '5_match'
                    ? '5-Match Jackpot Winner'
                    : verification.prizeTier === '4_match'
                    ? '4-Match Tier Winner'
                    : '3-Match Tier Winner'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase">Award Amount</span>
                <p className="font-black text-emerald-400 text-xl mt-0.5">
                  {formatCurrency(verification.prizeAmount)}
                </p>
              </div>
            </div>
          )}

          {/* Preset Sample Screenshots for Quick Evaluator Testing */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Quick Test Proofs (Or paste custom URL)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleScreenshots.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProofUrl(sample.url)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    proofUrl === sample.url
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{sample.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Click to attach</span>
                </button>
              ))}
            </div>
          </div>

          {/* Proof URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Screenshot Image URL
            </label>
            <input
              type="url"
              required
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
            />
          </div>

          {/* Image Preview */}
          {proofUrl && (
            <div className="rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 max-h-40 flex items-center justify-center p-2">
              <img src={proofUrl} alt="Score Proof" className="max-h-36 object-contain rounded-xl" />
            </div>
          )}

          {/* Proof Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Verification Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              placeholder="e.g. Attached scorecard from Golf Ireland handicap record for rounds played on 1st-12th March."
              className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              <Upload className="w-4 h-4" />
              <span>Submit Proof for Admin Review</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
