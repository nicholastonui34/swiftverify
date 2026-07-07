import "server-only";
import { siteConfig } from "./config";

/**
 * Transactional email — STUB for Phase 2.
 *
 * Phase 4 replaces the body of `sendEmail` with Nodemailer + Gmail SMTP
 * (GMAIL_USER / GMAIL_APP_PASSWORD). For now we log so the order flow works
 * end-to-end without email infrastructure. Call sites already pass real content.
 */
type Email = { to: string; subject: string; body: string };

async function sendEmail(email: Email): Promise<void> {
  // TODO(Phase 4): Nodemailer transport with Gmail SMTP.
  console.log(
    `[email:stub] → ${email.to}\n  subject: ${email.subject}\n  ${email.body.replace(/\n/g, "\n  ")}`
  );
}

export async function sendOrderConfirmation(params: {
  to: string;
  name: string;
  orderId: string;
  serviceName: string;
  priceKES: number;
}) {
  await sendEmail({
    to: params.to,
    subject: `Order received — ${params.serviceName}`,
    body: `Hi ${params.name},\n\nWe've received your order ${params.orderId} for ${params.serviceName} (KES ${params.priceKES.toLocaleString("en-KE")}).\n\nNext: send the M-PESA payment and upload your receipt. Our team verifies within 2–24 hours.\n\n— ${siteConfig.name}`,
  });
}

export async function sendPaymentSubmittedToAdmin(params: {
  orderId: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  mpesaPhone: string;
}) {
  await sendEmail({
    to: siteConfig.supportEmail,
    subject: `New payment proof — order ${params.orderId}`,
    body: `${params.clientName} (${params.clientEmail}) submitted M-PESA proof for ${params.serviceName}.\nSender phone: ${params.mpesaPhone}\nReview & approve in the admin dashboard.`,
  });
}

export async function sendPaymentReceived(params: {
  to: string;
  name: string;
  orderId: string;
}) {
  await sendEmail({
    to: params.to,
    subject: `Payment received — order ${params.orderId}`,
    body: `Hi ${params.name},\n\nWe've received your payment proof for order ${params.orderId}. Our team will verify it within 2–24 hours and email you once confirmed.\n\n— ${siteConfig.name}`,
  });
}
