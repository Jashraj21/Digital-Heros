# Digital Heroes Platform

> A subscription-driven web platform combining golf performance tracking, monthly charity prize draws, and transparent grassroots impact.

Built strictly according to the **Digital Heroes PRD (Level 1)**.

---

## 🌟 Key Features

1. **Golf Performance & 5-Score Rolling Engine (§ 05)**
   - Stableford scoring format (1 to 45).
   - Strict one-entry-per-date validation.
   - Automatic 5-score FIFO rolling window: newest rounds automatically roll out the oldest.
   - Reverse chronological score history with full edit and delete controls.

2. **Monthly Draw & Reward System (§ 06 & § 07)**
   - Monthly cadence with dual draw modes:
     - **Random**: Standard uniform lottery RNG across numbers 1–45.
     - **Algorithmic**: Frequency-weighted by active subscriber score distribution.
   - 3 Prize Tiers:
     - **5-Number Match**: 40% pool share + **Jackpot Rollover** (carries forward if unclaimed).
     - **4-Number Match**: 35% pool share (split equally among winners).
     - **3-Number Match**: 25% pool share (split equally among winners).
   - Admin pre-publish simulation mode with live tier payout calculations and rollover forecasts.

3. **Charity System & Independent Donations (§ 08)**
   - Guaranteed minimum 10% direct allocation from subscription fees.
   - Voluntary percentage boost slider (10% to 50%).
   - Comprehensive charity directory with search, category filtering, and impact metrics.
   - Detailed charity profiles featuring upcoming community golf days and direct one-off donation modal.

4. **Winner Verification & Payout Pipeline (§ 09)**
   - Winner eligibility detection and proof submission interface.
   - Scorecard screenshot upload (Golf Ireland, WHS, HowDidiDo).
   - Admin audit queue with Approve, Reject (with feedback notes), and Payout disbursement tracking (`Pending` $\rightarrow$ `Approved` $\rightarrow$ `Paid`).

5. **Subscriber & Administrator Dashboards (§ 10 & § 11)**
   - **Subscriber Dashboard**: Subscription status, rolling 5 scores, charity giving %, upcoming draws, winnings & claims.
   - **Admin Console**: 5 Control Surfaces (User Management, Draw Engine, Charity CRUD, Winner Verifications, Reports & CSV Export).

6. **Design Language (§ 12)**
   - High-end dark glassmorphism, glowing accents, rich typography, and micro-interactions.
   - Avoids golf clichés (no plaid, no fairway grass); leads with emotional social impact.

---

## 🚀 Quick Start

### 1. Install & Test
```bash
# Install dependencies
npm install

# Run comprehensive automated test suite (24 passing unit tests)
npm run test

# Launch development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Test Credentials & 1-Click Switcher

For seamless evaluation, use the **1-Click Switcher** button in the top navigation bar or the following credentials:

| Role | Email | Access |
| :--- | :--- | :--- |
| **Administrator** | `admin@digitalheroes.co.in` | `/admin` control surfaces |
| **Subscriber** | `player@digitalheroes.co.in` | `/dashboard` subscriber area |

---

## 📁 Technical Architecture & Project Structure

```
src/
├── app/
│   ├── (public)/                 # Landing, How It Works, Charities, Pricing
│   ├── auth/                     # Login (with 1-click switcher), Register
│   ├── dashboard/                # Subscriber portal (Overview, Scores, Charity, Draws, Winnings, Settings)
│   ├── admin/                    # Admin portal (Analytics, Users, Draws, Charities, Winners, Reports)
│   └── api/                      # Full REST API routes for all modules
├── components/                   # UI, Layout, Scores, Draws, Charities, Winners
├── lib/                          # Scores, Draws, Prizes, Charities, Winners, Supabase, Stripe
├── constants/                    # Route constants, Draw rules, Subscription tiers
└── hooks/                        # useAuth, Session management

supabase/
├── migrations/001_initial_schema.sql  # Complete PostgreSQL schema, RLS policies & indexes
└── seed/seed.sql                      # Demo seed data

docs/
├── architecture.md               # System architectural diagram and data flow
├── database.md                   # PostgreSQL table specifications & constraints
├── business-logic.md             # Rolling FIFO rules, prize math & charity logic
├── draw-system.md                # Random & Algorithmic draw mechanics
├── setup.md                      # Deployment & environment setup
└── assumptions.md                # Documented requirements interpretations
```

---

## 🧪 Automated Testing

All business logic modules are tested with Vitest:
- `tests/unit/scores/score-validation.test.js`: Validates 1-45 range, date checks, and duplicate date prohibition.
- `tests/unit/scores/score-service.test.js`: Validates 5-score rolling FIFO window and oldest score demotion.
- `tests/unit/draws/draw-engine.test.js`: Tests Random and Algorithmic draw generation and 3/4/5 matching rules.
- `tests/unit/prizes/prize-calculator.test.js`: Tests 40%/35%/25% pool splits, equal winner division, and 5-match jackpot rollover.
- `tests/unit/charities/contribution-calculator.test.js`: Tests 10% minimum rule and custom percentage contributions.
- `tests/unit/winners/verification-service.test.js`: Tests proof validation, approval, rejection, and payout states.

```bash
npm run test
```
