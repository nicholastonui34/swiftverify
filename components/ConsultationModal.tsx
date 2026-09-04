"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, MessageCircle, X } from "lucide-react";
import { services } from "@/lib/content";
import { siteConfig } from "@/lib/config";

type ConsultationModalProps = { open: boolean; onClose: () => void; initialAction: "paid" | "quote" };

export function ConsultationModal({ open, onClose, initialAction }: ConsultationModalProps) {
  const [action, setAction] = useState(initialAction);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actionLabel = action === "paid" ? "book a paid consultation (Ksh 2,000/hr)" : "request a free quote";
    const message = [
      `Hello SwiftVerify, I want to ${actionLabel}.`, "",
      `Name: ${String(data.get("name") || "").trim()}`,
      `Phone / WhatsApp: ${String(data.get("phone") || "").trim()}`,
      `Service: ${String(data.get("service") || "").trim()}`,
      `Details: ${String(data.get("details") || "").trim()}`,
    ].join("\n");
    window.open(`${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#06111d]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="consultation-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Start a conversation</p><h2 id="consultation-title" className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[#081624]">Book a consultation</h2><p className="mt-2 text-sm leading-6 text-slate-600">Share the basics and we will open a pre-filled WhatsApp message for a direct response.</p></div><button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#081624]" aria-label="Close consultation form"><X className="h-5 w-5" /></button></div>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#eef6f1] p-1 text-sm font-bold"><button type="button" onClick={() => setAction("paid")} className={`rounded-lg px-3 py-3 transition ${action === "paid" ? "bg-[#081624] text-white shadow-sm" : "text-[#315346]"}`}>Paid consultation<br /><span className="text-xs font-medium opacity-80">Ksh 2,000/hr</span></button><button type="button" onClick={() => setAction("quote")} className={`rounded-lg px-3 py-3 transition ${action === "quote" ? "bg-[#081624] text-white shadow-sm" : "text-[#315346]"}`}>Request free quote</button></div>
        <form onSubmit={submit} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#081624]">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="Your name" /></label><label className="text-sm font-semibold text-[#081624]">Phone / WhatsApp number<input required name="phone" type="tel" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="+254..." /></label></div><label className="block text-sm font-semibold text-[#081624]">Service required<select required name="service" defaultValue="" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15"><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.slug} value={service.name}>{service.name}</option>)}</select></label><label className="block text-sm font-semibold text-[#081624]">Specific issue or goal<textarea required name="details" rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#14845e] focus:ring-2 focus:ring-[#14845e]/15" placeholder="Tell us what you are trying to achieve..." /></label><button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#14845e] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f704f]"><MessageCircle className="h-4 w-4" /> Continue on WhatsApp</button><p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#14845e]" />We only advise on authentic, lawful information and client-provided documents.</p></form>
      </div>
    </div>
  );
}

export function ConsultationButton({ action = "paid", children, className = "" }: { action?: "paid" | "quote"; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)} className={className}>{children}</button><ConsultationModal open={open} onClose={() => setOpen(false)} initialAction={action} /></>;
}
