"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { trackOrder, type TrackState } from "@/app/track/actions";

const initial: TrackState = {};

export function TrackForm() {
  const [state, formAction, pending] = useActionState(trackOrder, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="orderId" className="block text-sm font-semibold text-navy-800">
          Order ID
        </label>
        <input
          id="orderId"
          name="orderId"
          required
          placeholder="e.g. a1b2c3d4 (from your confirmation email)"
          className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-navy-800">
          Email used for the order
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
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
            <Search className="h-4 w-4" /> Track order
          </>
        )}
      </button>
    </form>
  );
}
