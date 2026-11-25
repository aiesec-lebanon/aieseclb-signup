import type { NextRequest } from "next/server";

// Generous enough for a classroom or info booth signing up from one network,
// low enough to stop scripts from mass-creating EXPA accounts.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_SIGNUPS_PER_WINDOW = 20;
const MAX_TRACKED_CLIENTS = 5000;

// Client IP -> timestamps of recent signup attempts. Kept in memory only and
// dropped once outside the window. Limits apply per server instance.
const attempts = new Map<string, number[]>();

export type QuotaResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** Accept only requests sent by our own pages, not by other sites. */
export function isSameOriginRequest(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  const origin = req.headers.get("origin");
  if (!origin) return false;

  const hosts = [req.headers.get("x-forwarded-host"), req.headers.get("host")]
    .map((value) => value?.split(",")[0]?.trim())
    .filter((value): value is string => Boolean(value));

  try {
    return hosts.includes(new URL(origin).host);
  } catch {
    return false;
  }
}

/** The hidden "website" field is invisible to people; only bots fill it in. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return req.headers.get("x-real-ip")?.trim() || forwardedFor || "unknown";
}

export function consumeSignupQuota(clientKey: string, now = Date.now()): QuotaResult {
  const windowStart = now - WINDOW_MS;
  const recent = (attempts.get(clientKey) ?? []).filter((time) => time > windowStart);

  if (recent.length >= MAX_SIGNUPS_PER_WINDOW) {
    attempts.set(clientKey, recent);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + WINDOW_MS - now) / 1000)),
    };
  }

  recent.push(now);
  attempts.delete(clientKey);
  attempts.set(clientKey, recent);

  if (attempts.size > MAX_TRACKED_CLIENTS) {
    evictStale(windowStart);
  }

  return { allowed: true };
}

function evictStale(windowStart: number) {
  for (const [key, times] of attempts) {
    if (times[times.length - 1] <= windowStart) attempts.delete(key);
  }

  // Still too many: drop the least recently active clients (Map keeps insertion order).
  for (const key of attempts.keys()) {
    if (attempts.size <= MAX_TRACKED_CLIENTS) break;
    attempts.delete(key);
  }
}
