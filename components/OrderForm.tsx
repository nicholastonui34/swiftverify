"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowRight, CreditCard } from "lucide-react";
import { priceFor, type Service, type PromoState } from "@/lib/content";
import {
  stripeServices,
  withLiveStripeOnboardingPromo,
  type StripeService,
} from "@/lib/pricing";
import type { StripeOnboardingPromoState } from "@/lib/stripe-checkout";
import { formatKES } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { createOrder, type OrderFormState } from "@/app/order/actions";
import { Honeypot } from "@/components/Honeypot";

const initial: OrderFormState = {};

export function OrderForm({
  services,
  promo,
  stripePromo,
  defaultSlug,
}: {
  services: Service[];
  promo: PromoState;
  stripePromo: StripeOnboardingPromoState;
  defaultSlug?: string;
}) {
  const liveStripeServices = useMemo(
    () => stripeServices.map((s) => withLiveStripeOnboardingPromo(s, stripePromo)),
    [stripePromo]
  );

  const allSlugs = [...liveStripeServices.map((s) => s.slug), ...services.map((s) => s.slug)];
  const [selected, setSelected] = useState(
    defaultSlug && allSlugs.includes(defaultSlug) ? defaultSlug : allSlugs[0] ?? ""
  );
  const [state, formAction, pending] = useActionState(createOrder, initial);

  const stripeService = liveStripeServices.find((s) => s.slug === selected);
  const legacyService = services.find((s) => s.slug === selected);

  const legacyPrice = legacyService ? priceFor(legacyService, promo) : 0;
  const legacyStruck =
    legacyService &&
    promo.active &&
    legacyService.isPromoEligible &&
    legacyService.priceKES > legacyPrice;

  return (
    <div className="space-y-6">
      {/* Service selection */}
      <div>
        <label className="block text-sm font-semibold text-navy-800">Service</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        >
          <optgroup label="Pay by card (USD) — instant, via Stripe">
            {liveStripeServices.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} — {s.priceUSD === null ? "Request Quote" : `$${s.priceUSD}`}
              </option>
            ))}
          </optgroup>
          <optgroup label="Payoneer verification (KES) — M-PESA / USDT / Binance">
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} — {formatKES(priceFor(s, promo))}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {stripeService ? (
        <StripeServiceCta service={stripeService} />
      ) : (
        <form action={formAction} className="space-y-6">
          <Honeypot />
          <input type="hidden" name="service" value={selected} />

          {legacyService && (
            <div className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3">
              <span className="text-sm font-medium text-navy-600">You pay</span>
              <span className="flex items-end gap-2">
                <span className="font-display text-xl font-bold text-navy-900">
                  {formatKES(legacyPrice)}
                </span>
                {legacyStruck && (
                  <span className="mb-0.5 text-sm text-navy-400 line-through">
                    {formatKES(legacyService.priceKES)}
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" placeholder="Jane Wanjiru" required />
            <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
            <Field label="Phone (WhatsApp)" name="phone" placeholder="07XX XXX XXX" />
            <Field label="Country" name="country" placeholder="Kenya" />
          </div>

          <div>
            <p className="text-sm font-semibold text-navy-800">Create your account</p>
            <p className="mt-0.5 text-xs text-navy-500">
              Set a password so you can log in and track your orders later — no
              verification code needed.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
              />
              <Field
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-navy-600">
            <input
              type="checkbox"
              name="terms"
              className="mt-0.5 h-4 w-4 rounded border-navy-300 text-brand-500 focus:ring-brand-500"
            />
            <span>
              I have read the terms and understand this is onboarding &amp; document
              guidance.
            </span>
          </label>

          {state.error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
          >
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Continue to payment <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

function StripeServiceCta({ service }: { service: StripeService }) {
  const hasDiscount =
    typeof service.regularPriceUSD === "number" &&
    typeof service.priceUSD === "number" &&
    service.regularPriceUSD > service.priceUSD;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3">
        <span className="text-sm font-medium text-navy-600">You pay</span>
        {service.priceUSD === null ? (
          <span className="font-display text-xl font-bold text-navy-900">Request Quote</span>
        ) : (
          <span className="flex items-end gap-2">
            <span className="font-display text-xl font-bold text-navy-900">
              ${service.priceUSD}
            </span>
            {hasDiscount && (
              <span className="mb-0.5 text-sm text-navy-400 line-through">
                ${service.regularPriceUSD}
              </span>
            )}
            {service.internationalPriceUSD && (
              <span className="mb-0.5 text-xs text-navy-500">
                (${service.internationalPriceUSD} international)
              </span>
            )}
          </span>
        )}
      </div>

      {service.checkoutEnabled ? (
        <Link
          href={`/checkout/${service.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <CreditCard className="h-4 w-4" /> Continue to secure card checkout
        </Link>
      ) : (
        <a
          href={`${siteConfig.whatsapp}?text=${encodeURIComponent(
            `Hi SwiftVerify! I'd like a quote for: ${service.name}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-7 py-3.5 text-base font-semibold text-navy-800 transition-colors hover:bg-navy-50"
        >
          Request a Quote <ArrowRight className="h-4 w-4" />
        </a>
      )}
      <p className="text-center text-xs text-navy-500">
        You&apos;ll fill in your details on the next page before paying.
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
