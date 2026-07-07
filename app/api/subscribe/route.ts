import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup.
 *
 * Phase 1: validates and acknowledges (no persistence yet).
 * Phase 2+: insert into the `Subscriber` table via Prisma and send the
 * auto-reply email (Nodemailer) — see prisma/schema.prisma and PHASE plan.
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

  // TODO(Phase 2): persist subscriber + send Telegram tips auto-reply email.
  console.log(`[subscribe] new subscriber: ${email}`);

  return NextResponse.json({
    message: "You're in! Check your inbox for exclusive Payoneer tips.",
  });
}
