import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "./config";
import { getSettings } from "./settings";

/**
 * Transactional email — Nodemailer + Gmail SMTP (Phase 4).
 *
 * Reads GMAIL_USER / GMAIL_APP_PASSWORD from env. When they're absent (local
 * dev, CI) `sendEmail` degrades to a console log so the order flow never breaks.
 * Recipient/reply-to and the on/off switch come from admin Settings.
 *
 * Swapping providers (e.g. Resend if Gmail SMTP is throttled on serverless) is a
 * one-function change: replace the body of `deliver()` — every call site funnels
 * through `sendEmail`.
 */

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const smtpConfigured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

type Cta = { label: string; url: string };
type Email = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  cta?: Cta;
};

let cachedTransport: Transporter | null = null;
function getTransport(): Transporter | null {
  if (!smtpConfigured) return null;
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
  }
  return cachedTransport;
}

/** The one place that actually talks to the mail provider. */
async function deliver(email: Email, replyTo: string): Promise<void> {
  const transport = getTransport();
  if (!transport) {
    console.log(
      `[email:stub] → ${email.to}\n  subject: ${email.subject}\n  ${email.body.replace(
        /\n/g,
        "\n  "
      )}`
    );
    return;
  }
  try {
    await transport.sendMail({
      from: `"${siteConfig.name}" <${GMAIL_USER}>`,
      to: email.to,
      replyTo,
      subject: email.subject,
      text: email.body,
      html: renderTemplate(email.subject, email.body, email.cta),
    });
  } catch (err) {
    // Never let a mail failure break the order flow — log and move on.
    console.error(`[email] failed to send "${email.subject}" to ${email.to}:`, err);
  }
}

async function sendEmail(email: Email): Promise<void> {
  const settings = await getSettings();
  if (!settings.emailNotifications) {
    console.log(`[email:disabled] skipped "${email.subject}" → ${email.to}`);
    return;
  }
  await deliver(email, email.replyTo ?? settings.adminEmail);
}

/** Admin inbox for internal notifications (Setting → falls back to config). */
async function adminRecipient(): Promise<string> {
  const settings = await getSettings();
  return settings.adminEmail || siteConfig.supportEmail;
}

// ---- Templated messages ---------------------------------------------------

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
    body: `Hi ${params.name},\n\nWe've received your order ${params.orderId} for ${params.serviceName} (KES ${params.priceKES.toLocaleString(
      "en-KE"
    )}).\n\nNext: send payment via M-PESA, USDT (TRC20) or Binance Pay and upload your receipt. Our team verifies within 2–24 hours.\n\n— ${siteConfig.name}`,
    cta: { label: "Complete payment", url: `${BASE_URL}/order/${params.orderId}/payment` },
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
    to: await adminRecipient(),
    replyTo: params.clientEmail,
    subject: `New payment proof — order ${params.orderId}`,
    body: `${params.clientName} (${params.clientEmail}) submitted payment proof for ${params.serviceName}.\nPayment reference: ${params.mpesaPhone}\nReview & approve in the admin dashboard.`,
    cta: { label: "Open in admin", url: `${BASE_URL}/admin/orders/${params.orderId}` },
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
    body: `Hi ${params.name},\n\nWe've received your payment proof for order ${params.orderId}. Our team will verify it within 2–24 hours and email you once confirmed.\n\nYou can follow your order status any time using the button below.\n\n— ${siteConfig.name}`,
    cta: { label: "Track your order", url: `${BASE_URL}/order/${params.orderId}/status` },
  });
}

export async function sendOrderApproved(params: {
  to: string;
  name: string;
  orderId: string;
  serviceName: string;
}) {
  await sendEmail({
    to: params.to,
    subject: `Payment confirmed — ${params.serviceName}`,
    body: `Hi ${params.name},\n\nGood news — your payment for order ${params.orderId} (${params.serviceName}) is confirmed. We're starting your verification now and will keep you posted on Telegram/email.\n\n— ${siteConfig.name}`,
  });
}

export async function sendOrderRejected(params: {
  to: string;
  name: string;
  orderId: string;
  reason?: string;
}) {
  await sendEmail({
    to: params.to,
    subject: `Order ${params.orderId} — action needed`,
    body: `Hi ${params.name},\n\nWe couldn't confirm the payment for order ${params.orderId}.${
      params.reason ? `\nReason: ${params.reason}` : ""
    }\nIf you were charged, reply to this email with your M-PESA transaction code and we'll refund or re-check it right away.\n\n— ${siteConfig.name}`,
  });
}

