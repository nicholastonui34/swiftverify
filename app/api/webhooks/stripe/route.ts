import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db, isDbConfigured } from "@/lib/db";
import { notifyTelegram, tgEscape } from "@/lib/telegram";
import {
  sendStripeOrderConfirmation,
  sendStripeOrderAdminNotification,
  sendStripePaymentFailedAdminNotification,
  sendStripeRefundAdminNotification,
} from "@/lib/email";

/**
 * Stripe webhook endpoint. Signature-verified (never trust an unverified
 * payload) and idempotent (checks current status before writing, so Stripe's
 * at-least-once delivery / retries can't double-process a payment).
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe:webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe:webhook] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (!isDbConfigured) {
    // Nothing to reconcile against — acknowledge so Stripe doesn't retry forever.
    return new Response("ok", { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case "payment_intent.succeeded":
        // Reconciliation for Checkout is driven by checkout.session.completed
        // above; nothing additional to do here.
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe:webhook] failed handling ${event.type}:`, err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const order = await db.stripeOrder.findUnique({ where: { stripeSessionId: session.id } });
  if (!order || order.status === "PAID") return; // idempotent — already processed

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  const updated = await db.stripeOrder.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
    },
  });

  const amountUSD = updated.amountUSD / 100;

  await Promise.all([
    sendStripeOrderConfirmation({
      to: updated.email,
      name: updated.fullName,
      orderId: updated.id,
      serviceName: updated.serviceName,
      amountUSD,
    }),
    sendStripeOrderAdminNotification({
      orderId: updated.id,
      clientName: updated.fullName,
      clientEmail: updated.email,
      serviceName: updated.serviceName,
      amountUSD,
    }),
    notifyTelegram(
      `💳 <b>Stripe payment received</b>\n${tgEscape(updated.fullName)} — ${tgEscape(
        updated.serviceName
      )}\n$${amountUSD.toFixed(2)}\nOrder #${updated.id.slice(-8)}`
    ),
  ]);
}

/** PaymentIntents aren't linked to our StripeOrder row directly (we only store
 *  the Checkout Session id at creation) — look the session up by payment_intent. */
async function findOrderByPaymentIntent(paymentIntentId: string) {
  const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
  const session = sessions.data[0];
  if (!session) return null;
  return db.stripeOrder.findUnique({ where: { stripeSessionId: session.id } });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const order = await findOrderByPaymentIntent(paymentIntent.id);
  if (!order || order.status !== "PENDING") return;

  await db.stripeOrder.update({
    where: { id: order.id },
    data: { status: "FAILED", stripePaymentIntentId: paymentIntent.id },
  });

  await sendStripePaymentFailedAdminNotification({
    orderId: order.id,
    clientEmail: order.email,
    serviceName: order.serviceName,
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  const order = await findOrderByPaymentIntent(paymentIntentId);
  if (!order || order.status === "REFUNDED") return;

  await db.stripeOrder.update({
    where: { id: order.id },
    data: { status: "REFUNDED", receiptUrl: charge.receipt_url ?? order.receiptUrl },
  });

  await sendStripeRefundAdminNotification({
    orderId: order.id,
    clientEmail: order.email,
    serviceName: order.serviceName,
    amountUSD: charge.amount_refunded / 100,
  });
}
