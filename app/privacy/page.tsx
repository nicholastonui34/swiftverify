import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>
        {siteConfig.name} respects your privacy. This placeholder policy will be
        finalised before launch. We collect only the information needed to
        deliver your verification service — your name, email, phone and the
        documents you choose to share with us.
      </p>
      <h2>Information we collect</h2>
      <p>
        Contact details you submit, payment proof you upload, and basic usage
        analytics. We never sell your data.
      </p>
      <h2>How we use it</h2>
      <p>
        To process your order, verify payments, deliver your service and send
        you order updates.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Reach us at {siteConfig.supportEmail} or on Telegram.
      </p>
    </LegalShell>
  );
}
