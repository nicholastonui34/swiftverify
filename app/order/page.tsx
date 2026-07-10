import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Send, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { OrderForm } from "@/components/OrderForm";
import { isDbConfigured } from "@/lib/db";
import { getServices, getPromoState } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Place an Order",
  description:
    "Order Payoneer account verification, document formatting or a US/UK/Canada receiving account. Pay securely via M-PESA.",
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

  const [services, promo] = await Promise.all([getServices(), getPromoState()]);

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
            Fill in your details and continue to M-PESA payment. We verify
            everything manually — your money is safe.
          </p>

          <div className="mt-8 rounded-3xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <OrderForm services={services} promo={promo} defaultSlug={defaultSlug} />
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-navy-500">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            Manual M-PESA verification · no card details ever required
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
