import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdmins } from "@/lib/admin";
import { TeamManager } from "@/components/admin/TeamManager";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  const admins = await getAdmins();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Team</h1>
        <p className="mt-1 text-sm text-navy-500">
          Manage admin accounts. Super Admins can create/remove admins, change roles, and edit
          M-PESA/financial settings — regular Admins handle orders, promo, testimonials, and
          analytics only.
        </p>
      </header>
      <TeamManager initial={admins} currentUserId={session.user.id} />
    </div>
  );
}
