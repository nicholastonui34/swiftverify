"use client";

import { useActionState, useState } from "react";
import {
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  Smartphone,
} from "lucide-react";
import { formatKES } from "@/lib/utils";
import { submitPayment, type PaymentFormState } from "@/app/order/actions";

const initial: PaymentFormState = {};

export function PaymentPanel({
  orderId,
  amountKES,
  merchantPhone,
  merchantName,
  alreadySubmitted,
}: {
  orderId: string;
  amountKES: number;
  merchantPhone: string;
  merchantName: string;
  alreadySubmitted: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [state, formAction, pending] = useActionState(submitPayment, initial);

  const done = alreadySubmitted || state.success;

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(merchantPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-500" />
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">
          Payment proof received
        </h2>
        <p className="mt-2 text-navy-600">
          Thank you! Our team is verifying your M-PESA payment. You&apos;ll get an
          email within 2–24 hours once it&apos;s confirmed.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-500">
          <Clock className="h-3.5 w-3.5" /> Status: awaiting admin approval
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* M-PESA instructions */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6">
        <div className="flex items-center gap-2 text-navy-900">
          <Smartphone className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-bold">Pay with M-PESA</h2>
        </div>
        <ol className="mt-4 space-y-2 text-sm text-navy-600">
          <li>1. Go to M-PESA → Send Money.</li>
          <li>
            2. Send{" "}
            <span className="font-semibold text-navy-900">{formatKES(amountKES)}</span> to
            the number below ({merchantName}).
          </li>
          <li>3. Upload the confirmation SMS/screenshot here.</li>
        </ol>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-800 px-4 py-3 text-white">
          <div>
            <p className="text-xs text-navy-100">{merchantName}</p>
            <p className="font-display text-xl font-bold tracking-wide">{merchantPhone}</p>
          </div>
          <button
            type="button"
            onClick={copyNumber}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20"
          >
            {copied ? <Check className="h-4 w-4 text-brand-300" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Upload receipt */}
      <form action={formAction} className="rounded-2xl border border-navy-100 bg-white p-6">
        <input type="hidden" name="orderId" value={orderId} />
        <h2 className="font-display text-lg font-bold text-navy-900">
          Upload your M-PESA receipt
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-800">
              Phone that sent the payment <span className="text-brand-600">*</span>
            </label>
            <input
              name="mpesaPhone"
              required
              placeholder="07XX XXX XXX"
              className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800">
              Receipt image (JPG, PNG, WEBP · max 4MB){" "}
              <span className="text-brand-600">*</span>
            </label>
            <input
              name="receipt"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="mt-2 w-full rounded-xl border border-dashed border-navy-300 bg-navy-50/50 px-4 py-3 text-sm text-navy-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600"
            />
          </div>
        </div>

        {state.error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4" /> Submit payment proof
            </>
          )}
        </button>
      </form>
    </div>
  );
}
