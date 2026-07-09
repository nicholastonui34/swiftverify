import Link from "next/link";
import type { Metadata } from "next";
import type { OrderStatus } from "@prisma/client";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { getOrders } from "@/lib/admin";
import { formatKES, cn } from "@/lib/utils";
import { StatusBadge, ALL_STATUSES, STATUS_LABEL } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

function isStatus(v: string | undefined): v is OrderStatus {
  return !!v && (ALL_STATUSES as string[]).includes(v);
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = isStatus(sp.status) ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { orders, total, pageSize } = await getOrders({ status, page });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };
  const filterHref = (s?: OrderStatus) =>
    s ? `/admin/orders?status=${s}` : "/admin/orders";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-navy-500">{total} order{total === 1 ? "" : "s"} total.</p>
      </header>

      {/* Status filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip href={filterHref()} active={!status}>
          All
        </FilterChip>
        {ALL_STATUSES.map((s) => (
          <FilterChip key={s} href={filterHref(s)} active={status === s}>
            {STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-sm text-navy-500">No orders match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-navy-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Proof</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
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
                      {o.promo && (
                        <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600">
                          PROMO
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy-500">
                      {new Date(o.createdAt).toLocaleDateString("en-KE", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-navy-800">
                        {o.client.name ?? "—"}
                      </span>
                      <span className="block text-xs text-navy-400">{o.client.email}</span>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{o.service.name}</td>
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      {formatKES(o.priceKES)}
                    </td>
                    <td className="px-4 py-3">
                      {o.mpesaProofUrl ? (
                        <ImageIcon className="h-4 w-4 text-brand-500" />
                      ) : (
                        <span className="text-xs text-navy-300">—</span>
                      )}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-navy-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <PageLink href={pageHref(page - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </PageLink>
            <PageLink href={pageHref(page + 1)} disabled={page >= totalPages}>
              Next <ChevronRight className="h-4 w-4" />
            </PageLink>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50"
      )}
    >
      {children}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-navy-100 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-300">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
    >
      {children}
    </Link>
  );
}
