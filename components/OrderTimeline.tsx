import type { OrderStatus } from "@prisma/client";
import { Check, Loader2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Ordered happy-path steps. Cancelled is handled separately. */
const STEPS: { key: OrderStatus; label: string; description: string }[] = [
  {
    key: "PENDING_PAYMENT",
    label: "Order placed",
    description: "We received your order and are waiting for payment.",
  },
  {
    key: "PAYMENT_SUBMITTED",
    label: "Payment submitted",
    description: "Your M-PESA receipt is in — our team is reviewing it.",
  },
  {
    key: "APPROVED",
    label: "Payment confirmed",
    description: "Payment verified. We're preparing your verification.",
  },
  {
    key: "IN_PROGRESS",
    label: "In progress",
    description: "We're working through your account verification.",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    description: "All done — your account is verified and ready.",
  },
];

const STEP_INDEX: Record<OrderStatus, number> = {
  PENDING_PAYMENT: 0,
  PAYMENT_SUBMITTED: 1,
  APPROVED: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div>
          <p className="font-semibold text-navy-900">Order cancelled</p>
          <p className="mt-1 text-sm text-navy-600">
            This order was cancelled. If you were charged, contact us and we&apos;ll refund or
            re-check it right away.
          </p>
        </div>
      </div>
    );
  }

  const current = STEP_INDEX[status];

  return (
    <ol className="relative">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === STEPS.length - 1;

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5",
                  done ? "bg-brand-500" : "bg-navy-100"
                )}
                aria-hidden
              />
            )}

            {/* Node */}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                done && "border-brand-500 bg-brand-500 text-white",
                active && "border-brand-500 bg-white text-brand-600",
                !done && !active && "border-navy-200 bg-white text-navy-300"
              )}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : active ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Circle className="h-2.5 w-2.5 fill-current" />
              )}
            </span>

            {/* Text */}
            <div className={cn("pt-0.5", !done && !active && "opacity-60")}>
              <p
                className={cn(
                  "font-semibold",
                  active ? "text-navy-900" : done ? "text-navy-800" : "text-navy-500"
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-sm text-navy-500">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
