import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getOrderStatus } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/config";
import { formatKES } from "@/lib/utils";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Receipt", robots: { index: false } };
export const dynamic = "force-dynamic";

const PAID_STATUSES = new Set(["APPROVED", "IN_PROGRESS", "COMPLETED"]);

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const [order, settings] = await Promise.all([getOrderStatus(orderId), getSettings()]);
  if (!order || !PAID_STATUSES.has(order.status)) notFound();

  const issuedOn = order.approvedAt ?? order.createdAt;

  return (
    <main className="min-h-screen bg-navy-50/60 py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-xl px-4 print:max-w-none print:px-0">
        <div className="mb-5 flex items-center justify-between print:hidden">
          <Link
            href={`/order/${orderId}/status`}
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to order
          </Link>
          <PrintButton />
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <div className="flex items-center justify-between border-b border-dashed border-navy-200 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/swiftverify-logo.jpg" alt="SwiftVerify" fill sizes="40px" className="object-cover" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-navy-900">
                Swift<span className="text-brand-500">Verify</span>
              </span>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Payment confirmed
              </p>
            </div>
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">Payment receipt</h1>
          <p className="text-sm text-navy-500">
            Receipt #{order.id.slice(-8).toUpperCase()} ·{" "}
            {new Date(issuedOn).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <dl className="mt-6 divide-y divide-navy-100 text-sm">
            <Row label="Client">{order.firstName ?? "Valued client"}</Row>
            <Row label="Service">{order.serviceName}</Row>
            <Row label="Amount paid">{formatKES(order.priceKES)}</Row>
            <Row label="Payment method">M-PESA Buy Goods</Row>
            <Row label="Till number">
              {settings.mpesaTill} ({settings.mpesaMerchantName})
            </Row>
            <Row label="Order placed">{new Date(order.createdAt).toLocaleDateString("en-KE")}</Row>
          </dl>

          <p className="mt-8 border-t border-dashed border-navy-200 pt-6 text-center text-xs text-navy-500">
            Issued by {siteConfig.name} · {siteConfig.url.replace("https://", "")}
            <br />
            Questions about this receipt? Email {siteConfig.supportEmail}
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-navy-500">{label}</dt>
      <dd className="font-semibold text-navy-900">{children}</dd>
    </div>
  );
}
