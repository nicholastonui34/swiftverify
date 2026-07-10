"use server";

import { redirect } from "next/navigation";
import { findOrderIdByIdAndEmail } from "@/lib/data";

export type TrackState = { error?: string };

export async function trackOrder(
  _prev: TrackState,
  formData: FormData
): Promise<TrackState> {
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
