/**
 * Seed script (Phase 2). Run with `npx prisma db seed` after configuring
 * DATABASE_URL and running migrations. Content mirrors lib/content.ts so the
 * landing page can switch from static content to DB reads seamlessly.
 *
 * Requires: npm i @prisma/client bcryptjs && npm i -D prisma tsx
 * package.json: "prisma": { "seed": "tsx prisma/seed.ts" }
 */
import { PrismaClient } from "@prisma/client";
import { services, testimonials } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        priceKES: s.priceKES,
        isPromoEligible: s.isPromoEligible,
      },
    });
  }

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: {
        authorName: t.authorName,
        country: t.country,
        service: t.service,
        rating: t.rating,
        review: t.review,
        source: t.source,
        isActive: true,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "promo_count" },
    update: {},
    create: { key: "promo_count", value: JSON.stringify({ used: 0, limit: 10 }) },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
