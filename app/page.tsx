import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { BreakingNews } from "@/components/BreakingNews";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { getServices, getTestimonials, getPromoState } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { tips as defaultTips, faqs } from "@/lib/content";
import { organizationLd, websiteLd, servicesLd } from "@/lib/seo";

// Always render fresh so promo counts and new testimonials show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, testimonials, promo, settings] = await Promise.all([
    getServices(),
    getTestimonials(),
    getPromoState(),
    getSettings(),
  ]);

  // Admin's "current tip" leads the rotation when set.
  const tips = settings.currentTip.trim()
    ? [settings.currentTip.trim(), ...defaultTips]
    : defaultTips;

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), servicesLd(services)]} />
      <AnnouncementBanner tips={tips} />
      <Navbar />
      <main className="flex-1">
        <Hero promo={promo} />
        <ServicesGrid services={services} promo={promo} />
        <HowItWorks />
        <TestimonialsCarousel testimonials={testimonials} />
        <FaqSection />
        <BreakingNews />
      </main>
      <Footer />
      <FloatingButtons />
    </>
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
            Everything you need to know before getting your Payoneer account verified.
          </p>
        </div>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </div>
    </section>
  );
}
