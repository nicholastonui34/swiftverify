import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";
import type { PromoState } from "@/lib/content";
import { formatKES } from "@/lib/utils";

export function Hero({ promo }: { promo: PromoState }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="bg-hero-radial absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {siteConfig.successRate}% success rate · {siteConfig.sellersVerified}+ verified
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Get your Payoneer verified.{" "}
            <span className="text-brand-600">Fast. Compliant.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-600">
            For eBay, Etsy and Upwork sellers &amp; freelancers across East Africa.
            Verified expertise that gets your account approved — and your money
            flowing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              Place Order Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-7 py-3.5 text-base font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              Join Telegram
            </a>
          </div>

          {promo.active && (
            <p className="mt-5 text-sm font-medium text-navy-600">
              🎉 First {promo.limit} signups this month get everything at{" "}
              <span className="font-bold text-brand-600">
                {formatKES(promo.promoPriceKES)}
              </span>{" "}
              — {promo.remaining} spots left.
            </p>
          )}
        </div>

        {/* Visual: verification status card */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card-hover)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-navy-800 to-brand-500 text-white">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">Payoneer Account</p>
                  <p className="text-xs text-navy-500">Personal · Kenya</p>
                </div>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                Verified
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Identity document accepted",
                "Proof of address accepted",
                "KYC review passed",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-navy-50/70 px-4 py-3"
                >
                  <BadgeCheck className="h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-sm font-medium text-navy-700">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-navy-800 px-4 py-3 text-white">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-brand-300" />
                Verified in 48 hours
              </span>
              <span className="text-xs text-navy-100">SwiftVerify</span>
            </div>
          </div>

          {/* Floating stat chips */}
          <div className="absolute -left-4 -top-4 hidden rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-[var(--shadow-card)] sm:block">
            <p className="font-display text-2xl font-bold text-navy-900">
              {siteConfig.sellersVerified}+
            </p>
            <p className="text-xs text-navy-500">sellers verified</p>
          </div>
        </div>
      </div>
    </section>
  );
}
