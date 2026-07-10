# SwiftVerify — Phase 6 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 6.

---

Continue building the **SwiftVerify** project. Phases 1–5 are complete and DB-backed:
1 landing · 2 order + M-PESA funnel · 3 admin dashboard + Auth.js · 4 email (Nodemailer) + Telegram stubs · 5 client order tracking.

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch state:** work has been shipping on stacked feature branches (`phase-3-admin` → `phase-4-notifications` → `phase-5-tracking`); `phase-5-tracking` contains phases 3+4+5. **These may not be merged to `main`/deployed yet** — check `git log origin/main` and merge before building, or branch off `phase-5-tracking`. Direct pushes to `main` and Vercel secret writes are auto-mode-gated (do them yourself / hand to the user).

**Stack / conventions:**
- Next.js 16 (App Router, `/app`, no src), React 19, TS strict (no `any`), Tailwind v4 (`navy-*`/`brand-*` tokens in `app/globals.css`), lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **Dev = webpack** (`npm run dev`); Turbopack hangs on OneDrive. `next build` uses Turbopack, works. Verify with `npx next start -p 3200` (fast, no compile) + curl; a dev server from another session may hold port 3100.
- **Prisma v6.19.3** (NOT v7). Stop dev server before `prisma generate` (locks engine DLL) — or `npx next build` directly since the client is already generated. One-off scripts: `tsx --env-file=.env scripts/x.ts` (tsx does NOT auto-load .env).
- **Neon Postgres** via `.env` + Vercel. **Auth.js v5** (`auth.ts`/`auth.config.ts` `trustHost:true`, `middleware.ts` `export default auth`, gates `/admin`). Admin: `npm run admin:create`.
- Data-access: `lib/data.ts` (public, incl. `getOrderStatus`/`findOrderIdByIdAndEmail`), `lib/admin.ts` (admin), `lib/settings.ts` (Setting table → config fallback), `lib/db.ts`.
- Notifications: `lib/email.ts` (Nodemailer/Gmail SMTP, branded HTML template, console fallback, `emailNotifications` toggle) + `lib/telegram.ts` (`notifyTelegram`, no-ops when unconfigured). Both driven by admin Settings. **Bot token/chat id not set yet — user will configure later.**
- Tracking: `/track` (lookup), `/order/[orderId]/status` (timeline). Admin actions in `app/admin/actions.ts` (all `requireAdmin()`).

**Read first:** `lib/data.ts`, `lib/admin.ts`, `lib/settings.ts`, `app/admin/actions.ts`, `prisma/schema.prisma`.

## Phase 6 goal — pick with the user; suggested scope: SEO/polish + trust hardening

Good candidates (confirm priority with the user):
1. **SEO & metadata** — per-page `metadata`, Open Graph/Twitter cards + OG image, `app/sitemap.ts`, `app/robots.ts`, JSON-LD (Organization + Service + FAQ), canonical URLs. Landing currently has minimal metadata.
2. **Real logo** — still a PLACEHOLDER (`public/logo.svg`); swap when the user provides the asset.
3. **FAQ section/page** — the footer links `#tips`; build a proper FAQ (accordion) + `/faq` with FAQ JSON-LD.
4. **Analytics/consent** — lightweight privacy-friendly analytics (e.g. Vercel Analytics) + cookie/consent note; wire into `Setting`/env.
5. **Admin polish** — order search box (by id/email/phone), date-range filter on analytics, per-service revenue breakdown, bulk actions.
6. **Rate-limiting / abuse** — the order + newsletter + track endpoints are unauthenticated; add basic rate limiting (e.g. Upstash) and honeypot on forms.
7. **Accessibility & perf pass** — focus states, alt text, Lighthouse.

**Constraints:** TS strict no `any`; keep the DB-unset static fallback working; verify with `next start` + curl before committing; commit to a `phase-6-*` feature branch and push (human merges to `main`). When done, produce a **Phase 7** prompt.

## Manual steps still pending
- Merge stacked branches → `main` (or push `main`) to deploy phases 3–5 to production.
- Add to Vercel env: `AUTH_SECRET` (Phase 3), and when ready `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`TELEGRAM_BOT_TOKEN`/`TELEGRAM_ADMIN_CHAT_ID` (Phase 4).
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
