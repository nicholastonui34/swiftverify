import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { StripeService } from "@/lib/pricing";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function PricingCard({
  service,
  featured,
}: {
  service: StripeService;
  featured?: boolean;
}) {
  const hasDiscount =
    typeof service.regularPriceUSD === "number" &&
    typeof service.priceUSD === "number" &&
    service.regularPriceUSD > service.priceUSD;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        featured ? "border-brand-200" : "border-navy-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug text-navy-900">
          {service.name}
        </h3>
        {service.badge && (
          <span className="shrink-0 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {service.badge}
          </span>
        )}
      </div>

      <ul className="mt-4 flex-1 space-y-2">
        {service.description.map((line) => (
          <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-navy-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {service.priceUSD === null ? (
          <span className="font-display text-2xl font-bold text-navy-900">Request Quote</span>
        ) : (
          <div className="flex flex-wrap items-end gap-2">
            <span className="font-display text-3xl font-bold text-navy-900">
              ${service.priceUSD}
            </span>
            {hasDiscount && (
              <span className="mb-1 text-sm text-navy-400 line-through">
                ${service.regularPriceUSD}
              </span>
            )}
            {service.internationalPriceUSD && (
              <span className="mb-1 text-xs text-navy-500">
                (${service.internationalPriceUSD} international)
              </span>
            )}
          </div>
        )}
        {service.supportNote && (
          <p className="mt-1.5 text-xs font-semibold text-brand-600">{service.supportNote}</p>
        )}
      </div>

      {service.checkoutEnabled ? (
        <Link
          href={`/checkout/${service.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 group-hover:bg-brand-500"
        >
          Order Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <a
          href={`${siteConfig.whatsapp}?text=${encodeURIComponent(
            `Hi SwiftVerify! I'd like a quote for: ${service.name}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
        >
          Request a Quote
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