export async function sendOrderCompleted(params: {
  to: string;
  name: string;
  orderId: string;
  serviceName: string;
}) {
  await sendEmail({
    to: params.to,
    subject: `Done! ${params.serviceName} is complete`,
    body: `Hi ${params.name},\n\nYour ${params.serviceName} (order ${params.orderId}) is complete. 🎉\n\nIf we earned it, a quick review means a lot — reply here or send it on Telegram (${siteConfig.telegram}) and we may feature it on the site.\n\nThank you for trusting ${siteConfig.name}.`,
  });
}

// ---- Stripe checkout (USD services) ---------------------------------------

export async function sendStripeOrderConfirmation(params: {
  to: string;
  name: string;
  orderId: string;
  serviceName: string;
  amountUSD: number;
  receiptUrl?: string | null;
}) {
  await sendEmail({
    to: params.to,
    subject: `Payment received — ${params.serviceName}`,
    body: `Hi ${params.name},\n\nThank you for choosing ${siteConfig.name}. Your payment of $${params.amountUSD.toFixed(
      2
    )} for ${params.serviceName} (order #${params.orderId.slice(
      -8
    )}) has been received successfully. Our team will begin processing your order shortly.\n\nNext steps: we'll reach out by email with any documents or details we need from you.${
      params.receiptUrl ? "\n\nYour Stripe receipt is linked below." : ""
    }\n\n— ${siteConfig.name}`,
    cta: params.receiptUrl ? { label: "View receipt", url: params.receiptUrl } : undefined,
  });
}

export async function sendStripeOrderAdminNotification(params: {
  orderId: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amountUSD: number;
}) {
  await sendEmail({
    to: await adminRecipient(),
    replyTo: params.clientEmail,
    subject: `New paid order — ${params.serviceName} ($${params.amountUSD.toFixed(2)})`,
    body: `${params.clientName} (${params.clientEmail}) just paid $${params.amountUSD.toFixed(
      2
    )} for ${params.serviceName} via Stripe.\nOrder #${params.orderId.slice(-8)}.`,
  });
}

export async function sendStripePaymentFailedAdminNotification(params: {
  orderId: string;
  clientEmail: string;
  serviceName: string;
}) {
  await sendEmail({
    to: await adminRecipient(),
    subject: `Payment failed — ${params.serviceName}`,
    body: `A Stripe payment attempt failed for ${params.clientEmail} (${
      params.serviceName
    }).\nOrder #${params.orderId.slice(-8)}. No charge was made — the customer can try again.`,
  });
}

export async function sendStripeRefundAdminNotification(params: {
  orderId: string;
  clientEmail: string;
  serviceName: string;
  amountUSD: number;
}) {
  await sendEmail({
    to: await adminRecipient(),
    subject: `Refund issued — ${params.serviceName}`,
    body: `A $${params.amountUSD.toFixed(2)} refund was issued for ${params.clientEmail} (${
      params.serviceName
    }).\nOrder #${params.orderId.slice(-8)}.`,
  });
}

// ---- HTML template --------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wrap the plaintext body in a simple branded, email-client-safe layout. */
function renderTemplate(subject: string, body: string, cta?: Cta): string {
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:#0a2540;font-size:15px;line-height:1.6;">${p.replace(
          /\n/g,
          "<br/>"
        )}</p>`
    )
    .join("");

  const button = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;"><tr><td style="border-radius:9999px;background:#10b981;">
         <a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:9999px;">${escapeHtml(
        cta.label
      )}</a>
       </td></tr></table>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#eef4fb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4fb;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d5e3f4;">
        <tr><td style="background:#0a2540;padding:20px 28px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">Swift<span style="color:#34d399;">Verify</span></span>
        </td></tr>
        <tr><td style="padding:28px;font-family:Arial,Helvetica,sans-serif;">
          <h1 style="margin:0 0 16px;font-size:18px;color:#0a2540;">${escapeHtml(subject)}</h1>
          ${paragraphs}
          ${button}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f7fafd;border-top:1px solid #eef4fb;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0;font-size:12px;color:#7089a3;">${escapeHtml(
            siteConfig.name
          )} · Payoneer verification for East African freelancers</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
