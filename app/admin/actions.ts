"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateSettings, type SiteSettings } from "@/lib/settings";
import {
  sendOrderApproved,
  sendOrderRejected,
  sendOrderCompleted,
} from "@/lib/email";

/** Throw unless the current session belongs to an ADMIN. Every action calls this. */
async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized.");
  }
  return session;
}

export type ActionResult = { ok: boolean; error?: string; message?: string };

// ---- Orders ---------------------------------------------------------------

async function loadOrderForAction(orderId: string) {
  return db.order.findUnique({
    where: { id: orderId },
    include: { client: true, service: true },
  });
}

export async function approveOrder(orderId: string): Promise<ActionResult> {
  await requireAdmin();
  const order = await loadOrderForAction(orderId);
  if (!order) return { ok: false, error: "Order not found." };

  await db.order.update({
    where: { id: orderId },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
  await sendOrderApproved({
    to: order.client.email,
    name: order.client.name ?? "there",
    orderId: order.id,
    serviceName: order.service.name,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { ok: true, message: "Order approved — client notified." };
}

export async function rejectOrder(orderId: string, reason?: string): Promise<ActionResult> {
  await requireAdmin();
  const order = await loadOrderForAction(orderId);
  if (!order) return { ok: false, error: "Order not found." };

  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", notes: reason?.trim() || order.notes },
  });
  await sendOrderRejected({
    to: order.client.email,
    name: order.client.name ?? "there",
    orderId: order.id,
    reason: reason?.trim() || undefined,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { ok: true, message: "Order cancelled & refund email sent." };
}

export async function completeOrder(orderId: string): Promise<ActionResult> {
  await requireAdmin();
  const order = await loadOrderForAction(orderId);
  if (!order) return { ok: false, error: "Order not found." };

  await db.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" },
  });
  await sendOrderCompleted({
    to: order.client.email,
    name: order.client.name ?? "there",
    orderId: order.id,
    serviceName: order.service.name,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { ok: true, message: "Order marked complete — review request sent." };
}

export async function markInProgress(orderId: string): Promise<ActionResult> {
  await requireAdmin();
  const order = await loadOrderForAction(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  await db.order.update({ where: { id: orderId }, data: { status: "IN_PROGRESS" } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true, message: "Order moved to in progress." };
}

export async function saveOrderNotes(orderId: string, notes: string): Promise<ActionResult> {
  await requireAdmin();
  await db.order.update({ where: { id: orderId }, data: { notes: notes.trim() || null } });
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true, message: "Notes saved." };
}

/**
 * Bulk-approve the selected orders. Bound directly to a <form>, so it receives
 * FormData with repeated `ids` fields. Only PAYMENT_SUBMITTED orders are
 * affected; each approved order emails its client.
 */
export async function bulkApproveOrders(formData: FormData): Promise<void> {
  await requireAdmin();
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (ids.length === 0) return;

  const orders = await db.order.findMany({
    where: { id: { in: ids }, status: "PAYMENT_SUBMITTED" },
    include: { client: true, service: true },
  });
  if (orders.length === 0) return;

  await db.order.updateMany({
    where: { id: { in: orders.map((o) => o.id) } },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  await Promise.all(
    orders.map((o) =>
      sendOrderApproved({
        to: o.client.email,
        name: o.client.name ?? "there",
        orderId: o.id,
        serviceName: o.service.name,
      })
    )
  );

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

// ---- Promo ----------------------------------------------------------------

export async function resetPromo(): Promise<ActionResult> {
  await requireAdmin();
  // Clearing the promo trackers resets the live "X/10" counter the landing reads.
  await db.promoTracker.deleteMany({});
  revalidatePath("/admin/promo");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, message: "Promo counter reset to 0." };
}

// ---- Testimonials ---------------------------------------------------------

export type TestimonialInput = {
  authorName: string;
  country: string;
  service: string;
  rating: number;
  review: string;
  photoUrl?: string;
  source: string;
  isActive: boolean;
};

function validateTestimonial(input: TestimonialInput): string | null {
  if (!input.authorName.trim()) return "Author name is required.";
  if (!input.review.trim()) return "Review text is required.";
  if (input.rating < 1 || input.rating > 5) return "Rating must be 1–5.";
  return null;
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult> {
  await requireAdmin();
  const err = validateTestimonial(input);
  if (err) return { ok: false, error: err };
  await db.testimonial.create({
    data: {
      authorName: input.authorName.trim(),
      country: input.country.trim(),
      service: input.service.trim(),
      rating: input.rating,
      review: input.review.trim(),
      photoUrl: input.photoUrl?.trim() || null,
      source: input.source === "DIRECT" ? "DIRECT" : "TELEGRAM",
      isActive: input.isActive,
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true, message: "Testimonial added." };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput
): Promise<ActionResult> {
  await requireAdmin();
  const err = validateTestimonial(input);
  if (err) return { ok: false, error: err };
  await db.testimonial.update({
    where: { id },
    data: {
      authorName: input.authorName.trim(),
      country: input.country.trim(),
      service: input.service.trim(),
      rating: input.rating,
      review: input.review.trim(),
      photoUrl: input.photoUrl?.trim() || null,
      source: input.source === "DIRECT" ? "DIRECT" : "TELEGRAM",
      isActive: input.isActive,
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true, message: "Testimonial updated." };
}

export async function toggleTestimonial(id: string, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.testimonial.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { ok: true, message: "Testimonial deleted." };
}

// ---- Settings -------------------------------------------------------------

export async function saveSettings(patch: Partial<SiteSettings>): Promise<ActionResult> {
  await requireAdmin();
  await updateSettings(patch);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  // Payment pages read settings; force them to re-read.
  revalidatePath("/order", "layout");
  return { ok: true, message: "Settings saved." };
}
