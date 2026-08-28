import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>By using {siteConfig.name}, you agree to these terms. SwiftVerify provides independent payment gateway onboarding, verification and document-preparation guidance. We are not affiliated with Payoneer, Stripe, PayPal, Wise, Grey, Square, Mercury or any other provider.</p>
      <h2>Our service</h2>
      <p>We help clients understand provider requirements, prepare accurate information and respond to reasonable compliance requests. Approval decisions are made by the providers themselves, and no outcome can be guaranteed where eligibility requirements are not met.</p>
      <h2>Quotes and engagements</h2>
      <p>New enquiries are scoped individually. The scope, quote, timing and payment terms for an engagement are confirmed in writing before work begins. We do not use public self-serve checkout for new visitors.</p>
      <h2>Client responsibilities</h2>
      <p>You are responsible for providing truthful, current information and documents that belong to you or your business. SwiftVerify does not help clients bypass eligibility, identity or compliance requirements.</p>
      <h2>Contact</h2>
      <p>Reach us at {siteConfig.supportEmail} or through the WhatsApp and Telegram links on this site.</p>
    </LegalShell>
  );
}
