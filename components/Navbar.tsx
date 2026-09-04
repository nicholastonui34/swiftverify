"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ConsultationButton } from "./ConsultationModal";

const navLinks = [{ href: "/#services", label: "Services" }, { href: "/#legal", label: "Legal & Compliance" }];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#081624]/95 backdrop-blur-xl"><nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8"><Logo light /><div className="hidden items-center gap-8 lg:flex">{navLinks.map((link) => <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">{link.label}</a>)}<ConsultationButton className="rounded-full bg-brand-400 px-5 py-2.5 text-sm font-bold text-[#081624] transition hover:-translate-y-0.5 hover:bg-brand-300">Book consultation <span className="font-medium">(Ksh 2,000/hr)</span></ConsultationButton></div><button type="button" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-slate-200 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></nav>{open && <div className="border-t border-white/10 bg-[#081624] lg:hidden"><div className="space-y-1 px-5 py-4 sm:px-8">{navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/10">{link.label}</a>)}<ConsultationButton className="mt-2 block w-full rounded-full bg-brand-400 px-5 py-3 text-center text-base font-bold text-[#081624]">Book consultation (Ksh 2,000/hr)</ConsultationButton></div></div>}</header>;
}
