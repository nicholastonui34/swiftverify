"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello SwiftVerify, I would like help with my freelancer or marketplace-seller goal.", "",
      `Name: ${String(data.get("name") || "").trim()}`,
      `Email: ${String(data.get("email") || "").trim()}`,
      `Phone / WhatsApp: ${String(data.get("phone") || "").trim()}`,
      `I am a: ${String(data.get("role") || "").trim()}`,
      `Platform or marketplace: ${String(data.get("platform") || "").trim()}`,
      `What I need help with: ${String(data.get("goal") || "").trim()}`,
    ].join("\n");
    window.open(`${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(8,22,36,0.07)] sm:p-8">{submitted ? <div className="py-12 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#d9f7e8] text-[#14845e]"><Check className="h-7 w-7" /></div><h2 className="mt-6 font-display text-2xl font-semibold text-[#081624]">Your inquiry is ready</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-600">WhatsApp opened with your details. Send the pre-filled message so our team can review your situation.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-sm font-bold text-[#14845e] hover:text-[#081624]">Submit another inquiry</button></div> : <form onSubmit={submit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-[#081624]">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="Your name" /></label><label className="text-sm font-semibold text-[#081624]">Email address<input required name="email" type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="you@example.com" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-[#081624]">Phone / WhatsApp number<input required name="phone" type="tel" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="+254..." /></label><label className="text-sm font-semibold text-[#081624]">I am a<select required name="role" defaultValue="" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15"><option value="" disabled>Select one</option><option>Freelancer</option><option>eBay seller</option><option>Etsy seller</option><option>Other marketplace seller</option></select></label></div><label className="block text-sm font-semibold text-[#081624]">Platform or marketplace <input required name="platform" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="e.g. Payoneer, eBay, Etsy, Upwork" /></label><label className="block text-sm font-semibold text-[#081624]">Tell us what you need help with<textarea required name="goal" rows={5} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="Briefly describe your goal, issue or verification bottleneck..." /></label><button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#14845e] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f704f]"><MessageCircle className="h-4 w-4" /> Continue on WhatsApp <ArrowUpRight className="h-4 w-4" /></button><p className="text-xs leading-5 text-slate-500">Please share only information needed for an initial inquiry. We do not request passwords, one-time codes or fabricated documents.</p></form>}</div>;
}
