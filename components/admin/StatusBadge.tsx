import type { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: "Pending payment", className: "bg-navy-100 text-navy-700" },
  PAYMENT_SUBMITTED: { label: "Awaiting review", className: "bg-amber-100 text-amber-800" },
  APPROVED: { label: "Approved", className: "bg-brand-100 text-brand-700" },
  IN_PROGRESS: { label: "In progress", className: "bg-sky-100 text-sky-800" },
  COMPLETED: { label: "Completed", className: "bg-brand-500 text-white" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}

export const ALL_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_SUBMITTED",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export const STATUS_LABEL: Record<OrderStatus, string> = Object.fromEntries(
  (Object.entries(STATUS_META) as [OrderStatus, { label: string }][]).map(([k, v]) => [
    k,
    v.label,
  ])
) as Record<OrderStatus, string>;
