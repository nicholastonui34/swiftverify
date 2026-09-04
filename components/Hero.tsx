"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { ConsultationButton } from "./ConsultationModal";

export function Hero() {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      setParallaxOffset(Math.min(window.scrollY * 0.12, 48));
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#081624] text-white">
      <Image
        src="/images/black-man-laptop-hero.jpeg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 55vw"
        quality={70}
        preload
        style={{ transform: `translate3d(0, ${parallaxOffset}px, 0) scale(1.08)` }}
        className="will-change-transform object-cover object-[center_30%] opacity-30 sm:object-[center_38%] lg:object-[center_42%]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,22,36,0.98)_0%,rgba(8,22,36,0.88)_42%,rgba(8,22,36,0.66)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,36,0.82)_0%,rgba(8,22,36,0.2)_34%,rgba(8,22,36,0.92)_100%)]"
        aria-hidden
      />
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-400/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-28 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/35 bg-[#081624]/65 px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-200 shadow-lg shadow-black/10 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Kenya-based global advisory
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(3rem,9vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.055em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.22)] sm:mt-7 sm:text-6xl lg:text-[5.25rem]">
            Build your global work life<span className="text-brand-300"> with clarity.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-7 text-slate-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] sm:mt-7 sm:text-lg sm:leading-8">
            Practical consulting for Kenyan freelancers building remote careers, international payments, compliant business structures, and privacy-aware digital workflows.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <ConsultationButton className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand-300 px-6 text-base font-bold text-[#06131f] shadow-[0_10px_30px_rgba(94,231,180,0.2)] ring-1 ring-brand-200/40 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_34px_rgba(255,255,255,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#081624]">
              Book consultation <span className="font-medium">(Ksh 2,000/hr)</span><ArrowUpRight className="h-4 w-4" />
            </ConsultationButton>
            <a href="#services" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/35 bg-[#081624]/70 px-6 text-base font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081624]">
              Explore services
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-300" /> Ethical, lawful guidance</span>
            <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4 text-brand-300" /> Built for global work</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#081624]/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-200">Your advisory map</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">From local ambition to global opportunity.</h2>
            <div className="mt-7 space-y-3">
              {["Position your remote-work profile", "Choose payment and business rails", "Prepare authentic documents clearly", "Move forward with a compliant plan"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#102335]/90 p-3.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-300/15 text-xs font-bold text-brand-200">0{index + 1}</span><span className="text-sm font-medium text-slate-200">{item}</span><Check className="ml-auto h-4 w-4 text-brand-300" /></div>)}
            </div>
            <div className="mt-6 rounded-2xl bg-brand-300 p-5 text-[#081624]"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#234d43]">One clear next step</p><p className="mt-1 font-display text-xl font-bold">Bring your goal. We will map the route.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
