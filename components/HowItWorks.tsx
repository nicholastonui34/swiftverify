import { ArrowRight, ClipboardCheck, FileCheck2, MessageCircle, Route } from "lucide-react";
import { howItWorks } from "@/lib/content";

const icons = [MessageCircle, ClipboardCheck, FileCheck2, Route];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">A calmer way to get verified</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">From confusion to a clear next step.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">No public price menu. No guesswork. Just a direct conversation, a clear scope and practical compliance support for the gateway that fits your goals.</p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#c9ded3] bg-[#f4fcf8] px-4 py-2.5 text-sm font-semibold text-[#106a4e]">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-300 text-xs font-bold text-[#081624]">SV</span>
              Human support on WhatsApp
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {howItWorks.map((step, index) => {
              const Icon = icons[index];
              return (
                <div key={step.step} className="group relative rounded-[1.5rem] border border-slate-200 bg-[#fbfcfb] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#abd4c1] hover:shadow-[0_18px_50px_rgba(8,22,36,0.08)]">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f8f1] text-[#14845e]"><Icon className="h-5 w-5" /></div>
                    <span className="font-display text-4xl font-semibold tracking-[-0.08em] text-slate-200">0{step.step}</span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-semibold text-[#081624]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  {index < howItWorks.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1.5 text-[#14845e] sm:block" aria-hidden />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
