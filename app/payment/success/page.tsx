import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ArrowLeft, Receipt } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { db, isDbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Payment Successful" };
export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let serviceName: string | null = null;
  let amountUSD: number | null = null;
  let orderRef: string | null = null;
  let receiptUrl: string | null = null;

  if (sessionId && stripeConfigured) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent.latest_charge"],
      });
      paid = session.payment_status === "paid";
      amountUSD = session.amount_total != null ? session.amount_total / 100 : null;

      const pi = session.payment_intent;
      if (pi && typeof pi !== "string") {
        const charge = pi.latest_charge;
        if (charge && typeof charge !== "string") {
          receiptUrl = charge.receipt_url ?? null;
        }
      }

      if (isDbConfigured) {
        const order = await db.stripeOrder.findUnique({ where: { stripeSessionId: sessionId } });
        if (order) {
          serviceName = order.serviceName;
          orderRef = order.id.slice(-8);
        }
      }
    } catch (err) {
      console.error("[stripe] failed to verify checkout session:", err);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
          {paid ? (
            <>
              <CheckCircle2 className="h-14 w-14 text-brand-500" />
              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Payment Successful
              </h1>
              <p className="mt-3 text-lg text-navy-600">
                Thank you for choosing SwiftVerify. Your payment has been received
                successfully. Our team will begin processing your order shortly.
              </p>

              <div className="mt-8 w-full space-y-3 rounded-2xl border border-navy-100 bg-white p-6 text-left">
                {serviceName && (
                  <Row label="Service" value={serviceName} />
                )}
                {orderRef && <Row label="Order reference" value={`#${orderRef}`} />}
                {amountUSD != null && <Row label="Amount paid" value={`$${amountUSD.toFixed(2)}`} />}
              </div>

              {receiptUrl && (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Receipt className="h-4 w-4" /> View Stripe receipt
                </a>
              )}

              <p className="mt-6 text-sm text-navy-500">
                A confirmation email with your receipt is on its way — check your inbox
                (and spam folder) shortly.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Confirming your payment…
              </h1>
              <p className="mt-3 text-lg text-navy-600">
                We couldn&apos;t immediately verify this payment. If you were charged, our
                team will confirm it shortly — you&apos;ll get an email once it&apos;s
                verified. If anything looks wrong, contact us and we&apos;ll help right away.
              </p>
            </>
          )}

          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-navy-500">{label}</span>
      <span className="font-semibold text-navy-900">{value}</span>
    </div>
  );
}
