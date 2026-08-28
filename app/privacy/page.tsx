import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p className="text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>
      <p>{siteConfig.name} respects your privacy. We collect only the information needed to understand your enquiry, prepare your verification support and communicate with you about an engagement.</p>
      <h2>Information we collect</h2>
      <p>This may include your name, email address, phone number, country, account type, documents you choose to share and basic website usage analytics. We never sell your data.</p>
      <h2>How we use it</h2>
      <p>We use your information to respond to enquiries, scope and deliver consultancy support, review documents you voluntarily provide, communicate updates and maintain the security of our site and services.</p>
      <h2>Document handling</h2>
      <p>Please share only documents needed for your case. We do not publish your documents or use them for unrelated purposes. If you have a question about information shared with our team, contact us directly.</p>
      <h2>Contact</h2>
      <p>Questions? Reach us at {siteConfig.supportEmail} or through the WhatsApp and Telegram links on this site.</p>
    </LegalShell>
  );
}
