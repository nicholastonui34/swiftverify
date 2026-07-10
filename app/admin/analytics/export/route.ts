import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** CSV export of every order. Admin-only. */
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const orders = await db.order.findMany({
    include: { client: true, service: true, promo: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Order ID",
    "Created",
    "Status",
    "Service",
    "Price KES",
    "Promo",
    "Client Name",
    "Client Email",
    "Client Phone",
    "Country",
    "M-PESA Phone",
    "Approved At",
  ];

  const rows = orders.map((o) => [
    o.id,
    o.createdAt.toISOString(),
    o.status,
    o.service.name,
    String(o.priceKES),
    o.promo ? "yes" : "no",
    o.client.name ?? "",
    o.client.email,
    o.client.phone ?? "",
    o.client.country ?? "",
    o.mpesaPhone ?? "",
    o.approvedAt ? o.approvedAt.toISOString() : "",
  ]);

  const csv = [header, ...rows]
    .map((cols) => cols.map(csvCell).join(","))
    .join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="swiftverify-orders-${date}.csv"`,
    },
  });
}

/** Escape a CSV cell: wrap in quotes and double any embedded quotes. */
function csvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
