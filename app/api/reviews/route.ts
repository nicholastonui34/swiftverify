import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  if (!isDbConfigured) return NextResponse.json({ reviews: [], count: 0 });
  try {
    const [reviews, count] = await Promise.all([
      db.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, authorName: true, country: true, service: true, rating: true, review: true, createdAt: true } }),
      db.testimonial.count({ where: { isActive: true } }),
    ]);
    return NextResponse.json({ reviews, count }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ reviews: [], count: 0, error: "Reviews are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authorName = clean(body.name, 80);
    const country = clean(body.country, 80);
    const service = clean(body.service, 120);
    const review = clean(body.review, 1000);
    const rating = Number(body.rating);
    if (!authorName || !country || !service || !review || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please complete every field and select a rating from 1 to 5." }, { status: 400 });
    }
    if (!isDbConfigured) return NextResponse.json({ error: "Reviews are temporarily unavailable. Please contact us on WhatsApp instead." }, { status: 503 });
    await db.testimonial.create({ data: { authorName, country, service, rating, review, source: "DIRECT", isActive: false } });
    return NextResponse.json({ message: "Thank you. Your review has been submitted for approval." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not submit your review. Please try again." }, { status: 500 });
  }
}
