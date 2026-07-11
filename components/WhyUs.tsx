import { ShieldCheck, Users, Smartphone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

const points = [
  {
    icon: ShieldCheck,
    title: `${siteConfig.successRate}% success rate`,
    body: "We prepare your documents to the exact spec Payoneer's review accepts — so they pass the first time.",
  },
  {
    icon: Users,
    title: `${siteConfig.sellersVerified}+ sellers verified`,
    body: `Trusted by freelancers and sellers across East Africa over ${siteConfig.yearsActive} years.`,
  },
  {
    icon: Smartphone,
    title: "Pay safely with M-PESA",
    body: "Manual M-PESA verification — no card details, no risky payment APIs, ever.",
  },
  {
    icon: MessageCircle,
    title: "Real human support",
    body: "Clear guidance and quick replies from people who do this every day.",
  },
];

/** Trust band explaining why SwiftVerify, with proof points. */
export function WhyUs() {
  return (
    <section id="why-us" className="border-y border-navy-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-brand-600">
            Why SwiftVerify
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Verification done right, the first time
          </h2>
          <p className="mt-3 text-navy-600">
            Most Payoneer rejections come down to document formatting. That&apos;s exactly what we
            get right — so you stop guessing and start getting paid.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border border-navy-100 bg-navy-50/40 p-6">
                <span className="inline-flex rounded-xl bg-brand-100 p-2.5 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-navy-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
