import { ClipboardList, Upload, ShieldCheck, PartyPopper } from "lucide-react";
import { howItWorks } from "@/lib/content";

const icons = [ClipboardList, Upload, ShieldCheck, PartyPopper];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Four simple steps from order to a verified, paid-out account.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s, i) => {
            const Icon = icons[i];
            return (
              <div key={s.step} className="relative text-center sm:text-left">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-navy-800 to-brand-500 text-white sm:mx-0">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="font-display text-sm font-bold text-brand-600">
                    Step {s.step}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-navy-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
