import type { Service, PromoState } from "@/lib/content";
import { formatKES } from "@/lib/utils";
import { ServiceCard } from "./ServiceCard";

export function ServicesGrid({
  services,
  promo,
}: {
  services: Service[];
  promo: PromoState;
}) {
  return (
    <section id="services" className="scroll-mt-20 bg-navy-50/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Services built for getting paid
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Choose what you need. We handle the documents, the formatting and the
            verification.
          </p>
          {promo.active && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              🔥 First {promo.limit} signups pay just {formatKES(promo.promoPriceKES)} —{" "}
              {promo.remaining} spots left
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} promo={promo} />
          ))}
        </div>
      </div>
    </section>
  );
}
