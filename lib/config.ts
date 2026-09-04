export const siteConfig = {
  name: "SwiftVerify",
  tagline: "Freelance Consulting & Business Advisory Firm in Kenya",
  description: "Kenya's leading consulting firm for remote freelancers. We assist with US/UK LLC formation, Stripe/PayPal setup, resume revamps, industry documents, M-Pesa payable residential proxies, and business asset formatting.",
  url: "https://swiftverify-alpha.vercel.app",
  whatsapp: "https://wa.me/447916624874",
  telegram: "https://t.me/swiftverifydotcom",
  supportEmail: "support@swiftverify.co.ke",
  mpesaTill: "3561312",
  mpesaMerchantName: "NICHOLAS TONUI",
  usdtTrc20Address: "TW5aWQhPp2QZimRYMjAkaAURykbxZRRoPc",
  binancePayId: "820002132",
  successRate: 99,
  sellersVerified: 470,
  yearsActive: 3,
  promoLimit: 10,
  promoUsed: 3,
  promoPriceKES: 1250,
} as const;

export const quoteMessage = "Hello SwiftVerify, I want to request a free quote.";

export function whatsappLink(message = quoteMessage) { return `${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`; }
