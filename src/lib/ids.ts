import { randomBytes, randomUUID } from "node:crypto";

/** Unambiguous alphabet: no 0/O, 1/I/L. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function shortCode(length = 6): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/** Booking confirmation codes look like PJ-7K3M9. */
export function bookingCode(): string {
  return `PJ-${shortCode(5)}`;
}

/** Trip share codes look like K7M3PQ (used in /track/K7M3PQ). */
export function tripCode(): string {
  return shortCode(6);
}

export function uuid(): string {
  return randomUUID();
}
