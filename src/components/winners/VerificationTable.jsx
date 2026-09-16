'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Check, X, CreditCard, ExternalLink, Image as ImageIcon, ShieldAlert, Sparkles } from 'lucide-react';

export function VerificationTable({
  verifications = [],
  onApprove,
  onReject,
  onMarkPaid,
  isProcessingId = null,
}) {
  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleRejectSubmit = (verId) => {
    if (onReject) onReject(verId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  if (!verifications || verifications.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-slate-400 text-sm">No winner claims in the queue right now.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Winner Proof Verification Queue (§ 09)</CardTitle>
          <CardDescription>
            Audit submitted golf score screenshots against official rules, approve claims, and release cash prize payouts.
          </CardDescription>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Winner / Draw</th>
              <th className="py-3.5 px-4">Tier & Award</th>
              <th className="py-3.5 px-4">Submitted Scores</th>
              <th className="py-3.5 px-4">Proof Screenshot</th>
              <th className="py-3.5 px-4">Verification</th>
              <th className="py-3.5 px-4">Payout</th>
              <th className="py-3.5 px-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {verifications.map((ver) => {
              const isProcessing = isProcessingId === ver.id;

              return (
                <tr key={ver.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Winner / Draw */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{ver.userName}</div>
                    <div className="text-xs text-slate-400">{ver.userEmail}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Draw #{ver.drawNumber} ({ver.drawMonthYear})
                    </div>
                  </td>

                  {/* Tier & Award */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-emerald-400 text-base">
                      {formatCurrency(ver.prizeAmount)}
                    </div>
                    <Badge
                      variant={
                        ver.prizeTier === '5_match'
                          ? 'gold'
                          : ver.prizeTier === '4_match'
                          ? 'cyan'
                          : 'emerald'
                      }
                      size="sm"
                      className="mt-1"
                    >
                      {ver.prizeTier === '5_match'
                        ? '5-Match Jackpot'
                        : ver.prizeTier === '4_match'
                        ? '4-Match Tier'
                        : '3-Match Tier'}
                    </Badge>
                  </td>

                  {/* Submitted Scores */}
                  <td className="py-3.5 px-4">
                    <div className="flex gap-1">
                      {ver.submittedScores.map((score, i) => {
                        const isMatch = ver.matchedNumbers?.includes(score);
                        return (
                          <span
                            key={i}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                              isMatch
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {score}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {ver.matchedNumbers?.length || 0} numbers matched
                    </span>
                  </td>

                  {/* Proof Screenshot */}
                  <td className="py-3.5 px-4">
                    {ver.proofUrl ? (
                      <button
                        onClick={() => setSelectedProof(ver.proofUrl)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-emerald-400 hover:bg-slate-700 transition-colors border border-slate-700"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Proof</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No proof attached</span>
                    )}
                    {ver.proofNotes && (
                      <p className="text-[11px] text-slate-400 mt-1 truncate max-w-xs">{ver.proofNotes}</p>
                    )}
                  </td>

                  {/* Verification Status */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        ver.verificationStatus === 'approved'
                          ? 'emerald'
                          : ver.verificationStatus === 'rejected'
                          ? 'rose'
                          : 'gold'
                      }
                      size="sm"
                    >
                      {ver.verificationStatus.toUpperCase()}
                    </Badge>
                    {ver.rejectionReason && (
                      <p className="text-[10px] text-rose-400 mt-1 truncate max-w-xs">{ver.rejectionReason}</p>
                    )}
                  </td>

                  {/* Payout Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={ver.payoutStatus === 'paid' ? 'emerald' : 'default'} size="sm">
                      {ver.payoutStatus === 'paid' ? 'PAID ✓' : 'PENDING'}
                    </Badge>
                    {ver.paidAt && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">{formatDate(ver.paidAt)}</span>
                    )}
                  </td>

                  {/* Admin Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ver.verificationStatus === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => onApprove && onApprove(ver.id)}
                            title="Approve Claim"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => setRejectingId(ver.id)}
                            title="Reject Claim"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}

                      {ver.verificationStatus === 'approved' && ver.payoutStatus === 'pending' && (
                        <Button
                          variant="gold"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => onMarkPaid && onMarkPaid(ver.id)}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedProof(null)}
        >
          <div className="relative max-w-2xl w-full glass-panel bg-slate-900 rounded-3xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white text-sm">Golf Scorecard Verification Image</h4>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedProof} alt="Proof" className="w-full max-h-[75vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel bg-slate-900 rounded-3xl p-6 border border-rose-500/30">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Reject Winner Submission</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Please enter the reason for rejecting this proof. The user will be notified to resubmit.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Screenshot does not match the submitted round dates."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-rose-400 mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRejectingId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleRejectSubmit(rejectingId)}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
