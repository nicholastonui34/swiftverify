"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, KeyRound, Loader2, X, AlertCircle, ShieldCheck, Shield } from "lucide-react";
import {
  createAdmin,
  updateAdminRole,
  resetAdminPassword,
  deleteAdmin,
  type CreateAdminInput,
} from "@/app/admin/actions";
import type { AdminUser } from "@/lib/admin";

export function TeamManager({
  initial,
  currentUserId,
}: {
  initial: AdminUser[];
  currentUserId: string;
}) {
  const [adding, setAdding] = useState(false);
  const [resetting, setResetting] = useState<AdminUser | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onRoleChange = (user: AdminUser, role: "ADMIN" | "SUPER_ADMIN") => {
    setError(null);
    startTransition(async () => {
      const r = await updateAdminRole(user.id, role);
      if (!r.ok) setError(r.error ?? "Something went wrong.");
    });
  };

  const onDelete = (user: AdminUser) => {
    if (!confirm(`Remove admin access for ${user.email}?`)) return;
    setError(null);
    startTransition(async () => {
      const r = await deleteAdmin(user.id);
      if (!r.ok) setError(r.error ?? "Something went wrong.");
    });
  };

  const onCreate = (input: CreateAdminInput) => {
    setError(null);
    startTransition(async () => {
      const r = await createAdmin(input);
      if (r.ok) setAdding(false);
      else setError(r.error ?? "Something went wrong.");
    });
  };

  const onReset = (password: string) => {
    if (!resetting) return;
    setError(null);
    startTransition(async () => {
      const r = await resetAdminPassword(resetting.id, password);
      if (r.ok) setResetting(null);
      else setError(r.error ?? "Something went wrong.");
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Add admin
        </button>
      </div>

      <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
        {initial.map((u) => {
          const isSelf = u.id === currentUserId;
          return (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                {u.role === "SUPER_ADMIN" ? (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-brand-500" />
                ) : (
                  <Shield className="h-5 w-5 shrink-0 text-navy-400" />
                )}
                <div>
                  <p className="font-semibold text-navy-900">
                    {u.name || u.email} {isSelf && <span className="text-xs text-navy-400">(you)</span>}
                  </p>
                  <p className="text-xs text-navy-500">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={u.role}
                  disabled={pending || isSelf}
                  onChange={(e) => onRoleChange(u, e.target.value as "ADMIN" | "SUPER_ADMIN")}
                  className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 outline-none focus:border-brand-400 disabled:opacity-50"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <IconBtn
                  title="Reset password"
                  onClick={() => {
                    setError(null);
                    setResetting(u);
                  }}
                  disabled={pending}
                >
                  <KeyRound className="h-4 w-4" />
                </IconBtn>
                <IconBtn title="Remove" onClick={() => onDelete(u)} disabled={pending || isSelf} danger>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          );
        })}
      </div>

      {adding && (
        <CreateAdminModal pending={pending} error={error} onCancel={() => setAdding(false)} onSubmit={onCreate} />
      )}
      {resetting && (
        <ResetPasswordModal
          user={resetting}
          pending={pending}
          error={error}
          onCancel={() => setResetting(null)}
          onSubmit={onReset}
        />
      )}
    </div>
  );
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
      className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 ${
        danger ? "text-red-500 hover:bg-red-50" : "text-navy-500 hover:bg-navy-50 hover:text-navy-800"
      }`}
    >
      {children}
    </button>
  );
}

function CreateAdminModal({
  pending,
  error,
  onCancel,
  onSubmit,
}: {
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (input: CreateAdminInput) => void;
}) {
  const [form, setForm] = useState<CreateAdminInput>({
    email: "",
    name: "",
    password: "",
    role: "ADMIN",
  });

  return (
    <Modal title="Add admin" onCancel={onCancel}>
      {error && <ErrorBox>{error}</ErrorBox>}
      <div className="mt-4 space-y-4">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
          />
        </Field>
        <Field label="Temporary password (min 8 characters)">
          <input
            type="text"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
          />
        </Field>
        <Field label="Role">
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as CreateAdminInput["role"] }))}
            className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </Field>
      </div>
      <ModalActions pending={pending} label="Create" onCancel={onCancel} onSubmit={() => onSubmit(form)} />
    </Modal>
  );
}

function ResetPasswordModal({
  user,
  pending,
  error,
  onCancel,
  onSubmit,
}: {
  user: AdminUser;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <Modal title={`Reset password — ${user.email}`} onCancel={onCancel}>
      {error && <ErrorBox>{error}</ErrorBox>}
      <div className="mt-4">
        <Field label="New password (min 8 characters)">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-400"
          />
        </Field>
      </div>
      <ModalActions pending={pending} label="Reset" onCancel={onCancel} onSubmit={() => onSubmit(password)} />
    </Modal>
  );
}

function Modal({
  title,
  onCancel,
  children,
}: {
  title: string;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-card-hover">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
          <button type="button" onClick={onCancel} className="rounded-lg p-1 text-navy-400 hover:bg-navy-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
      <AlertCircle className="h-4 w-4" /> {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</label>
      {children}
    </div>
  );
}

function ModalActions({
  pending,
  label,
  onCancel,
  onSubmit,
}: {
  pending: boolean;
  label: string;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
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
        onClick={onSubmit}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>
    </div>
  );
}
