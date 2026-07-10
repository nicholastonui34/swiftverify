"use server";

import { redirect } from "next/navigation";
import { findOrderIdByIdAndEmail } from "@/lib/data";
import { rateLimitByIp } from "@/lib/security";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/honeypot";

export type TrackState = { error?: string };

export async function trackOrder(
  _prev: TrackState,
  formData: FormData
): Promise<TrackState> {
  if (isHoneypotTripped(formData.get(HONEYPOT_FIELD))) {
    return { error: "No order found with that ID and email. Check your confirmation email and try again." };
  }
  // Tighter window — guards against brute-forcing order ids.
  const rl = await rateLimitByIp("track", 20, 600);
  if (!rl.success) {
    return { error: "Too many lookups. Please wait a few minutes and try again." };
  }

  const orderId = String(formData.get("orderId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!orderId || !email) return { error: "Enter your order ID and email." };

  const id = await findOrderIdByIdAndEmail(orderId, email);
  if (!id) {
    return {
      error: "No order found with that ID and email. Check your confirmation email and try again.",
    };
  }

  redirect(`/order/${id}/status`);
}
