"use client";

import { useEffect, useState } from "react";
import { tips as defaultTips } from "@/lib/content";

/**
 * Top ad banner that rotates through tips every 5 seconds. The tip list can be
 * overridden from the DB (admin Settings → "current banner tip"); falls back to
 * the static tips when no prop is passed.
 */
export function AnnouncementBanner({ tips = defaultTips }: { tips?: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tips.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % tips.length);
    }, 5000);
    return () => clearInterval(id);
  }, [tips.length]);

  return (
    <div className="bg-navy-800 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2.5 text-center text-sm">
        <p key={index} className="animate-[fadeIn_0.6s_ease] font-medium text-navy-50">
          {tips[index]}
        </p>
        <a
          href="#tips"
          className="hidden shrink-0 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-600 sm:inline-block"
        >
          Learn more
        </a>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
