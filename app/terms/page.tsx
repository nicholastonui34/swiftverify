import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>
        By using {siteConfig.name} you agree to these placeholder terms, which
        will be finalised before launch. Our services provide onboarding and
        document-formatting <strong>guidance</strong> to help you pass platform
        verification. We are not affiliated with Payoneer.
      </p>
      <h2>Our service</h2>
      <p>
        We assist with account setup and document preparation. Approval decisions
        are made by the platforms themselves.
      </p>
      <h2>Payments</h2>
      <p>
        Payments can be made securely online by debit/credit card via Stripe
        Checkout, or via M-PESA, with work beginning once payment is confirmed.
      </p>
      <h2>Contact</h2>
      <p>Reach us at {siteConfig.supportEmail} or on Telegram.</p>
    </LegalShell>
  );
}
