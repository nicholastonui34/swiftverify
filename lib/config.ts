export const siteConfig = {
  name: "SwiftVerify",
  tagline: "Payment Gateway Verification & Compliance Consultancy. Fast. Compliant.",
  description:
    "SwiftVerify is a payment gateway verification and compliance consultancy for freelancers, agencies and online businesses. Get expert guidance for Payoneer, Stripe, PayPal, Wise, Grey, Square and Mercury.",
  url: "https://swiftverify-alpha.vercel.app",

  // Social proof
  sellersVerified: 470,
  yearsActive: 3,
  successRate: 99,

  // Contact / community
  whatsapp: "https://wa.me/447916624874",
  telegram: "https://t.me/swiftverifydotcom",
  supportEmail: "support@swiftverify.co.ke",

  // Legacy payment configuration retained for existing order history/admin tools.
  mpesaTill: "3561312",
  mpesaMerchantName: "NICHOLAS TONUI",
  usdtTrc20Address: "TW5aWQhPp2QZimRYMjAkaAURykbxZRRoPc",
  binancePayId: "820002132",
  promoLimit: 10,
  promoUsed: 3,
  promoPriceKES: 1250,
} as const;

export const promoActive = siteConfig.promoUsed < siteConfig.promoLimit;
export const promoRemaining = Math.max(siteConfig.promoLimit - siteConfig.promoUsed, 0);

export const quoteMessage = "Hi SwiftVerify! I'd like a quote for payment gateway verification.";

export function whatsappLink(message = quoteMessage) {
  return `${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
