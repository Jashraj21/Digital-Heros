# Digital Heroes — System Architecture

## 1. Overview
Digital Heroes is a modern, full-stack, subscription-driven web platform combining golf performance tracking, charity fundraising, and monthly draw-based prize pools.

Built with **Next.js (App Router), React, JavaScript (ESM), Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), and Stripe**.

```
                           +------------------------+
                           |  Next.js (App Router)  |
                           +-----------+------------+
                                       |
                +----------------------+----------------------+
                |                                             |
        +-------v-------+                             +-------v-------+
        | Public Pages  |                             | Auth & Guards |
        | (Marketing,   |                             | (User / Admin)|
        |  Charities,   |                             +-------+-------+
        |  Pricing)     |                                     |
        +---------------+                     +---------------+---------------+
                                              |                               |
                                      +-------v-------+               +-------v-------+
                                      | Subscriber UI |               | Admin Console |
                                      | - 5 Rolling   |               | - Draw Engine |
                                      | - Charity %   |               | - Winner Audits|
                                      | - Draws & Proof|              | - User CRUD   |
                                      +-------+-------+               +-------+-------+
                                              |                               |
                                      +-------v-------------------------------v-------+
                                      |             Core Domain Engines               |
                                      |  (Scores, Draws, Prizes, Charity, Winners)    |
                                      +-----------------------+-----------------------+
                                                              |
                                              +---------------+---------------+
                                              |                               |
                                      +-------v-------+               +-------v-------+
                                      |  Supabase DB  |               | Stripe Gateway|
                                      | (PostgreSQL,  |               | (Subscriptions|
                                      |  RLS, Storage)|               |  & Checkouts) |
                                      +---------------+               +---------------+
```

## 2. Directory Structure
- `src/app/(public)`: Public marketing, charity directory, and pricing routes.
- `src/app/auth`: Authentication and 1-click test credential login.
- `src/app/dashboard`: Registered subscriber portal (Overview, Scores, Charity, Draws, Winnings, Settings).
- `src/app/admin`: Administrator surface (Analytics, User Management, Draw Engine, Charity CRUD, Winner Verification, Reports).
- `src/app/api`: Server-side API endpoints for all operations.
- `src/lib`: Core business logic engines (`scores`, `draws`, `prizes`, `charities`, `winners`, `data`, `stripe`, `supabase`).
- `src/constants`: Domain rules, prize tier percentages, pricing plans, and routes.
- `supabase`: PostgreSQL migrations, RLS policies, and rich seed data.
- `tests`: Vitest test suites verifying score rolling FIFO, draw generation, prize tier calculations, and winner workflows.
