/**
 * Public landing-page copy. Legacy service types are kept compatible with the
 * existing admin/data layer, while all visitor-facing messaging is quote-first.
 */

export type Service = {
  slug: string;
  name: string;
  description: string;
  priceKES: number;
  isPromoEligible: boolean;
  featured?: boolean;
};

export type PromoState = {
  active: boolean;
  used: number;
  limit: number;
  remaining: number;
  promoPriceKES: number;
};

export function priceFor(service: Service, promo: PromoState): number {
  return promo.active && service.isPromoEligible ? promo.promoPriceKES : service.priceKES;
}

export const services: Service[] = [
  {
    slug: "personal-payoneer",
    name: "Personal Payoneer Account Assistance",
    description: "End-to-end guidance for opening and verifying a personal Payoneer account.",
    priceKES: 2500,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "business-payoneer",
    name: "Business Payoneer Account Assistance",
    description: "Business registration, director ID and address-document preparation.",
    priceKES: 3900,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "personal-docs-formatting",
    name: "Personal Verification Docs Formatting",
    description: "Reformatting support for ID and proof-of-address submissions.",
    priceKES: 1250,
    isPromoEligible: false,
  },
  {
    slug: "business-docs-formatting",
    name: "Business Verification Docs Formatting",
    description: "Business registration, bank letters and address proofs prepared for review.",
    priceKES: 2500,
    isPromoEligible: true,
  },
  {
    slug: "receiving-accounts",
    name: "USA / Canada / UK Receiving Accounts",
    description: "Global receiving-account setup for platforms and direct clients.",
    priceKES: 1550,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "other-docs-formatting",
    name: "Other Documents Formatting",
    description: "Additional KYC or platform documents prepared for clean submission.",
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
    review: "My Payoneer kept getting rejected for months. SwiftVerify fixed my documents and it was verified in 48 hours. Fast and professional.",
    source: "TELEGRAM",
  },
  {
    authorName: "Amina H.",
    country: "Tanzania",
    service: "USA Receiving Account",
    rating: 5,
    review: "Finally getting paid by my Upwork clients through a US account. The whole thing was smooth and the guidance was clear.",
    source: "TELEGRAM",
  },
  {
    authorName: "Samuel O.",
    country: "Kenya",
    service: "Business Payoneer",
    rating: 5,
    review: "Set up my eBay business payouts with a verified business Payoneer. Worth every shilling — no more frozen proceeds.",
    source: "DIRECT",
  },
  {
    authorName: "Grace W.",
    country: "Uganda",
    service: "Docs Formatting",
    rating: 5,
    review: "They knew exactly why my ID scan was failing. Reformatted it and it passed instantly. Highly recommend.",
    source: "TELEGRAM",
  },
  {
    authorName: "Brian K.",
    country: "Kenya",
    service: "Personal Payoneer",
    rating: 5,
    review: "Professional from start to finish. Clear instructions, quick replies on Telegram, and my account got verified.",
    source: "TELEGRAM",
  },
];

export const tips: string[] = [
  "470+ clients supported in 3 years across seven major payment gateways.",
  "A clean document is faster to review: use current, uncropped, glare-free files.",
  "Need help after a flag or re-verification request? Bring the message to WhatsApp.",
  "Your name and address should match exactly across every account and document.",
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Is SwiftVerify affiliated with any of the gateways you support?",
    answer: "No. SwiftVerify is an independent onboarding, verification and document-preparation consultancy. We help you prepare accurate information for your own account and never ask for your account password.",
  },
  {
    question: "What does account setup assistance include?",
    answer: "We help you choose the right account path, prepare the required profile information, review your documents, and understand the compliance details that can trigger avoidable delays across the supported gateways.",
  },
  {
    question: "How long does verification take?",
    answer: "Document preparation is often completed within a few hours. Final approval depends on your chosen provider's own review process and may take longer if additional information is requested.",
  },
  {
    question: "How much does it cost?",
    answer: "Every engagement is scoped individually based on the gateway, account type and complexity, so we do not publish fixed prices. Message us on WhatsApp for a free custom quote.",
  },
  {
    question: "How do I pay?",
    answer: "We do not publish fixed prices or take new visitors through self-serve checkout. Message us on WhatsApp with what you need and we will send a custom quote and payment terms before any work begins.",
  },
  {
    question: "Which payment gateways do you support?",
    answer: "We support Payoneer, Stripe, PayPal, Wise, Grey, Square and Mercury. Eligibility still depends on each provider's country, business and compliance requirements.",
  },
  {
    question: "Which countries do you support?",
    answer: "We work with clients internationally, with strong experience supporting freelancers and online businesses across East Africa and other markets. Gateway availability and eligibility vary by country, residency and business structure.",
  },
  {
    question: "Can you set up US, UK or Canada receiving accounts?",
    answer: "Yes. We can guide eligible clients through global receiving-account options so platforms such as Upwork, Etsy, eBay and direct clients can pay by local transfer.",
  },
  {
    question: "What if my account still isn't verified?",
    answer: "We review the provider's response with you and explain the next compliant step. We never promise approval where the provider's eligibility requirements are not met.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Your documents are used only to prepare your verification and are handled by our team directly. We do not publish your details or share them with third parties outside the delivery of your engagement.",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Tell us what you need",
    description: "Message us the gateway, account type and outcome you are working toward.",
  },
  {
    step: 2,
    title: "Get your custom quote",
    description: "We scope your case and send a clear quote on WhatsApp before any work begins.",
  },
  {
    step: 3,
    title: "Prepare with confidence",
    description: "We review your documents and help you follow the right compliance path.",
  },
  {
    step: 4,
    title: "Submit and move forward",
    description: "You submit accurate information, with practical support if the provider asks questions.",
  },
];
