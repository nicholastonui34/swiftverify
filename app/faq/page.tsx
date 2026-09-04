import type { Metadata } from "next";
import { DocumentFaqSection, documentFaqs } from "@/components/DocumentFaqSection";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Document Verification FAQ | SwiftVerify",
  description: "Answers to common questions about authentic KYC documents, Proof of Address, work contracts, invoices, business URLs and legitimate document formatting.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <><JsonLd data={faqLd(documentFaqs)} /><Navbar /><main><DocumentFaqSection /></main><Footer /></>;
}
