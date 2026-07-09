"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { saveSettings, type ActionResult } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form, setForm] = useState<SiteSettings>(initial);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSave = () =>
    startTransition(async () => {
      setResult(await saveSettings(form));
    });

  return (
    <div className="space-y-6">
      {result && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
            result.ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"
          }`}
        >
          {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {result.message ?? result.error}
        </div>
      )}

      <Section title="M-PESA payment" desc="Shown to clients on the payment page.">
        <Field label="Buy Goods Till number">
          <input
            value={form.mpesaTill}
            onChange={(e) => set("mpesaTill", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Merchant name">
          <input
            value={form.mpesaMerchantName}
            onChange={(e) => set("mpesaMerchantName", e.target.value)}
            className={inputCls}
          />
        </Field>
      </Section>

      <Section title="Contact & promo">
        <Field label="Admin / support email">
          <input
            type="email"
            value={form.adminEmail}
            onChange={(e) => set("adminEmail", e.target.value)}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-700">
          <input
            type="checkbox"
            checked={form.promoActive}
            onChange={(e) => set("promoActive", e.target.checked)}
            className="h-4 w-4 rounded border-navy-300 text-brand-500 focus:ring-brand-500"
          />
          First-10 promo active
        </label>
      </Section>

      <Section title="Site copy">
        <Field label="Company tagline" full>
          <input
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Current banner tip (overrides the first rotating tip; blank = default)" full>
          <input
            value={form.currentTip}
            onChange={(e) => set("currentTip", e.target.value)}
            placeholder="e.g. 🎉 Flash sale: first 10 verifications this week at KES 1,250"
            className={inputCls}
          />
        </Field>
      </Section>

      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save settings
      </button>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-navy-900">{title}</h2>
      {desc && <p className="mt-0.5 text-sm text-navy-500">{desc}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400">
        {label}
      </label>
      {children}
    </div>
  );
}
