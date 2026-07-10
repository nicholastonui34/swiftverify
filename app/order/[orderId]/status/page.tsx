import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CreditCard, MessageCircle, LifeBuoy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { OrderTimeline } from "@/components/OrderTimeline";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getOrderStatus } from "@/lib/data";
import { siteConfig } from "@/lib/config";
import { formatKES } from "@/lib/utils";

export const metadata: Metadata = { title: "Order status", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderStatus(orderId);
  if (!order) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Track another order
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {order.firstName ? `Hi ${order.firstName}, ` : ""}here&apos;s your order
            </h1>
            <StatusBadge status={order.status} />
          </div>

          {/* Order summary */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-navy-100 bg-white p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-navy-400">Order</p>
              <p className="font-semibold text-navy-900">{order.serviceName}</p>
              <p className="text-xs text-navy-500">
                #{order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString("en-KE")}
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-navy-900">
              {formatKES(order.priceKES)}
            </p>
          </div>

          {/* Contextual CTA */}
          <ContextualCta status={order.status} orderId={order.id} />

          {/* Timeline */}
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6">
            <h2 className="mb-5 font-display text-lg font-bold text-navy-900">Progress</h2>
            <OrderTimeline status={order.status} />
          </div>

          <p className="mt-6 text-center text-xs text-navy-500">
            Questions about your order? Reach us on{" "}
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 hover:underline"
            >
              Telegram
            </a>{" "}
            or{" "}
            <a href={`mailto:${siteConfig.supportEmail}`} className="font-medium text-brand-600 hover:underline">
              email
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function ContextualCta({ status, orderId }: { status: string; orderId: string }) {
  if (status === "PENDING_PAYMENT") {
    return (
      <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <p className="text-sm text-navy-700">
            We&apos;re waiting for your M-PESA payment to get started.
          </p>
        </div>
        <Link
          href={`/order/${orderId}/payment`}
          className="shrink-0 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Complete payment
        </Link>
      </div>
    );
  }
  if (status === "COMPLETED") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <p className="text-sm text-navy-700">
          🎉 Your verification is complete! If we earned it, a quick review on Telegram means a
          lot — we may feature it on the site.
        </p>
      </div>
    );
  }
  if (status === "CANCELLED") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-5">
        <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />
        <p className="text-sm text-navy-700">
          This order was cancelled. If you believe this is a mistake or were charged, contact us
          and we&apos;ll sort it out.
        </p>
      </div>
    );
  }
  return null;
}
