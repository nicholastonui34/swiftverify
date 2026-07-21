import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { CheckoutForm } from "@/components/CheckoutForm";
import { MpesaManualPanel } from "@/components/MpesaManualPanel";
import { getStripeServiceBySlug } from "@/lib/pricing";
import { getStripeOnboardingPromoState } from "@/lib/stripe-checkout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getStripeServiceBySlug(slug);
  return { title: service ? `Order — ${service.name}` : "Checkout" };
}

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getStripeServiceBySlug(slug);
  if (!service || !service.checkoutEnabled) notFound();

  let displayPrice = service.priceUSD;
  let displayRegular = service.regularPriceUSD;
  if (service.slug === "stripe-onboarding") {
    const promo = await getStripeOnboardingPromoState();
    if (!promo.active) {
      displayPrice = 150;
      displayRegular = undefined;
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to services
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {service.name}
          </h1>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-navy-100 bg-white p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-navy-400">You pay</p>
              {service.internationalPriceUSD && (
                <p className="text-xs text-navy-500">
                  International clients: ${service.internationalPriceUSD} — confirmed at checkout
                </p>
              )}
            </div>
            <p className="flex items-end gap-2">
              <span className="font-display text-2xl font-bold text-navy-900">
                ${displayPrice}
              </span>
              {displayRegular && (
                <span className="mb-0.5 text-sm text-navy-400 line-through">
                  ${displayRegular}
                </span>
              )}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <CheckoutForm service={service} />
          </div>

          <div className="mt-6">
            <MpesaManualPanel serviceName={service.name} />
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-navy-500">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            Card payments are processed securely by Stripe — we never see or store your card details.
          </p>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
