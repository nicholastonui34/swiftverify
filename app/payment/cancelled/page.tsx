import Link from "next/link";
import type { Metadata } from "next";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelledPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <XCircle className="h-14 w-14 text-navy-400" />
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Payment Cancelled
          </h1>
          <p className="mt-3 text-lg text-navy-600">
            Your payment was not completed. You may safely try again at any time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#services"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Back to services
            </Link>
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
