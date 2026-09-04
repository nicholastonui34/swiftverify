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
    slug: "remote-job-resume-optimisation",
    name: "Remote Job & Resume Optimisation",
    description: "Profiles and resumes for remote work and AI training platforms.",
    priceKES: 2000,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "foreign-phone-verification",
    name: "Foreign Phone Number Verification Consultation",
    description: "Guidance on dedicated international virtual numbers.",
    priceKES: 2000,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "global-payment-gateway-setup",
    name: "Global Payment Gateway Setup Advisory",
    description: "Setup guidance for payment gateways and international accounts.",
    priceKES: 2000,
    isPromoEligible: false,
  },
  {
    slug: "verification-document-formatting",
    name: "Verification Document Formatting",
    description: "Clear structuring of authentic KYC and business documents.",
    priceKES: 2000,
    isPromoEligible: true,
  },
  {
    slug: "industry-documents-business-assets",
    name: "Industry Documents & Business Assets",
    description: "Formatting authentic work contracts, invoices, business URLs, company profiles, quotations and related business assets.",
    priceKES: 2000,
    isPromoEligible: true,
  },
  {
    slug: "proxy-rdp-location-advisory",
    name: "Proxy, RDP & Location Masking Advisory",
    description: "Consultation on privacy-aware software and residential proxy options.",
    priceKES: 2000,
    isPromoEligible: true,
    featured: true,
  },
  {
    slug: "usa-uk-llc-formation",
    name: "USA & UK LLC Business Formation",
    description: "Consulting for entity formation, EIN/CRN and eligible business banking.",
    priceKES: 2000,
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
    authorName: "John Musyoka",
    country: "Kenya",
    service: "Personal Payoneer",
    rating: 5,
    review: "My Payoneer kept getting rejected for months. SwiftVerify fixed my documents and it was verified in 48 hours. Fast and professional.",
    source: "TELEGRAM",
  },
  {
    authorName: "Brian Obunga",
    country: "Tanzania",
    service: "USA Receiving Account",
    rating: 5,
    review: "Finally getting paid by my Upwork clients through a US account. The whole thing was smooth and the guidance was clear.",
    source: "TELEGRAM",
  },
  {
    authorName: "Zack Maina",
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
