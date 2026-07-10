import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides — Payoneer verification & getting paid",
  description:
    "Practical guides for East African freelancers and sellers: how to verify Payoneer, fix rejections, and set up US/UK receiving accounts.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-brand-600">
              <BookOpen className="h-4 w-4" /> Guides
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Get verified and get paid
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-navy-600">
              Straight-talking guides for East African freelancers and sellers — no fluff, just
              what works for Payoneer verification and global payouts.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <p className="flex items-center gap-2 text-xs font-medium text-navy-400">
                  <Clock className="h-3.5 w-3.5" /> {g.readingMinutes} min read ·{" "}
                  {new Date(g.datePublished).toLocaleDateString("en-KE", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h2 className="mt-3 font-display text-lg font-bold text-navy-900 group-hover:text-brand-700">
                  {g.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{g.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
