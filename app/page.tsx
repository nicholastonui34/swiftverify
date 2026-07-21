import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BreakingNews } from "@/components/BreakingNews";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Faq } from "@/components/Faq";
import { WhyUs } from "@/components/WhyUs";
import { JsonLd } from "@/components/JsonLd";
import { getTestimonials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { getGuides } from "@/lib/guides";
import { getStripeOnboardingPromoState } from "@/lib/stripe-checkout";
import { stripeServices } from "@/lib/pricing";
import { tips as defaultTips, faqs } from "@/lib/content";
import { organizationLd, websiteLd, stripeServicesLd } from "@/lib/seo";

// Always render fresh so promo counts and new testimonials show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [testimonials, settings, stripePromo] = await Promise.all([
    getTestimonials(),
    getSettings(),
    getStripeOnboardingPromoState(),
  ]);

  // Admin's "current tip" leads the rotation when set.
  const tips = settings.currentTip.trim()
    ? [settings.currentTip.trim(), ...defaultTips]
    : defaultTips;

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), stripeServicesLd(stripeServices)]} />
      <AnnouncementBanner tips={tips} />
      <Navbar />
      <main className="flex-1">
        <Hero stripePromo={stripePromo} />
        <PricingSection promo={stripePromo} />
        <HowItWorks />
        <WhyUs />
        <TestimonialsCarousel testimonials={testimonials} />
        <GuidesTeaser />
        <FaqSection />
        <BreakingNews />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function GuidesTeaser() {
  const guides = getGuides().slice(0, 3);
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-brand-600">
              Guides
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Learn before you pay
            </h2>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            All guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <p className="flex items-center gap-2 text-xs font-medium text-navy-400">
                <Clock className="h-3.5 w-3.5" /> {g.readingMinutes} min read
              </p>
              <h3 className="mt-3 font-display text-base font-bold text-navy-900 group-hover:text-brand-700">
                {g.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{g.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="bg-navy-50/40 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-brand-600">
            FAQ
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-3 text-navy-600">
            Everything you need to know before getting verified on Payoneer or Stripe.
          </p>
        </div>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </div>
    </section>
  );
}
