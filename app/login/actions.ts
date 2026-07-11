"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { rateLimitByIp } from "@/lib/security";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // Throttle credential-stuffing / brute force before touching the DB.
  const rl = await rateLimitByIp("login", 10, 900);
  if (!rl.success) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  let ok = false;
  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    ok = !result?.error;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  if (!ok) return { error: "Invalid email or password." };

  // Admins/staff land in the dashboard; clients land on their order history.
  const session = await auth();
  const role = session?.user?.role;
  redirect(role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" : "/account");
}
