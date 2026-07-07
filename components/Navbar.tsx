"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#tips", label: "Tips" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={siteConfig.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900"
          >
            Telegram
          </a>
          <Link
            href="/order"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            Place Order
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-navy-800 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-navy-700 hover:bg-navy-50"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-brand-500 px-5 py-3 text-center text-base font-semibold text-white"
            >
              Place Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
