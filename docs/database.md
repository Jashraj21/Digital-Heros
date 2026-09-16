# Database Schema & Entity Relationships

The platform uses a PostgreSQL schema configured with Row-Level Security (RLS), foreign key integrity constraints, and query indexes.

## Entity Overview

### 1. `profiles`
- `id`: UUID (Primary Key, references `auth.users(id)`)
- `email`: TEXT (Unique)
- `full_name`: TEXT
- `avatar_url`: TEXT
- `phone`: TEXT
- `role`: TEXT ('user' | 'admin')
- `created_at`, `updated_at`: TIMESTAMPTZ

### 2. `subscriptions`
- `id`: UUID (PK)
- `user_id`: UUID (FK `profiles.id`)
- `stripe_customer_id`: TEXT
- `stripe_subscription_id`: TEXT
- `plan`: TEXT ('monthly' | 'yearly')
- `status`: TEXT ('active' | 'past_due' | 'canceled' | 'lapsed' | 'incomplete')
- `price_amount`: NUMERIC(10, 2)
- `currency`: TEXT (Default 'INR')
- `current_period_start`, `current_period_end`: TIMESTAMPTZ
- `cancel_at_period_end`: BOOLEAN

### 3. `scores` (PRD § 05)
- `id`: UUID (PK)
- `user_id`: UUID (FK `profiles.id`)
- `score`: INTEGER (1 to 45 Stableford format)
- `played_at`: DATE (Unique per `user_id` constraint)
- `course_name`: TEXT
- `notes`: TEXT
- `is_rolling_active`: BOOLEAN (True for the latest 5 dated scores)

### 4. `charities` (PRD § 08)
- `id`: UUID (PK)
- `name`: TEXT
- `slug`: TEXT (Unique)
- `category`: TEXT
- `description`: TEXT
- `mission_statement`: TEXT
- `logo_url`: TEXT
- `cover_image_url`: TEXT
- `featured`: BOOLEAN
- `total_raised`: NUMERIC(12, 2)
- `supporter_count`: INTEGER
- `events`: JSONB (Charity golf days & galas)

### 5. `user_charity_preferences` (PRD § 08.1)
- `id`: UUID (PK)
- `user_id`: UUID (Unique, FK `profiles.id`)
- `charity_id`: UUID (FK `charities.id`)
- `contribution_percentage`: INTEGER (>= 10, default 10)

### 6. `draws` (PRD § 06 & § 07)
- `id`: UUID (PK)
- `draw_number`: INTEGER (Unique)
- `title`: TEXT
- `draw_date`: DATE
- `month_year`: TEXT
- `draw_type`: TEXT ('random' | 'algorithmic')
- `winning_numbers`: INTEGER[] (Array of 5 sorted numbers)
- `total_pool_amount`: NUMERIC(12, 2)
- `jackpot_brought_forward`: NUMERIC(12, 2)
- `jackpot_carried_forward`: NUMERIC(12, 2)
- `status`: TEXT ('draft' | 'simulated' | 'published')
- `tier_summaries`: JSONB

### 7. `draw_entries`
- `id`: UUID (PK)
- `draw_id`: UUID (FK `draws.id`)
- `user_id`: UUID (FK `profiles.id`)
- `submitted_scores`: INTEGER[] (5 numbers)
- `matches_count`: INTEGER (0 to 5)
- `matched_numbers`: INTEGER[]
- `prize_tier`: TEXT ('5_match' | '4_match' | '3_match' | NULL)
- `prize_amount`: NUMERIC(10, 2)

### 8. `winner_verifications` (PRD § 09)
- `id`: UUID (PK)
- `draw_entry_id`: UUID (FK `draw_entries.id`)
- `draw_id`: UUID (FK `draws.id`)
- `user_id`: UUID (FK `profiles.id`)
- `proof_url`: TEXT (Screenshot image URL)
- `proof_notes`: TEXT
- `verification_status`: TEXT ('pending' | 'approved' | 'rejected')
- `payout_status`: TEXT ('pending' | 'paid')
- `rejection_reason`: TEXT
- `reviewed_by`: UUID (FK `profiles.id`)
