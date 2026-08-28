import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/content";

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z .]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="bg-[#f5f7f4] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Client notes</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[#081624] sm:text-4xl">Clear guidance makes the process feel lighter.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">A few words from clients who wanted a clearer route through verification.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <article key={`${testimonial.authorName}-${testimonial.service}`} className="flex flex-col rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(8,22,36,0.04)]">
              <Quote className="h-5 w-5 text-[#55c99b]" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-6 text-[#294052]">“{testimonial.review}”</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d9f5e8] text-xs font-bold text-[#106a4e]">{initials(testimonial.authorName)}</div>
                <div>
                  <p className="text-sm font-bold text-[#081624]">{testimonial.authorName}</p>
                  <p className="text-xs text-slate-500">{testimonial.country} · {testimonial.service}</p>
                </div>
                <div className="ml-auto flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-[#f2b94b] text-[#f2b94b]" aria-hidden="true" />)}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-400">Individual results depend on provider requirements, eligibility and the information submitted.</p>
      </div>
    </section>
  );
}
