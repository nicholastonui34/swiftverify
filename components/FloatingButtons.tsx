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
        className="group grid h-13 w-13 place-items-center rounded-full bg-[#229ED9] p-3.5 text-white shadow-lg shadow-[#229ED9]/30 transition-transform hover:scale-105"
      >
        <Send className="h-6 w-6" />
      </a>
      <a
        href={siteConfig.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
