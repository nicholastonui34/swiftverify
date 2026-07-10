"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getServiceBySlug, getPromoState, priceFor } from "@/lib/data";
import {
  sendOrderConfirmation,
  sendPaymentReceived,
  sendPaymentSubmittedToAdmin,
} from "@/lib/email";
import { notifyTelegram, tgEscape } from "@/lib/telegram";
import { formatKES } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RECEIPT_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type OrderFormState = { error?: string };

export async function createOrder(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const serviceSlug = String(formData.get("service") ?? "").trim();
  const terms = formData.get("terms") === "on";

  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (!serviceSlug) return { error: "Please choose a service." };
  if (!terms) return { error: "Please accept the terms to continue." };

  const service = await getServiceBySlug(serviceSlug);
  if (!service) return { error: "That service is no longer available." };

  const promo = await getPromoState();
  const priceKES = priceFor(service, promo);
  const usedPromo = promo.active && service.isPromoEligible;

  // Resolve the Service row id (data layer returns the domain shape, not the row).
  const serviceRow = await db.service.findUnique({ where: { slug: service.slug } });
  if (!serviceRow) return { error: "That service is no longer available." };

  const user = await db.user.upsert({
    where: { email },
    update: { name, phone: phone || undefined, country: country || undefined },
    create: { email, name, phone: phone || null, country: country || null },
  });

  const order = await db.order.create({
    data: {
      clientId: user.id,
      serviceId: serviceRow.id,
      priceKES,
      status: "PENDING_PAYMENT",
      ...(usedPromo ? { promo: { create: { usedPromoCode: true } } } : {}),
    },
  });

  await sendOrderConfirmation({
    to: email,
    name,
    orderId: order.id,
    serviceName: service.name,
    priceKES,
  });

  await notifyTelegram(
    `🆕 <b>New order</b>\n${tgEscape(name)} — ${tgEscape(service.name)}\n${formatKES(
      priceKES
    )}${usedPromo ? " (promo)" : ""}\nOrder #${order.id.slice(-8)}`
  );

  redirect(`/order/${order.id}/payment`);
}

export type PaymentFormState = { error?: string; success?: boolean };

export async function submitPayment(
  _prev: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const orderId = String(formData.get("orderId") ?? "");
  const mpesaPhone = String(formData.get("mpesaPhone") ?? "").trim();
  const file = formData.get("receipt");

  if (!orderId) return { error: "Missing order." };
  if (!mpesaPhone) return { error: "Enter the phone number that sent the M-PESA payment." };
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please upload your M-PESA receipt image." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Receipt must be a JPG, PNG or WEBP image." };
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return { error: "Receipt image must be under 4 MB." };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { client: true, service: true },
  });
  if (!order) return { error: "Order not found." };

  // Store the receipt as a base64 data URL (serverless-friendly; no blob store
  // needed for MVP volume). Phase 2+ can swap to Vercel Blob.
  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;

  await db.order.update({
    where: { id: orderId },
    data: {
      mpesaProofUrl: dataUrl,
      mpesaPhone,
      status: order.status === "PENDING_PAYMENT" ? "PAYMENT_SUBMITTED" : order.status,
    },
  });

  await Promise.all([
    sendPaymentReceived({
      to: order.client.email,
      name: order.client.name ?? "there",
      orderId: order.id,
    }),
    sendPaymentSubmittedToAdmin({
      orderId: order.id,
      clientName: order.client.name ?? order.client.email,
      clientEmail: order.client.email,
      serviceName: order.service.name,
      mpesaPhone,
    }),
    notifyTelegram(
      `💰 <b>Payment proof submitted</b>\n${tgEscape(
        order.client.name ?? order.client.email
      )} — ${tgEscape(order.service.name)}\nFrom ${tgEscape(
        mpesaPhone
      )}\nReview order #${order.id.slice(-8)}`
    ),
  ]);

  revalidatePath(`/order/${orderId}/payment`);
  return { success: true };
}
