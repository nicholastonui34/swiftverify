"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/content";

export function HeroContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello SwiftVerify, I would like to make an enquiry.",
      "",
      `Name: ${String(data.get("hero-name") || "").trim()}`,
      `Phone / WhatsApp: ${String(data.get("hero-phone") || "").trim()}`,
      `Service: ${String(data.get("hero-service") || "").trim()}`,
      `Goal: ${String(data.get("hero-goal") || "").trim()}`,
    ].join("\n");

    window.open(`${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <div className="mt-7 border-t border-white/10 pt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-200">Have a question?</p>
          <p className="mt-1 text-sm text-slate-300">Send the basics and we will reply on WhatsApp.</p>
        </div>
        <MessageCircle className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
      </div>
      {submitted ? (
        <div className="mt-4 rounded-xl border border-brand-300/30 bg-brand-300/10 p-4 text-sm leading-6 text-brand-100" role="status">
          Your enquiry is ready in WhatsApp. We look forward to speaking with you.
          <button type="button" onClick={() => setSubmitted(false)} className="ml-2 font-bold text-brand-200 underline underline-offset-4 hover:text-white">Send another</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="hero-name">Full name</label>
            <input id="hero-name" name="hero-name" required placeholder="Full name" autoComplete="name" className="min-h-11 w-full rounded-xl border border-white/15 bg-[#081624]/80 px-3.5 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/20" />
            <label className="sr-only" htmlFor="hero-phone">Phone or WhatsApp number</label>
            <input id="hero-phone" name="hero-phone" required type="tel" placeholder="Phone / WhatsApp" autoComplete="tel" className="min-h-11 w-full rounded-xl border border-white/15 bg-[#081624]/80 px-3.5 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/20" />
          </div>
          <label className="sr-only" htmlFor="hero-service">Service needed</label>
          <select id="hero-service" name="hero-service" required defaultValue="" className="min-h-11 w-full rounded-xl border border-white/15 bg-[#081624]/80 px-3.5 text-sm text-slate-300 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/20">
            <option value="" disabled>What can we help with?</option>
            {services.map((service) => <option key={service.slug} value={service.name}>{service.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="hero-goal">Your goal or question</label>
          <textarea id="hero-goal" name="hero-goal" required rows={2} placeholder="Tell us your goal or question..." className="w-full resize-none rounded-xl border border-white/15 bg-[#081624]/80 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/20" />
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-300 px-4 text-sm font-bold text-[#06131f] shadow-lg shadow-brand-300/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102335]">
            Send enquiry on WhatsApp <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
