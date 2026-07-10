import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { rateLimitByIp } from "@/lib/security";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/honeypot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_MESSAGE = "You're in! Check your inbox for exclusive Payoneer tips.";

/**
 * Newsletter signup. Persists to the `Subscriber` table when a database is
 * configured; otherwise validates and acknowledges (Phase 1 behaviour).
 * Phase 4 adds the Telegram-tips auto-reply email.
 */
export async function POST(request: Request) {
  let email = "";
  let honeypot: unknown = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    honeypot = body?.[HONEYPOT_FIELD];
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught.
  if (isHoneypotTripped(honeypot as string)) {
    return NextResponse.json({ message: SUCCESS_MESSAGE });
  }

  const rl = await rateLimitByIp("subscribe", 5, 3600);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (isDbConfigured) {
    try {
      await db.subscriber.upsert({
        where: { email },
        update: {},
        create: { email },
      });
    } catch (err) {
      console.error("[subscribe] db error:", err);
      // Fall through — don't fail the UX over a transient DB issue.
    }
  } else {
    console.log(`[subscribe] new subscriber (no db): ${email}`);
  }

  // TODO(Phase 4): send Telegram-tips auto-reply email.
  return NextResponse.json({ message: SUCCESS_MESSAGE });
}
