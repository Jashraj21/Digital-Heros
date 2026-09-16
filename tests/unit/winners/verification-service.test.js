import { describe, it, expect } from 'vitest';
import {
  validateWinnerProofSubmission,
  processWinnerVerificationAction,
} from '@/lib/winners/verification-service';

describe('Winner Verification & Payout Workflow (§ 09)', () => {
  it('validates that proof screenshot URL is provided', () => {
    expect(validateWinnerProofSubmission({ proofUrl: '' }).isValid).toBe(false);
    expect(validateWinnerProofSubmission({ proofUrl: 'https://example.com/proof.png' }).isValid).toBe(true);
  });

  it('updates verification record to approved when admin approves', () => {
    const initial = {
      id: 'v1',
      verificationStatus: 'pending',
      payoutStatus: 'pending',
    };
    const approved = processWinnerVerificationAction(initial, 'approve', 'admin-99');
    expect(approved.verificationStatus).toBe('approved');
    expect(approved.reviewedBy).toBe('admin-99');
    expect(approved.reviewedAt).toBeDefined();
  });

  it('updates verification record to rejected with reason', () => {
    const initial = {
      id: 'v1',
      verificationStatus: 'pending',
      payoutStatus: 'pending',
    };
    const rejected = processWinnerVerificationAction(
      initial,
      'reject',
      'admin-99',
      'Scores in image do not match submitted Stableford dates'
    );
    expect(rejected.verificationStatus).toBe('rejected');
    expect(rejected.rejectionReason).toContain('Scores in image do not match');
  });

  it('marks payout as paid only after approval', () => {
    const approved = {
      id: 'v1',
      verificationStatus: 'approved',
      payoutStatus: 'pending',
    };
    const paid = processWinnerVerificationAction(approved, 'mark_paid', 'admin-99');
    expect(paid.payoutStatus).toBe('paid');
    expect(paid.paidAt).toBeDefined();

    // Rejects marking paid if pending
    const pending = { id: 'v2', verificationStatus: 'pending', payoutStatus: 'pending' };
    expect(() => processWinnerVerificationAction(pending, 'mark_paid')).toThrow();
  });
});
