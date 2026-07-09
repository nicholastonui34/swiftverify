"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import {
  Check,
  X,
  Play,
  CheckCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react";
import {
  approveOrder,
  rejectOrder,
  completeOrder,
  markInProgress,
  saveOrderNotes,
  type ActionResult,
} from "@/app/admin/actions";

export function OrderActions({
  orderId,
  status,
  initialNotes,
}: {
  orderId: string;
  status: OrderStatus;
  initialNotes: string;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState(initialNotes);

  const run = (fn: () => Promise<ActionResult>) =>
    startTransition(async () => {
      const r = await fn();
      setResult(r);
      if (r.ok && showReject) setShowReject(false);
    });

  const canApprove = status === "PAYMENT_SUBMITTED";
  const canProgress = status === "APPROVED";
  const canComplete = status === "APPROVED" || status === "IN_PROGRESS";
  const canCancel = !["COMPLETED", "CANCELLED"].includes(status);
  const terminal = status === "COMPLETED" || status === "CANCELLED";

  return (
    <div className="space-y-4">
      {result && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
            result.ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {result.message ?? result.error}
        </div>
      )}

      {terminal ? (
        <p className="rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-500">
          This order is {status === "COMPLETED" ? "completed" : "cancelled"} — no further
          actions.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {canApprove && (
            <ActionButton
              onClick={() => run(() => approveOrder(orderId))}
              disabled={pending}
              variant="primary"
            >
              <Check className="h-4 w-4" /> Approve payment
            </ActionButton>
          )}
          {canProgress && (
            <ActionButton
              onClick={() => run(() => markInProgress(orderId))}
              disabled={pending}
              variant="sky"
            >
              <Play className="h-4 w-4" /> Mark in progress
            </ActionButton>
          )}
          {canComplete && (
            <ActionButton
              onClick={() => run(() => completeOrder(orderId))}
              disabled={pending}
              variant="primary"
            >
              <CheckCheck className="h-4 w-4" /> Mark complete
            </ActionButton>
          )}
          {canCancel && (
            <ActionButton
              onClick={() => setShowReject((v) => !v)}
              disabled={pending}
              variant="danger"
            >
              <X className="h-4 w-4" /> Reject & refund
            </ActionButton>
          )}
          {pending && <Loader2 className="h-5 w-5 animate-spin self-center text-navy-400" />}
        </div>
      )}

      {showReject && (
        <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
          <label className="block text-sm font-semibold text-navy-800">
            Reason (included in the client email — optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. M-PESA receipt didn't match the amount."
            className="mt-2 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-500/15"
          />
          <div className="mt-3 flex gap-2">
            <ActionButton
              onClick={() => run(() => rejectOrder(orderId, reason))}
              disabled={pending}
              variant="danger"
            >
              Confirm cancel & refund
            </ActionButton>
            <ActionButton onClick={() => setShowReject(false)} disabled={pending} variant="ghost">
              Keep order
            </ActionButton>
          </div>
        </div>
      )}

      {/* Internal notes */}
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <label className="block text-sm font-semibold text-navy-800">Internal notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Private notes for the team (not emailed to the client)."
          className="mt-2 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
        />
        <ActionButton
          onClick={() => run(() => saveOrderNotes(orderId, notes))}
          disabled={pending}
          variant="ghost"
        >
          <Save className="h-4 w-4" /> Save notes
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "primary" | "danger" | "sky" | "ghost";
}) {
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    sky: "bg-sky-500 text-white hover:bg-sky-600",
    ghost: "mt-3 border border-navy-200 bg-white text-navy-700 hover:bg-navy-50",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${styles}`}
    >
      {children}
    </button>
  );
}
