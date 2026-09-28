import { headers } from "next/headers";

/** Client IP from proxy headers (Vercel sets x-forwarded-for). Never persisted raw — see hashIp(). */
export function ipFromHeaders(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function currentIp(): Promise<string> {
  return ipFromHeaders(await headers());
}

/** Consistent JSON error shape for API routes: { error: string, fields?: Record<string,string> } */
export function jsonError(message: string, status = 400, fields?: Record<string, string>) {
  return Response.json(fields ? { error: message, fields } : { error: message }, { status });
}
