/**
 * Site-wide configuration.
 *
 * In Phase 2+ the promo count, tips and M-PESA number move to the `Setting`
 * table (see prisma/schema.prisma) and the admin dashboard. For Phase 1 they
 * live here so the landing page renders with zero infrastructure.
 */
export const siteConfig = {
  name: "SwiftVerify",
  tagline: "Get Your Payoneer Account Verified. Fast. Compliant.",
  description:
    "SwiftVerify helps East African freelancers and sellers get their Payoneer accounts verified and set up US/UK/Canada receiving accounts. 99% success rate.",
  url: "https://swiftverify-alpha.vercel.app",

  // Social proof
  sellersVerified: 470,
  yearsActive: 3,
  successRate: 99,

  // Contact / community
  whatsapp: "https://wa.me/447916624874",
  telegram: "https://t.me/swiftverifydotcom",
  supportEmail: "support@swiftverify.co.ke",

  // M-PESA Buy Goods / Till (configurable in admin Settings in Phase 3)
  mpesaTill: "3561312",
  mpesaMerchantName: "NICHOLAS TONUI",

  // Crypto payment options (configurable in admin Settings)
  usdtTrc20Address: "TW5aWQhPp2QZimRYMjAkaAURykbxZRRoPc",
  binancePayId: "820002132",

  // Promo funnel: first N clients get the promo price
  promoLimit: 10,
  promoUsed: 3, // Phase 2: read live count from PromoTracker
  promoPriceKES: 1250,
} as const;

export const promoActive = siteConfig.promoUsed < siteConfig.promoLimit;
export const promoRemaining = Math.max(siteConfig.promoLimit - siteConfig.promoUsed, 0);
