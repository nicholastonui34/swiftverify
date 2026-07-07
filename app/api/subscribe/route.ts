import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup. Persists to the `Subscriber` table when a database is
 * configured; otherwise validates and acknowledges (Phase 1 behaviour).
 * Phase 4 adds the Telegram-tips auto-reply email.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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
  return NextResponse.json({
    message: "You're in! Check your inbox for exclusive Payoneer tips.",
  });
}
