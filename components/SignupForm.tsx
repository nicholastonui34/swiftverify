"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, UserPlus } from "lucide-react";
import { signup, type SignupState } from "@/app/account/actions";
import { Honeypot } from "@/components/Honeypot";

const initial: SignupState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initial);

  return (
    <form action={formAction} className="space-y-4">
      <Honeypot />

      <Field label="Full name" name="name" type="text" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="username" required />
      <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <Field label="Country (optional)" name="country" type="text" autoComplete="country-name" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />

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
            <UserPlus className="h-4 w-4" /> Create account
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-navy-800">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
