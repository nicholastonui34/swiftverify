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

// Always render fresh so promo counts and new testimonials show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, testimonials, promo] = await Promise.all([
    getServices(),
    getTestimonials(),
    getPromoState(),
  ]);

  return (
    <>
      <AnnouncementBanner />
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
