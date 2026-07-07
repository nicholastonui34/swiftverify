import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/content";
import { siteConfig, promoActive } from "@/lib/config";
import { formatKES, cn } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const showPromo = promoActive && service.isPromoEligible;
  const displayPrice = showPromo ? siteConfig.promoPriceKES : service.priceKES;
  const struck = showPromo && service.priceKES > siteConfig.promoPriceKES;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        service.featured ? "border-brand-200" : "border-navy-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug text-navy-900">
          {service.name}
        </h3>
        {showPromo && (
          <span className="shrink-0 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            First 10
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
        {service.description}
      </p>

      <div className="mt-6 flex items-end gap-2">
        <span className="font-display text-2xl font-bold text-navy-900">
          {formatKES(displayPrice)}
        </span>
        {struck && (
          <span className="mb-1 text-sm text-navy-400 line-through">
            {formatKES(service.priceKES)}
          </span>
        )}
      </div>

      <Link
        href={`/order?service=${service.slug}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 group-hover:bg-brand-500"
      >
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
