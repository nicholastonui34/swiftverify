import { stripeServices, withLiveStripeOnboardingPromo } from "@/lib/pricing";
import type { StripeOnboardingPromoState } from "@/lib/stripe-checkout";
import { PromoBanner } from "./PromoBanner";
import { PricingCard } from "./PricingCard";

export function PricingSection({ promo }: { promo: StripeOnboardingPromoState }) {
  return (
    <section id="services" className="scroll-mt-20 bg-navy-50/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Services built for getting paid
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Choose what you need. We handle the setup, the compliance and the
            verification — pay securely online by card.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <PromoBanner />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stripeServices.map((service) => (
            <PricingCard
              key={service.slug}
              service={withLiveStripeOnboardingPromo(service, promo)}
              featured={service.slug === "stripe-onboarding"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
