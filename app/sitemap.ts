import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getGuides } from "@/lib/guides";

/** Public, indexable routes. Admin, login, order/track flows are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: Date }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/order", priority: 0.9, changeFrequency: "monthly" },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
    ...getGuides().map((g) => ({
      path: `/guides/${g.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: new Date(g.dateModified),
    })),
  ];

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: r.lastModified ?? now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
