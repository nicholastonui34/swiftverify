import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  TestimonialManager,
  type TestimonialRow,
} from "@/components/admin/TestimonialManager";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  const initial: TestimonialRow[] = rows.map((t) => ({
    id: t.id,
    authorName: t.authorName,
    country: t.country,
    service: t.service,
    rating: t.rating,
    review: t.review,
    photoUrl: t.photoUrl,
    source: t.source,
    isActive: t.isActive,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="mb-2">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Testimonials</h1>
        <p className="mt-1 text-sm text-navy-500">
          Add, edit and toggle reviews. Only active ones show on the landing page.
        </p>
      </header>
      <TestimonialManager initial={initial} />
    </div>
  );
}
