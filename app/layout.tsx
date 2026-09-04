import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "SwiftVerify | Freelance Advisory, US LLC, Payment Gateways & Remote Work Solutions Kenya",
  description: "Kenya's leading consulting firm for remote freelancers. We assist with US/UK LLC formation, Stripe/PayPal setup, resume revamps, M-Pesa payable residential proxies, and document formatting.",
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  keywords: ["freelance consulting Kenya", "remote work solutions Kenya", "US LLC formation Kenya", "UK company formation", "payment gateway setup", "resume optimisation", "verification document formatting"],
  openGraph: { title: "SwiftVerify | Freelance Advisory & Business Consulting Kenya", description: siteConfig.description, url: siteConfig.url, siteName: siteConfig.name, locale: "en_KE", type: "website", images: [{ url: "/swiftverify-og.png", width: 1200, height: 630, alt: "SwiftVerify freelance and business advisory" }] },
  twitter: { card: "summary_large_image", title: "SwiftVerify | Freelance Advisory Kenya", description: siteConfig.description, images: ["/swiftverify-og.png"] },
  icons: { icon: "/logo-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="h-full antialiased"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" /></head><body className="min-h-full flex flex-col bg-white text-navy-800">{children}</body></html>; }
