import "server-only";
import type { OrderStatus } from "@prisma/client";
import { db, isDbConfigured } from "./db";
import { siteConfig } from "./config";
import {
  services as staticServices,
  testimonials as staticTestimonials,
  priceFor,
  type Service,
  type Testimonial,
  type PromoState,
} from "./content";

/**
 * Data-access layer. Reads from Postgres when DATABASE_URL is set and reachable,
 * otherwise falls back to the static Phase 1 content so the site always renders.
 */

export { priceFor };
export type { PromoState };

export async function getServices(): Promise<Service[]> {
  if (!isDbConfigured) return staticServices;
  try {
    const rows = await db.service.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length === 0) return staticServices;
    return rows.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      priceKES: s.priceKES,
      isPromoEligible: s.isPromoEligible,
      featured: staticServices.find((x) => x.slug === s.slug)?.featured,
    }));
  } catch {
    return staticServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDbConfigured) return staticTestimonials;
  try {
    const rows = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (rows.length === 0) return staticTestimonials;
    return rows.map((t) => ({
      authorName: t.authorName,
      country: t.country,
      service: t.service,
      rating: t.rating,
      review: t.review,
      photoUrl: t.photoUrl ?? undefined,
      source: (t.source === "DIRECT" ? "DIRECT" : "TELEGRAM") as Testimonial["source"],
    }));
  } catch {
    return staticTestimonials;
  }
}

export async function getPromoState(): Promise<PromoState> {
  const limit = siteConfig.promoLimit;
  const promoPriceKES = siteConfig.promoPriceKES;

  if (!isDbConfigured) {
    const used = siteConfig.promoUsed;
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  }
  try {
    const used = await db.promoTracker.count({ where: { usedPromoCode: true } });
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  } catch {
    const used = siteConfig.promoUsed;
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  }
}

/**
 * Client-safe view of an order for the public tracking page. Deliberately omits
 * PII (email, phone, payment proof) — the order id acts as an unguessable
 * receipt token, so anyone with the link sees only status + summary.
 */
export type OrderStatusView = {
  id: string;
  firstName: string | null;
  serviceName: string;
  priceKES: number;
  status: OrderStatus;
  hasProof: boolean;
  createdAt: Date;
  approvedAt: Date | null;
};

export async function getOrderStatus(orderId: string): Promise<OrderStatusView | null> {
  if (!isDbConfigured) return null;
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { client: true, service: true },
    });
    if (!order) return null;
    return {
      id: order.id,
      firstName: order.client.name?.trim().split(/\s+/)[0] ?? null,
      serviceName: order.service.name,
      priceKES: order.priceKES,
      status: order.status,
      hasProof: Boolean(order.mpesaProofUrl),
      createdAt: order.createdAt,
      approvedAt: order.approvedAt,
    };
  } catch {
    return null;
  }
}

export type ClientOrderView = {
  id: string;
  serviceName: string;
  priceKES: number;
  status: OrderStatus;
  hasProof: boolean;
  createdAt: Date;
};

/** Full order history for a signed-in client's account dashboard. */
export async function getClientOrders(clientId: string): Promise<ClientOrderView[]> {
  if (!isDbConfigured) return [];
  try {
    const orders = await db.order.findMany({
      where: { clientId },
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });
    return orders.map((o) => ({
      id: o.id,
      serviceName: o.service.name,
      priceKES: o.priceKES,
      status: o.status,
      hasProof: Boolean(o.mpesaProofUrl),
      createdAt: o.createdAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Look up an order by id + email (case-insensitive). Used by the /track form to
 * confirm the requester owns the order before revealing its status link.
 * Accepts either the full order id (from the confirmation email) or the short
 * 8-char id shown in the UI. The email match scopes the suffix lookup so it
 * can't leak another client's order.
 */
export async function findOrderIdByIdAndEmail(
  orderIdInput: string,
  email: string
): Promise<string | null> {
  if (!isDbConfigured) return null;
  const id = orderIdInput.trim();
  const emailNorm = email.trim().toLowerCase();
  if (id.length < 6 || !emailNorm) return null;
  try {
    const order = await db.order.findFirst({
      where: {
        OR: [{ id }, { id: { endsWith: id } }],
        client: { email: emailNorm },
      },
      select: { id: true },
    });
    return order?.id ?? null;
  } catch {
    return null;
  }
}
