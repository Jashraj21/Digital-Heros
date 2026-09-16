'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WinnerProofModal } from '@/components/winners/WinnerProofModal';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Award, Trophy, Upload, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MyWinningsPage() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVerifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/winners?userId=${user.id}`);
      const data = await res.json();
      setVerifications(data.verifications || []);
    } catch (e) {
      console.error('Error fetching winnings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [user]);

  const totalWon = verifications.reduce((acc, v) => acc + Number(v.prizeAmount || 0), 0);
  const totalPaid = verifications
    .filter((v) => v.payoutStatus === 'paid')
    .reduce((acc, v) => acc + Number(v.prizeAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="gold" size="sm" className="mb-2">
          Winner Verification & Payouts (§ 09)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Prize Claims & Scorecard Proofs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          When your submitted Stableford scores match 3, 4, or 5 winning balls, upload your official golf platform
          screenshot to verify your claim and receive payout.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Prize Awards</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{formatCurrency(totalWon)}</p>
          <span className="text-xs text-slate-400 mt-1 block">Lifetime matches won</span>
        </Card>

        <Card className="p-6 border border-cyan-500/20 bg-cyan-950/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disbursed Payouts</span>
          <p className="text-3xl font-black text-white mt-1">{formatCurrency(totalPaid)}</p>
          <span className="text-xs text-emerald-400 mt-1 block">Verified & Paid to Account ✓</span>
        </Card>

        <Card className="p-6 border border-amber-500/20 bg-amber-950/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Claims In Queue</span>
          <p className="text-3xl font-black text-amber-400 mt-1">
            {verifications.filter((v) => v.payoutStatus !== 'paid').length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting proof / admin audit</span>
        </Card>
      </div>

      {/* Verification Claims List */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>My Prize Claims List (§ 09)</CardTitle>
            <CardDescription>
              Status progression: Proof Submission → Admin Verification → Direct Payout.
            </CardDescription>
          </div>
        </CardHeader>

        {verifications.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            <Trophy className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="font-bold text-white">No Prize Claims Yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Keep logging your 5 golf rounds! When you match 3 or more numbers in the monthly draw, your claim will
              appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {verifications.map((ver) => (
              <div key={ver.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-900/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        ver.prizeTier === '5_match'
                          ? 'gold'
                          : ver.prizeTier === '4_match'
                          ? 'cyan'
                          : 'emerald'
                      }
                      size="sm"
                    >
                      {ver.prizeTier === '5_match'
                        ? '5-Match Jackpot Winner'
                        : ver.prizeTier === '4_match'
                        ? '4-Match Tier'
                        : '3-Match Tier'}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Draw #{ver.drawNumber} ({ver.drawMonthYear})
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white">
                    {formatCurrency(ver.prizeAmount)}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Submitted Scores:</span>
                    <span className="font-semibold text-slate-200">
                      {ver.submittedScores.join(', ')}
                    </span>
                  </div>

                  {ver.rejectionReason && (
                    <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                      Rejection note: {ver.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Status & Proof Upload Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Status</span>
                    <Badge
                      variant={
                        ver.verificationStatus === 'approved'
                          ? 'emerald'
                          : ver.verificationStatus === 'rejected'
                          ? 'rose'
                          : 'gold'
                      }
                      size="md"
                      className="mt-0.5"
                    >
                      {ver.verificationStatus.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payout Status</span>
                    <Badge
                      variant={ver.payoutStatus === 'paid' ? 'emerald' : 'default'}
                      size="md"
                      className="mt-0.5"
                    >
                      {ver.payoutStatus === 'paid' ? 'PAID ✓' : 'PENDING'}
                    </Badge>
                  </div>

                  <Button
                    variant={ver.proofUrl ? 'secondary' : 'primary'}
                    size="md"
                    onClick={() => setSelectedVerification(ver)}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    <span>{ver.proofUrl ? 'Update Proof' : 'Upload Scorecard Proof'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Proof Submission Modal */}
      {selectedVerification && (
        <WinnerProofModal
          isOpen={Boolean(selectedVerification)}
          onClose={() => setSelectedVerification(null)}
          verification={selectedVerification}
          onSubmitSuccess={() => {
            fetchVerifications();
          }}
        />
      )}
    </div>
  );
}
