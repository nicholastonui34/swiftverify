import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { quoteMessage, siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Get a custom quote",
  description: "Start a conversation with SwiftVerify about payment gateway verification and compliance support.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f5f7f4]">
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <Link href="/#services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#081624]"><ArrowLeft className="h-4 w-4" /> Back to services</Link>
          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(8,22,36,0.08)] sm:p-10">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9f8f1] text-[#14845e]"><MessageCircle className="h-6 w-6" /></div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Custom quote, not self-serve checkout</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">Start with your case.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">We scope every engagement around your gateway, account type, country and current roadblock. Message our team on WhatsApp and we will send a clear next step and custom quote before any work begins.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink(quoteMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#081624] px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#102335]">Message us on WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
              <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 px-6 text-sm font-bold text-[#081624] transition-colors hover:bg-slate-50"><Send className="h-4 w-4" /> Use Telegram</a>
            </div>
            <div className="mt-9 flex items-start gap-3 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" /><p>We help you prepare accurate information for your own account. We do not ask for your passwords or promise to bypass provider requirements.</p></div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
