/**
 * Landing-page content. Mirrors the Prisma `Service`, `Testimonial` and
 * `Setting` (tips) models so Phase 2 can swap these arrays for DB reads
 * without touching the components.
 */

export type Service = {
  slug: string;
  name: string;
  description: string;
  priceKES: number;
  /** If true, eligible for the first-10 promo price. */
  isPromoEligible: boolean;
  featured?: boolean;
};

/** Current promo funnel state (client-safe type; computed in lib/data.ts). */
export type PromoState = {
  active: boolean;
  used: number;
  limit: number;
  remaining: number;
  promoPriceKES: number;
};

/** Price a service given the current promo state. Pure + client-safe. */
export function priceFor(service: Service, promo: PromoState): number {
  return promo.active && service.isPromoEligible ? promo.promoPriceKES : service.priceKES;
}

export const services: Service[] = [
  {
    slug: "personal-payoneer",
    name: "Personal Payoneer Account Assistance",
    description:
      "End-to-end help opening and verifying a personal Payoneer account — the right documents, formatted to pass KYC the first time.",
    priceKES: 2500,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "business-payoneer",
    name: "Business Payoneer Account Assistance",
    description:
      "Get a business Payoneer account verified with correctly formatted registration, director ID and address documents.",
    priceKES: 3900,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "personal-docs-formatting",
    name: "Personal Verification Docs Formatting",
    description:
      "We reformat your ID and proof-of-address to the exact DPI, size and layout Payoneer's automated review accepts.",
    priceKES: 1250,
    isPromoEligible: false,
  },
  {
    slug: "business-docs-formatting",
    name: "Business Verification Docs Formatting",
    description:
      "Business registration, bank letters and address proofs formatted to letterhead and file-spec requirements.",
    priceKES: 2500,
    isPromoEligible: true,
  },
  {
    slug: "receiving-accounts",
    name: "USA / Canada / UK Receiving Accounts",
    description:
      "Set up global receiving accounts so eBay, Etsy, Upwork and clients can pay you by local bank transfer.",
    priceKES: 1550,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "other-docs-formatting",
    name: "Other Documents Formatting",
    description:
      "Any other KYC or platform document reformatted and prepared to pass verification cleanly.",
    priceKES: 1250,
    isPromoEligible: false,
  },
];

export type Testimonial = {
  authorName: string;
  country: string;
  service: string;
  rating: number;
  review: string;
  photoUrl?: string;
  source: "TELEGRAM" | "DIRECT";
};

export const testimonials: Testimonial[] = [
  {
    authorName: "John D.",
    country: "Kenya",
    service: "Personal Payoneer",
    rating: 5,
    review:
      "My Payoneer kept getting rejected for months. SwiftVerify fixed my documents and it was verified in 48 hours. Fast and professional.",
    source: "TELEGRAM",
  },
  {
    authorName: "Amina H.",
    country: "Tanzania",
    service: "USA Receiving Account",
    rating: 5,
    review:
      "Finally getting paid by my Upwork clients through a US account. The whole thing was smooth and the guidance was clear.",
    source: "TELEGRAM",
  },
  {
    authorName: "Samuel O.",
    country: "Kenya",
    service: "Business Payoneer",
    rating: 5,
    review:
      "Set up my eBay business payouts with a verified business Payoneer. Worth every shilling — no more frozen proceeds.",
    source: "DIRECT",
  },
  {
    authorName: "Grace W.",
    country: "Uganda",
    service: "Docs Formatting",
    rating: 5,
    review:
      "They knew exactly why my ID scan was failing. Reformatted it and it passed instantly. Highly recommend.",
    source: "TELEGRAM",
  },
  {
    authorName: "Brian K.",
    country: "Kenya",
    service: "Personal Payoneer",
    rating: 5,
    review:
      "Professional from start to finish. Clear instructions, quick replies on Telegram, and my account got verified.",
    source: "TELEGRAM",
  },
];

/** Rotating tips for the announcement banner (Phase 2: from Setting table). */
export const tips: string[] = [
  "🚀 Launch Offer: First 20 Stripe account setups are just $80 (with 3 months free support) — pay securely online by card.",
  "💡 Pro Tip: Some African banks process Payoneer withdrawals in hours, not days. Join our newsletter for the full 2026 guide.",
  "✅ 470+ sellers verified in 3 years. Now offering Stripe onboarding assistance alongside Payoneer.",
  "📢 Getting your Payoneer flagged in Kenya? It's usually a document-format issue. We fix that.",
];

/** Frequently asked questions — rendered on the landing FAQ section, the /faq
 *  page, and emitted as FAQPage JSON-LD for rich search results. */
export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Is SwiftVerify affiliated with Payoneer?",
    answer:
      "No. We're an independent verification and document-formatting service. We help you prepare and submit the right documents so your own Payoneer account passes KYC — we never ask for your Payoneer password.",
  },
  {
    question: "How long does verification take?",
    answer:
      "Most document formatting is delivered within a few hours. Full account verification depends on Payoneer's review, but correctly formatted documents typically pass within 24–72 hours instead of being repeatedly rejected.",
  },
  {
    question: "How do I pay?",
    answer:
      "You can pay securely online by debit or credit card via Stripe Checkout — payment is confirmed automatically. Prefer M-PESA? Use Buy Goods Till number 3561312 and forward your confirmation on WhatsApp instead.",
  },
  {
    question: "What if my account still isn't verified?",
    answer:
      "We work with you until your documents are accepted. If we genuinely can't help with your case, contact us about our refund policy — we don't want your money for a service we couldn't deliver.",
  },
  {
    question: "Which countries do you support?",
    answer:
      "We focus on East Africa — Kenya, Tanzania, Uganda and neighbouring countries — but our document-formatting help works for freelancers and sellers anywhere Payoneer operates.",
  },
  {
    question: "Can you set up US, UK or Canada receiving accounts?",
    answer:
      "Yes. Our receiving-accounts service helps you set up global receiving accounts so platforms like Upwork, Etsy, eBay and direct clients can pay you by local bank transfer.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Your documents are used only to prepare your verification and are handled by our team directly. We never post your details publicly and never share them with third parties.",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Select a service & place your order",
    description: "Choose the service you need and submit your details in under two minutes.",
  },
  {
    step: 2,
    title: "Pay securely online",
    description:
      "Pay instantly by debit or credit card via Stripe Checkout, or via M-PESA if you prefer.",
  },
  {
    step: 3,
    title: "We verify & assist",
    description: "Our team prepares your documents and guides your account through verification.",
  },
  {
    step: 4,
    title: "Complete & get paid",
    description: "Your account is verified and ready. Start receiving payments worldwide.",
  },
];
