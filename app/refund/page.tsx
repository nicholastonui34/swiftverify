import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>SwiftVerify now handles new enquiries through case-by-case quotes rather than a public self-serve checkout. Because payment and delivery terms can vary by engagement, the applicable refund arrangement is confirmed in writing with each client before work begins.</p>
      <h2>Policy status</h2>
      <p>The historical fixed-price online checkout wording on this page has been retired. SwiftVerify&apos;s final standard refund terms are pending confirmation and should be reviewed with our team before you proceed with any paid engagement.</p>
      <h2>How to ask about a refund</h2>
      <p>Contact {siteConfig.supportEmail} or message us through WhatsApp or Telegram with your engagement details. Please do not send payment or sensitive documents until the scope, payment terms and refund arrangement are clear.</p>
    </LegalShell>
  );
}
