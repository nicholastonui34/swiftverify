"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Ticket,
  MessageSquareQuote,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const baseLinks: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/promo", label: "Promo", icon: Ticket },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const superAdminLinks: NavLink[] = [
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  userName,
  userEmail,
  isSuperAdmin,
  signOutAction,
}: {
  userName: string;
  userEmail: string;
  isSuperAdmin: boolean;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = isSuperAdmin ? [...baseLinks, ...superAdminLinks] : baseLinks;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900 px-4 py-3 md:hidden">
        <span className="font-display text-lg font-bold text-white">
          Swift<span className="text-brand-400">Verify</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-navy-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside
        className={cn(
          "flex w-full shrink-0 flex-col bg-navy-900 text-navy-100 md:w-64",
          open ? "block" : "hidden md:flex"
        )}
      >
        <div className="hidden items-center gap-2 px-6 py-5 md:flex">
          <span className="font-display text-xl font-bold text-white">
            Swift<span className="text-brand-400">Verify</span>
          </span>
          <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-300">
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-3">
          {links.map((l) => {
            const active = isActive(l.href, l.exact);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-500 text-white"
                    : "text-navy-100 hover:bg-navy-800 hover:text-white"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-800 px-3 py-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5" /> View live site
          </Link>

          <div className="mt-2 rounded-xl bg-navy-800/60 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="truncate text-xs text-navy-300">{userEmail}</p>
            <form action={signOutAction} className="mt-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-600"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
