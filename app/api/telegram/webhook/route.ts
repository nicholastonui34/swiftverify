import { NextRequest, NextResponse } from "next/server";
import { adminChatId, sendTelegramMessage } from "@/lib/telegram";
import { handleTelegramCommand } from "@/lib/telegram-commands";

/**
 * Telegram webhook — receives inbound updates (commands) from the admin bot.
 * Registered via Telegram's setWebhook API pointing at this route with a
 * `secret_token`, which Telegram echoes back on every request so we can
 * reject anything that didn't come from Telegram itself.
 *
 * Beyond that, every command is scoped to the configured admin chat id (the
 * same one notifications go out to) — messages from any other chat are
 * acknowledged (200, so Telegram doesn't retry) but never processed or
 * replied to, so a stranger who finds the bot username learns nothing.
 */
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const gotSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (gotSecret !== expectedSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  let update: {
    message?: { chat?: { id?: number }; text?: string };
  };
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text;
  if (!chatId || !text?.startsWith("/")) {
    return NextResponse.json({ ok: true });
  }

  const allowedChatId = await adminChatId();
  if (!allowedChatId || String(chatId) !== String(allowedChatId)) {
    return NextResponse.json({ ok: true });
  }

  try {
    const reply = await handleTelegramCommand(text);
    await sendTelegramMessage(String(chatId), reply);
  } catch (err) {
    console.error("[telegram webhook] command handling failed:", err);
    await sendTelegramMessage(String(chatId), "Something went wrong handling that command.");
  }

  return NextResponse.json({ ok: true });
}
