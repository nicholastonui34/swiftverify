import { ArrowUpRight, BadgeCheck, Check, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { siteConfig, quoteMessage, whatsappLink } from "@/lib/config";

const gateways = ["Payoneer", "Stripe", "PayPal", "Wise", "Grey", "Square", "Mercury"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#081624] text-white">
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-400/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-48 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:pb-28 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/25 bg-brand-300/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-200">
            <Sparkles className="h-3.5 w-3.5" />
            Independent payment gateway consultancy
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-[5.15rem]">
            Get verified.
            <br />
            <span className="text-brand-300">Get paid.</span>
            <br />
            Move faster.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Compliance-led account setup and verification support for freelancers, agencies and online businesses using the world&apos;s major payment gateways.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(quoteMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-400 px-6 text-base font-bold text-[#081624] transition-all hover:-translate-y-0.5 hover:bg-brand-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
            >
              Get a free quote
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
            >
              Explore services
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-300" /> {siteConfig.successRate}% reported success rate</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand-300" /> {siteConfig.sellersVerified}+ clients supported</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-5 rounded-[2rem] border border-brand-300/10 bg-brand-300/5 blur-sm" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-200">Your verification map</p>
                <p className="mt-1 text-sm text-slate-300">A clearer path through compliance</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300/25 bg-brand-300/10 px-3 py-1.5 text-xs font-bold text-brand-200">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-300" /> Advisory
              </span>
            </div>

            <div className="space-y-3 p-6">
              {[
                ["01", "Choose the right gateway", "Based on your country, account type and use case"],
                ["02", "Prepare the right documents", "Clear, current and consistent before submission"],
                ["03", "Submit with confidence", "Practical support if the provider asks questions"],
              ].map(([number, title, description], index) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-[#102335]/80 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-300/15 text-xs font-bold text-brand-200">{number}</span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                  {index === 2 && <Check className="ml-auto mt-1 h-5 w-5 shrink-0 text-brand-300" />}
                </div>
              ))}
            </div>

            <div className="mx-6 mb-6 rounded-2xl bg-brand-300 p-5 text-[#081624]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#234d43]">Supported gateways</p>
                  <p className="mt-1 text-lg font-bold">One team. Seven routes to getting paid.</p>
                </div>
                <MessageCircle className="h-7 w-7 shrink-0" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {gateways.map((gateway) => <span key={gateway} className="rounded-full bg-[#081624]/10 px-2.5 py-1 text-xs font-bold">{gateway}</span>)}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-[#102335] px-4 py-3 shadow-xl sm:block">
            <p className="font-display text-2xl font-bold text-white">{siteConfig.yearsActive} yrs</p>
            <p className="text-xs text-slate-400">of practical experience</p>
          </div>
        </div>
      </div>
    </section>
  );
}
