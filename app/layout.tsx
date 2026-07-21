import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Payoneer Verification & Stripe Account Setup`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  keywords: [
    "Payoneer verification",
    "Payoneer account setup",
    "Stripe account setup",
    "Stripe onboarding assistance",
    "US receiving account",
    "freelancer payments",
    "online business payment onboarding",
    "M-PESA Payoneer",
  ],
  openGraph: {
    title: `${siteConfig.name} — Payoneer & Stripe Account Setup`,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Payoneer & Stripe Account Setup`,
    description: siteConfig.description,
  },
  icons: { icon: "/logo-mark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Fonts loaded via stylesheet (non-blocking) with system-font fallback. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-navy-800">
        {children}
      </body>
    </html>
  );
}
