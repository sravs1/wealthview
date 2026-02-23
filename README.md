# Wealthview

**Your entire portfolio, one intelligent view.**

Connect your crypto exchanges and brokerage accounts in one place. Get real-time portfolio tracking and AI-powered investment suggestions.

🌐 **Live:** https://wealthview-biyr.vercel.app/
📦 **Repo:** https://github.com/sravs1/wealthview

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, Framer Motion |
| Auth & Database | Supabase (Auth + Postgres + RLS) |
| Payments | Stripe (Subscriptions + Customer Portal) |
| Email | Resend |
| Deployment | Vercel |

---

## Environment Variables

Create a `.env.local` file in the project root:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key — needed for Stripe webhook to update profiles. Get from: Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Webhook signing secret (`stripe listen --print-secret`) |
| `RESEND_API_KEY` | ✅ | Resend API key for welcome emails |

---

## Route Manifest

### Pages

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page |
| `/auth/signin` | Static | Email/password + Google OAuth sign-in |
| `/auth/signup` | Static | Account creation (email confirmation disabled) |
| `/auth/callback` | Dynamic | Supabase OAuth callback; sends welcome email |
| `/dashboard` | Dynamic | Portfolio overview — stats, top holdings, quick actions |
| `/dashboard/exchanges` | Dynamic | Connect / disconnect exchanges |
| `/dashboard/portfolio` | Dynamic | Full holdings + allocation chart (real Alpaca data or demo) |
| `/dashboard/insights` | Dynamic | AI insights (coming soon) |
| `/dashboard/billing` | Dynamic | Subscription plans + Stripe Customer Portal |
| `/dashboard/settings` | Dynamic | Account settings |

### API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/exchanges/connect` | POST | 🔒 User | Save exchange API credentials to Supabase |
| `/api/exchanges/disconnect` | POST | 🔒 User | Soft-delete exchange credentials |
| `/api/portfolio/sync` | GET | 🔒 User | Fetch real portfolio from Alpaca; falls back to demo data |
| `/api/stripe/checkout` | POST | 🔒 User | Create Stripe checkout session (inline pricing) |
| `/api/stripe/portal` | POST | 🔒 User | Create Stripe Customer Portal session |
| `/api/stripe/webhook` | POST | Stripe sig | Handle subscription lifecycle events |
| `/api/demo/seed` | POST | 🔒 User | Seed 3 demo exchanges for quick trials |

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local   # then fill in your keys
```

### 3. Run the Supabase migration
Open **Supabase Dashboard → SQL Editor**, paste and run the contents of:
```
supabase/migrations/001_initial.sql
```
This creates the `profiles`, `connected_exchanges`, and `portfolio_snapshots` tables with Row Level Security policies. A trigger auto-creates a profile row on every new sign-up.

### 4. Run the Stripe webhook listener (local dev only)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 5. Start the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Demo Mode

### One-click seed (fastest path for judges)
1. Sign up at `/auth/signup` with any email — you're logged in immediately
2. Click **"Load Demo Data"** in the dashboard header
3. Dashboard shows a **$47,832** portfolio across Coinbase, Binance, and Alpaca

### Real Alpaca integration
1. Create a free account at [alpaca.markets](https://alpaca.markets) (paper trading is free)
2. Generate an API Key + Secret (paper keys start with `PK`)
3. Dashboard → Exchanges → Connect **Alpaca** → enter your credentials
4. Dashboard → Portfolio shows your **real** Alpaca positions and account value

### Test credentials
```
Email:    demo@wealthview.app
Password: Demo@12345
```
Create this account once via `/auth/signup`, then use **Load Demo Data** in the header.

---

## Stripe Test Cards

| Scenario | Card Number |
|---|---|
| ✅ Success | `4242 4242 4242 4242` |
| ❌ Declined | `4000 0000 0000 0002` |
| 🔐 3D Secure | `4000 0025 0000 3155` |

Use any future expiry date and any 3-digit CVC.

Plans are created **inline** — no Stripe Dashboard products needed:
- **Pro** — $9.99/month
- **Enterprise** — $29.99/month

After checkout, the Stripe webhook fires `checkout.session.completed` and updates `profiles.subscription_tier` in Supabase. The billing page immediately reflects the active tier and shows a **Manage Subscription** button linked to the Stripe Customer Portal.

---

## Supported Exchanges

### Live (API key integration)
| Exchange | Type | Real Sync |
|---|---|---|
| **Alpaca** | Stocks + Crypto | ✅ Live positions + P&L |
| Coinbase | Crypto | API key stored, sync coming |
| Binance | Crypto | API key stored, sync coming |
| Kraken | Crypto | API key stored, sync coming |
| KuCoin | Crypto | API key + passphrase stored |
| Bybit | Crypto | API key stored |
| Gemini | Crypto | API key stored |
| Crypto.com | Crypto | API key stored |

### Coming Soon
Robinhood, Fidelity, Charles Schwab, E*TRADE, Interactive Brokers, Webull

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                       # Landing page
│   ├── auth/
│   │   ├── signin/page.tsx            # Sign-in form (Suspense-wrapped)
│   │   ├── signup/page.tsx            # Sign-up form
│   │   └── callback/route.ts          # OAuth callback + welcome email
│   ├── dashboard/
│   │   ├── layout.tsx                 # Auth guard + sidebar/header shell
│   │   ├── page.tsx                   # Overview with stats + holdings
│   │   ├── exchanges/page.tsx         # Exchange connect/disconnect UI
│   │   ├── portfolio/page.tsx         # Holdings + allocation (real or demo)
│   │   ├── billing/page.tsx           # Plans + Stripe Portal
│   │   ├── insights/page.tsx          # AI insights placeholder
│   │   └── settings/page.tsx          # Account settings
│   └── api/
│       ├── exchanges/connect/         # POST — save credentials
│       ├── exchanges/disconnect/      # POST — remove credentials
│       ├── portfolio/sync/            # GET  — Alpaca live sync
│       ├── stripe/checkout/           # POST — create checkout session
│       ├── stripe/portal/             # POST — create portal session
│       ├── stripe/webhook/            # POST — subscription events
│       └── demo/seed/                 # POST — seed demo exchanges
├── components/
│   ├── landing/                       # Hero, Features, ExchangeLogos, etc.
│   ├── dashboard/                     # Sidebar, DashboardHeader, DemoSeedButton
│   └── exchanges/                     # ExchangeCard, ConnectModal
└── lib/
    ├── supabase/client.ts             # Browser client
    ├── supabase/server.ts             # Server client (cookie-based)
    ├── stripe.ts                      # Lazy Stripe singleton
    ├── exchanges/alpaca.ts            # Alpaca API client
    └── resend.ts                      # Welcome email

supabase/
└── migrations/001_initial.sql        # DB schema + RLS policies
```
