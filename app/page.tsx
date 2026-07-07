import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { BreakingNews } from "@/components/BreakingNews";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesGrid />
        <HowItWorks />
        <TestimonialsCarousel />
        <BreakingNews />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
