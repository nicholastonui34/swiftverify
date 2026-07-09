import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { PaymentPanel } from "@/components/PaymentPanel";
import { db, isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/lib/config";
import { formatKES } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment" };
export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  if (!isDbConfigured) notFound();

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { service: true, client: true },
  });
  if (!order) notFound();

  const alreadySubmitted = order.status !== "PENDING_PAYMENT";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to services
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Complete your payment
          </h1>

          {/* Order summary */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-navy-100 bg-white p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-navy-400">Order</p>
              <p className="font-semibold text-navy-900">{order.service.name}</p>
              <p className="text-xs text-navy-500">
                #{order.id.slice(-8)} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-KE")}
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-navy-900">
              {formatKES(order.priceKES)}
            </p>
          </div>

          <div className="mt-6">
            <PaymentPanel
              orderId={order.id}
              amountKES={order.priceKES}
              till={siteConfig.mpesaTill}
              merchantName={siteConfig.mpesaMerchantName}
              alreadySubmitted={alreadySubmitted}
            />
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-navy-500">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            Your receipt is reviewed manually by our team — usually within a few hours.
          </p>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
