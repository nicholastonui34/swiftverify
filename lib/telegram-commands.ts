import "server-only";
import { getDashboardMetrics, getOrders } from "./admin";
import { formatKES } from "./utils";
import { tgEscape } from "./telegram";
import { STATUS_LABEL } from "@/components/admin/StatusBadge";

const HELP_TEXT = [
  "<b>SwiftVerify admin bot</b>",
  "",
  "/stats — this month's orders, pending approvals, revenue",
  "/pending — orders awaiting payment review",
  "/status &lt;order id&gt; — look up one order (full or last-8-char id)",
  "/help — show this message",
].join("\n");

/** Handle one inbound Telegram command and return the reply text (HTML parse mode). */
export async function handleTelegramCommand(text: string): Promise<string> {
  const [rawCommand, ...rest] = text.trim().split(/\s+/);
  const command = rawCommand.toLowerCase().replace(/@\w+$/, ""); // strip @BotName suffix
  const arg = rest.join(" ").trim();

  switch (command) {
    case "/start":
    case "/help":
      return HELP_TEXT;
    case "/stats":
      return statsReply();
    case "/pending":
      return pendingReply();
    case "/status":
    case "/order":
      return arg ? statusReply(arg) : "Usage: /status <order id>";
    default:
      return "Unrecognised command. Send /help to see what I can do.";
  }
}

async function statsReply(): Promise<string> {
  const m = await getDashboardMetrics();
  return [
    "<b>SwiftVerify stats</b>",
    `Orders this month: ${m.ordersThisMonth}`,
    `Awaiting review: ${m.pendingApprovals}`,
    `Completed (all time): ${m.completed}`,
    `Revenue this month: ${formatKES(m.revenueThisMonthKES)}`,
    `Revenue (all time): ${formatKES(m.totalRevenueKES)}`,
  ].join("\n");
}

async function pendingReply(): Promise<string> {
  const { orders, total } = await getOrders({ status: "PAYMENT_SUBMITTED", page: 1 });
  if (orders.length === 0) return "No orders awaiting review right now.";
  const lines = orders
    .slice(0, 8)
    .map(
      (o) =>
        `#${o.id.slice(-8)} — ${tgEscape(o.client.name ?? o.client.email)} — ${tgEscape(
          o.service.name
        )} — ${formatKES(o.priceKES)}`
    );
  const more = total > lines.length ? `\n…and ${total - lines.length} more.` : "";
  return `<b>Awaiting review (${total})</b>\n${lines.join("\n")}${more}`;
}

async function statusReply(idOrSuffix: string): Promise<string> {
  const { orders } = await getOrders({ query: idOrSuffix, page: 1 });
  const order = orders[0];
  if (!order) return `No order found matching "${tgEscape(idOrSuffix)}".`;
  return [
    `<b>Order #${order.id.slice(-8)}</b>`,
    `Client: ${tgEscape(order.client.name ?? order.client.email)}`,
    `Service: ${tgEscape(order.service.name)}`,
    `Amount: ${formatKES(order.priceKES)}`,
    `Status: ${STATUS_LABEL[order.status]}`,
  ].join("\n");
}
