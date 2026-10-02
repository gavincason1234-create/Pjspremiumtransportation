import { z } from "zod";
import { centralLocalToIso } from "@/lib/format";

/**
 * Zod v4 schemas shared by API routes, server actions and client forms.
 * Keep error messages human: they are shown directly under form fields.
 */

export const SERVICE_TYPE_VALUES = ["airport", "medical", "winstar", "metroplex", "local", "hourly", "other"] as const;

const name = z.string().trim().min(2, "Please enter your name.").max(80, "That name is a bit long.");
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a phone number we can reach you at.")
  .max(25, "That phone number looks too long.")
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Please include your area code.");
const optionalEmail = z
  .union([z.literal(""), z.email("That email address doesn't look right.")])
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

/** Bots fill hidden fields; humans never see them. Must be empty. */
const honeypot = z.string().max(0, "Submission rejected.").optional();

export const bookingSchema = z.object({
  serviceType: z.enum(SERVICE_TYPE_VALUES, "Please choose a service."),
  pickupAddress: z.string().trim().min(4, "Where should we pick you up?").max(200),
  dropoffAddress: z.string().trim().min(4, "Where are you headed?").max(200),
  /**
   * From <input type="datetime-local">: "YYYY-MM-DDTHH:mm" (no timezone) or a full ISO string.
   * Zone-less values are interpreted as Central Time; the output is always an ISO UTC string.
   */
  pickupAt: z
    .string()
    .trim()
    .min(1, "When do you need the ride?")
    .transform((v, ctx) => {
      const iso = centralLocalToIso(v);
      if (!iso) {
        ctx.addIssue({ code: "custom", message: "Please pick a valid date and time." });
        return z.NEVER;
      }
      return iso;
    })
    .refine((v) => new Date(v).getTime() > Date.now() - 60 * 60 * 1000, "Please choose a time in the future."),
  passengers: z.coerce.number().int().min(1, "At least one passenger.").max(6, "For groups over 6, please call us."),
  name,
  phone,
  email: optionalEmail,
  notes: optionalText(600),
  website: honeypot,
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your first name.").max(60),
  rating: z.preprocess(
    (v) => (v === undefined || v === null || v === "" ? 0 : v),
    z.coerce.number().int().min(1, "Please choose a star rating.").max(5, "Please choose a star rating."),
  ),
  comment: z.string().trim().min(10, "Please share a few words about your ride.").max(1200, "Please keep your review under 1,200 characters."),
  serviceType: z.union([z.literal(""), z.enum(SERVICE_TYPE_VALUES)]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  website: honeypot,
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const driverApplicationSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  licensePlate: z
    .string()
    .trim()
    .min(2, "Please enter your license plate.")
    .max(12, "That plate looks too long.")
    .transform((v) => v.toUpperCase().replace(/\s+/g, " ")),
  vehicle: z.string().trim().min(3, "Tell us what you drive (year, make, model).").max(80),
  yearsDriving: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(80)])
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  city: optionalText(80),
  message: optionalText(600),
  website: honeypot,
});
export type DriverApplicationInput = z.infer<typeof driverApplicationSchema>;

export const driverCreateSchema = z.object({
  name,
  phone: z.union([z.literal(""), phone]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  vehicle: z.string().trim().min(3).max(80),
  licensePlate: z.string().trim().min(2).max(12).transform((v) => v.toUpperCase()),
  pin: z.string().trim().regex(/^\d{4,6}$/, "PIN must be 4–6 digits."),
});

export const driverLoginSchema = z.object({
  driverId: z.string().trim().min(1, "Choose your name."),
  pin: z.string().trim().regex(/^\d{4,6}$/, "PIN must be 4–6 digits."),
});

export const tripStartSchema = z.object({
  passengerName: optionalText(80),
  bookingCode: optionalText(16),
  /** The driver must explicitly confirm they consent to share their location for this trip. */
  consent: z.literal(true, "Please confirm you agree to share your location for this trip."),
});

export const locationPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracyM: z.number().min(0).max(100000).nullable().optional(),
  headingDeg: z.number().min(0).max(360).nullable().optional(),
  speedMps: z.number().min(0).max(200).nullable().optional(),
  recordedAt: z.string().refine((v) => !Number.isNaN(new Date(v).getTime()), "Bad timestamp"),
});
export const locationBatchSchema = z.object({
  points: z.array(locationPointSchema).min(1).max(50),
});

export const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(25),
  email: z.email(),
  facebookUrl: z.url(),
  serviceArea: z.string().trim().min(2).max(160),
  availabilityStatus: z.enum(["accepting", "by_appointment", "fully_booked"]),
  availabilityNote: z.string().trim().max(200).default(""),
  hoursText: z.string().trim().max(240).default(""),
  reviewsRequireApproval: z.coerce.boolean().default(false),
});

/** Flattens Zod issues into { fieldName: firstMessage } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Converts a FormData into a plain object (first value per key). */
export function formToObject(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string" && !(k in out)) out[k] = v;
  return out;
}
