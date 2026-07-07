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
  "💡 Pro Tip: Some African banks process Payoneer withdrawals in hours, not days. Join our newsletter for the full 2026 guide.",
  "🚀 New: US, UK & Canada receiving accounts now available — get paid by local bank transfer.",
  "✅ 470+ sellers verified in 3 years. First 10 signups this month get the KES 1,250 promo rate.",
  "📢 Getting your Payoneer flagged in Kenya? It's usually a document-format issue. We fix that.",
];

export const howItWorks = [
  {
    step: 1,
    title: "Select a service & place your order",
    description: "Choose the service you need and submit your details in under two minutes.",
  },
  {
    step: 2,
    title: "Upload your M-PESA payment proof",
    description: "Pay via M-PESA and upload the receipt. We verify it manually — no risky APIs.",
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
