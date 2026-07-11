import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PackageOpen, LogOut, Calendar } from "lucide-react";
import { auth, signOut } from "@/auth";
import { getClientOrders } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "My account", robots: { index: false } };
export const dynamic = "force-dynamic";

function actionForStatus(orderId: string, status: string) {
  if (status === "PENDING_PAYMENT" || status === "PAYMENT_SUBMITTED") {
    return { href: `/order/${orderId}/payment`, label: "View payment" };
  }
  if (status === "APPROVED" || status === "IN_PROGRESS" || status === "COMPLETED") {
    return { href: `/order/${orderId}/receipt`, label: "View receipt" };
  }
  return { href: `/order/${orderId}/status`, label: "View status" };
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const orders = await getClientOrders(session.user.id);

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <main className="min-h-screen bg-navy-50/40">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-900">
              Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-navy-500">{session.user.email}</p>
          </div>
          <Link
            href="/order"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            Place new order
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="border-b border-navy-100 px-6 py-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-navy-400">
              Your orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <PackageOpen className="h-10 w-10 text-navy-300" />
              <p className="text-sm text-navy-500">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/order"
                className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Place your first order
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-navy-100">
              {orders.map((order) => {
                const action = actionForStatus(order.id, order.status);
                return (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div>
                      <p className="font-semibold text-navy-900">{order.serviceName}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-KE")} ·{" "}
                        {formatKES(order.priceKES)} · #{order.id.slice(-8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <Link
                        href={action.href}
                        className="text-sm font-semibold text-brand-600 hover:underline"
                      >
                        {action.label}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
