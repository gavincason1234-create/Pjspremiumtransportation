import type {
  ApplicationStatus,
  Booking,
  BookingStatus,
  Driver,
  DriverApplication,
  NewBooking,
  NewDriver,
  NewDriverApplication,
  NewReview,
  Review,
  ReviewStats,
  ReviewStatus,
  SiteSettings,
  Trip,
  TripLocation,
} from "@/lib/types";

/**
 * The single data-access contract for the app.
 *
 * Two adapters implement it:
 *  - SupabaseDb  (src/lib/db/supabase.ts) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
 *  - MemoryDb    (src/lib/db/memory.ts)   otherwise — zero-config, resets on cold start
 *
 * Always obtain it through getDb(); never import an adapter directly from feature code.
 */
export interface Db {
  readonly kind: "supabase" | "memory";

  settings: {
    get(): Promise<SiteSettings>;
    update(patch: Partial<Omit<SiteSettings, "updatedAt">>): Promise<SiteSettings>;
  };

  bookings: {
    create(input: NewBooking): Promise<Booking>;
    list(opts?: { status?: BookingStatus; limit?: number }): Promise<Booking[]>;
    get(id: string): Promise<Booking | null>;
    getByCode(code: string): Promise<Booking | null>;
    setStatus(id: string, status: BookingStatus): Promise<Booking | null>;
    countRecentByIp(ipHash: string, sinceIso: string): Promise<number>;
  };

  reviews: {
    create(input: NewReview): Promise<Review>;
    listPublic(limit?: number): Promise<Review[]>;
    listAll(): Promise<Review[]>;
    setStatus(id: string, status: ReviewStatus): Promise<Review | null>;
    setOwnerReply(id: string, reply: string | null): Promise<Review | null>;
    stats(): Promise<ReviewStats>;
    countRecentByIp(ipHash: string, sinceIso: string): Promise<number>;
  };

  applications: {
    create(input: NewDriverApplication): Promise<DriverApplication>;
    list(opts?: { status?: ApplicationStatus }): Promise<DriverApplication[]>;
    get(id: string): Promise<DriverApplication | null>;
    setStatus(id: string, status: ApplicationStatus): Promise<DriverApplication | null>;
    setAdminNotes(id: string, notes: string | null): Promise<DriverApplication | null>;
    countRecentByIp(ipHash: string, sinceIso: string): Promise<number>;
  };

  drivers: {
    create(input: NewDriver): Promise<Driver>;
    list(): Promise<Driver[]>;
    listActive(): Promise<Driver[]>;
    get(id: string): Promise<Driver | null>;
    verifyPin(id: string, pin: string): Promise<boolean>;
    setActive(id: string, active: boolean): Promise<Driver | null>;
    resetPin(id: string, pin: string): Promise<boolean>;
  };

  trips: {
    start(input: { driverId: string; passengerName?: string | null; bookingId?: string | null }): Promise<Trip>;
    end(id: string): Promise<Trip | null>;
    get(id: string): Promise<Trip | null>;
    getByCode(code: string): Promise<Trip | null>;
    getActiveForDriver(driverId: string): Promise<Trip | null>;
    listRecent(limit?: number): Promise<Trip[]>;
  };

  locations: {
    /** Stores ONLY the most recent of `points` for the trip (replacing any previous one). No route history is kept. */
    append(tripId: string, points: TripLocation[]): Promise<void>;
    latest(tripId: string): Promise<TripLocation | null>;
    /** Deletes the stored position for trips that ended more than `olderThanHours` ago. Returns rows removed (best effort). */
    purgeExpired(olderThanHours?: number): Promise<number>;
  };
}

let cached: Db | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getDb(): Promise<Db> {
  if (cached) return cached;
  if (isSupabaseConfigured()) {
    const { createSupabaseDb } = await import("./supabase");
    cached = createSupabaseDb();
  } else {
    const { createMemoryDb } = await import("./memory");
    cached = createMemoryDb();
  }
  return cached;
}
