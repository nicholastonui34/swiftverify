# SwiftVerify — Phase 2 Session Prompt

Copy everything below into a **new Claude Code session** to build Phase 2.

---

Continue building the **SwiftVerify** project. Phase 1 (landing page) is complete and committed. The project lives at:

`C:\Users\nicho\OneDrive\Desktop\CLAUDE CODE\swiftverify`

**Stack already set up:** Next.js 16 (App Router, `/app`, no src dir) · React 19 · TypeScript · Tailwind CSS v4 (tokens in `app/globals.css`: `navy-*` primary, `brand-*` emerald accent) · lucide-react · `cn()`/`formatKES()` in `lib/utils.ts`. Dev server runs on port **3100** (`preview_start` name `swiftverify`).

**Read these first** to match conventions:
- `lib/content.ts` — services, testimonials, tips (currently static; Phase 2 moves reads to Prisma)
- `lib/config.ts` — promo counter, M-PESA number, social links
- `prisma/schema.prisma` — the full data model is already written (User, Service, Order, PromoTracker, Testimonial, Subscriber, Setting)
- `prisma/seed.ts` — seeds services + testimonials
- `components/` — existing UI components and styling patterns

## Phase 2 goal: Order System + database foundation

1. **Database + Prisma**
   - `npm i @prisma/client bcryptjs && npm i -D prisma tsx @types/bcryptjs`
   - Add `"prisma": { "seed": "tsx prisma/seed.ts" }` to package.json
   - Provision Postgres (Vercel Postgres or local Docker), set `DATABASE_URL` in `.env.local`
   - `npx prisma migrate dev --name init` then `npx prisma db seed`
   - Create `lib/db.ts` (singleton PrismaClient)
   - Switch `ServicesGrid`/`ServiceCard` and `TestimonialsCarousel` to read from the DB; compute live promo count from `PromoTracker`

2. **Auth.js (Auth.js v5 / next-auth)** — email + password, no email verification. Roles CLIENT/ADMIN (ADMIN set manually). Session middleware ready for Phase 3's `/admin` guard.

3. **Order form** (`/order`, replace the current stub)
   - Service pre-selected via `?service=<slug>`
   - Guest checkout or signup: email, name, phone, country + terms checkbox
   - Creates an `Order` with status `PENDING_PAYMENT`; applies promo price if `promoActive && isPromoEligible`
   - Creates a `PromoTracker` row when the promo price is used

4. **Payment page** (`/order/[orderId]/payment`)
   - Order summary + single **M-PESA** method (number/name from config/Setting)
   - "Copy Merchant Number" button
   - Upload M-PESA receipt (image only, validate type/size) → Vercel Blob or `/public/uploads`
   - On submit: set `mpesaProofUrl` + `mpesaPhone`, status → `PAYMENT_SUBMITTED`
   - Stub the client + admin notification emails (real Nodemailer wiring is Phase 4) — leave clear TODOs

5. **Wire the newsletter** `app/api/subscribe/route.ts` to persist to `Subscriber` (currently a validating stub).

**Acceptance:** place an order end-to-end locally → upload receipt → order shows `PAYMENT_SUBMITTED` in Prisma Studio. TypeScript strict, no `any`, server + client validation, all secrets in `.env`.

When Phase 2 is done, give me a **Phase 3 (Admin Dashboard)** session prompt, following the plan in `SwiftVerify_Production_Prompt.md` (in Downloads).

> Note: the SwiftVerify logo is currently a placeholder (`public/logo.svg`). If I've provided the real logo, swap it in; otherwise keep the placeholder.
