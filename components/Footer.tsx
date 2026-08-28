import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";
import { quoteMessage, siteConfig, whatsappLink } from "@/lib/config";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: "Documents", href: "/documents" },
      { label: "Guides", href: "/guides" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Get a quote", href: whatsappLink(quoteMessage), external: true },
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
    <footer className="bg-[#06111d] text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="w-fit rounded-xl bg-white px-3 py-2"><Logo /></div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Payment gateway verification and compliance consultancy for freelancers, agencies and online businesses working across borders.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" aria-label="SwiftVerify on Telegram" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:border-brand-300/50 hover:bg-brand-300/10 hover:text-brand-200"><Send className="h-4 w-4" /></a>
              <a href={whatsappLink(quoteMessage)} target="_blank" rel="noopener noreferrer" aria-label="SwiftVerify on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:border-brand-300/50 hover:bg-brand-300/10 hover:text-brand-200"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white">{column.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white">{link.label}<ArrowUpRight className="h-3.5 w-3.5" /></a>
                    ) : (
                      <Link href={link.href} className="text-slate-400 transition-colors hover:text-white">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <p className="font-display text-sm font-bold text-white">Practical guidance in your inbox</p>
            <p className="mt-1 text-sm text-slate-400">Verification tips, document checklists and payment-platform updates.</p>
            <div className="mt-4"><Newsletter variant="dark" /></div>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
