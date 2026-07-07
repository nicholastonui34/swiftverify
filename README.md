# SwiftVerify

Revenue-generating SaaS for Payoneer onboarding & payment-gateway services for East African freelancers and sellers. Built in phases.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma (Phase 2) · Auth.js (Phase 2) · Nodemailer (Phase 4) · Vercel + Vercel Postgres.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000 (the preview here runs on :3100)
```

## Build phases

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | Landing page — hero, rotating banner, services grid w/ promo logic, testimonials carousel, how-it-works, breaking-news + newsletter, footer, floating WhatsApp/Telegram | ✅ Done |
| 2 | Prisma + Postgres + Auth.js, order form, M-PESA payment upload | ⬜ Next |
| 3 | Admin dashboard — orders, approvals, promo tracking, testimonials CRUD, analytics, settings | ⬜ |
| 4 | Email (Gmail SMTP) + newsletter persistence + Telegram links | ⬜ |
| 5 | Deploy to Vercel + go-live | ⬜ |

## Project structure (Phase 1)

```
app/
  layout.tsx            Root layout, fonts, metadata
  page.tsx              Landing page composition
  order/page.tsx        Order CTA stub (full flow = Phase 2)
  privacy|terms|refund/ Legal stubs
  api/subscribe/route.ts  Newsletter endpoint (validates; persists in Phase 2)
components/             Navbar, Hero, ServicesGrid, ServiceCard, HowItWorks,
                       TestimonialsCarousel, BreakingNews, Newsletter, Footer,
                       FloatingButtons, AnnouncementBanner, Logo, LegalShell
lib/
  config.ts            Site config: promo count, M-PESA #, social links
  content.ts           Services, testimonials, tips (mirrors Prisma models)
  utils.ts             cn(), formatKES()
prisma/
  schema.prisma        Full data model (Phase 2 contract)
  seed.ts              Seed services + testimonials (Phase 2)
public/
  logo.svg             Placeholder wordmark — swap with the real brand asset
  logo-mark.svg        Placeholder icon / favicon
```

## Branding

Placeholder logo (`public/logo.svg` + `logo-mark.svg`). **To use the real logo:** replace `public/logo.svg` with the brand file (same name, or update `components/Logo.tsx`). Colors are Tailwind v4 tokens in `app/globals.css` (`navy-*` primary, `brand-*` emerald accent).

## Configuration

Edit `lib/config.ts` for the promo counter, M-PESA number, WhatsApp/Telegram links and social-proof stats. In Phase 3 these move to the admin **Settings** page backed by the `Setting` table.

## Environment

Copy `.env.example` → `.env.local` and fill in as each phase needs it (DB in Phase 2, email in Phase 4).
