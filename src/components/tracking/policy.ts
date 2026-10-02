import type { Trip } from "@/lib/types";

/**
 * The rules live trip tracking runs by. Kept in one place so the driver console, the rider's page
 * and the API routes can never drift apart. Safe to import from client and server code.
 */

/** Exact wording the driver agrees to before every trip. Shown next to the consent checkbox. */
export const CONSENT_TEXT =
  "I agree to share my live location with PJ's and with the rider who has this trip's link, only while this trip is active. I can stop sharing at any time.";

/** How often the rider's page asks for a fresh position while a trip is active. */
export const POLL_INTERVAL_MS = 5_000;

/** Longest gap between retries when the rider's page cannot reach the server. */
export const POLL_MAX_BACKOFF_MS = 20_000;

/** A position older than this, on an active trip, gets a gentle "may be in a weak-signal area" note. */
export const STALE_LOCATION_MS = 3 * 60_000;

/**
 * Safety net for a trip the driver forgot to end: after this long it is treated as ended and closed,
 * so a driver's position is never shared indefinitely. Matches the driver sign-in lifetime (one long shift).
 */
export const MAX_TRIP_HOURS = 14;

/** Points recorded more than this long before a trip started are dropped (never stored before consent). */
export const PRE_START_TOLERANCE_MS = 2 * 60_000;

export function isTripExpired(trip: Pick<Trip, "status" | "startedAt">, now: number = Date.now()): boolean {
  if (trip.status !== "active") return false;
  const started = Date.parse(trip.startedAt);
  return Number.isFinite(started) && now - started > MAX_TRIP_HOURS * 60 * 60 * 1000;
}
