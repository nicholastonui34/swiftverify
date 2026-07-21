"use server";

import { redirect } from "next/navigation";
import { db, isDbConfigured } from "@/lib/db";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { getStripeServiceBySlug, priceForCheckout } from "@/lib/pricing";
import {
  getStripeOnboardingPromoState,
  checkoutSuccessUrl,
  checkoutCancelUrl,
} from "@/lib/stripe-checkout";
import { rateLimitByIp } from "@/lib/security";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/honeypot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckoutFormState = { error?: string };

/**
 * Creates a Stripe Checkout Session for one of the USD services and redirects
 * the customer to Stripe's hosted payment page. The charged amount is always
 * computed here from `lib/pricing.ts` + the live promo count — client input is
 * never trusted for price.
 */
export async function createStripeCheckout(
  _prev: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  if (isHoneypotTripped(formData.get(HONEYPOT_FIELD))) {
    return { error: "Something went wrong. Please try again." };
  }
  const rl = await rateLimitByIp("stripe-checkout", 10, 3600);
  if (!rl.success) {
    return { error: "Too many attempts. Please wait a moment and try again." };
  }

  const slug = String(formData.get("service") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const service = getStripeServiceBySlug(slug);
  if (!service || !service.checkoutEnabled) {
    return { error: "That service isn't available for online checkout." };
  }
  if (!fullName) return { error: "Please enter your full name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (!phone) return { error: "Please enter your phone number." };
  if (!country) return { error: "Please enter your country." };
  if (!stripeConfigured) {
    return {
      error: "Online card payment isn't configured yet. Please use the M-PESA option below.",
    };
  }
  if (!isDbConfigured) {
    return { error: "Ordering is temporarily unavailable. Please contact us on WhatsApp." };
  }

  const stripePromo = await getStripeOnboardingPromoState();
  const amountUSD = priceForCheckout(service, country, stripePromo.used);

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.name,
              description: service.description.slice(0, 2).join(" "),
            },
            unit_amount: amountUSD * 100,
          },
          quantity: 1,
        },
      ],
      success_url: checkoutSuccessUrl,
      cancel_url: checkoutCancelUrl,
      metadata: { serviceSlug: service.slug, fullName, phone, country },
    });
  } catch (err) {
    console.error("[stripe] failed to create checkout session:", err);
    return { error: "We couldn't start checkout. Please try again or use the M-PESA option." };
  }

  if (!session.url) {
    return { error: "We couldn't start checkout. Please try again." };
  }

  await db.stripeOrder.create({
    data: {
      serviceSlug: service.slug,
      serviceName: service.name,
      amountUSD: amountUSD * 100,
      fullName,
      businessName: businessName || null,
      email,
      phone,
      country,
      website: website || null,
      notes: notes || null,
      stripeSessionId: session.id,
      status: "PENDING",
    },
  });

  redirect(session.url);
}
