"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    // signIn throws a NEXT_REDIRECT on success — let it propagate.
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return {};
}
