# Business Logic Specifications

## 1. 5-Score Rolling FIFO Window (§ 05)
1. **Format**: Stableford points, strictly whole numbers in range `1` to `45`.
2. **Date Requirement**: Every entry has a date `YYYY-MM-DD` (cannot be in the future).
3. **Uniqueness**: Only one score entry is permitted per date.
4. **FIFO Rolling**:
   - Scores are sorted in reverse chronological order (most recent round first).
   - Only the latest 5 scores are active (`isRollingActive = true`) and constitute the user's draw entry.
   - Adding a 6th score automatically demotes the oldest score to archive.
   - Deleting or updating an active score automatically recalculates the rolling 5 set from historical records.

## 2. Prize Pool & Tier Mathematics (§ 07)
A fixed portion (50%) of each subscription contributes to the monthly prize pool.
- **5-Number Match**:
  - `40%` of fresh monthly pool + `100%` of unclaimed rollover jackpot brought forward.
  - Rollover enabled: If 0 winners, entire 5-match tier carries forward to the next month's jackpot.
- **4-Number Match**:
  - `35%` of fresh monthly pool.
  - Split equally among multiple 4-match winners.
  - No rollover: Unclaimed 4-match pool does not carry forward.
- **3-Number Match**:
  - `25%` of fresh monthly pool.
  - Split equally among multiple 3-match winners.
  - No rollover.

## 3. Charity Contribution Model (§ 08)
- Guaranteed minimum `10%` of each subscription fee is ring-fenced for the subscriber's chosen charity.
- Voluntary boost: Users can raise their contribution to `15%`, `20%`, `25%`, `35%`, or `50%`.
- Direct donations: Supporters can donate arbitrary amounts directly to any charity outside the subscription draw flow.

## 4. Winner Verification Workflow (§ 09)
1. **Trigger**: When a published draw identifies an entry with 3, 4, or 5 matches, a verification record is generated with `verification_status: 'pending'`, `payout_status: 'pending'`.
2. **Submission**: Winner uploads a screenshot of their scores from their official golf platform (Golf Ireland, WHS, HowDidiDo).
3. **Admin Review**:
   - `Approve`: Confirms scorecard validity; sets `verification_status = 'approved'`.
   - `Reject`: Requires rejection reason notes; sets `verification_status = 'rejected'`.
4. **Disbursement**: When approved, admin marks payout as `paid`, recording timestamp and audit trail.
