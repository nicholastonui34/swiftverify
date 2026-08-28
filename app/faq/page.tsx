import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/content";
import { faqLd } from "@/lib/seo";
import { quoteMessage, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers about SwiftVerify's payment gateway verification and compliance consultancy.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <Navbar />
      <main className="flex-1 bg-[#f5f7f4]">
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">FAQ</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-[-0.05em] text-[#081624] sm:text-6xl">Questions, answered clearly.</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">A practical overview of how SwiftVerify supports payment gateway verification, document preparation and compliance follow-through.</p>
          </div>
          <div className="mt-12"><Faq items={faqs} /></div>
          <div className="mt-10 flex flex-col gap-5 rounded-[1.5rem] border border-[#c9ded3] bg-[#f4fcf8] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" /><p className="text-sm leading-6 text-[#295443]">Still unsure which route fits your case? Ask us directly on WhatsApp and we will point you in the right direction.</p></div>
            <a href={whatsappLink(quoteMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#081624] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#102335]">Ask the team <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
