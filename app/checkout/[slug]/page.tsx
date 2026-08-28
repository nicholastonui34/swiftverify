import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { quoteMessage, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Start a custom quote",
  description: "Connect with SwiftVerify for a payment gateway verification and compliance quote.",
  alternates: { canonical: "/order" },
};

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const serviceName = slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const message = `Hi SwiftVerify! I'd like a quote for: ${serviceName}.`;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f5f7f4]">
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <Link href="/#services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#081624]"><ArrowLeft className="h-4 w-4" /> Back to services</Link>
          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(8,22,36,0.08)] sm:p-10">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9f8f1] text-[#14845e]"><MessageCircle className="h-6 w-6" /></div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">{serviceName}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">Let&apos;s scope the right support.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">SwiftVerify now handles new enquiries through a direct consultation rather than public self-serve checkout. Message us with your gateway, account type and country so we can recommend the right next step.</p>
            <a href={whatsappLink(message || quoteMessage)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#081624] px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#102335]">Get a custom quote on WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
            <div className="mt-9 flex items-start gap-3 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" /><p>Existing orders and account access remain available through the links in the footer.</p></div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
