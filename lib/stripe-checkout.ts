import "server-only";
import { db, isDbConfigured } from "./db";
import { siteConfig } from "./config";
import { STRIPE_ONBOARDING_PROMO_LIMIT } from "./pricing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

export type StripeOnboardingPromoState = {
  active: boolean;
  used: number;
  limit: number;
  remaining: number;
};

/** Live count of PAID Stripe-onboarding orders, for the "first 20 accounts" promo. */
export async function getStripeOnboardingPromoState(): Promise<StripeOnboardingPromoState> {
  const limit = STRIPE_ONBOARDING_PROMO_LIMIT;
  if (!isDbConfigured) return { active: true, used: 0, limit, remaining: limit };
  try {
    const used = await db.stripeOrder.count({
      where: { serviceSlug: "stripe-onboarding", status: "PAID" },
    });
    return { active: used < limit, used, limit, remaining: Math.max(limit - used, 0) };
  } catch {
    return { active: true, used: 0, limit, remaining: limit };
  }
}

export const checkoutSuccessUrl = `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
export const checkoutCancelUrl = `${BASE_URL}/payment/cancelled`;
