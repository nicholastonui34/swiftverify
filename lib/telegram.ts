import "server-only";
import { getSettings } from "./settings";

/**
 * Telegram admin notifications (Phase 4).
 *
 * Fires an instant message to the admin's Telegram chat on key events (new
 * order, payment proof). The bot token is a secret (env only); the target chat
 * id + the on/off switch come from admin Settings (chat id falls back to
 * TELEGRAM_ADMIN_CHAT_ID). No-ops silently when unconfigured or disabled so it
 * can never break the order flow.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function notifyTelegram(text: string): Promise<void> {
  let settings;
  try {
    settings = await getSettings();
  } catch {
    return;
  }

  const chatId = settings.telegramChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!BOT_TOKEN || !chatId || !settings.telegramNotifications) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[telegram:skip] ${text.replace(/\n/g, " ")}`);
    }
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error(`[telegram] API ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("[telegram] send failed:", err);
  }
}

/** Escape user-supplied text for Telegram HTML parse mode. */
export function tgEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
