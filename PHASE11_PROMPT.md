# SwiftVerify — Phase 11 Session Prompt

Copy into a **new Claude Code session** to build Phase 11.

---

Continue building **SwiftVerify**. Phases 1–10 complete:
1 landing · 2 order+M-PESA funnel · 3 admin+Auth.js · 4 email+Telegram · 5 order tracking · 6 SEO+FAQ · 7 abuse hardening · 8 admin polish · 9 testing+CI · 10 content/long-tail SEO (guides).

Project path: `C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`
**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify

**Branch/deploy state:** phases 3–8 merged to `main` (deployed). Open PRs awaiting the user's review/merge: **#2** `phase-9-testing-ci`, **#3** `phase-10-content-seo`. Check `git log origin/main`; base new work off `main` (merge #2/#3 first if you want their code as a base). Merges need explicit user say-so.

**Environment gotchas (IMPORTANT — read):**
- **Bash tool PATH is flaky** (node/npx/head/grep missing → exit 127). **Use the PowerShell tool** for npm/git/tsx/gh; use `Select-String`/`Get-Content` not grep/head.
- **`next start` for verification: run via PowerShell `run_in_background: true`**, poll `/` until ready, drive with `curl.exe` + cookie jar. Note curl.exe `-o $null` doesn't suppress the body in PowerShell (writes a file literally named `$null`); use `-o NUL` or ignore.
- **Commit with `git commit -F <file>`** (PowerShell here-strings mangle multi-line `-m`).
- **Can't push `.github/workflows/*`** — gh token lacks `workflow` scope; `ci.yml` sits untracked on disk and gets swept into commits by `git add -A` → push rejected. **Before committing, `git restore --staged .github/workflows/ci.yml`** (or the user adds it after `gh auth refresh -s workflow`).
- **Prisma v6.19.3** (NOT v7); build with `npx next build`. One-off scripts: `npx tsx --env-file=.env scripts/x.ts`.

**Conventions:** Next.js 16 (App Router, no src), React 19, TS strict no `any`, Tailwind v4 (`navy-*`/`brand-*`), lucide-react. Auth.js v5 (`trustHost:true`, gates `/admin`; `npm run admin:create`). Content model examples: `lib/content.ts` (services/testimonials/faqs), `lib/guides.ts` (typed blocks). SEO: `lib/seo.ts` (siteUrl + JSON-LD builders incl. articleLd/breadcrumbLd), `app/opengraph-image.tsx`, `sitemap.ts`, `robots.ts`. Libs: `lib/data.ts`, `lib/admin.ts`, `lib/settings.ts`, `lib/email.ts` (console fallback), `lib/telegram.ts` (dormant), `lib/security.ts`+`lib/honeypot.ts`.

**Read first:** `lib/config.ts`, `lib/guides.ts`, `lib/admin.ts`, `prisma/schema.prisma`.

## Phase 11 goal — pick with the user. Unbuilt candidates:
1. **Real logo + favicon** — `public/logo.svg`/`logo-mark.svg` still PLACEHOLDERS; obtain the asset from the user first (they think it's in a "SwiftVerify New WEBSITE" project not reachable here).
2. **M-PESA Daraja STK Push (big)** — auto-confirm payments; needs Safaricom Daraja creds; env-gated.
3. **Analytics + consent** — Vercel Analytics + cookie/consent note wired to `Setting`.
4. **Transactional email polish** — branded receipt, admin daily digest, more status-change triggers.
5. **More guides + internal linking** — expand the /guides library, add related-guides links, author/date schema tweaks; maybe an About page.
6. **Deeper tests** — authenticated admin e2e (needs a CI Postgres service container) or unit tests for `lib/security.ts`/`lib/data.ts`.

**Constraints:** TS strict no `any`; keep DB-unset + integration-unset fallbacks; verify with `next start` + curl before committing; commit to `phase-11-*` branch + push (exclude ci.yml); open a PR (don't self-merge without the user). Produce a Phase 12 prompt when done.

## Manual steps still pending
- Review/merge PR #2 (tests+CI) and #3 (guides). Add the CI workflow: `gh auth refresh -h github.com -s workflow` then commit/push `.github/workflows/ci.yml`.
- Vercel env: `AUTH_SECRET` (required — `/admin`+`/login` 500 without it); when ready `GMAIL_*`, `TELEGRAM_*`, `NEXT_PUBLIC_SITE_URL`, `UPSTASH_*`.
- After first admin login: change + remove `ADMIN_PASSWORD` from `.env`.
