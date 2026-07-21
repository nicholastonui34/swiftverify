import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>
        This placeholder refund policy will be finalised before launch. If we are
        unable to deliver the service you paid for, you are entitled to a full
        refund of your payment.
      </p>
      <h2>Eligibility</h2>
      <p>
        Refunds apply where work has not yet started or where we cannot complete
        the service. Card payments made via Stripe are refunded to the original
        card; M-PESA payments are refunded to your original M-PESA number.
      </p>
      <h2>How to request</h2>
      <p>
        Contact us at {siteConfig.supportEmail} or on Telegram with your order
        details.
      </p>
    </LegalShell>
  );
}
