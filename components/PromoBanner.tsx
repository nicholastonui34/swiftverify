import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { launchOffer } from "@/lib/pricing";

/** Prominent launch-offer banner introducing the USD pricing section. */
export function PromoBanner() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 text-white sm:p-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-300">
        <Sparkles className="h-3.5 w-3.5" />
        {launchOffer.title}
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {launchOffer.subtitle}
      </h3>
      <ul className="mt-5 space-y-2 text-sm text-navy-100 sm:text-base">
        {launchOffer.content.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            {line}
          </li>
        ))}
      </ul>
      <Link
        href="/checkout/stripe-onboarding"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        {launchOffer.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
