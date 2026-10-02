import type { Trip, TripLocation, TripStatus } from "@/lib/types";

/**
 * What the public tracking page and its API expose about a trip.
 * No ids, no phone numbers, no rider details: only what someone holding the private link needs.
 */
export interface PublicTrip {
  code: string;
  status: TripStatus;
  driverName: string;
  vehicle: string;
  licensePlate: string;
  startedAt: string;
  endedAt: string | null;
  /** Always null on the public surface. The rider's name is never shown on a shareable link. */
  passengerName: null;
}

export interface TrackResponse {
  trip: PublicTrip;
  location: TripLocation | null;
}

export function toPublicTrip(trip: Trip): PublicTrip {
  return {
    code: trip.code,
    status: trip.status,
    driverName: trip.driverName,
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
