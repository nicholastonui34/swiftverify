import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getOrdersByStatus, getRevenueTrend } from "@/lib/admin";
import { formatKES } from "@/lib/utils";
import { STATUS_LABEL, ALL_STATUSES } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [byStatus, trend] = await Promise.all([getOrdersByStatus(), getRevenueTrend(6)]);

  const maxStatus = Math.max(1, ...ALL_STATUSES.map((s) => byStatus[s]));
  const maxRevenue = Math.max(1, ...trend.map((t) => t.revenueKES));
  const totalRevenue = trend.reduce((sum, t) => sum + t.revenueKES, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-navy-500">Order mix and revenue over the last 6 months.</p>
        </div>
        <a
          href="/admin/analytics/export"
          className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          <Download className="h-4 w-4" /> Export orders CSV
        </a>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders by status */}
        <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-navy-900">Orders by status</h2>
          <div className="mt-5 space-y-3">
            {ALL_STATUSES.map((s) => (
              <div key={s}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-navy-600">{STATUS_LABEL[s]}</span>
                  <span className="font-semibold text-navy-900">{byStatus[s]}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(byStatus[s] / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue trend */}
        <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-navy-900">Revenue trend</h2>
            <span className="text-sm font-semibold text-brand-600">{formatKES(totalRevenue)}</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {trend.map((t) => (
              <div key={t.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-brand-500/90 transition-all hover:bg-brand-600"
                    style={{ height: `${Math.max(4, (t.revenueKES / maxRevenue) * 100)}%` }}
                    title={`${t.month}: ${formatKES(t.revenueKES)} (${t.orders} orders)`}
                  />
                </div>
                <span className="text-[10px] font-medium text-navy-400">{t.month}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-navy-400">
            Revenue counts approved, in-progress and completed orders by approval month.
          </p>
        </section>
      </div>
    </div>
  );
}
