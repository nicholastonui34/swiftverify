import Link from "next/link";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/content";
import { faqLd } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ — Payoneer Verification Questions",
  description:
    "Answers to common questions about SwiftVerify: how Payoneer verification works, payment via M-PESA, timelines, refunds and supported countries.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Frequently asked questions
            </h1>
            <p className="mt-3 text-navy-600">
              Can&apos;t find what you&apos;re looking for? Reach us on{" "}
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 hover:underline"
              >
                Telegram
              </a>
              .
            </p>
          </div>

          <div className="mt-10">
            <Faq items={faqs} />
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <p className="text-sm text-navy-700">
                Ready to get your account verified? First 10 signups this month get the promo rate.
              </p>
            </div>
            <Link
              href="/order"
              className="shrink-0 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Place an order
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
