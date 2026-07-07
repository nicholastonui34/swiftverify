"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMessage(data.message || "You're subscribed! Check your inbox.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const dark = variant === "dark";

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium",
          dark ? "bg-brand-500/20 text-brand-100" : "bg-brand-50 text-brand-700",
          className
        )}
      >
        <CheckCircle2 className="h-5 w-5" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={cn(
            "w-full flex-1 rounded-full border px-5 py-3 text-sm outline-none transition-colors focus:ring-2",
            dark
              ? "border-navy-600 bg-navy-900 text-white placeholder-navy-300 focus:border-brand-400 focus:ring-brand-500/30"
              : "border-navy-200 bg-white text-navy-900 placeholder-navy-400 focus:border-brand-400 focus:ring-brand-500/20"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Subscribe
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-500">{message}</p>
      )}
    </form>
  );
}
