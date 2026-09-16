'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerificationTable } from '@/components/winners/VerificationTable';
import { Award, ShieldCheck } from 'lucide-react';

export default function AdminWinnersPage() {
  const [verifications, setVerifications] = useState([]);
  const [isProcessingId, setIsProcessingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVerifications = () => {
    setIsLoading(true);
    fetch('/api/winners')
      .then((res) => res.json())
      .then((data) => {
        if (data.verifications) setVerifications(data.verifications);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (verificationId) => {
    setIsProcessingId(verificationId);
    try {
      const res = await fetch('/api/winners/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId,
          action: 'approve',
          adminId: 'user-admin',
        }),
      });
      if (!res.ok) throw new Error('Failed to approve claim');
      fetchVerifications();
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleReject = async (verificationId, rejectionReason) => {
    setIsProcessingId(verificationId);
    try {
      const res = await fetch('/api/winners/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId,
          action: 'reject',
          rejectionReason,
          adminId: 'user-admin',
        }),
      });
      if (!res.ok) throw new Error('Failed to reject claim');
      fetchVerifications();
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleMarkPaid = async (verificationId) => {
    setIsProcessingId(verificationId);
    try {
      const res = await fetch('/api/winners/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId,
          action: 'mark_paid',
          adminId: 'user-admin',
        }),
      });
      if (!res.ok) throw new Error('Failed to mark payout paid');
      fetchVerifications();
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="gold" size="sm" className="mb-2">
          Control Surface 04 (§ 11)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Winner Verification & Payout Operations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect golf platform scorecard proofs, approve or reject claims, and disburse cash prize payouts (PRD § 09 &
          § 11).
        </p>
      </div>

      {/* Verification Queue Table */}
      <VerificationTable
        verifications={verifications}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkPaid={handleMarkPaid}
        isProcessingId={isProcessingId}
      />
    </div>
  );
}
