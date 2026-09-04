import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/transactional areas — no SEO value, keep out of the index.
      disallow: ["/admin", "/login", "/account", "/api/", "/track", "/order", "/checkout", "/payment", "/documents", "/guides"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
