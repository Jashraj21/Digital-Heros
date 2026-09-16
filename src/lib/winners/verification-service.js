/**
 * Validates winner proof submission
 * @param {Object} input
 * @param {string} input.proofUrl - URL or base64 data string of the uploaded proof screenshot
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateWinnerProofSubmission(input) {
  if (!input || !input.proofUrl || typeof input.proofUrl !== 'string' || input.proofUrl.trim() === '') {
    return {
      isValid: false,
      error: 'Please upload a valid screenshot proof from your official golf platform (e.g. Golf Ireland, WHS, HowDidiDo).',
    };
  }
  return { isValid: true };
}

/**
 * Updates winner verification and payout status
 * @param {Object} verificationRecord
 * @param {Object} update
 * @param {'approve'|'reject'|'mark_paid'} action
 * @param {string} [adminId='admin-1']
 * @param {string} [rejectionReason]
 * @returns {Object} Updated verification record
 */
export function processWinnerVerificationAction(verificationRecord, action, adminId = 'admin-1', rejectionReason = '') {
  const updated = { ...verificationRecord, updatedAt: new Date().toISOString() };

  if (action === 'approve') {
    updated.verificationStatus = 'approved';
    updated.reviewedBy = adminId;
    updated.reviewedAt = new Date().toISOString();
    updated.rejectionReason = '';
  } else if (action === 'reject') {
    updated.verificationStatus = 'rejected';
    updated.reviewedBy = adminId;
    updated.reviewedAt = new Date().toISOString();
    updated.rejectionReason = rejectionReason || 'Screenshot proof did not match the submitted Stableford scores.';
  } else if (action === 'mark_paid') {
    if (updated.verificationStatus !== 'approved') {
      throw new Error('Winner verification must be approved before marking payout as paid.');
    }
    updated.payoutStatus = 'paid';
    updated.paidAt = new Date().toISOString();
  }

  return updated;
}
