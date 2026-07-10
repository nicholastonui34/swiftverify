import "server-only";
import { headers } from "next/headers";

/**
 * Lightweight abuse controls for the unauthenticated funnel (order, payment,
 * newsletter, track, login). Zero dependencies:
 *
 * - Rate limiting: fixed-window counter in Upstash Redis (REST) when
 *   UPSTASH_REDIS_REST_URL/TOKEN are set, otherwise an in-memory per-instance
 *   fallback (fine for dev / single instance). **Fails open** — a backend error
 *   never blocks a legitimate request.
 * - Honeypot: a hidden form field real users never fill; bots that autofill it
 *   are rejected.
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type RateLimitResult = { success: boolean; remaining: number };

// Per-instance fallback store. Not distributed, but a useful soft guard.
const memory = new Map<string, { count: number; reset: number }>();

/**
 * Increment the counter for `key` and report whether it's still within `limit`
 * per `windowSec` seconds.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const id = `rl:${key}`;

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          "Content-Type": "application/json",
        },
        // INCR then set TTL only on the first hit (NX) → true fixed window.
        body: JSON.stringify([
          ["INCR", id],
          ["EXPIRE", id, windowSec, "NX"],
        ]),
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { result?: number }[];
        const count = Number(data?.[0]?.result ?? 0);
        return { success: count <= limit, remaining: Math.max(0, limit - count) };
      }
    } catch {
      // fall through to in-memory
    }
  }

  const now = Date.now();
  const entry = memory.get(id);
  if (!entry || entry.reset < now) {
    memory.set(id, { count: 1, reset: now + windowSec * 1000 });
    return { success: true, remaining: limit - 1 };
  }
  entry.count += 1;
  return { success: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/** Rate-limit the current request keyed by IP + a route bucket. */
export async function rateLimitByIp(
  bucket: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const ip = await clientIp();
  return rateLimit(`${bucket}:${ip}`, limit, windowSec);
}
