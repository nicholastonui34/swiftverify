# SwiftVerify — Phase 10 Session Prompt

Copy into a **new Claude Code session** to build Phase 10.

---

Continue building **SwiftVerify**. Phases 1–9 complete:
1 landing · 2 order + M-PESA funnel · 3 admin dashboard + Auth.js · 4 email (Nodemailer) + Telegram · 5 client order tracking · 6 SEO + FAQ · 7 abuse hardening · 8 admin polish · 9 testing + CI.

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch/deploy state:** phases 3–8 merged to `main` (PR #1, deployed). Phase 9 = PR #2 open (`phase-9-testing-ci`), unmerged. Check `git log origin/main`; base new work off `main` (merge PR #2 first if you want CI/tests in). Direct `main` push + Vercel secret writes are auto-mode-gated; **merges need explicit user say-so** (PR-merge via `gh pr merge`).

**Environment gotchas (IMPORTANT):**
- **Bash tool PATH is flaky** (node/npx/head missing → exit 127). **Use the PowerShell tool** for npm/git/tsx/gh.
- **`next start` must run via a background runner** (PowerShell `run_in_background: true`); poll `/` until ready; drive with `curl.exe` + cookie jar.
- **Commit with `git commit -F <file>`** (PowerShell here-strings mangle multi-line `-m`).
- **Can't push `.github/workflows/*`** — gh CLI token lacks `workflow` scope. `ci.yml` is on disk untracked; user must `gh auth refresh -s workflow` then push it, or add via UI. Don't re-attempt pushing workflow files.
- **Prisma v6.19.3** (NOT v7); build directly with `npx next build` (client pre-generated). One-off scripts: `npx tsx --env-file=.env scripts/x.ts`.

**Conventions:** Next.js 16 (App Router, no src), React 19, TS strict no `any`, Tailwind v4 (`navy-*`/`brand-*`), lucide-react. Auth.js v5 (`trustHost:true`, gates `/admin`; `npm run admin:create`). Libs: `lib/data.ts`, `lib/admin.ts`, `lib/settings.ts`, `lib/email.ts` (console fallback), `lib/telegram.ts` (dormant), `lib/seo.ts`, `lib/security.ts` + `lib/honeypot.ts`. Tests in `e2e/` (`npm run test:e2e`, Playwright on port 3111, DB-less).

**Read first:** `lib/config.ts`, `lib/admin.ts`, `prisma/schema.prisma`, `e2e/smoke.spec.ts`.

## Phase 10 goal — pick with the user. Unbuilt candidates:
1. **Real logo + favicon** — `public/logo.svg`/`logo-mark.svg` still PLACEHOLDERS; swap when the user provides the asset (they believe it's in a "SwiftVerify New WEBSITE" project not reachable from this machine — confirm/obtain first).
2. **M-PESA Daraja STK Push (big)** — auto-confirm payments (STK push + C2B/validation callback) alongside the manual receipt flow. Needs Safaricom Daraja creds; env-gated like other integrations.
3. **Analytics + consent** — Vercel Analytics (or privacy-friendly alt) + cookie/consent note wired to `Setting`.
4. **Content / long-tail SEO** — About/Why-us, trust badges, `/guides/[slug]` articles.
5. **Transactional email polish** — branded receipt, admin daily digest, more status-change triggers.
6. **Extend tests** — authenticated admin e2e (needs a seeded test DB in CI, e.g. a service-container Postgres), or unit tests for `lib/security.ts`/`lib/data.ts` lookup logic.

**Constraints:** TS strict no `any`; keep DB-unset + integration-unset fallbacks; verify with `next start` + curl (view visual output) before committing; commit to `phase-10-*` branch + push; open a PR (don't self-merge without the user). Produce a Phase 11 prompt when done.

## Manual steps still pending
- **Add the CI workflow:** `gh auth refresh -h github.com -s workflow`, then commit/push `.github/workflows/ci.yml` (on disk, untracked). Merge PR #2.
- Vercel env: `AUTH_SECRET` (required — `/admin`+`/login` 500 without it); when ready `GMAIL_*`, `TELEGRAM_*`, `NEXT_PUBLIC_SITE_URL`, `UPSTASH_*`.
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
