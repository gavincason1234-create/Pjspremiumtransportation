import { displayName } from "@/lib/format";
import type { Trip, TripLocation, TripStatus } from "@/lib/types";

/**
 * What the public tracking page and its API expose about a trip.
 * No ids, no phone numbers, no rider details: only what someone holding the private link needs.
 */
export interface PublicTrip {
  code: string;
  status: TripStatus;
  /** First name and last initial ("Patsy M."), never the driver's full name. */
  driverName: string;
  vehicle: string;
  licensePlate: string;
  startedAt: string;
  endedAt: string | null;
  /** Always null on the public surface. The rider's name is never shown on a shareable link. */
  passengerName: null;
}

/** GET /api/track/[code] */
export interface TrackResponse {
  trip: PublicTrip;
  /** Always null once the trip has ended: a driver's position is only ever shown during an active trip. */
  location: TripLocation | null;
}

/** POST and PATCH /api/driver/trips */
export interface DriverTripResponse {
  trip: Trip;
  /** POST only: true when a booking code was given and matched a reservation. */
  bookingLinked?: boolean;
}

/** POST /api/driver/locations */
export interface LocationsResponse {
  ok: true;
  received: number;
}

/** Every API error in this workstream, via jsonError(). */
export interface ApiErrorBody {
  error: string;
  fields?: Record<string, string>;
}

export function toPublicTrip(trip: Trip): PublicTrip {
  return {
    code: trip.code,
    status: trip.status,
    driverName: displayName(trip.driverName),
    vehicle: trip.vehicle,
    licensePlate: trip.licensePlate,
    startedAt: trip.startedAt,
    endedAt: trip.endedAt,
    passengerName: null,
  };
}

/** Trip codes are 6 characters from an unambiguous alphabet; a little slack is allowed for hand-typed input. */
export const TRIP_CODE_PATTERN = /^[A-Z0-9]{4,10}$/;

/** Upper-cases, strips spaces and dashes, and returns null when the result cannot be a trip code. */
export function normalizeTripCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase().replace(/[\s-]/g, "");
  return TRIP_CODE_PATTERN.test(code) ? code : null;
}

/** Pulls a trip code out of a pasted link such as "https://…/track/K7M3PQ", or returns null. */
export function codeFromPastedText(text: string): string | null {
  const match = /\/track\/([A-Za-z0-9-]{4,12})/.exec(text);
  return normalizeTripCode(match ? match[1] : text);
}
