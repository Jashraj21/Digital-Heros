# Local Setup & Deployment Guide

## Prerequisites
- Node.js (v18+)
- npm (v9+)

## 1. Quick Start (Instant In-Memory / Full-Stack Mode)
```bash
# 1. Install dependencies
npm install

# 2. Run unit & integration test suite
npm run test

# 3. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 2. Test Accounts & Instant Switcher
- **Administrator**:
  - Email: `admin@digitalheroes.co.in`
  - Access: Full access to `/admin` surfaces (Analytics, Users, Draws, Charities, Winners, Reports)
- **Subscriber**:
  - Email: `player@digitalheroes.co.in`
  - Access: Full access to `/dashboard` (5 Rolling scores, Charity %, Draws, Winnings & Proof upload)
- **1-Click Switcher**: Click the **1-Click Switcher** button in the top navbar on any page to switch identities instantly.

## 3. Connecting to Supabase (Production)
1. Create a project in [Supabase](https://supabase.com).
2. Go to the SQL Editor and execute:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed/seed.sql`
3. Copy your project URL and anon key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

## 4. Connecting Stripe (Production)
1. Add your Stripe test API keys into `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
2. When Stripe keys are omitted or placeholder, the platform automatically switches to **Interactive Demo Checkout Mode**, allowing seamless end-to-end evaluation without external webhooks.
