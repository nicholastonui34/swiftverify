"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/content";
import { siteConfig } from "@/lib/config";

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z .]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const t = testimonials[index % count];

  return (
    <section id="testimonials" className="scroll-mt-20 bg-navy-800 py-20 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Trusted by sellers across East Africa
        </h2>
        <p className="mt-4 text-lg text-navy-100">
          Real results from real freelancers and sellers.
        </p>

        <div className="relative mt-12">
          <Quote className="mx-auto h-10 w-10 text-brand-400" />

          <blockquote
            key={index}
            className="mx-auto mt-6 max-w-2xl animate-[fadeUp_0.5s_ease] text-xl font-medium leading-relaxed text-white sm:text-2xl"
          >
            “{t.review}”
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < t.rating ? "h-5 w-5 fill-brand-400 text-brand-400" : "h-5 w-5 text-navy-600"
                }
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-sky-brand text-sm font-bold text-navy-900">
              {initials(t.authorName)}
            </div>
            <div className="text-left">
              <p className="font-semibold">{t.authorName}</p>
              <p className="text-sm text-navy-100">
                {t.country} · {t.service}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy-600 text-white transition-colors hover:bg-navy-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-brand-400" : "w-2 bg-navy-600 hover:bg-navy-500"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy-600 text-white transition-colors hover:bg-navy-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <a
          href={siteConfig.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-50"
        >
          Submit your review
        </a>
      </div>

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}
