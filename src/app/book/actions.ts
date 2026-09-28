"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { hashIp } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { notifyOwner } from "@/lib/notify";
import { hoursAgoIso, rateLimit } from "@/lib/rate-limit";
import { currentIp } from "@/lib/request";
import { BUSINESS, siteUrl } from "@/lib/site";
import { SERVICE_TYPES } from "@/lib/types";
import { bookingSchema, fieldErrors, formToObject } from "@/lib/validation";
import { tryCentralLocalToIso } from "./time";
import { BOOKING_FIELDS, type BookingActionState, type BookingFormValues } from "./types";

const HOURLY_LIMIT = 6;
const DAILY_LIMIT = 8;

const FALLBACK_MESSAGE = "Something went wrong. Please call or text us and we'll get you booked.";

function preservedValues(raw: Record<string, string>): BookingFormValues {
  const out: BookingFormValues = {};
  for (const key of BOOKING_FIELDS) {
    const v = raw[key];
    if (typeof v === "string" && v !== "") out[key] = v.slice(0, 1000);
  }
  return out;
}

function failure(message: string, values: BookingFormValues, fields?: Record<string, string>): BookingActionState {
  return { ok: false, message, fields, data: { values, respondedAt: new Date().toISOString() } };
}

/**
 * Handles the public reservation form.
 * Order of checks: honeypot → schema → in-memory rate limit → database rate limit → persist → notify owner.
 */
export async function submitBooking(_prev: BookingActionState, formData: FormData): Promise<BookingActionState> {
  // 1. Honeypot. Humans never see the "website" field; anything in it is a bot.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return failure("We couldn't process that request. Please call or text us instead.", {});
  }

  const raw = formToObject(formData);
  const values = preservedValues(raw);

  // 2. Validate. The datetime-local value is zone-less, so normalise it to Central Time *before* the schema's
  //    "must be in the future" check runs; otherwise a server in UTC would judge Central times several hours off.
  const parsed = bookingSchema.safeParse({
    ...raw,
    pickupAt: tryCentralLocalToIso(raw.pickupAt) ?? raw.pickupAt ?? "",
  });
  if (!parsed.success) {
    return failure("Please check the highlighted fields.", values, fieldErrors(parsed.error));
  }
  const input = parsed.data;

  // 3. Rate limits: a quick per-instance window, then a durable per-day count in the database.
  const ip = await currentIp();
  const ipHash = hashIp(ip);
  const window = rateLimit(`book:${ipHash}`, { limit: HOURLY_LIMIT, windowMs: 60 * 60 * 1000 });
  if (!window.ok) {
    return failure(
      `You've sent several requests in a short time. Please give it a few minutes, or call or text ${BUSINESS.phone} and we'll get you booked right away.`,
      values,
    );
  }

  const db = await getDb();
  try {
    const recent = await db.bookings.countRecentByIp(ipHash, hoursAgoIso(24));
    if (recent >= DAILY_LIMIT) {
      return failure(
        `We've received quite a few requests from this connection today. Please call or text ${BUSINESS.phone} and we'll take care of you personally.`,
        values,
      );
    }

    // 4. Persist. `input.pickupAt` is already an ISO UTC string (normalised above).
    const booking = await db.bookings.create({
      serviceType: input.serviceType,
      pickupAddress: input.pickupAddress,
      dropoffAddress: input.dropoffAddress,
      pickupAt: new Date(input.pickupAt).toISOString(),
      passengers: input.passengers,
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      notes: input.notes ?? null,
      ipHash,
    });

    // 5. Tell the owner, after the response has been sent.
    const serviceName = SERVICE_TYPES.find((s) => s.value === booking.serviceType)?.label ?? booking.serviceType;
    const lines = [
      `New ride request ${booking.code}`,
      "",
      `Service:     ${serviceName}`,
      `Pickup time: ${formatDateTime(booking.pickupAt, { withYear: true })} (Central)`,
      `From:        ${booking.pickupAddress}`,
      `To:          ${booking.dropoffAddress}`,
      `Passengers:  ${booking.passengers}`,
      "",
      `Name:        ${booking.name}`,
      `Phone:       ${booking.phone}`,
      `Email:       ${booking.email ?? "(not given)"}`,
      `Notes:       ${booking.notes ?? "(none)"}`,
      "",
      `Confirm with the rider by text or call, then mark it confirmed in the owner area: ${siteUrl()}/admin`,
    ];
    after(() => notifyOwner({ subject: `New ride request ${booking.code}`, text: lines.join("\n") }));

    revalidatePath("/admin");

    return {
      ok: true,
      message: `Request received. Your confirmation code is ${booking.code}.`,
      data: { booking, respondedAt: new Date().toISOString() },
    };
  } catch (err) {
    console.error("[book] submitBooking failed", err);
    return failure(FALLBACK_MESSAGE, values);
  }
}
