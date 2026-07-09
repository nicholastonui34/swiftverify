# SwiftVerify — Phase 3 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 3.

---

Continue building the **SwiftVerify** project. Phases 1 (landing page) and 2 (order + M-PESA payment funnel) are complete, deployed, and DB-backed. Project path:

`C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`

**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify (pushes to `main` auto-deploy to Vercel).

**Stack / conventions already in place:**
- Next.js 16 (App Router, `/app`, no src dir), React 19, TypeScript, Tailwind v4 (tokens in `app/globals.css`: `navy-*` primary, `brand-*` emerald). lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **Dev uses webpack** (`npm run dev` → `next dev --webpack`); Turbopack hangs on this OneDrive filesystem. Preview runs on port **3100** (preview_start name `swiftverify`).
- **Prisma v6.19.3** (NOT v7 — v7's deps corrupt on OneDrive). Stop the dev server before `prisma generate` (it locks the engine DLL). Full schema in `prisma/schema.prisma` (User, Service, Order, PromoTracker, Testimonial, Subscriber, Setting; enums Role, OrderStatus).
- **Neon Postgres** already connected: `DATABASE_URL` + `DIRECT_URL` in gitignored `.env` (Prisma CLI reads `.env`, NOT `.env.local`) and in Vercel env (Production + Preview). Migrated + seeded (6 services, 5 testimonials). Order data-access in `lib/data.ts`; Prisma singleton in `lib/db.ts`.
- Order flow: `app/order/page.tsx` (form), `app/order/actions.ts` (`createOrder`, `submitPayment`), `app/order/[orderId]/payment/page.tsx`. Email stubs in `lib/email.ts` (real Nodemailer = Phase 4).

**Read first:** `prisma/schema.prisma`, `lib/db.ts`, `lib/data.ts`, `lib/config.ts`, `app/order/actions.ts`, and a couple of components for styling patterns.

## Phase 3 goal: Admin Dashboard + Auth

1. **Auth.js v5 (next-auth, already installed)** — credentials provider (email/password, bcryptjs), JWT sessions, `role` (CLIENT/ADMIN) in token+session. `middleware.ts` protects `/admin` (ADMIN only). Add a one-time admin bootstrap (seed an ADMIN user, or a guarded setup route) since guest-checkout users have `password = null`.
2. **`/admin` dashboard home** — metrics: total orders this month, pending approvals, completed, total revenue; recent orders.
3. **Orders management** (`/admin/orders`) — table (id, client, service, price, status, proof), status filter, pagination, sort. Row detail: client contact, **payment proof image** (the `mpesaProofUrl` is a base64 data URL — render with `<img>`), admin notes, and actions: **Approve Payment** (→ APPROVED + client email), **Reject & Refund** (→ CANCELLED + email), **Mark Complete** (→ COMPLETED + email + testimonial ask). Status-change emails via `lib/email.ts` stubs.
4. **Promo tracking** — show `X/10` (count `PromoTracker`), list promo orders, **Reset Promo** action. (Landing already reads live promo count.)
5. **Testimonials CRUD** — table + add/edit/delete + active toggle (landing reads `isActive` from DB).
6. **Basic analytics** — orders-by-status chart, revenue trend, CSV export.
7. **Settings** (`Setting` table) — M-PESA merchant phone/name, admin email, company tagline, current tip, promo active. Wire the payment page + banner to read these instead of `lib/config.ts` hardcodes (currently M-PESA = 0725830334 / NICHOLAS TONUI in config).

**Acceptance:** admin logs in, sees the test-order-driven metrics, opens an order, views the M-PESA receipt, approves it (status → APPROVED, email stub logs), and a promo reset works. TypeScript strict, no `any`, `/admin` blocked for non-admins. Commit + push (auto-deploys); add any new env vars (e.g. `NEXTAUTH_SECRET`) to Vercel. When done, give me a **Phase 4 (Email + Telegram)** session prompt.
