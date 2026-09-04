import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ReviewsCenter } from "@/components/ReviewsCenter";
import { db, isDbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Reviews Center | SwiftVerify", description: "Read live client reviews and share your experience with SwiftVerify freelance and marketplace seller advisory services.", alternates: { canonical: "/reviews" } };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  let initialReviews: Array<{ id: string; authorName: string; country: string; service: string; rating: number; review: string; createdAt: string }> = [];
  if (isDbConfigured) {
    try {
      const rows = await db.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, authorName: true, country: true, service: true, rating: true, review: true, createdAt: true } });
      initialReviews = rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
    } catch { /* The client refresh will retry through the API. */ }
  }
  return <><Navbar /><main className="bg-[#f5f7f4]"><section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">SwiftVerify Reviews Center</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight tracking-[-0.05em] text-[#081624] sm:text-6xl">Real experiences. Clearer decisions.</h1><p className="mt-6 text-lg leading-8 text-slate-600">Read published experiences from freelancers and marketplace sellers, then share what changed for you.</p></div><div className="mt-14"><ReviewsCenter initialReviews={initialReviews} /></div></section></main><Footer /></>;
}
