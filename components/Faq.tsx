import { ChevronDown } from "lucide-react";
import type { Faq as FaqItem } from "@/lib/content";

/**
 * FAQ accordion built on native <details>/<summary> — accessible and needs no
 * client JS. Used on the landing FAQ section and the /faq page.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 marker:hidden hover:bg-navy-50/60">
            <span>{item.question}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-navy-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-navy-600">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
