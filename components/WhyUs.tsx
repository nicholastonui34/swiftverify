import { FileCheck2, Fingerprint, MessageCircle, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";

const points = [
  {
    icon: ShieldCheck,
    title: `${siteConfig.successRate}% reported success rate`,
    body: "We prepare your information to the exact details each gateway's compliance review expects.",
  },
  {
    icon: FileCheck2,
    title: "Document-first thinking",
    body: "Most avoidable rejections start with mismatched names, stale addresses or poor-quality files. We catch those details early.",
  },
  {
    icon: Fingerprint,
    title: "Built around your case",
    body: "Personal or business, East Africa or international — your route is scoped around your actual profile and use case.",
  },
  {
    icon: MessageCircle,
    title: "Transparent custom quotes",
    body: "No fixed menu pricing. You get a clear WhatsApp quote and scope before any work begins.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="border-y border-slate-200 bg-[#081624] py-24 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Why SwiftVerify</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Compliance support that respects the details.</h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-300">We do not sell shortcuts or promise outcomes a provider controls. We help you make a stronger, more accurate submission and understand what comes next.</p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="bg-[#102335] p-6 sm:p-7">
                <Icon className="h-6 w-6 text-brand-300" />
                <h3 className="mt-7 font-display text-lg font-semibold text-white">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
