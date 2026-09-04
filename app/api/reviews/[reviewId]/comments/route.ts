import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET(_request: Request, { params }: { params: Promise<{ reviewId: string }> }) {
  if (!isDbConfigured) return NextResponse.json({ comments: [] });
  try {
    const { reviewId } = await params;
    const comments = await db.reviewComment.findMany({ where: { reviewId, isActive: true }, orderBy: { createdAt: "asc" }, select: { id: true, parentId: true, authorName: true, body: true, createdAt: true } });
    return NextResponse.json({ comments }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Discussion is temporarily unavailable." }, { status: 503 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const { reviewId } = await params;
    const body = await request.json();
    const authorName = clean(body.authorName, 80);
    const commentBody = clean(body.body, 1000);
    const parentId = clean(body.parentId, 30) || null;
    if (!authorName || !commentBody) return NextResponse.json({ error: "Please enter your name and comment." }, { status: 400 });
    if (!isDbConfigured) return NextResponse.json({ error: "Discussion is temporarily unavailable." }, { status: 503 });
    const review = await db.testimonial.findFirst({ where: { id: reviewId, source: "REVIEWS_CENTER", isActive: true }, select: { id: true } });
    if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });
    if (parentId) { const parent = await db.reviewComment.findFirst({ where: { id: parentId, reviewId, isActive: true }, select: { id: true } }); if (!parent) return NextResponse.json({ error: "Comment thread not found." }, { status: 404 }); }
    await db.reviewComment.create({ data: { reviewId, parentId, authorName, body: commentBody, isActive: true } });
    return NextResponse.json({ message: parentId ? "Reply added to the discussion." : "Comment added to the discussion." }, { status: 201 });
  } catch { return NextResponse.json({ error: "We could not add your comment. Please try again." }, { status: 500 }); }
}
