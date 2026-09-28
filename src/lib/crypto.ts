import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** Secret used to sign cookies. Derived from ADMIN_PASSWORD unless SESSION_SECRET is set explicitly. */
export function sessionSecret(): string {
  const explicit = process.env.SESSION_SECRET;
  if (explicit && explicit.length >= 16) return explicit;
  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (!pw) return "dev-only-insecure-secret-change-me";
  return createHash("sha256").update(`pjs-session:${pw}`).digest("hex");
}

export function hmac(value: string, secret = sessionSecret()): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

/** Signs `payload` into `payload.expiresAt.signature`. */
export function signToken(payload: string, ttlSeconds: number): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${payload}.${expiresAt}`;
  return `${body}.${hmac(body)}`;
}

/** Returns the payload if the token is valid and unexpired, else null. */
export function verifyToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return null;
  const body = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = hmac(body);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const expDot = body.lastIndexOf(".");
  if (expDot < 0) return null;
  const expiresAt = Number(body.slice(expDot + 1));
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return null;
  return body.slice(0, expDot);
}

/** Hash a driver PIN (short secret) with scrypt + random salt. Format: salt:hash (hex). */
export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPinHash(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(pin, salt, 32);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/** One-way, salted hash of an IP for rate limiting. Never store raw IPs. */
export function hashIp(ip: string | null | undefined): string {
  return createHash("sha256").update(`ip:${sessionSecret()}:${ip ?? "unknown"}`).digest("hex").slice(0, 32);
}

export function constantTimeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
