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
    slug: "gateway-account-setup",
    name: "Payment Gateway Account Setup & Verification",
    priceUSD: null,
    checkoutEnabled: false,
    description: [
      "Personal or business account opening guidance.",
      "KYC and compliance review before submission.",
      "Payoneer, Stripe, PayPal, Wise, Grey, Square or Mercury.",
      "Practical support when a provider requests more information.",
    ],
  },
  {
    slug: "documents-formatting-assistance",
    name: "Document Formatting & Compliance Prep",
    priceUSD: null,
    checkoutEnabled: false,
    description: [
      "ID, proof-of-address and business document review.",
      "Formatting for cleaner automated KYC review.",
      "Name, address, file-quality and consistency checks.",
      "A clear checklist for your final submission.",
    ],
  },
  {
    slug: "receiving-accounts",
    name: "Global Receiving Accounts",
    priceUSD: null,
    checkoutEnabled: false,
    description: [
      "Guidance for eligible US, UK and Canada receiving accounts.",
      "Support for Upwork, Etsy, eBay and direct-client payments.",
      "Account-path recommendations based on your profile.",
      "Clear explanation of provider requirements and limitations.",
    ],
  },
  {
    slug: "ongoing-compliance-support",
    name: "Ongoing Compliance Support",
    priceUSD: null,
    checkoutEnabled: false,
    description: [
      "Help responding to flags, holds and re-verification requests.",
      "Document refresh and submission guidance.",
      "Human support after your account goes live.",
      "A compliant next step, not a shortcut around provider rules.",
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

/** Applies the live "first 20 accounts" promo state to the Stripe Onboarding
 *  service so any UI displaying it always matches what checkout will actually
 *  charge. No-op for every other service. */
export function withLiveStripeOnboardingPromo(
  service: StripeService,
  promo: { active: boolean; remaining: number }
): StripeService {
  if (service.slug !== "stripe-onboarding") return service;
  if (promo.active) {
    return { ...service, badge: `First ${promo.remaining} Spots Left` };
  }
  return {
    ...service,
    priceUSD: 150,
    regularPriceUSD: undefined,
    badge: "Standard Rate",
  };
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
