import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { isDbConfigured } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · SwiftVerify Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defence in depth — middleware already blocks non-admins, but never trust it alone.
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  if (!isDbConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-50 p-6 text-center">
        <div className="max-w-md rounded-2xl border border-navy-100 bg-white p-8">
          <h1 className="font-display text-xl font-bold text-navy-900">Database not configured</h1>
          <p className="mt-2 text-sm text-navy-600">
            Set <code className="rounded bg-navy-50 px-1">DATABASE_URL</code> to use the admin
            dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-50/50 md:flex-row">
      <AdminSidebar
        userName={session.user.name ?? "Admin"}
        userEmail={session.user.email ?? ""}
        signOutAction={handleSignOut}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
