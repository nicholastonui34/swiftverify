import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-navy-500">
          These override the built-in defaults and take effect on the live site immediately.
        </p>
      </header>
      <SettingsForm initial={settings} />
    </div>
  );
}
