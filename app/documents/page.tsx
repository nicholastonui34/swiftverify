import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { quoteMessage, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Document preparation checklist",
  description: "A practical checklist for preparing personal, business and US-entity payment gateway verification documents.",
  alternates: { canonical: "/documents" },
};

const sections = [
  {
    icon: FileCheck2,
    title: "Personal accounts",
    intro: "For individual applications and personal receiving accounts.",
    items: ["Government-issued photo ID — national ID or passport, with all four corners visible and no glare.", "Proof of address — bank statement, utility bill or official letter dated within the last three months, showing your full name and physical address.", "A selfie or ID photo that matches your account name exactly."],
  },
  {
    icon: Landmark,
    title: "Business accounts",
    intro: "For businesses, agencies, sellers and online companies.",
    items: ["Business registration certificate.", "Director or owner identification.", "Business address proof — a bank reference letter or utility bill on letterhead."],
  },
  {
    icon: ShieldCheck,
    title: "US-entity gateways",
    intro: "For providers such as Mercury with additional eligibility gates.",
    items: ["Certificate of Incorporation or Formation.", "EIN confirmation letter.", "An already-registered US business — formation and tax eligibility are separate from document formatting."],
  },
];

const rules = ["Your name must match exactly across every document and your account profile.", "Address proof should be current; anything older than three months is commonly rejected automatically.", "Use clean, uncropped, glare-free scans or photos saved as JPG or PDF — never a screenshot of a screenshot.", "Do not submit documents with visible signs of editing or alteration."];

export default function DocumentsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f5f7f4]">
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#081624]"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Document preparation</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#081624] sm:text-6xl">A stronger application starts with cleaner details.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">Use this checklist to prepare the documents commonly requested by payment gateways. If you are unsure which path fits your case, send the checklist and your question to our team.</p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {sections.map(({ icon: Icon, title, intro, items }) => (
              <section key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(8,22,36,0.05)] sm:p-7">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f8f1] text-[#14845e]"><Icon className="h-5 w-5" /></div>
                <h2 className="mt-6 font-display text-2xl font-semibold text-[#081624]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{intro}</p>
                <ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-[#14845e]" />{item}</li>)}</ul>
              </section>
            ))}
          </div>

          <section className="mt-5 rounded-[1.5rem] border border-[#c9ded3] bg-[#f4fcf8] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14845e]">The formatting rules that decide pass or fail</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{rules.map((rule) => <div key={rule} className="flex items-start gap-2.5 text-sm leading-6 text-[#295443]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#14845e]" />{rule}</div>)}</div>
          </section>

          <section className="mt-14 rounded-[1.75rem] bg-[#081624] p-8 text-white sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">Need a second pair of eyes?</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">We can review your route before you submit.</h2><p className="mt-4 text-base leading-7 text-slate-300">Message us with the gateway, account type and documents you have ready. We will scope the right support and send a custom quote.</p></div>
            <a href={whatsappLink(quoteMessage)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-300 px-6 text-sm font-bold text-[#081624] transition-all hover:-translate-y-0.5 hover:bg-brand-200 lg:mt-0">Ask SwiftVerify <ArrowUpRight className="h-4 w-4" /></a>
          </section>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
