import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { GuideContent } from "@/components/GuideContent";
import { JsonLd } from "@/components/JsonLd";
import { getGuides, getGuideBySlug } from "@/lib/guides";
import { services } from "@/lib/content";
import { articleLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const ctaService = guide.ctaServiceSlug
    ? services.find((s) => s.slug === guide.ctaServiceSlug)
    : undefined;
  const orderHref = ctaService ? `/order?service=${ctaService.slug}` : "/order";

  return (
    <>
      <JsonLd
        data={[
          articleLd(guide),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>

          <header className="mt-6">
            <p className="flex items-center gap-2 text-xs font-medium text-navy-400">
              <Clock className="h-3.5 w-3.5" /> {guide.readingMinutes} min read · Updated{" "}
              {new Date(guide.dateModified).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-navy-900 sm:text-4xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-navy-600">{guide.description}</p>
          </header>

          <div className="mt-10">
            <GuideContent blocks={guide.content} />
          </div>

          {/* End CTA */}
          <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy-900">
              Want us to handle it for you?
            </h2>
            <p className="mt-2 text-navy-700">
              {ctaService
                ? `Our ${ctaService.name} gets your documents formatted and your account through verification — done right the first time.`
                : "Our team gets your documents formatted and your account through verification — done right the first time."}
            </p>
            <Link
              href={orderHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
