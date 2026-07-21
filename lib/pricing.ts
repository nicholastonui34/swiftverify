/**
 * USD service lineup + launch-offer promo content for the new Stripe Checkout
 * flow. Deliberately separate from `lib/content.ts` (the KES Payoneer service
 * catalog behind the legacy M-PESA/USDT/Binance order flow, which this file
 * does not touch) — see `lib/stripe-checkout.ts` / `app/checkout` for how
 * these are priced and paid for.
 */

export type StripeService = {
  slug: string;
  name: string;
  /** Current display price in whole USD. Null when only a quote makes sense. */
  priceUSD: number | null;
  /** Struck-through original price, shown when a discount is active. */
  regularPriceUSD?: number;
  /** Shown for services with a separate international rate (e.g. Stripe onboarding). */
  internationalPriceUSD?: number;
  badge?: string;
  supportNote?: string;
  checkoutEnabled: boolean;
  description: string[];
};

export const stripeServices: StripeService[] = [
  {
    slug: "payoneer-onboarding",
    name: "Payoneer Onboarding Assistance",
    priceUSD: 20,
    regularPriceUSD: 30,
    badge: "Limited-Time Offer",
    checkoutEnabled: true,
    description: [
      "Professional Payoneer onboarding assistance.",
      "Application guidance from start to finish.",
      "Support until successful submission.",
      "Ideal for freelancers, startups, agencies and online businesses.",
    ],
  },
  {
    slug: "stripe-onboarding",
    name: "Stripe Onboarding Assistance",
    priceUSD: 80,
    regularPriceUSD: 150,
    internationalPriceUSD: 250,
    badge: "First 20 Accounts Only",
    supportNote: "Includes 3 Months FREE Support",
    checkoutEnabled: true,
    description: [
      "Professional Stripe account onboarding.",
      "Business configuration assistance.",
      "Compliance best-practice guidance.",
      "Accept 36+ payment methods.",
      "Accept payments in over 140 currencies.",
      "Accept Visa, Mastercard, American Express and other major cards.",
      "Accept ACH payments.",
      "Accept Bank Transfers.",
      "Accept Pay by Bank.",
      "Receive payments globally.",
      "Supports businesses in the USA, United Kingdom, Belgium, European Union, Mexico, Finland and many other Stripe-supported countries.",
      "Ideal for SaaS platforms, ecommerce stores, agencies, creators and online businesses.",
    ],
  },
  {
    slug: "compliant-payoneer-application-support",
    name: "Compliant Payoneer Application Support",
    priceUSD: 30,
    checkoutEnabled: true,
    description: [
      "Professional compliance review.",
      "Application optimization.",
      "Submission guidance.",
    ],
  },
  {
    slug: "documents-formatting-assistance",
    name: "Documents Formatting Assistance",
    priceUSD: 10,
    checkoutEnabled: true,
    description: [
      "Professional formatting of required business documents.",
      "Ensure documents meet submission requirements.",
    ],
  },
  {
    slug: "custom-payment-gateway-websites",
    name: "Websites with Custom Payment Gateway APIs",
    priceUSD: null,
    checkoutEnabled: false,
    description: [
      "Enterprise-grade websites.",
      "Custom Stripe integration.",
      "Payoneer integration.",
      "Custom payment gateway APIs.",
      "Subscription billing.",
      "Marketplace payments.",
      "Secure checkout systems.",
      "Scalable enterprise architecture.",
    ],
  },
];

export function getStripeServiceBySlug(slug: string): StripeService | undefined {
  return stripeServices.find((s) => s.slug === slug);
}

/** Countries treated as "domestic" for Stripe-onboarding promo pricing; every
 *  other country pays the flat international rate. Matches SwiftVerify's core
 *  East African market. */
const DOMESTIC_COUNTRIES = new Set([
  "kenya",
  "tanzania",
  "uganda",
  "rwanda",
  "burundi",
  "south sudan",
  "ethiopia",
  "somalia",
]);

export const STRIPE_ONBOARDING_PROMO_LIMIT = 20;

/**
 * Server-side source of truth for what a customer actually pays for the Stripe
 * Onboarding service — never trust a client-submitted price. `promoUsed` is the
 * live count of PAID Stripe-onboarding orders (see lib/stripe-checkout.ts).
 */
export function resolveStripeOnboardingPriceUSD(
  country: string,
  promoUsed: number
): { amountUSD: number; label: string } {
  const isDomestic = DOMESTIC_COUNTRIES.has(country.trim().toLowerCase());
  if (!isDomestic) {
    return { amountUSD: 250, label: "International rate" };
  }
  if (promoUsed < STRIPE_ONBOARDING_PROMO_LIMIT) {
    return { amountUSD: 80, label: "Launch offer" };
  }
  return { amountUSD: 150, label: "Standard rate" };
}

/** Resolve the price (in whole USD) a given service actually charges,
 *  applying the Stripe-onboarding country/promo rule where relevant. */
export function priceForCheckout(
  service: StripeService,
  country: string,
  stripeOnboardingPromoUsed: number
): number {
  if (service.slug === "stripe-onboarding") {
    return resolveStripeOnboardingPriceUSD(country, stripeOnboardingPromoUsed).amountUSD;
  }
  return service.priceUSD ?? 0;
}

export const launchOffer = {
  title: "🚀 Limited-Time Launch Offer",
  subtitle: "Stripe Account Setup with 3 Months FREE Support",
  content: [
    "First 20 Stripe account setups are only $80.",
    "After the first 20 accounts, pricing automatically returns to $150.",
    "International clients: $250.",
    "Every Stripe setup includes 3 Months FREE Support.",
  ],
  cta: "Get Started",
};
