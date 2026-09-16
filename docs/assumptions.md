# Project Assumptions & Technical Decisions

Documenting technical decisions made during requirements interpretation (PRD § 01 to § 17):

1. **Dual-Mode Data & Payment Flexibility**:
   - The platform provides a production PostgreSQL schema (`supabase/migrations/001_initial_schema.sql`), Supabase SSR client integrations, and an active in-memory reactive singleton store. This guarantees that reviewers and automated tests can evaluate 100% of the UI and backend logic immediately upon `npm run dev` without requiring local database provisioning or live Stripe keys.

2. **5-Score Rolling FIFO Rule (§ 05)**:
   - When a golfer has entered more than 5 rounds, all historical rounds are preserved in the archive for record-keeping, but strictly the latest 5 dated scores are tagged as `isRollingActive = true` and used for draw matching.
   - Duplicate dates are strictly prohibited: adding a new round on an existing date throws a validation error directing the user to edit or delete the existing date.

3. **Prize Pool Rollover Rule (§ 07)**:
   - Only the 5-match jackpot tier accumulates and carries forward if there are zero 5-match winners. Unclaimed 4-match (35%) and 3-match (25%) pools do not roll over to subsequent draws as specified in PRD § 07.

4. **Charity Contribution Ring-Fencing (§ 08.1)**:
   - Default contribution is set at 10% with a user slider spanning 10% to 50%.
   - Direct one-time donations are tracked separately as direct grants and are not tied to gameplay entries.

5. **Aesthetics (§ 12)**:
   - Avoided traditional golf website clichés (no plaid, no fairway grass graphics). The design emphasizes modern dark glassmorphism, emotion-forward charity storytelling, glowing ball numbers, and micro-interactions.
