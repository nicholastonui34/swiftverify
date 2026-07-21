import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Send, MessageCircle, ShieldCheck, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { OrderForm } from "@/components/OrderForm";
import { isDbConfigured } from "@/lib/db";
import { getServices, getPromoState } from "@/lib/data";
import { getStripeOnboardingPromoState } from "@/lib/stripe-checkout";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Place an Order",
  description:
    "Order Payoneer verification, Stripe account onboarding, document formatting or a global receiving account. Pay securely by card or M-PESA.",
  alternates: { canonical: "/order" },
};
export const dynamic = "force-dynamic";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: defaultSlug } = await searchParams;

  if (!isDbConfigured) {
    return <OrderingUnavailable />;
  }

  const [services, promo, stripePromo] = await Promise.all([
    getServices(),
    getPromoState(),
    getStripeOnboardingPromoState(),
  ]);

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
            Place your order
          </h1>
          <p className="mt-2 text-navy-600">
            Choose a service below — pay instantly by card via Stripe, or via
            M-PESA, USDT (TRC20) or Binance Pay if you prefer.
          </p>

          <a
            href={`${siteConfig.whatsapp}?text=${encodeURIComponent(
              "Hi SwiftVerify! I'd like a free consultation before placing an order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-4 transition-colors hover:bg-[#25D366]/15"
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 shrink-0 text-[#128C7E]" />
              <span className="text-sm text-navy-800">
                <span className="font-semibold">Not sure which service you need?</span>{" "}
                Book a free WhatsApp consultation before you order.
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white">
              <MessageCircle className="h-3.5 w-3.5" /> Chat now
            </span>
          </a>

          <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <OrderForm
              services={services}
              promo={promo}
              stripePromo={stripePromo}
              defaultSlug={defaultSlug}
            />
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-navy-500">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            Manual payment verification · no card details ever required
          </p>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

/** Shown when DATABASE_URL isn't configured yet (keeps the site usable). */
function OrderingUnavailable() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Start your order with our team
          </h1>
          <p className="mt-4 text-lg text-navy-600">
            Online checkout is being finalised. Start your order directly with us
            on Telegram or WhatsApp — same fast service.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              <Send className="h-4 w-4" /> Start on Telegram
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-7 py-3.5 text-base font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
