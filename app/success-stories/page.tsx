import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export const metadata: Metadata = {
  title: "Success Stories | SwiftVerify",
  description: "See how SwiftVerify has helped Kenyan freelancers pursue remote work, resolve payment-account bottlenecks and support smoother Payoneer onboarding for online sellers.",
  alternates: { canonical: "/success-stories" },
};

export default function SuccessStoriesPage() {
  return <><Navbar /><main><section className="bg-[#081624] px-5 py-20 text-white sm:px-8 sm:py-28"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Success stories</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">Real progress starts with a clearer route.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">We&apos;ve helped 470+ Kenyan freelancers pursue remote work, recover payment accounts they had given up on, and move past IP and phone verification bottlenecks. We&apos;ve also supported eBay and Etsy sellers with legitimate Payoneer onboarding so they can sell and receive payments more smoothly.</p></div></section><section className="bg-white px-5 py-20 sm:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">{[["Remote work", "Freelancers improved their profiles and resumes to pursue opportunities on remote-work and AI training platforms."], ["Payment access", "Clients received clearer guidance around account requirements and document consistency after frustrating verification delays."], ["Online selling", "eBay and Etsy sellers were supported through eligible Payoneer onboarding so they could focus on selling and fulfillment."]].map(([title, text]) => <article key={title} className="rounded-[1.35rem] border border-slate-200 bg-[#fbfcfb] p-6"><CheckCircle2 className="h-6 w-6 text-[#14845e]" /><h2 className="mt-5 font-display text-xl font-semibold text-[#081624]">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div><p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-7 text-slate-500">Results depend on each client&apos;s eligibility, truthful information and the independent review process of the relevant platform, provider or marketplace. We do not guarantee approval or bypass compliance requirements.</p></section><TestimonialsSection /></main><Footer /></>;
}
