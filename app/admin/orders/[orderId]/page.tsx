import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Mail, Phone, Globe, Smartphone, Calendar, Download } from "lucide-react";
import { getOrderById } from "@/lib/admin";
import { formatKES } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderActions } from "@/components/admin/OrderActions";

export const metadata: Metadata = { title: "Order detail" };
export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">
            Order <span className="font-mono">#{order.id.slice(-8)}</span>
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-500">
            <Calendar className="h-4 w-4" />
            {new Date(order.createdAt).toLocaleString("en-KE")}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: summary + client + proof */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Order summary">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Service">{order.service.name}</Field>
              <Field label="Amount">
                <span className="font-display text-lg font-bold text-navy-900">
                  {formatKES(order.priceKES)}
                </span>
              </Field>
              <Field label="Promo used">{order.promo ? "Yes — promo price" : "No"}</Field>
              <Field label="Payment method">{paymentMethodLabel(order.paymentMethod)}</Field>
              <Field label="Approved at">
                {order.approvedAt
                  ? new Date(order.approvedAt).toLocaleDateString("en-KE")
                  : "—"}
              </Field>
            </dl>
          </Card>

          <Card title="Client">
            <div className="space-y-2 text-sm">
              <p className="text-base font-semibold text-navy-900">
                {order.client.name ?? "Unnamed client"}
              </p>
              <ContactRow icon={Mail}>
                <a href={`mailto:${order.client.email}`} className="text-brand-600 hover:underline">
                  {order.client.email}
                </a>
              </ContactRow>
              {order.client.phone && (
                <ContactRow icon={Phone}>{order.client.phone}</ContactRow>
              )}
              {order.client.country && (
                <ContactRow icon={Globe}>{order.client.country}</ContactRow>
              )}
              {order.mpesaPhone && (
                <ContactRow icon={Smartphone}>
                  Paid from <span className="font-medium text-navy-800">{order.mpesaPhone}</span>
                </ContactRow>
              )}
            </div>
          </Card>

          <Card title="Payment proof">
            {order.mpesaProofUrl ? (
              <div>
                <a href={order.mpesaProofUrl} target="_blank" rel="noopener noreferrer">
                  {/* Base64 data URL — next/image can't optimise it, plain img is correct. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.mpesaProofUrl}
                    alt="M-PESA receipt"
                    className="max-h-[28rem] w-auto rounded-xl border border-navy-100"
                  />
                </a>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-xs text-navy-400">Click image to open full size</span>
                  <a
                    href={order.mpesaProofUrl}
                    download={`mpesa-proof-${order.id.slice(-8)}.${proofExtension(
                      order.mpesaProofUrl
                    )}`}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-navy-200 px-3.5 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </div>
              </div>
            ) : (
              <p className="rounded-xl bg-navy-50 px-4 py-6 text-center text-sm text-navy-500">
                No receipt uploaded yet.
              </p>
            )}
          </Card>
        </div>

        {/* Right: actions */}
        <div className="lg:col-span-1">
          <Card title="Actions">
            <OrderActions
              orderId={order.id}
              status={order.status}
              initialNotes={order.notes ?? ""}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function paymentMethodLabel(method: string): string {
  switch (method) {
    case "USDT_TRC20":
      return "USDT (TRC20)";
    case "BINANCE_PAY":
      return "Binance Pay";
    default:
      return "M-PESA";
  }
}

/** Infer a download file extension from a `data:image/...` URL's mime type. */
function proofExtension(dataUrl: string): string {
  const match = /^data:image\/(\w+);/.exec(dataUrl);
  const type = match?.[1] ?? "jpg";
  return type === "jpeg" ? "jpg" : type;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-navy-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-navy-400">{label}</dt>
      <dd className="mt-1 text-navy-800">{children}</dd>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-navy-600">
      <Icon className="h-4 w-4 text-navy-400" />
      {children}
    </p>
  );
}
