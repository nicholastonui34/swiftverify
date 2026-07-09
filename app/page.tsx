import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { BreakingNews } from "@/components/BreakingNews";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { getServices, getTestimonials, getPromoState } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { tips as defaultTips } from "@/lib/content";

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
      <AnnouncementBanner tips={tips} />
      <Navbar />
      <main className="flex-1">
        <Hero promo={promo} />
        <ServicesGrid services={services} promo={promo} />
        <HowItWorks />
        <TestimonialsCarousel testimonials={testimonials} />
        <BreakingNews />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
