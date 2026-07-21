import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client. STRIPE_SECRET_KEY must be a live secret key
 * (sk_live_...) in production — never hardcode it, env var only. When unset
 * (local dev without keys configured) callers should fail gracefully rather
 * than crash the whole app; `stripeConfigured` lets them check first.
 */
export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_missing_key", {
  apiVersion: "2026-06-24.dahlia",
});
