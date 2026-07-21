"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, CreditCard } from "lucide-react";
import type { StripeService } from "@/lib/pricing";
import { createStripeCheckout, type CheckoutFormState } from "@/app/checkout/actions";
import { Honeypot } from "@/components/Honeypot";

const initial: CheckoutFormState = {};

export function CheckoutForm({ service }: { service: StripeService }) {
  const [state, formAction, pending] = useActionState(createStripeCheckout, initial);

  return (
    <form action={formAction} className="space-y-6">
      <Honeypot />
      <input type="hidden" name="service" value={service.slug} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" placeholder="Jane Wanjiru" required />
        <Field label="Business name" name="businessName" placeholder="Optional" />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
        <Field label="Phone" name="phone" placeholder="+254 7XX XXX XXX" required />
        <Field label="Country" name="country" placeholder="Kenya" required />
        <Field label="Company website" name="website" placeholder="Optional" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy-800">
          Additional notes
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything we should know before we start? (optional)"
          className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

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
            <CreditCard className="h-4 w-4" /> Pay securely by card
          </>
        )}
      </button>
      <p className="text-center text-xs text-navy-500">
        You&apos;ll be redirected to Stripe&apos;s secure checkout to complete payment.
      </p>
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
