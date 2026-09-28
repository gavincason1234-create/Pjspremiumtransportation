import type { ActionState } from "@/lib/actions";
import type { Booking } from "@/lib/types";

/** The user-editable fields on the reservation form, in display order. */
export const BOOKING_FIELDS = [
  "serviceType",
  "pickupAddress",
  "dropoffAddress",
  "pickupAt",
  "passengers",
  "name",
  "phone",
  "email",
  "notes",
] as const;

export type BookingField = (typeof BOOKING_FIELDS)[number];

/** Raw strings as typed, echoed back so the form can re-fill itself after a validation error. */
export type BookingFormValues = Partial<Record<BookingField, string>>;

export interface BookingActionData {
  /** Present only on success. */
  booking?: Booking;
  /** Present on failure so the form can keep what the rider typed. */
  values?: BookingFormValues;
  /** Server timestamp of this response. The form remounts on it so preserved values apply cleanly. */
  respondedAt: string;
}

export type BookingActionState = ActionState<BookingActionData>;
