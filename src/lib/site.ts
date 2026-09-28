import type { SiteSettings } from "@/lib/types";

/**
 * Business constants. Editable values (phone, availability, etc.) live in site_settings
 * and are managed from /admin; these are the defaults used until the owner changes them.
 */
export const BUSINESS = {
  name: "PJ's Premium Transportation",
  shortName: "PJ's",
  ownerFirstName: "Patsy",
  city: "Myra",
  state: "TX",
  phone: "(940) 277-9099",
  phoneHref: "tel:+19402779099",
  smsHref: "sms:+19402779099",
  email: "pjspremiumtransportation@gmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61591566692936",
  tagline: "The driver you know. The service you trust.",
  promise: "Premium rides. Personal service. Every time.",
  serviceArea: "Myra & Cooke County · Gainesville · DFW Metroplex · WinStar",
} as const;

export const DEFAULT_SETTINGS: Omit<SiteSettings, "updatedAt"> = {
  businessName: BUSINESS.name,
  phone: BUSINESS.phone,
  email: BUSINESS.email,
  facebookUrl: BUSINESS.facebookUrl,
  serviceArea: BUSINESS.serviceArea,
  availabilityStatus: "accepting",
  availabilityNote: "",
  hoursText: "Reservations only. Early-morning airport runs and late-night pickups available by request.",
  reviewsRequireApproval: false,
};

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Turns "(940) 277-9099" into "tel:+19402779099". */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  return `tel:${e164}`;
}

export function smsHref(phone: string, body?: string): string {
  const digits = phone.replace(/\D/g, "");
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  return body ? `sms:${e164}?&body=${encodeURIComponent(body)}` : `sms:${e164}`;
}
