import { Newspaper, Send } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Newsletter } from "./Newsletter";

export function BreakingNews() {
  return (
    <section id="tips" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-navy-100 bg-gradient-to-br from-navy-50 to-brand-50 p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold text-white">
            <Newspaper className="h-3.5 w-3.5" />
            Breaking News
          </div>

          <h2 className="mt-5 max-w-2xl font-display text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
            The best bank to withdraw from Payoneer in 2026
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-navy-600">
            Discover which African banks process Payoneer withdrawals fastest —
            some in hours, not days. We&apos;re sharing the full guide with our
            newsletter subscribers and Telegram community.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="max-w-md">
              <Newsletter />
              <p className="mt-2 text-xs text-navy-500">
                Get the full tip by email. No spam — unsubscribe anytime.
              </p>
            </div>

            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-navy-800 underline-offset-4 hover:underline"
            >
              <Send className="h-4 w-4" />
              Or join our Telegram community for daily tips
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
