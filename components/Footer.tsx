import Link from "next/link";
import { Send, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";
import { siteConfig } from "@/lib/config";

const columns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: "Guides", href: "/guides" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: siteConfig.telegram },
      { label: "Place an order", href: "/order" },
      { label: "Track my order", href: "/track" },
      { label: "My account", href: "/account/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="rounded-lg bg-white/95 p-2 w-fit">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
              Payoneer verification &amp; global receiving accounts for East
              African freelancers and sellers.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="grid h-10 w-10 place-items-center rounded-full bg-navy-800 transition-colors hover:bg-brand-500"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-navy-800 transition-colors hover:bg-brand-500"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-navy-200 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-navy-800 pt-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-md">
              <p className="font-display text-sm font-bold text-white">
                Get Payoneer tips in your inbox
              </p>
              <p className="mt-1 text-sm text-navy-200">
                Withdrawal guides, verification tips and platform updates.
              </p>
              <div className="mt-3">
                <Newsletter variant="dark" />
              </div>
            </div>
            <p className="text-xs text-navy-300">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
