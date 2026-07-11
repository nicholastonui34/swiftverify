import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, LayoutDashboard, ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Sign in to see every SwiftVerify order in your account, or look up one by id.",
};

export default async function TrackPage() {
  const session = await auth();
  if (session?.user) redirect("/account");

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
                <LayoutDashboard className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">
                Track your orders
              </h1>
              <p className="mt-1 text-sm text-navy-500">
                Every order you&apos;ve placed already has an account — sign in to see all of
                them, their status, receipts and more in one place.
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          <details className="group mt-6 rounded-2xl border border-navy-100 bg-white shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-4 text-sm font-semibold text-navy-700">
              Look up a single order without signing in
              <ChevronDown className="h-4 w-4 text-navy-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-navy-100 px-6 py-6">
              <TrackForm />
            </div>
          </details>

          <p className="mt-6 text-center text-xs text-navy-500">
            Don&apos;t have an order yet?{" "}
            <Link href="/order" className="font-medium text-brand-600 hover:underline">
              Place one now
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
