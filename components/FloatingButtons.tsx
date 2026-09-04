"use client";

import { MessageCircle, Send } from "lucide-react";
import { siteConfig } from "@/lib/config";

/** Floating WhatsApp + Telegram buttons, fixed bottom-right on all pages. */
export function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={siteConfig.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on Telegram"
        className="group relative grid h-13 w-13 place-items-center rounded-full bg-[#229ED9] p-3.5 text-white shadow-lg shadow-[#229ED9]/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06111d]"
      >
        <Send className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#06111d] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-visible:block">Join Telegram</span>
      </a>
      <a
        href={siteConfig.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06111d]"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#06111d] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-visible:block">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
