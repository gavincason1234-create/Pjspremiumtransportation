import { TIME_ZONE } from "@/lib/format";

/**
 * Time helpers for the reservation form.
 *
 * `<input type="datetime-local">` returns "YYYY-MM-DDTHH:mm" with no time zone. The business runs on
 * Central Time (America/Chicago), so every local string is interpreted as Central and stored as ISO UTC.
 * These helpers are pure and safe to use on both the server and the client.
 */

const LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

/** Interprets a zone-less local string as Central Time and returns an ISO UTC string. Throws on garbage input. */
export function centralLocalToIso(local: string): string {
  // If the string already has a zone, trust it.
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(local)) return new Date(local).toISOString();
  const guess = new Date(`${local}:00Z`); // treat as UTC first
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(guess).map((p) => [p.type, p.value]));
  const asCentral = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute);
  const offset = asCentral - guess.getTime(); // how far Central is from UTC at that instant
  return new Date(guess.getTime() - offset).toISOString();
}

/** Like `centralLocalToIso` but returns null instead of throwing when the input is not a usable date. */
export function tryCentralLocalToIso(local: string | null | undefined): string | null {
  if (!local) return null;
  const trimmed = local.trim();
  // Only accept the shapes we expect: a datetime-local string, or a full ISO string with a zone.
  if (!LOCAL_RE.test(trimmed) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(trimmed)) return null;
  try {
    const iso = centralLocalToIso(trimmed);
    return Number.isNaN(new Date(iso).getTime()) ? null : iso;
  } catch {
    return null;
  }
}

/** Year/month/day/hour/minute of an instant as seen on a clock in Central Time. */
export function centralParts(date: Date): { year: number; month: number; day: number; hour: number; minute: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    year: +parts.year,
    month: +parts.month,
    day: +parts.day,
    hour: +parts.hour % 24, // some engines print midnight as "24"
    minute: +parts.minute,
  };
}

/** Formats an instant as a Central-time "YYYY-MM-DDTHH:mm" string suitable for a datetime-local input. */
export function toCentralLocal(date: Date): string {
  const p = centralParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/**
 * The earliest pickup we let the picker offer: "now" in Central Time, rounded up to the next 15-minute mark.
 * `leadMinutes` can push the floor later (e.g. 60 for a one-hour minimum notice). The server validates
 * independently, so this is a convenience for the picker, not a security boundary.
 */
export function nextQuarterHourLocal(now: Date = new Date(), leadMinutes = 0): string {
  const step = 15 * 60 * 1000;
  const target = Math.ceil((now.getTime() + leadMinutes * 60 * 1000) / step) * step;
  return toCentralLocal(new Date(target));
}
