"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
  type TestimonialInput,
} from "@/app/admin/actions";

export type TestimonialRow = {
  id: string;
  authorName: string;
  country: string;
  service: string;
  rating: number;
  review: string;
  photoUrl: string | null;
  source: string;
  isActive: boolean;
};

const EMPTY: TestimonialInput = {
  authorName: "",
  country: "",
  service: "",
  rating: 5,
  review: "",
  photoUrl: "",
  source: "TELEGRAM",
  isActive: true,
};

export function TestimonialManager({ initial }: { initial: TestimonialRow[] }) {
  const [editing, setEditing] = useState<TestimonialRow | "new" | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onToggle = (row: TestimonialRow) =>
    startTransition(async () => {
      await toggleTestimonial(row.id, !row.isActive);
    });

  const onDelete = (row: TestimonialRow) => {
    if (!confirm(`Delete testimonial from ${row.authorName}?`)) return;
    startTransition(async () => {
      await deleteTestimonial(row.id);
    });
  };

  const onSubmit = (input: TestimonialInput) => {
    setError(null);
    startTransition(async () => {
      const r =
        editing === "new"
          ? await createTestimonial(input)
          : await updateTestimonial((editing as TestimonialRow).id, input);
      if (r.ok) setEditing(null);
      else setError(r.error ?? "Something went wrong.");
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setEditing("new");
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {initial.length === 0 && (
          <p className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-500">
            No testimonials yet.
          </p>
        )}
        {initial.map((t) => (
          <div
            key={t.id}
            className={`rounded-2xl border bg-white p-5 shadow-card ${
              t.isActive ? "border-navy-100" : "border-dashed border-navy-200 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-900">{t.authorName}</p>
                <p className="text-xs text-navy-500">
                  {t.country} · {t.service}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-navy-600">&ldquo;{t.review}&rdquo;</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-navy-400">
                {t.source}
              </span>
              <span className="flex-1" />
              <IconBtn title={t.isActive ? "Hide" : "Show"} onClick={() => onToggle(t)} disabled={pending}>
                {t.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </IconBtn>
              <IconBtn
                title="Edit"
                onClick={() => {
                  setError(null);
                  setEditing(t);
                }}
                disabled={pending}
              >
                <Pencil className="h-4 w-4" />
              </IconBtn>
              <IconBtn title="Delete" onClick={() => onDelete(t)} disabled={pending} danger>
                <Trash2 className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <TestimonialModal
          initial={editing === "new" ? EMPTY : rowToInput(editing)}
          isNew={editing === "new"}
          pending={pending}
          error={error}
          onCancel={() => setEditing(null)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

function rowToInput(row: TestimonialRow): TestimonialInput {
  return {
    authorName: row.authorName,
    country: row.country,
    service: row.service,
    rating: row.rating,
    review: row.review,
    photoUrl: row.photoUrl ?? "",
    source: row.source,
    isActive: row.isActive,
  };
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-navy-500 hover:bg-navy-50 hover:text-navy-800"
      }`}
    >
      {children}
    </button>
  );
}

function TestimonialModal({
  initial,
  isNew,
  pending,
  error,
  onCancel,
  onSubmit,
}: {
  initial: TestimonialInput;
  isNew: boolean;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (input: TestimonialInput) => void;
}) {
  const [form, setForm] = useState<TestimonialInput>(initial);
  const set = <K extends keyof TestimonialInput>(k: K, v: TestimonialInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-card-hover">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-navy-900">
            {isNew ? "Add testimonial" : "Edit testimonial"}
          </h3>
          <button type="button" onClick={onCancel} className="rounded-lg p-1 text-navy-400 hover:bg-navy-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Input label="Author name" value={form.authorName} onChange={(v) => set("authorName", v)} />
          <Input label="Country" value={form.country} onChange={(v) => set("country", v)} />
          <Input label="Service" value={form.service} onChange={(v) => set("service", v)} />
          <div>
            <Label>Rating</Label>
            <select
              value={form.rating}
              onChange={(e) => set("rating", Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <Label>Review</Label>
            <textarea
              value={form.review}
              onChange={(e) => set("review", e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
            />
          </div>
          <Input
            label="Photo URL (optional)"
            value={form.photoUrl ?? ""}
            onChange={(v) => set("photoUrl", v)}
          />
          <div>
            <Label>Source</Label>
            <select
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
            >
              <option value="TELEGRAM">Telegram</option>
              <option value="DIRECT">Direct</option>
            </select>
          </div>
          <label className="col-span-2 flex items-center gap-2 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-navy-300 text-brand-500 focus:ring-brand-500"
            />
            Show on the landing page
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(form)}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNew ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400">{children}</label>;
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
      />
    </div>
  );
}
