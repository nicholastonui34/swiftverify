import { ArrowUpRight, Check, FileText, HelpCircle, LibraryBig } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { JsonLd } from "@/components/JsonLd";
import { services } from "@/lib/content";
import { organizationLd, websiteLd, servicesLd } from "@/lib/seo";
import { quoteMessage, whatsappLink } from "@/lib/config";

const gateways = ["Payoneer", "Stripe", "PayPal", "Wise", "Grey", "Square", "Mercury"];

export default function Home() {
  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), servicesLd(services)]} />
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="border-b border-slate-200 bg-white py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Supported gateways</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#1e3345]">
              {gateways.map((gateway) => <span key={gateway} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#55c99b]" />{gateway}</span>)}
            </div>
          </div>
        </section>

        <PricingSection />
        <HowItWorks />
        <ResourceLinks />

        <section className="bg-[#f5f7f4] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-[#102335] p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Ready to start?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">Tell us what you are trying to unlock.</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">Share your gateway, country and current roadblock. We will reply with the right next step and a custom quote.</p>
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

function ResourceLinks() {
  const resources = [
    { href: "/documents", icon: FileText, label: "Document checklist", text: "Prepare the details providers usually request." },
    { href: "/guides", icon: LibraryBig, label: "Guides", text: "Read practical notes before you submit." },
    { href: "/faq", icon: HelpCircle, label: "FAQ", text: "Get clear answers about the process." },
  ];

  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Need more detail?</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[#081624] sm:text-4xl">Useful resources, kept one click away.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {resources.map(({ href, icon: Icon, label, text }) => (
            <a key={href} href={href} className="group rounded-[1.25rem] border border-slate-200 bg-[#fbfcfb] p-5 transition-all hover:-translate-y-0.5 hover:border-[#abd4c1] hover:shadow-[0_14px_34px_rgba(8,22,36,0.07)]">
              <div className="flex items-start justify-between gap-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9f8f1] text-[#14845e]"><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#081624]">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </a>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500"><Check className="h-4 w-4 text-[#14845e]" /> The homepage stays focused; detailed reading lives on its own page.</div>
      </div>
    </section>
  );
}
