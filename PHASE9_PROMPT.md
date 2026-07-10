# SwiftVerify — Phase 9 Session Prompt

Copy into a **new Claude Code session** to build Phase 9.

---

Continue building **SwiftVerify**. Phases 1–8 complete and DB-backed:
1 landing · 2 order + M-PESA funnel · 3 admin dashboard + Auth.js · 4 email (Nodemailer) + Telegram · 5 client order tracking · 6 SEO + FAQ · 7 abuse hardening (rate limiting + honeypots) · 8 admin polish (order search, bulk approve, per-service revenue + analytics range).

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch state:** stacked feature branches; latest `phase-8-admin-polish` contains phases 3–8. Check `git log origin/main` — if the big merge happened, branch off `main`; else off `phase-8-admin-polish`. Direct `main` push + Vercel secret writes are auto-mode-gated (hand to user).

**Conventions:**
- Next.js 16 (App Router, no src), React 19, TS strict (no `any`), Tailwind v4 (`navy-*`/`brand-*`), lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **This machine's Bash tool PATH is flaky** (node/npx sometimes missing) — use the **PowerShell** tool for npm/git/tsx. Dev = webpack (`npm run dev`; Turbopack hangs on OneDrive). `next build` works. Verify with `npx next start -p 3200` started via a **background** runner (a foreground/detached start dies between calls); poll `/` until ready; drive with `curl.exe` + a cookie jar. One-off scripts: `npx tsx --env-file=.env scripts/x.ts`.
- **Commit messages: use `git commit -F <file>`** — PowerShell here-strings mangle multi-line `-m`.
- **Prisma v6.19.3** (NOT v7). **Neon Postgres** via `.env` + Vercel. **Auth.js v5** (`trustHost:true`, gates `/admin`; admin bootstrap `npm run admin:create`).
- Libs: `lib/data.ts`, `lib/admin.ts` (getOrders has `query`; getRevenueByService; bulkApproveOrders in `app/admin/actions.ts`), `lib/settings.ts`, `lib/email.ts` (console fallback), `lib/telegram.ts` (dormant), `lib/seo.ts`, `lib/security.ts` (rate limit, fails open) + `lib/honeypot.ts`.

**Read first:** `lib/admin.ts`, `app/admin/actions.ts`, `lib/data.ts`, `prisma/schema.prisma`, `lib/config.ts`.

## Phase 9 goal — pick with the user. Unbuilt candidates:
1. **Real logo + favicon** — `public/logo.svg`/`logo-mark.svg` still PLACEHOLDERS; swap when the user provides the asset.
2. **M-PESA Daraja STK Push (big)** — auto-confirm payments (STK push + C2B/validation callback) alongside the existing manual receipt flow. Needs Safaricom Daraja creds; gate behind env like other integrations.
3. **Testing + CI** — Playwright smoke test (order → payment → track) + a GitHub Action running typecheck/build on PRs. (Note the PowerShell/Bash quirks above.)
4. **Analytics + consent** — Vercel Analytics + a cookie/consent note wired to `Setting`.
5. **Content/long-tail SEO** — About/Why-us, trust badges, `/guides/[slug]` articles for "verify Payoneer in Kenya" etc.
6. **Transactional email polish** — branded receipt, admin daily digest, more status-change triggers now that Nodemailer is live.

**Constraints:** TS strict no `any`; keep DB-unset + integration-unset fallbacks working; verify with `next start` + curl (view any visual output) before committing; commit to a `phase-9-*` branch + push (human merges). Produce a Phase 10 prompt when done.

## Manual steps still pending
- Merge stacked branches → `main` (or push `main`) to deploy phases 3–8.
- Vercel env: `AUTH_SECRET` (P3); when ready `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`TELEGRAM_BOT_TOKEN`/`TELEGRAM_ADMIN_CHAT_ID` (P4); `NEXT_PUBLIC_SITE_URL` (P6); optional `UPSTASH_REDIS_REST_URL`/`_TOKEN` (P7).
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
