import "server-only";
import { db } from "./db";
import type { OrderStatus, Prisma } from "@prisma/client";

/**
 * Admin data-access. All functions assume the DB is configured — the /admin
 * area is DB-only (guarded by auth + a check in the admin layout).
 */

/** Statuses that count as realised revenue (payment accepted). */
export const REVENUE_STATUSES: OrderStatus[] = ["APPROVED", "IN_PROGRESS", "COMPLETED"];

export type DashboardMetrics = {
  ordersThisMonth: number;
  pendingApprovals: number;
  completed: number;
  totalRevenueKES: number;
  revenueThisMonthKES: number;
};

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const monthStart = startOfMonth();
  const [ordersThisMonth, pendingApprovals, completed, revenueAll, revenueMonth] =
    await Promise.all([
      db.order.count({ where: { createdAt: { gte: monthStart } } }),
      db.order.count({ where: { status: "PAYMENT_SUBMITTED" } }),
      db.order.count({ where: { status: "COMPLETED" } }),
      db.order.aggregate({
        _sum: { priceKES: true },
        where: { status: { in: REVENUE_STATUSES } },
      }),
      db.order.aggregate({
        _sum: { priceKES: true },
        where: { status: { in: REVENUE_STATUSES }, approvedAt: { gte: monthStart } },
      }),
    ]);

  return {
    ordersThisMonth,
    pendingApprovals,
    completed,
    totalRevenueKES: revenueAll._sum.priceKES ?? 0,
    revenueThisMonthKES: revenueMonth._sum.priceKES ?? 0,
  };
}

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: { client: true; service: true; promo: true };
}>;

export async function getRecentOrders(limit = 8): Promise<OrderWithRelations[]> {
  return db.order.findMany({
    include: { client: true, service: true, promo: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

const PAGE_SIZE = 20;

export async function getOrders(opts: {
  status?: OrderStatus;
  page?: number;
  query?: string;
}): Promise<{ orders: OrderWithRelations[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const where: Prisma.OrderWhereInput = {};
  if (opts.status) where.status = opts.status;

  const q = opts.query?.trim();
  if (q) {
    // Match order id (full or short suffix), M-PESA phone, or client name/email/phone.
    where.OR = [
      { id: { endsWith: q } },
      { mpesaPhone: { contains: q, mode: "insensitive" } },
      {
        client: {
          is: {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { client: true, service: true, promo: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.order.count({ where }),
  ]);
  return { orders, total, page, pageSize: PAGE_SIZE };
}

export async function getOrderById(id: string): Promise<OrderWithRelations | null> {
  return db.order.findUnique({
    where: { id },
    include: { client: true, service: true, promo: true },
  });
}

/** Count of orders per status (for the analytics bar chart). */
export async function getOrdersByStatus(): Promise<Record<OrderStatus, number>> {
  const grouped = await db.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const base: Record<OrderStatus, number> = {
    PENDING_PAYMENT: 0,
    PAYMENT_SUBMITTED: 0,
    APPROVED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  for (const g of grouped) base[g.status] = g._count._all;
  return base;
}

export type RevenuePoint = { month: string; revenueKES: number; orders: number };

/** Revenue + realised-order count for the last `months` calendar months. */
export async function getRevenueTrend(months = 6): Promise<RevenuePoint[]> {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const orders = await db.order.findMany({
    where: { status: { in: REVENUE_STATUSES }, approvedAt: { gte: from } },
    select: { priceKES: true, approvedAt: true },
  });

  const buckets = new Map<string, { revenueKES: number; orders: number }>();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    buckets.set(monthKey(d), { revenueKES: 0, orders: 0 });
  }
  for (const o of orders) {
    if (!o.approvedAt) continue;
    const key = monthKey(o.approvedAt);
    const b = buckets.get(key);
    if (b) {
      b.revenueKES += o.priceKES;
      b.orders += 1;
    }
  }
  return Array.from(buckets.entries()).map(([month, v]) => ({
    month,
    revenueKES: v.revenueKES,
    orders: v.orders,
  }));
}

function monthKey(d: Date): string {
  return d.toLocaleDateString("en-KE", { month: "short", year: "2-digit" });
}

export type PromoOrder = OrderWithRelations;

export async function getPromoData(): Promise<{
  used: number;
  limit: number;
  orders: PromoOrder[];
}> {
  const { siteConfig } = await import("./config");
  const [used, orders] = await Promise.all([
    db.promoTracker.count({ where: { usedPromoCode: true } }),
    db.order.findMany({
      where: { promo: { usedPromoCode: true } },
      include: { client: true, service: true, promo: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { used, limit: siteConfig.promoLimit, orders };
}

export type ServiceRevenue = { service: string; revenueKES: number; orders: number };

/** Realised revenue + order count grouped by service (analytics breakdown). */
export async function getRevenueByService(): Promise<ServiceRevenue[]> {
  const [grouped, services] = await Promise.all([
    db.order.groupBy({
      by: ["serviceId"],
      where: { status: { in: REVENUE_STATUSES } },
      _sum: { priceKES: true },
      _count: { _all: true },
    }),
    db.service.findMany({ select: { id: true, name: true } }),
  ]);
  const nameById = new Map(services.map((s) => [s.id, s.name]));
  return grouped
    .map((g) => ({
      service: nameById.get(g.serviceId) ?? "Unknown",
      revenueKES: g._sum.priceKES ?? 0,
      orders: g._count._all,
    }))
    .sort((a, b) => b.revenueKES - a.revenueKES);
}
