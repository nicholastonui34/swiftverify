"use client";

import { useActionState, useState } from "react";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { priceFor, type Service, type PromoState } from "@/lib/content";
import { formatKES } from "@/lib/utils";
import { createOrder, type OrderFormState } from "@/app/order/actions";
import { Honeypot } from "@/components/Honeypot";

const initial: OrderFormState = {};

export function OrderForm({
  services,
  promo,
  defaultSlug,
}: {
  services: Service[];
  promo: PromoState;
  defaultSlug?: string;
}) {
  const [selected, setSelected] = useState(
    defaultSlug && services.some((s) => s.slug === defaultSlug)
      ? defaultSlug
      : services[0]?.slug ?? ""
  );
  const [state, formAction, pending] = useActionState(createOrder, initial);

  const service = services.find((s) => s.slug === selected);
  const price = service ? priceFor(service, promo) : 0;
  const struck = service && promo.active && service.isPromoEligible && service.priceKES > price;

  return (
    <form action={formAction} className="space-y-6">
      <Honeypot />
      {/* Service selection */}
      <div>
        <label className="block text-sm font-semibold text-navy-800">Service</label>
        <select
          name="service"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        >
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price summary */}
      {service && (
        <div className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3">
          <span className="text-sm font-medium text-navy-600">You pay</span>
          <span className="flex items-end gap-2">
            <span className="font-display text-xl font-bold text-navy-900">
              {formatKES(price)}
            </span>
            {struck && (
              <span className="mb-0.5 text-sm text-navy-400 line-through">
                {formatKES(service.priceKES)}
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
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Continue to payment <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
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
