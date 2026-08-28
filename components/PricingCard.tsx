import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import type { StripeService } from "@/lib/pricing";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function PricingCard({ service, featured }: { service: StripeService; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-[1.5rem] border p-6 transition-all duration-300 hover:-translate-y-1",
        featured ? "border-brand-300/40 bg-[#102335] shadow-[0_20px_70px_rgba(8,22,36,0.18)]" : "border-slate-200 bg-white hover:border-brand-300/50 hover:shadow-[0_20px_60px_rgba(8,22,36,0.10)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", featured ? "bg-brand-300/15 text-brand-200" : "bg-[#e9f8f1] text-[#14845e]")}>
          <MessageCircle className="h-5 w-5" />
        </div>
        {featured && <span className="rounded-full bg-brand-300 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#081624]">Most requested</span>}
      </div>

      <h3 className={cn("mt-6 font-display text-xl font-semibold leading-tight", featured ? "text-white" : "text-[#081624]")}>{service.name}</h3>
      <p className={cn("mt-3 text-sm leading-6", featured ? "text-slate-300" : "text-slate-600")}>
        {service.description[0]}
      </p>

      <ul className="mt-5 flex-1 space-y-3">
        {service.description.slice(1).map((line) => (
          <li key={line} className={cn("flex items-start gap-2.5 text-sm leading-5", featured ? "text-slate-300" : "text-slate-600")}>
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-brand-300" : "text-[#14845e]")} />
            {line}
          </li>
        ))}
      </ul>

      <div className={cn("mt-7 border-t pt-5", featured ? "border-white/10" : "border-slate-200")}>
        <p className={cn("text-xs font-bold uppercase tracking-[0.14em]", featured ? "text-brand-200" : "text-[#14845e]")}>Custom quote</p>
        <p className={cn("mt-1 text-sm", featured ? "text-slate-400" : "text-slate-500")}>Scoped to your gateway, account type and complexity.</p>
      </div>

      <a
        href={`${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi SwiftVerify! I'd like a quote for: ${service.name}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-all hover:-translate-y-0.5",
          featured ? "bg-brand-300 text-[#081624] hover:bg-brand-200" : "border border-[#b5d9ca] bg-[#f4fcf8] text-[#106a4e] hover:bg-[#e9f8f1]"
        )}
      >
        Get a free quote
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  );
}
