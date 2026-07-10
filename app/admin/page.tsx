import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingCart, Clock, CheckCircle2, Banknote, ArrowRight } from "lucide-react";
import { getDashboardMetrics, getRecentOrders } from "@/lib/admin";
import { formatKES } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [metrics, recent] = await Promise.all([getDashboardMetrics(), getRecentOrders(8)]);

  const cards = [
    {
      label: "Orders this month",
      value: metrics.ordersThisMonth.toString(),
      icon: ShoppingCart,
      tint: "text-navy-700 bg-navy-100",
    },
    {
      label: "Pending approvals",
      value: metrics.pendingApprovals.toString(),
      icon: Clock,
      tint: "text-amber-700 bg-amber-100",
      href: "/admin/orders?status=PAYMENT_SUBMITTED",
    },
    {
      label: "Completed",
      value: metrics.completed.toString(),
      icon: CheckCircle2,
      tint: "text-brand-700 bg-brand-100",
    },
    {
      label: "Total revenue",
      value: formatKES(metrics.totalRevenueKES),
      icon: Banknote,
      tint: "text-brand-700 bg-brand-100",
      sub: `${formatKES(metrics.revenueThisMonthKES)} this month`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-navy-500">Overview of orders, revenue and approvals.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-navy-500">{c.label}</p>
                <span className={`rounded-lg p-2 ${c.tint}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-navy-900">{c.value}</p>
              {c.sub && <p className="mt-1 text-xs text-navy-400">{c.sub}</p>}
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>
              {inner}
            </Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-900">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            All orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-navy-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-navy-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {recent.map((o) => (
                    <tr key={o.id} className="hover:bg-navy-50/40">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="font-mono text-xs font-semibold text-brand-600 hover:underline"
                        >
                          #{o.id.slice(-8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-navy-800">
                        {o.client.name ?? o.client.email}
                      </td>
                      <td className="px-4 py-3 text-navy-600">{o.service.name}</td>
                      <td className="px-4 py-3 font-semibold text-navy-900">
                        {formatKES(o.priceKES)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
