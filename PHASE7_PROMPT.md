# SwiftVerify — Phase 7 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 7.

---

Continue building **SwiftVerify**. Phases 1–6 are complete and DB-backed:
1 landing · 2 order + M-PESA funnel · 3 admin dashboard + Auth.js · 4 email (Nodemailer) + Telegram · 5 client order tracking · 6 SEO + FAQ.

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch state:** shipping on stacked feature branches; latest is `phase-6-seo-faq` (contains phases 3–6). **Likely not merged to `main`/deployed yet** — check `git log origin/main`, merge, or branch off `phase-6-seo-faq`. Direct `main` push + Vercel secret writes are auto-mode-gated (hand to user).

**Stack / conventions:**
- Next.js 16 (App Router, `/app`, no src), React 19, TS strict (no `any`), Tailwind v4 (`navy-*`/`brand-*` in `app/globals.css`), lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **Dev = webpack** (`npm run dev`); Turbopack hangs on OneDrive. `next build` uses Turbopack, works. Verify with `npx next start -p 3200` + curl (readiness-poll `/` before hitting routes — first requests 000 while booting). A dev server from another session may hold port 3100.
- **Prisma v6.19.3** (NOT v7). `next build` directly (client already generated); stop dev server before `prisma generate`. One-off scripts: `tsx --env-file=.env scripts/x.ts`.
- **Neon Postgres** via `.env` + Vercel. **Auth.js v5** (`trustHost:true`, `middleware.ts` `export default auth`, gates `/admin`). Admin: `npm run admin:create`.
- Data: `lib/data.ts` (public), `lib/admin.ts` (admin), `lib/settings.ts` (Setting table→config fallback), `lib/db.ts`. Notifications: `lib/email.ts` (console fallback), `lib/telegram.ts` (dormant until bot token/chat id set). SEO: `lib/seo.ts` (`siteUrl`, JSON-LD builders), `components/JsonLd.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`. FAQ: `lib/content.ts` `faqs` + `components/Faq.tsx`.

**Read first:** `lib/admin.ts`, `app/admin/actions.ts`, `lib/data.ts`, `prisma/schema.prisma`, `lib/config.ts`.

## Phase 7 goal — pick with the user. Strong candidates:
1. **Abuse hardening** (highest priority for a live, unauthenticated funnel) — rate-limit the order, newsletter (`/api/subscribe`), and track endpoints; add form honeypots + basic bot checks. Prefer a serverless-friendly store (Upstash Redis REST, env-configured, no-op when unset like the other integrations). Guard the createOrder server action + subscribe route.
2. **Real logo** — still a PLACEHOLDER (`public/logo.svg` + `logo-mark.svg`). Swap when the user provides `swiftverifylogo.jpg`; also refresh favicon + OG (og uses inline check mark, no logo file needed).
3. **Admin polish** — order search (id/email/phone), analytics date-range filter, per-service revenue breakdown, CSV of a filtered view, bulk approve.
4. **Analytics + consent** — Vercel Analytics (or privacy-friendly alt) + a light cookie/consent note wired to `Setting`.
5. **Payments upgrade** — optional M-PESA STK push / Daraja API to auto-confirm payments instead of manual receipt review (bigger lift; needs Safaricom Daraja creds).
6. **Content/trust** — a real "About/Why us" section, trust badges, richer testimonials with photos, blog/guides for SEO long-tail.

**Constraints:** TS strict no `any`; keep the DB-unset + integration-unset fallbacks working; verify with `next start` + curl (and view any visual output) before committing; commit to a `phase-7-*` branch + push (human merges). Produce a Phase 8 prompt when done.

## Manual steps still pending
- Merge stacked branches → `main` (or push `main`) to deploy phases 3–6.
- Vercel env: `AUTH_SECRET` (P3); when ready `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`TELEGRAM_BOT_TOKEN`/`TELEGRAM_ADMIN_CHAT_ID` (P4); `NEXT_PUBLIC_SITE_URL` (P6, for correct canonical/OG on custom domains).
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
