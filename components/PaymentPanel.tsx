"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  Smartphone,
  Coins,
  Wallet,
} from "lucide-react";
import { formatKES } from "@/lib/utils";
import { submitPayment, type PaymentFormState } from "@/app/order/actions";

const initial: PaymentFormState = {};

type Method = "MPESA" | "USDT_TRC20" | "BINANCE_PAY";

const METHODS: { id: Method; label: string; icon: typeof Smartphone }[] = [
  { id: "MPESA", label: "M-PESA", icon: Smartphone },
  { id: "USDT_TRC20", label: "USDT (TRC20)", icon: Coins },
  { id: "BINANCE_PAY", label: "Binance Pay", icon: Wallet },
];

export function PaymentPanel({
  orderId,
  amountKES,
  till,
  merchantName,
  usdtTrc20Address,
  binancePayId,
  alreadySubmitted,
}: {
  orderId: string;
  amountKES: number;
  till: string;
  merchantName: string;
  usdtTrc20Address: string;
  binancePayId: string;
  alreadySubmitted: boolean;
}) {
  const [method, setMethod] = useState<Method>("MPESA");
  const [copied, setCopied] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(submitPayment, initial);

  const done = alreadySubmitted || state.success;

  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
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
          Thank you! Our team is verifying your payment. You&apos;ll get an
          email within 2–24 hours once it&apos;s confirmed.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-500">
          <Clock className="h-3.5 w-3.5" /> Status: awaiting admin approval
        </p>
        <div className="mt-5">
          <Link
            href={`/order/${orderId}/status`}
            className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Track your order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment method selector */}
      <div className="flex gap-2 rounded-full bg-navy-100 p-1">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              method === m.id
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-800"
            }`}
          >
            <m.icon className="h-4 w-4" /> {m.label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6">
        {method === "MPESA" && (
          <>
            <div className="flex items-center gap-2 text-navy-900">
              <Smartphone className="h-5 w-5 text-brand-500" />
              <h2 className="font-display text-lg font-bold">Pay with M-PESA</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-navy-600">
              <li>1. Go to M-PESA → Buy Goods and Services.</li>
              <li>
                2. Enter Till Number{" "}
                <span className="font-semibold text-navy-900">{till}</span> ({merchantName}).
              </li>
              <li>
                3. Enter amount{" "}
                <span className="font-semibold text-navy-900">{formatKES(amountKES)}</span> and
                confirm.
              </li>
              <li>4. Upload the confirmation SMS/screenshot below.</li>
            </ol>
            <CopyRow
              eyebrow={`Buy Goods · Till Number · ${merchantName}`}
              value={till}
              copied={copied === "till"}
              onCopy={() => copyValue("till", till)}
            />
          </>
        )}

        {method === "USDT_TRC20" && (
          <>
            <div className="flex items-center gap-2 text-navy-900">
              <Coins className="h-5 w-5 text-brand-500" />
              <h2 className="font-display text-lg font-bold">Pay with USDT (TRC20)</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-navy-600">
              <li>1. Open your crypto wallet or exchange app.</li>
              <li>
                2. Send USDT on the <span className="font-semibold text-navy-900">TRC20</span>{" "}
                network only, to the address below.
              </li>
              <li>3. Send the equivalent of {formatKES(amountKES)}.</li>
              <li>4. Upload a screenshot of the completed transaction below.</li>
            </ol>
            <CopyRow
              eyebrow="USDT · TRC20 network only"
              value={usdtTrc20Address}
              mono
              copied={copied === "usdt"}
              onCopy={() => copyValue("usdt", usdtTrc20Address)}
            />
            <p className="mt-2 text-xs text-red-500">
              Only send USDT on the TRC20 network. Funds sent on another network cannot be recovered.
            </p>
          </>
        )}

        {method === "BINANCE_PAY" && (
          <>
            <div className="flex items-center gap-2 text-navy-900">
              <Wallet className="h-5 w-5 text-brand-500" />
              <h2 className="font-display text-lg font-bold">Pay with Binance Pay</h2>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-navy-600">
              <li>1. Open Binance → Pay → Send.</li>
              <li>
                2. Enter Binance Pay ID{" "}
                <span className="font-semibold text-navy-900">{binancePayId}</span>.
              </li>
              <li>3. Send the equivalent of {formatKES(amountKES)}.</li>
              <li>4. Upload a screenshot of the completed transaction below.</li>
            </ol>
            <CopyRow
              eyebrow="Binance Pay ID"
              value={binancePayId}
              copied={copied === "binance"}
              onCopy={() => copyValue("binance", binancePayId)}
            />
          </>
        )}
      </div>

      {/* Upload receipt */}
      <form action={formAction} className="rounded-2xl border border-navy-100 bg-white p-6">
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="paymentMethod" value={method} />
        <h2 className="font-display text-lg font-bold text-navy-900">
          Upload your payment proof
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-800">
              {method === "MPESA" ? "Phone that sent the payment" : "Wallet / transaction reference"}{" "}
              <span className="text-brand-600">*</span>
            </label>
            <input
              name="mpesaPhone"
              required
              placeholder={method === "MPESA" ? "07XX XXX XXX" : "Sending wallet address or txn ID"}
              className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800">
              Receipt / screenshot (JPG, PNG, WEBP · max 4MB){" "}
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

function CopyRow({
  eyebrow,
  value,
  mono,
  copied,
  onCopy,
}: {
  eyebrow: string;
  value: string;
  mono?: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-navy-800 px-4 py-3 text-white">
      <div className="min-w-0">
        <p className="text-xs text-navy-100">{eyebrow}</p>
        <p
          className={`font-bold tracking-wide ${
            mono ? "truncate font-mono text-sm" : "font-display text-xl"
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20"
      >
        {copied ? <Check className="h-4 w-4 text-brand-300" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
