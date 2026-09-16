'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Camera,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function WinnerProofModal({ isOpen, onClose, verification, onSubmitSuccess }) {
  const [proofUrl, setProofUrl] = useState(verification?.proofUrl || '');
  const [proofNotes, setProofNotes] = useState(verification?.proofNotes || '');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Quick demo sample images for fast evaluation
  const sampleScreenshots = [
    {
      label: 'Golf Ireland Scorecard',
      url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'HowDidiDo Handicap Proof',
      url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'WHS Official Score Sheet',
      url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid image (PNG, JPG, WebP) or PDF scorecard.');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size must be under 10MB.');
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
    if (!proofUrl) {
      setErrorMessage('Please upload a scorecard image or select a sample proof.');
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
          proofNotes: proofNotes || `Uploaded: ${uploadedFileName || 'Scorecard Image'}`,
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
      description="Upload a photo or screenshot of your 5 Stableford scores from your golf platform or scorecard to verify your cash claim."
      maxWidth="max-w-xl"
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Proof Uploaded Successfully!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your verification proof is now saved and queued for admin audit. Payouts are released directly upon approval.
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

          {/* Real Drag & Drop File Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Upload Scorecard / Handicap Screenshot
            </label>

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
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : proofUrl
                  ? 'border-emerald-500/50 bg-slate-900/80'
                  : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-slate-800/80'
              }`}
            >
              {proofUrl ? (
                <div className="space-y-3">
                  <div className="relative max-h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 mx-auto flex items-center justify-center p-2">
                    <img src={proofUrl} alt="Uploaded Proof Preview" className="max-h-40 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUploadedFile();
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-500 text-white transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{uploadedFileName || 'Image attached ready for submission'}</span>
                    {uploadedFileSize && <span className="text-slate-400">({uploadedFileSize})</span>}
                  </div>
                  <p className="text-[11px] text-slate-400">Click to change or drag a different image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">
                    <span>Click to browse photo</span> or drag & drop here
                  </div>
                  <p className="text-xs text-slate-400">
                    Supports PNG, JPG, WebP screenshots from Golf Ireland, WHS, HowDidiDo, or scorecard camera photos (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Samples for Testing */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Or Choose Sample Proof (For Instant Testing)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleScreenshots.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProofUrl(sample.url);
                    setUploadedFileName(sample.label);
                    setUploadedFileSize('Sample Proof');
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    proofUrl === sample.url
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md'
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

          {/* Verification Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Verification Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              placeholder="e.g. Attached official scorecard from club handicap export for rounds played on 1st-14th March."
              className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
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
