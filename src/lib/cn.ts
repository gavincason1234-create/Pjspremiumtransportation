/** Tiny class-name joiner (no dependency). Falsy values are skipped. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
