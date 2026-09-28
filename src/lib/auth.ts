import { cookies } from "next/headers";
import { constantTimeEquals, signToken, verifyToken } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import type { Driver } from "@/lib/types";

export const ADMIN_COOKIE = "pjs_admin";
export const DRIVER_COOKIE = "pjs_driver";
const ADMIN_TTL = 60 * 60 * 24 * 7; // 7 days
const DRIVER_TTL = 60 * 60 * 14; // one long shift

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});

/* ------------------------------------------------------------------ admin */

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  return constantTimeEquals(candidate, expected);
}

/** Only callable from Server Actions / Route Handlers (cookie writes). */
export async function createAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signToken("admin", ADMIN_TTL), cookieOpts(ADMIN_TTL));
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value) === "admin";
}

/** Throws a 401-style error for API routes / actions that must be admin-only. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new AuthError("Admin sign-in required.");
}

/* ------------------------------------------------------------------ driver */

export async function createDriverSession(driverId: string): Promise<void> {
  const jar = await cookies();
  jar.set(DRIVER_COOKIE, signToken(`driver:${driverId}`, DRIVER_TTL), cookieOpts(DRIVER_TTL));
}

export async function destroyDriverSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(DRIVER_COOKIE);
}

export async function currentDriver(): Promise<Driver | null> {
  const jar = await cookies();
  const payload = verifyToken(jar.get(DRIVER_COOKIE)?.value);
  if (!payload || !payload.startsWith("driver:")) return null;
  const db = await getDb();
  const driver = await db.drivers.get(payload.slice("driver:".length));
  return driver && driver.active ? driver : null;
}

export async function requireDriver(): Promise<Driver> {
  const d = await currentDriver();
  if (!d) throw new AuthError("Driver sign-in required.");
  return d;
}

export class AuthError extends Error {
  status = 401;
}
