"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPromo, type ActionResult } from "@/app/admin/actions";

export function PromoResetButton() {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  const doReset = () =>
    startTransition(async () => {
      const r = await resetPromo();
      setResult(r);
      setConfirming(false);
    });

  return (
    <div className="space-y-3">
      {result && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
            result.ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {result.message ?? result.error}
        </div>
      )}

      {confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-navy-600">
            Reset promo counter to 0? This clears all promo records.
          </span>
          <button
            type="button"
            onClick={doReset}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, reset"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50"
        >
          <RotateCcw className="h-4 w-4" /> Reset promo counter
        </button>
      )}
    </div>
  );
}
