"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { quoteMessage, whatsappLink } from "@/lib/config";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#081624]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo light />

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={whatsappLink(quoteMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-400 px-5 py-2.5 text-sm font-bold text-[#081624] shadow-[0_0_24px_rgba(94,231,180,0.2)] transition-all hover:-translate-y-0.5 hover:bg-brand-300"
          >
            Get a quote
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#081624] lg:hidden">
          <div className="space-y-1 px-5 py-4 sm:px-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="block rounded-xl px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}
            <a
              href={whatsappLink(quoteMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="mt-2 block rounded-full bg-brand-400 px-5 py-3 text-center text-base font-bold text-[#081624]"
            >
              Get a quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
