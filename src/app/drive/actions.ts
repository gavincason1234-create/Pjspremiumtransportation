"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { ActionState } from "@/lib/actions";
import { hashIp } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { formatPhone } from "@/lib/format";
import { notifyOwner } from "@/lib/notify";
import { hoursAgoIso, rateLimit } from "@/lib/rate-limit";
import { currentIp } from "@/lib/request";
import { BUSINESS, siteUrl } from "@/lib/site";
import type { DriverApplication } from "@/lib/types";
import { driverApplicationSchema, fieldErrors, formToObject } from "@/lib/validation";

/** What the form receives back after a successful submission. */
export interface SubmitApplicationResult {
  application: DriverApplication;
}

export type SubmitApplicationState = ActionState<SubmitApplicationResult>;

const HOUR_MS = 60 * 60 * 1000;
/** Short-window limit (in-memory, per instance) and the durable per-day cap checked against the database. */
const BURST_LIMIT = 3;
const DAILY_LIMIT = 3;

/**
 * Handles the public "Drive with PJ's" application form.
 * Order of checks: honeypot → schema → in-memory rate limit → database rate limit → persist → notify owner.
 * Deliberately collects nothing that identifies a person beyond name, phone and plate: no date of birth,
 * no license or Social Security numbers, no photos or documents.
 */
export async function submitApplication(_prev: SubmitApplicationState, formData: FormData): Promise<SubmitApplicationState> {
  // 1. Honeypot. Applicants never see the "website" field, so anything typed into it came from a bot.
  const trap = formData.get("website");
  if (typeof trap === "string" && trap.trim() !== "") {
    return { ok: false, message: `We could not send that application. Please text ${BUSINESS.ownerFirstName} at ${BUSINESS.phone} instead.` };
  }

  // 2. Validate with the shared schema so the form, the API and the admin all agree on what an application is.
  const parsed = driverApplicationSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    // The years field is a union (blank or a number), so Zod's default message is not helpful. Say what we mean.
    if (fields.yearsDriving) fields.yearsDriving = "Please enter a whole number of years, between 0 and 80.";
    return { ok: false, message: "Please check the highlighted fields.", fields };
  }
  const input = parsed.data;

  // 3. Rate limits: a quick per-instance window, then a durable per-day count in the database.
  const ipHash = hashIp(await currentIp());
  const burst = rateLimit(`apply:${ipHash}`, { limit: BURST_LIMIT, windowMs: HOUR_MS });
  if (!burst.ok) {
    return {
      ok: false,
      message: `You have sent a few applications in a short time. Please try again in about an hour, or text ${BUSINESS.ownerFirstName} at ${BUSINESS.phone}.`,
    };
  }

  try {
    const db = await getDb();
    const recent = await db.applications.countRecentByIp(ipHash, hoursAgoIso(24));
    if (recent >= DAILY_LIMIT) {
      return {
        ok: false,
        message: `We have already received several applications from your connection today. If you have not heard back yet, text ${BUSINESS.ownerFirstName} at ${BUSINESS.phone}.`,
      };
    }

    // 4. Persist. The schema has already trimmed, upper-cased the plate and turned blanks into nulls.
    const application = await db.applications.create({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      licensePlate: input.licensePlate,
      vehicle: input.vehicle,
      yearsDriving: input.yearsDriving ?? null,
      city: input.city ?? null,
      message: input.message ?? null,
      ipHash,
    });

    // 5. Let the owner know after the response has been sent so the applicant is not kept waiting.
    after(() =>
      notifyOwner({
        subject: `New driver application: ${application.name} (${application.licensePlate})`,
        text: [
          `${application.name} would like to drive with ${BUSINESS.shortName}.`,
          "",
          `Name:          ${application.name}`,
          `Phone:         ${formatPhone(application.phone)}`,
          `Email:         ${application.email ?? "(not given)"}`,
          `Plate:         ${application.licensePlate}`,
          `Vehicle:       ${application.vehicle}`,
          `Years driving: ${application.yearsDriving ?? "(not given)"}`,
          `City:          ${application.city ?? "(not given)"}`,
          "",
          "Message:",
          application.message ?? "(none)",
          "",
          `Review applications in the owner area: ${siteUrl()}/admin`,
        ].join("\n"),
      }),
    );

    revalidatePath("/admin");

    return { ok: true, message: "Application received.", data: { application } };
  } catch (err) {
    console.error("[drive] submitApplication failed", err);
    return {
      ok: false,
      message: `Something went wrong on our end and your application was not saved. Please try again in a moment, or text your name and plate to ${BUSINESS.phone}.`,
    };
  }
}
