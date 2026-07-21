"use client";

import { useState } from "react";
import { Copy, Check, Smartphone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

/**
 * Manual M-PESA alternative for customers who prefer not to pay by card:
 * copy the Buy Goods till number and forward the payment confirmation on
 * WhatsApp. Deliberately no form/DB record — our team reconciles it manually
 * once the confirmation arrives on WhatsApp.
 */
export function MpesaManualPanel({ serviceName }: { serviceName: string }) {
  const [copied, setCopied] = useState(false);

  async function copyTill() {
    try {
      await navigator.clipboard.writeText(siteConfig.mpesaTill);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  const whatsappHref = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi SwiftVerify! I've paid via M-PESA Till ${siteConfig.mpesaTill} for: ${serviceName}. Here's my payment confirmation:`
  )}`;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6">
      <div className="flex items-center gap-2 text-navy-900">
        <Smartphone className="h-5 w-5 text-brand-500" />
        <h2 className="font-display text-lg font-bold">Prefer M-PESA?</h2>
      </div>
      <ol className="mt-3 space-y-1.5 text-sm text-navy-600">
        <li>1. Go to M-PESA → Buy Goods and Services.</li>
        <li>
          2. Enter Till Number{" "}
          <span className="font-semibold text-navy-900">{siteConfig.mpesaTill}</span> (
          {siteConfig.mpesaMerchantName}) and pay.
        </li>
        <li>3. Forward the confirmation SMS/screenshot to us on WhatsApp.</li>
      </ol>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-navy-800 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="text-xs text-navy-100">Buy Goods · Till Number · {siteConfig.mpesaMerchantName}</p>
          <p className="font-display text-xl font-bold tracking-wide">{siteConfig.mpesaTill}</p>
        </div>
        <button
          type="button"
          onClick={copyTill}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20"
        >
          {copied ? <Check className="h-4 w-4 text-brand-300" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
      >
        <MessageCircle className="h-4 w-4" /> Forward confirmation on WhatsApp
      </a>
    </div>
  );
}
