/**
 * One-time admin bootstrap.
 *
 * Guest-checkout users have `password = null`, so no one can log in until an
 * ADMIN with a password exists. Run once (or again to reset the password):
 *
 *   npm run admin:create
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from `.env`.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN", name },
    create: { email, password: hash, role: "ADMIN", name },
  });

  console.log(`✅ Admin ready: ${user.email} (role=${user.role})`);
  console.log("   You can now log in at /login. Delete ADMIN_PASSWORD from .env when done.");
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
