/**
 * Canonical domain types for PJ's Premium Transportation.
 * The data layer (src/lib/db) and every API route speak in these shapes.
 * Dates are ISO-8601 strings so the same types work in server and client components.
 */

export type ServiceType =
  | "airport"
  | "medical"
  | "winstar"
  | "metroplex"
  | "local"
  | "hourly"
  | "other";

export const SERVICE_TYPES: { value: ServiceType; label: string; short: string }[] = [
  { value: "airport", label: "Airport transportation (DFW / Love Field)", short: "Airport" },
  { value: "medical", label: "Medical appointments", short: "Medical" },
  { value: "winstar", label: "WinStar Casino trips", short: "WinStar" },
  { value: "metroplex", label: "Dallas–Fort Worth Metroplex", short: "Metroplex" },
  { value: "local", label: "Local trips around North Texas", short: "Local" },
  { value: "hourly", label: "Hourly / as directed", short: "Hourly" },
  { value: "other", label: "Something else", short: "Other" },
];

export function serviceLabel(value: ServiceType | null | undefined): string {
  return SERVICE_TYPES.find((s) => s.value === value)?.short ?? "Ride";
}

export type AvailabilityStatus = "accepting" | "by_appointment" | "fully_booked";

export const AVAILABILITY: Record<AvailabilityStatus, { label: string; description: string }> = {
  accepting: {
    label: "Accepting reservations",
    description: "Request a ride and we will confirm shortly.",
  },
  by_appointment: {
    label: "By appointment",
    description: "Limited openings this week. Request early and we will do our best.",
  },
  fully_booked: {
    label: "Fully booked",
    description: "We are at capacity right now. Send a request and we will reach out when a slot opens.",
  },
};

export interface SiteSettings {
  businessName: string;
  phone: string;
  email: string;
  facebookUrl: string;
  serviceArea: string;
  availabilityStatus: AvailabilityStatus;
  availabilityNote: string;
  hoursText: string;
  reviewsRequireApproval: boolean;
  updatedAt: string;
}

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  code: string;
  status: BookingStatus;
  serviceType: ServiceType;
  pickupAddress: string;
  dropoffAddress: string;
  pickupAt: string;
  passengers: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewBooking = Omit<Booking, "id" | "code" | "status" | "createdAt" | "updatedAt"> & {
  ipHash?: string | null;
};

export type ReviewStatus = "pending" | "approved" | "hidden";

export interface Review {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  serviceType: ServiceType | null;
  status: ReviewStatus;
  ownerReply: string | null;
  createdAt: string;
}

export type NewReview = Omit<Review, "id" | "status" | "ownerReply" | "createdAt"> & {
  status?: ReviewStatus;
  ipHash?: string | null;
};

export interface ReviewStats {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export type ApplicationStatus = "new" | "contacted" | "approved" | "declined";

export interface DriverApplication {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  licensePlate: string;
  vehicle: string;
  yearsDriving: number | null;
  city: string | null;
  message: string | null;
  status: ApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
}

export type NewDriverApplication = Omit<DriverApplication, "id" | "status" | "adminNotes" | "createdAt"> & {
  ipHash?: string | null;
};

export interface Driver {
  id: string;
  name: string;
  phone: string | null;
  vehicle: string;
  licensePlate: string;
  active: boolean;
  createdAt: string;
}

export interface NewDriver {
  name: string;
  phone?: string | null;
  vehicle: string;
  licensePlate: string;
  pin: string;
}

export type TripStatus = "active" | "ended";

export interface Trip {
  id: string;
  code: string;
  driverId: string;
  driverName: string;
  vehicle: string;
  licensePlate: string;
  passengerName: string | null;
  bookingId: string | null;
  status: TripStatus;
  consentAt: string;
  startedAt: string;
  endedAt: string | null;
}

export interface TripLocation {
  lat: number;
  lng: number;
  accuracyM: number | null;
  headingDeg: number | null;
  speedMps: number | null;
  recordedAt: string;
}
