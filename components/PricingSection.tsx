import { ArrowDownRight, ShieldCheck } from "lucide-react";
import { stripeServices } from "@/lib/pricing";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  return (
    <section id="services" className="scroll-mt-20 bg-[#f5f7f4] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">How we can help</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">
              The right route for your payment stack.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-600">
            Every engagement is scoped individually. Tell us what you are trying to unlock and we will recommend the cleanest, compliant next step.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {stripeServices.map((service, index) => <PricingCard key={service.slug} service={service} featured={index === 0} />)}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-[1.5rem] border border-[#c9ded3] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#14845e]" />
            <div>
              <p className="font-semibold text-[#081624]">Independent guidance, not a shortcut around provider rules.</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">We help you present accurate, consistent information and set realistic expectations for each provider&apos;s review.</p>
            </div>
          </div>
          <a href="/documents" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#106a4e] transition-colors hover:text-[#081624]">
            See document checklist <ArrowDownRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
