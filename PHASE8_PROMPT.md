# SwiftVerify — Phase 8 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 8.

---

Continue building **SwiftVerify**. Phases 1–7 complete and DB-backed:
1 landing · 2 order + M-PESA funnel · 3 admin dashboard + Auth.js · 4 email (Nodemailer) + Telegram · 5 client order tracking · 6 SEO + FAQ · 7 abuse hardening (rate limiting + honeypots).

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch state:** stacked feature branches; latest is `phase-7-hardening` (contains phases 3–7). **Likely not merged to `main`/deployed yet** — check `git log origin/main`, merge, or branch off `phase-7-hardening`. Direct `main` push + Vercel secret writes are auto-mode-gated (hand to user).

**Stack / conventions:**
- Next.js 16 (App Router, `/app`, no src), React 19, TS strict (no `any`), Tailwind v4 (`navy-*`/`brand-*` in `app/globals.css`), lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **Dev = webpack** (`npm run dev`); Turbopack hangs on OneDrive. `next build` uses Turbopack, works. Verify with `npx next start -p 3200` + curl — **poll `/` until ready before hitting routes** (early requests return 000 while booting). A dev server from another session may hold port 3100.
- **Prisma v6.19.3** (NOT v7). `next build` directly (client already generated). One-off scripts: `tsx --env-file=.env scripts/x.ts` (tsx does NOT auto-load .env).
- **Neon Postgres** via `.env` + Vercel. **Auth.js v5** (`trustHost:true`, `middleware.ts` `export default auth`, gates `/admin`). Admin bootstrap: `npm run admin:create`.
- Libs: `lib/data.ts` (public), `lib/admin.ts` (admin), `lib/settings.ts` (Setting table→config fallback), `lib/db.ts`, `lib/email.ts` (Nodemailer, console fallback), `lib/telegram.ts` (dormant until bot token set), `lib/seo.ts` + `app/opengraph-image.tsx`/`sitemap.ts`/`robots.ts`, `lib/security.ts` (rate limiter, Upstash-or-memory, fails open) + `lib/honeypot.ts`. Forms use `components/Honeypot.tsx`.

**Read first:** `lib/admin.ts`, `app/admin/actions.ts`, `lib/data.ts`, `lib/config.ts`, `prisma/schema.prisma`.

## Phase 8 goal — pick with the user. Strong candidates (unbuilt so far):
1. **Real logo + brand polish** — `public/logo.svg`/`logo-mark.svg` are still PLACEHOLDERS; swap when the user provides the asset, refresh favicon. (OG image uses an inline SVG check, no logo file needed.)
2. **Admin polish** — order search (id/email/phone), analytics date-range filter, per-service revenue breakdown, filtered CSV, bulk approve, pagination on promo/testimonials.
3. **Payments upgrade (big)** — M-PESA Daraja STK Push + C2B callback to auto-confirm payments instead of manual receipt review. Needs Safaricom Daraja creds; add as an opt-in path alongside the existing manual flow.
4. **Analytics + consent** — Vercel Analytics (or privacy-friendly alt) + cookie/consent banner wired to `Setting`.
5. **Content/trust & long-tail SEO** — About/Why-us section, trust badges, blog/guides (`/guides/[slug]` from MDX or DB) targeting "how to verify Payoneer in Kenya" etc., richer testimonials with photos.
6. **Transactional email polish** — now that Nodemailer is live, add order-status-change emails to more transitions, a branded receipt, and an admin daily digest.
7. **Testing/CI** — Playwright smoke tests for the order→payment→track flow + a GitHub Action running build/typecheck on PRs.

**Constraints:** TS strict no `any`; keep DB-unset + integration-unset fallbacks working; verify with `next start` + curl (view any visual output) before committing; commit to a `phase-8-*` branch + push (human merges). Produce a Phase 9 prompt when done.

## Manual steps still pending
- Merge stacked branches → `main` (or push `main`) to deploy phases 3–7.
- Vercel env: `AUTH_SECRET` (P3); when ready `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`TELEGRAM_BOT_TOKEN`/`TELEGRAM_ADMIN_CHAT_ID` (P4); `NEXT_PUBLIC_SITE_URL` (P6); optional `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` (P7 — without them rate limiting is in-memory per-instance, which resets on each serverless cold start).
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
