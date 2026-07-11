import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = { title: "Create your account", robots: { index: false } };

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/account");

  return (
    <main className="flex min-h-screen flex-col bg-navy-50/40">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              Track every order and payment in one place.
            </p>
          </div>

          <div className="mt-8">
            <SignupForm />
          </div>

          <p className="mt-6 text-center text-sm text-navy-500">
            Already have an account?{" "}
            <Link href="/account/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 inline-flex items-center justify-center gap-2 text-center text-xs text-navy-500">
          <ShieldCheck className="h-4 w-4 text-brand-500" />
          Your details are only used to manage your orders.
        </p>
      </div>
    </main>
  );
}
