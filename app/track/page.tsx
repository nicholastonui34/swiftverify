import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check the status of your SwiftVerify order with your order ID and email.",
};

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-navy-50/40">
        <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
            <div className="flex flex-col items-center text-center">
              <span className="rounded-2xl bg-brand-100 p-3 text-brand-600">
                <PackageSearch className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">
                Track your order
              </h1>
              <p className="mt-1 text-sm text-navy-500">
                Enter your order ID and the email you used to check its status.
              </p>
            </div>

            <div className="mt-8">
              <TrackForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-navy-500">
            Can&apos;t find your order ID? It&apos;s in your confirmation email, or{" "}
            <Link href="/order" className="font-medium text-brand-600 hover:underline">
              place a new order
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
