import Link from "next/link";
import type { Metadata } from "next";
import type { OrderStatus } from "@prisma/client";
import { ChevronLeft, ChevronRight, ImageIcon, Search, X, Check } from "lucide-react";
import { getOrders } from "@/lib/admin";
import { bulkApproveOrders } from "@/app/admin/actions";
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
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = isStatus(sp.status) ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = sp.q?.trim() || undefined;

  const { orders, total, pageSize } = await getOrders({ status, page, query });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const approvable = orders.filter((o) => o.status === "PAYMENT_SUBMITTED");

  const buildHref = (over: { status?: OrderStatus | null; page?: number }) => {
    const params = new URLSearchParams();
    const s = over.status === null ? undefined : over.status ?? status;
    if (s) params.set("status", s);
    if (query) params.set("q", query);
    const p = over.page ?? 1;
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-navy-500">
          {total} order{total === 1 ? "" : "s"}
          {query ? ` matching “${query}”` : status ? "" : " total"}.
        </p>
      </header>

      {/* Search */}
      <form method="get" action="/admin/orders" className="mb-4 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search by order ID, name, email or phone…"
            className="w-full rounded-full border border-navy-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy-900 outline-none placeholder-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
        >
          Search
        </button>
        {query && (
          <Link
            href={buildHref({ page: 1 })}
            className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
          >
            <X className="h-4 w-4" /> Clear
          </Link>
        )}
      </form>

      {/* Status filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip href={buildHref({ status: null })} active={!status}>
          All
        </FilterChip>
        {ALL_STATUSES.map((s) => (
          <FilterChip key={s} href={buildHref({ status: s })} active={status === s}>
            {STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      {/* Bulk actions + table share one form so checkboxes post together. */}
      <form action={bulkApproveOrders}>
        {approvable.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <p className="text-sm text-navy-700">
              {approvable.length} order{approvable.length === 1 ? "" : "s"} awaiting review on this
              page.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <Check className="h-4 w-4" /> Approve selected
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          {orders.length === 0 ? (
            <p className="p-10 text-center text-sm text-navy-500">No orders match this view.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-navy-400">
                  <tr>
                    <th className="w-10 px-4 py-3" />
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
                        {o.status === "PAYMENT_SUBMITTED" ? (
                          <input
                            type="checkbox"
                            name="ids"
                            value={o.id}
                            aria-label={`Select order ${o.id.slice(-8)}`}
                            className="h-4 w-4 rounded border-navy-300 text-brand-500 focus:ring-brand-500"
                          />
                        ) : null}
                      </td>
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
      </form>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-navy-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <PageLink href={buildHref({ page: page - 1 })} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </PageLink>
            <PageLink href={buildHref({ page: page + 1 })} disabled={page >= totalPages}>
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
