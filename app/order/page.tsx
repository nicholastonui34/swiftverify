import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Place an Order" };

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Coming in Phase 2
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            The online order &amp; payment flow is being set up
          </h1>
          <p className="mt-4 text-lg text-navy-600">
            We&apos;re finishing the secure order form and M-PESA payment upload.
            In the meantime, start your order directly with our team on Telegram
            or WhatsApp — same fast service.
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
