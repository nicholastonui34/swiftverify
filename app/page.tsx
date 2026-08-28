import Link from "next/link";
import { ArrowUpRight, Check, Clock, FileCheck2, Landmark, MapPinned, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Faq } from "@/components/Faq";
import { WhyUs } from "@/components/WhyUs";
import { JsonLd } from "@/components/JsonLd";
import { getTestimonials } from "@/lib/data";
import { getGuides } from "@/lib/guides";
import { faqs } from "@/lib/content";
import { organizationLd, websiteLd, servicesLd } from "@/lib/seo";
import { services } from "@/lib/content";
import { quoteMessage, whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

const gateways = [
  { name: "Payoneer", note: "Receiving & payouts" },
  { name: "Stripe", note: "Card & ACH processing" },
  { name: "PayPal", note: "Global consumer payments" },
  { name: "Wise", note: "Multi-currency transfers" },
  { name: "Grey", note: "Virtual accounts & cards" },
  { name: "Square", note: "Online & in-person sales" },
  { name: "Mercury", note: "US business banking" },
];

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), servicesLd(services)]} />
      <div className="bg-[#081624] px-5 py-2.5 text-center text-xs font-semibold tracking-wide text-slate-300 sm:px-8">
        <span className="text-brand-300">SwiftVerify brief:</span> Clearer verification guidance for a more confident application.
      </div>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="border-b border-slate-200 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Supported gateways</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#1e3345]">
              {gateways.map((gateway) => <span key={gateway.name} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#55c99b]" />{gateway.name}</span>)}
            </div>
          </div>
        </section>

        <PricingSection />
        <DocumentsSection />
        <HowItWorks />
        <WhyUs />
        <TestimonialsCarousel testimonials={testimonials} />
        <GuidesTeaser />
        <FaqSection />
        <section className="bg-[#f5f7f4] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 overflow-hidden rounded-[1.75rem] bg-[#102335] p-8 text-white sm:p-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Start with the right conversation</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Tell us what you are trying to unlock.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Share your gateway, account type and current roadblock. We will reply with a practical next step and a custom quote.</p>
            </div>
            <a href={whatsappLink(quoteMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-300 px-6 text-sm font-bold text-[#081624] transition-all hover:-translate-y-0.5 hover:bg-brand-200">Message us on WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function DocumentsSection() {
  const personal = ["Government-issued photo ID", "Proof of address dated within the last 3 months", "Selfie or ID photo matching your account name"];
  const business = ["Business registration certificate", "Director or owner identification", "Business address proof on letterhead"];
  const rules = ["Exact name match across documents and profile", "Clean, uncropped, glare-free JPG or PDF files", "No visible edits or alterations"];

  return (
    <section id="documents" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Documents we help you prepare</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">Small document details make a big difference.</h2>
          </div>
          <Link href="/documents" className="inline-flex items-center gap-2 text-sm font-bold text-[#106a4e] hover:text-[#081624]">View full checklist <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Most verification rejections are not about your ambition or business. They are about a missing, mismatched or poorly formatted detail. We make that detail easier to get right.</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <DocumentGroup icon={FileCheck2} title="Personal accounts" items={personal} />
          <DocumentGroup icon={Landmark} title="Business accounts" items={business} />
          <DocumentGroup icon={ShieldCheck} title="Formatting rules that matter" items={rules} />
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f0dfbd] bg-[#fffaf0] p-5 text-sm leading-6 text-[#725627]">
          <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-[#ba8732]" />
          <p><span className="font-bold">US-entity gateways such as Mercury:</span> an already-registered US business, formation documents and EIN confirmation are separate eligibility requirements from document formatting.</p>
        </div>
      </div>
    </section>
  );
}

function DocumentGroup({ icon: Icon, title, items }: { icon: typeof FileCheck2; title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-[#fbfcfb] p-6 sm:p-7">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f8f1] text-[#14845e]"><Icon className="h-5 w-5" /></div>
      <h3 className="mt-6 font-display text-xl font-semibold text-[#081624]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-[#14845e]" />{item}</li>)}
      </ul>
    </div>
  );
}

function GuidesTeaser() {
  const guides = getGuides().slice(0, 3);
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Field notes</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#081624] sm:text-5xl">Learn before you submit.</h2>
          </div>
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-bold text-[#106a4e] hover:text-[#081624]">All guides <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group flex flex-col rounded-[1.5rem] border border-slate-200 bg-[#fbfcfb] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#abd4c1] hover:shadow-[0_18px_50px_rgba(8,22,36,0.08)]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"><Clock className="h-3.5 w-3.5" /> {guide.readingMinutes} min read</p>
              <h3 className="mt-5 font-display text-xl font-semibold leading-tight text-[#081624] group-hover:text-[#14845e]">{guide.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#106a4e]">Read guide <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-[#f5f7f4] py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#081624] sm:text-5xl">Good questions lead to better submissions.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">What to expect from a quote-first, compliance-led process.</p>
        </div>
        <div className="mt-12"><Faq items={faqs} /></div>
      </div>
    </section>
  );
}
