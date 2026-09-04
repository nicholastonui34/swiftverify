import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { InquiryForm } from "@/components/InquiryForm";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Freelancer & Seller Inquiry | SwiftVerify",
  description: "Contact SwiftVerify for help with remote-work preparation, payment-account verification, Payoneer onboarding and marketplace seller bottlenecks.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <><Navbar /><main className="bg-[#f5f7f4]"><section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div className="pt-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Freelancer & seller inquiry</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight tracking-[-0.05em] text-[#081624] sm:text-6xl">Tell us where you&apos;re stuck.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">Use this short inquiry form if you are pursuing remote work, trying to verify a payment account, or selling on a marketplace and need a clearer next step.</p><ul className="mt-8 space-y-4 text-sm leading-6 text-[#315346]"><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" />Guidance for authentic, client-provided information</li><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" />Support for freelancers, eBay and Etsy sellers</li><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" />Direct handoff to WhatsApp for a faster response</li></ul></div><InquiryForm /></section></main><Footer /></>;
}
