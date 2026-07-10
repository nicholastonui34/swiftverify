# SwiftVerify — Phase 4 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 4.

---

Continue building the **SwiftVerify** project. Phases 1 (landing), 2 (order + M-PESA funnel) and 3 (admin dashboard + Auth.js) are complete, deployed and DB-backed. Project path:

`C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`

**Live:** https://swiftverify-alpha.vercel.app · **Repo:** https://github.com/nicholastonui34/swiftverify (push to `main` auto-deploys to Vercel; feature branches get previews).

**Stack / conventions already in place:**
- Next.js 16 (App Router, `/app`, no src dir), React 19, TypeScript strict, Tailwind v4 (tokens in `app/globals.css`: `navy-*` primary, `brand-*` emerald), lucide-react. `cn()`/`formatKES()` in `lib/utils.ts`.
- **Dev uses webpack** (`npm run dev` → `next dev --webpack`); Turbopack hangs on this OneDrive filesystem. `next build` uses Turbopack and works. Preview port **3100**.
- **Prisma v6.19.3** (NOT v7). Stop the dev server before `prisma generate` (locks the engine DLL). Run one-off scripts with `tsx --env-file=.env` (tsx does NOT auto-load `.env`).
- **Neon Postgres** connected via `.env` (`DATABASE_URL` + `DIRECT_URL`) and Vercel env.
- **Auth.js v5** (`auth.ts` full config w/ Credentials+bcrypt; `auth.config.ts` edge-safe with `trustHost:true`, JWT callbacks, `authorized` gate; `middleware.ts` protects `/admin`). Types in `types/next-auth.d.ts`. `AUTH_SECRET` in `.env` + Vercel. Bootstrap admin: `npm run admin:create` (reads `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME` from `.env`).
- **Admin dashboard** at `/admin` (metrics, orders + detail w/ proof image + approve/reject/complete actions, promo reset, testimonials CRUD, analytics + CSV, settings). Data-access in `lib/admin.ts`; server actions in `app/admin/actions.ts`; runtime settings in `lib/settings.ts` (Setting table → falls back to `lib/config.ts`).
- **Email is still a STUB**: `lib/email.ts` `sendEmail()` just `console.log`s. All call sites already pass real content: `sendOrderConfirmation`, `sendPaymentReceived`, `sendPaymentSubmittedToAdmin`, `sendOrderApproved`, `sendOrderRejected`, `sendOrderCompleted`.

**Read first:** `lib/email.ts`, `lib/settings.ts`, `app/admin/actions.ts`, `app/order/actions.ts`, `lib/config.ts`.

## Phase 4 goal: Real Email + Telegram notifications

1. **Nodemailer + Gmail SMTP** — implement the body of `sendEmail()` in `lib/email.ts` using `nodemailer` (`npm i nodemailer`, `npm i -D @types/nodemailer`). Read `GMAIL_USER` / `GMAIL_APP_PASSWORD` from env (already in `.env.example`). Keep the console fallback when creds are absent so local/dev still works and never throws. Send as HTML (wrap the existing plaintext bodies in a simple branded template — navy header, brand-emerald button) with a plaintext alternative. From/reply-to = the admin email from `lib/settings.ts`.
2. **Wire the "from" / admin recipient to Settings** — `sendPaymentSubmittedToAdmin` and status emails should send to the admin email in the `Setting` table (fall back to `siteConfig.supportEmail`).
3. **Telegram bot notifications (admin)** — on new order + new payment proof, POST to the Telegram Bot API (`https://api.telegram.org/bot<token>/sendMessage`) so the admin gets an instant ping. Read `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ADMIN_CHAT_ID` from env; no-op gracefully when unset. Put it in a new `lib/telegram.ts` and call it alongside the email stubs in `app/order/actions.ts` (and optionally on approve/complete).
4. **Admin Settings additions** — add editable fields for the Telegram admin chat id and a toggle for "email notifications on/off" / "telegram on/off" to `lib/settings.ts` + `SettingsForm`.
5. **Resend option (optional)** — if Gmail SMTP is flaky on Vercel serverless, note Resend (`resend` npm) as the alternative and structure `sendEmail` so swapping transports is a one-function change.

**Acceptance:** placing a real test order logs/sends a confirmation email and (if configured) a Telegram message; approving an order emails the client via Nodemailer; missing creds degrade to console logs without breaking the flow. TypeScript strict, no `any`. Build passes (`npx next build`), verify with `next start` on a spare port. Commit to a feature branch + push (the human merges to `main`); add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` to Vercel env yourself is human-gated — list them for the user. When done, give me a **Phase 5** session prompt (whatever remains: client account portal, order status tracking page, or polish).

## Manual steps still pending from Phase 3 (do these first if not done)
- Merge `phase-3-admin` → `main` (or push `main`) to deploy the admin dashboard to production.
- Add `AUTH_SECRET` to Vercel (Production + Preview). Value is in local `.env`.
- After first successful admin login, remove `ADMIN_PASSWORD` from `.env` (and change it from the bootstrap default).
