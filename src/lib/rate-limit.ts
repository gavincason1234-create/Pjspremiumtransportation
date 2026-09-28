/**
 * Best-effort in-memory sliding-window rate limiter.
 * On serverless this is per-instance, so pair it with the DB-backed `countRecentByIp`
 * checks for the forms that matter (bookings, reviews, applications).
 */

interface Bucket {
  hits: number[];
}

declare global {
  var __pjsRateBuckets: Map<string, Bucket> | undefined;
}

function buckets(): Map<string, Bucket> {
  if (!globalThis.__pjsRateBuckets) globalThis.__pjsRateBuckets = new Map();
  return globalThis.__pjsRateBuckets;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(key: string, opts: { limit: number; windowMs: number }): RateLimitResult {
  const now = Date.now();
  const map = buckets();
  const b = map.get(key) ?? { hits: [] };
  b.hits = b.hits.filter((t) => now - t < opts.windowMs);
  if (b.hits.length >= opts.limit) {
    const oldest = b.hits[0];
    map.set(key, b);
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((opts.windowMs - (now - oldest)) / 1000) };
  }
  b.hits.push(now);
  map.set(key, b);
  // Opportunistic cleanup so the map cannot grow without bound.
  if (map.size > 5000) {
    for (const [k, v] of map) if (v.hits.every((t) => now - t >= opts.windowMs)) map.delete(k);
  }
  return { ok: true, remaining: opts.limit - b.hits.length, retryAfterSec: 0 };
}

export function hoursAgoIso(hours: number): string {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}
