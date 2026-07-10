import { siteConfig } from "./config";
import type { Service, Faq } from "./content";

/** Canonical public origin, e.g. https://swiftverify-alpha.vercel.app (no trailing slash). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url).replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

// ---- JSON-LD builders (schema.org) ----------------------------------------

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: absoluteUrl("/logo-mark.svg"),
    description: siteConfig.description,
    sameAs: [siteConfig.telegram].filter(Boolean),
    areaServed: ["KE", "TZ", "UG"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.supportEmail,
      availableLanguage: ["en", "sw"],
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
  };
}

export function servicesLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        provider: { "@type": "Organization", name: siteConfig.name, url: siteUrl },
        areaServed: ["KE", "TZ", "UG"],
        offers: {
          "@type": "Offer",
          price: s.priceKES,
          priceCurrency: "KES",
          url: absoluteUrl(`/order?service=${s.slug}`),
        },
      },
    })),
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
