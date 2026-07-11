"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { rateLimitByIp } from "@/lib/security";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/honeypot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupState = { error?: string };

/**
 * Client self-service signup. If a guest checkout already created a `User` row
 * for this email (password = null), this "claims" that same row so the
 * client's existing order history shows up in their new account — it does not
 * create a duplicate.
 */
export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  if (isHoneypotTripped(formData.get(HONEYPOT_FIELD))) {
    return { error: "Something went wrong. Please try again." };
  }
  const rl = await rateLimitByIp("signup", 5, 3600);
  if (!rl.success) {
    return { error: "Too many attempts. Please try again in a little while." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing?.password) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const hashed = await bcrypt.hash(password, 12);

  if (existing) {
    await db.user.update({
      where: { email },
      data: {
        password: hashed,
        name,
        phone: phone || existing.phone,
        country: country || existing.country,
      },
    });
  } else {
    await db.user.create({
      data: { email, password: hashed, name, phone: phone || null, country: country || null, role: "CLIENT" },
    });
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/account" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please try logging in." };
    }
    throw error;
  }
  return {};
}

export type AccountLoginState = { error?: string };

export async function accountLogin(
  _prev: AccountLoginState,
  formData: FormData
): Promise<AccountLoginState> {
  const rl = await rateLimitByIp("account-login", 10, 900);
  if (!rl.success) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/account" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return {};
}
