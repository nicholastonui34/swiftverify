import "server-only";
import { db, isDbConfigured } from "./db";
import { siteConfig } from "./config";
import {
  services as staticServices,
  testimonials as staticTestimonials,
  priceFor,
  type Service,
  type Testimonial,
  type PromoState,
} from "./content";

/**
 * Data-access layer. Reads from Postgres when DATABASE_URL is set and reachable,
 * otherwise falls back to the static Phase 1 content so the site always renders.
 */

export { priceFor };
export type { PromoState };

export async function getServices(): Promise<Service[]> {
  if (!isDbConfigured) return staticServices;
  try {
    const rows = await db.service.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length === 0) return staticServices;
    return rows.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      priceKES: s.priceKES,
      isPromoEligible: s.isPromoEligible,
      featured: staticServices.find((x) => x.slug === s.slug)?.featured,
    }));
  } catch {
    return staticServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDbConfigured) return staticTestimonials;
  try {
    const rows = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (rows.length === 0) return staticTestimonials;
    return rows.map((t) => ({
      authorName: t.authorName,
      country: t.country,
      service: t.service,
      rating: t.rating,
      review: t.review,
      photoUrl: t.photoUrl ?? undefined,
      source: (t.source === "DIRECT" ? "DIRECT" : "TELEGRAM") as Testimonial["source"],
    }));
  } catch {
    return staticTestimonials;
  }
}

export async function getPromoState(): Promise<PromoState> {
  const limit = siteConfig.promoLimit;
  const promoPriceKES = siteConfig.promoPriceKES;

  if (!isDbConfigured) {
    const used = siteConfig.promoUsed;
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  }
  try {
    const used = await db.promoTracker.count({ where: { usedPromoCode: true } });
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  } catch {
    const used = siteConfig.promoUsed;
    return {
      active: used < limit,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      promoPriceKES,
    };
  }
}
