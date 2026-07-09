import Link from "next/link";
import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { getPromoData } from "@/lib/admin";
import { formatKES } from "@/lib/utils";
import { PromoResetButton } from "@/components/admin/PromoResetButton";

export const metadata: Metadata = { title: "Promo" };
export const dynamic = "force-dynamic";

export default async function PromoPage() {
  const { used, limit, orders } = await getPromoData();
  const remaining = Math.max(limit - used, 0);
  const pct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
          First-10 promo
        </h1>
        <p className="mt-1 text-sm text-navy-500">
          The landing page shows this live count. Reset it to run a new promo round.
        </p>
      </header>

      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-100 p-2.5 text-brand-700">
              <Ticket className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-3xl font-bold text-navy-900">
                {used}
                <span className="text-lg text-navy-400">/{limit}</span>
              </p>
              <p className="text-sm text-navy-500">
                {remaining > 0 ? `${remaining} promo slots left` : "Promo is full"}
              </p>
            </div>
          </div>
          <PromoResetButton />
        </div>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Promo orders</h2>
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          {orders.length === 0 ? (
            <p className="p-8 text-center text-sm text-navy-500">No promo orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-navy-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {orders.map((o) => (
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
                      <td className="whitespace-nowrap px-4 py-3 text-navy-500">
                        {new Date(o.createdAt).toLocaleDateString("en-KE")}
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
