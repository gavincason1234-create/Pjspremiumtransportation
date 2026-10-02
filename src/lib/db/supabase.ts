import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Db } from "./index";
import type {
  Booking,
  Driver,
  DriverApplication,
  Review,
  SiteSettings,
  Trip,
  TripLocation,
} from "@/lib/types";
import { bookingCode, tripCode } from "@/lib/ids";
import { hashPin, verifyPinHash } from "@/lib/crypto";
import { computeStats } from "./memory";

/**
 * Supabase (Postgres) adapter. Uses the SERVICE ROLE key and therefore must only ever run on the server.
 * Schema: supabase/migrations/0001_init.sql. Column names are snake_case; app types are camelCase.
 */

function client(): SupabaseClient {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "pjs-premium-transportation" } },
  });
}

type Row = Record<string, unknown>;

function fail(context: string, error: { message: string } | null): never {
  throw new Error(`[db:${context}] ${error?.message ?? "unknown error"}`);
}

/* ------------------------------------------------------------------ mappers */

const mapSettings = (r: Row): SiteSettings => ({
  businessName: r.business_name as string,
  phone: r.phone as string,
  email: r.email as string,
  facebookUrl: r.facebook_url as string,
  serviceArea: r.service_area as string,
  availabilityStatus: r.availability_status as SiteSettings["availabilityStatus"],
  availabilityNote: (r.availability_note as string) ?? "",
  hoursText: (r.hours_text as string) ?? "",
  reviewsRequireApproval: Boolean(r.reviews_require_approval),
  updatedAt: r.updated_at as string,
});

const mapBooking = (r: Row): Booking => ({
  id: r.id as string,
  code: r.code as string,
  status: r.status as Booking["status"],
  serviceType: r.service_type as Booking["serviceType"],
  pickupAddress: r.pickup_address as string,
  dropoffAddress: r.dropoff_address as string,
  pickupAt: r.pickup_at as string,
  passengers: r.passengers as number,
  name: r.name as string,
  phone: r.phone as string,
  email: (r.email as string) ?? null,
  notes: (r.notes as string) ?? null,
  createdAt: r.created_at as string,
  updatedAt: r.updated_at as string,
});

const mapReview = (r: Row): Review => ({
  id: r.id as string,
  name: r.name as string,
  rating: r.rating as Review["rating"],
  comment: r.comment as string,
  serviceType: (r.service_type as Review["serviceType"]) ?? null,
  status: r.status as Review["status"],
  ownerReply: (r.owner_reply as string) ?? null,
  createdAt: r.created_at as string,
});

const mapApplication = (r: Row): DriverApplication => ({
  id: r.id as string,
  name: r.name as string,
  phone: r.phone as string,
  email: (r.email as string) ?? null,
  licensePlate: r.license_plate as string,
  vehicle: r.vehicle as string,
  yearsDriving: (r.years_driving as number) ?? null,
  city: (r.city as string) ?? null,
  message: (r.message as string) ?? null,
  status: r.status as DriverApplication["status"],
  adminNotes: (r.admin_notes as string) ?? null,
  createdAt: r.created_at as string,
});

const mapDriver = (r: Row): Driver => ({
  id: r.id as string,
  name: r.name as string,
  phone: (r.phone as string) ?? null,
  vehicle: r.vehicle as string,
  licensePlate: r.license_plate as string,
  active: Boolean(r.active),
  createdAt: r.created_at as string,
});

const TRIP_SELECT = "*, drivers!inner(name, vehicle, license_plate)";
const mapTrip = (r: Row): Trip => {
  const d = (r.drivers as Row) ?? {};
  return {
    id: r.id as string,
    code: r.code as string,
    driverId: r.driver_id as string,
    driverName: (d.name as string) ?? "Driver",
    vehicle: (d.vehicle as string) ?? "",
    licensePlate: (d.license_plate as string) ?? "",
    passengerName: (r.passenger_name as string) ?? null,
    bookingId: (r.booking_id as string) ?? null,
    status: r.status as Trip["status"],
    consentAt: r.consent_at as string,
    startedAt: r.started_at as string,
    endedAt: (r.ended_at as string) ?? null,
  };
};

const mapLocation = (r: Row): TripLocation => ({
  lat: r.lat as number,
  lng: r.lng as number,
  accuracyM: (r.accuracy_m as number) ?? null,
  headingDeg: (r.heading_deg as number) ?? null,
  speedMps: (r.speed_mps as number) ?? null,
  recordedAt: r.recorded_at as string,
});

/* ------------------------------------------------------------------ adapter */

export function createSupabaseDb(): Db {
  const sb = client();

  return {
    kind: "supabase",

    settings: {
      async get() {
        const { data, error } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
        if (error) fail("settings.get", error);
        if (!data) {
          const { data: inserted, error: e2 } = await sb.from("site_settings").insert({ id: 1 }).select("*").single();
          if (e2) fail("settings.init", e2);
          return mapSettings(inserted as Row);
        }
        return mapSettings(data as Row);
      },
      async update(patch) {
        const row: Row = { updated_at: new Date().toISOString() };
        if (patch.businessName !== undefined) row.business_name = patch.businessName;
        if (patch.phone !== undefined) row.phone = patch.phone;
        if (patch.email !== undefined) row.email = patch.email;
        if (patch.facebookUrl !== undefined) row.facebook_url = patch.facebookUrl;
        if (patch.serviceArea !== undefined) row.service_area = patch.serviceArea;
        if (patch.availabilityStatus !== undefined) row.availability_status = patch.availabilityStatus;
        if (patch.availabilityNote !== undefined) row.availability_note = patch.availabilityNote;
        if (patch.hoursText !== undefined) row.hours_text = patch.hoursText;
        if (patch.reviewsRequireApproval !== undefined) row.reviews_require_approval = patch.reviewsRequireApproval;
        const { data, error } = await sb.from("site_settings").upsert({ id: 1, ...row }).select("*").single();
        if (error) fail("settings.update", error);
        return mapSettings(data as Row);
      },
    },

    bookings: {
      async create(input) {
        // Retry a couple of times in the (very unlikely) event of a code collision.
        for (let attempt = 0; attempt < 3; attempt++) {
          const { data, error } = await sb
            .from("bookings")
            .insert({
              code: bookingCode(),
              service_type: input.serviceType,
              pickup_address: input.pickupAddress,
              dropoff_address: input.dropoffAddress,
              pickup_at: input.pickupAt,
              passengers: input.passengers,
              name: input.name,
              phone: input.phone,
              email: input.email ?? null,
              notes: input.notes ?? null,
              ip_hash: input.ipHash ?? null,
            })
            .select("*")
            .single();
          if (!error) return mapBooking(data as Row);
          if (error.code !== "23505") fail("bookings.create", error);
        }
        throw new Error("[db:bookings.create] could not allocate a unique code");
      },
      async list(opts) {
        let q = sb.from("bookings").select("*").order("created_at", { ascending: false });
        if (opts?.status) q = q.eq("status", opts.status);
        if (opts?.limit) q = q.limit(opts.limit);
        const { data, error } = await q;
        if (error) fail("bookings.list", error);
        return (data as Row[]).map(mapBooking);
      },
      async get(id) {
        const { data, error } = await sb.from("bookings").select("*").eq("id", id).maybeSingle();
        if (error) fail("bookings.get", error);
        return data ? mapBooking(data as Row) : null;
      },
      async getByCode(code) {
        const { data, error } = await sb.from("bookings").select("*").eq("code", code.toUpperCase()).maybeSingle();
        if (error) fail("bookings.getByCode", error);
        return data ? mapBooking(data as Row) : null;
      },
      async setStatus(id, status) {
        const { data, error } = await sb
          .from("bookings")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select("*")
          .maybeSingle();
        if (error) fail("bookings.setStatus", error);
        return data ? mapBooking(data as Row) : null;
      },
      async countRecentByIp(ipHash, sinceIso) {
        const { count, error } = await sb
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", sinceIso);
        if (error) fail("bookings.countRecentByIp", error);
        return count ?? 0;
      },
    },

    reviews: {
      async create(input) {
        const { data, error } = await sb
          .from("reviews")
          .insert({
            name: input.name,
            rating: input.rating,
            comment: input.comment,
            service_type: input.serviceType ?? null,
            status: input.status ?? "approved",
            ip_hash: input.ipHash ?? null,
          })
          .select("*")
          .single();
        if (error) fail("reviews.create", error);
        return mapReview(data as Row);
      },
      async listPublic(limit) {
        let q = sb.from("reviews").select("*").eq("status", "approved").order("created_at", { ascending: false });
        if (limit) q = q.limit(limit);
        const { data, error } = await q;
        if (error) fail("reviews.listPublic", error);
        return (data as Row[]).map(mapReview);
      },
      async listAll() {
        const { data, error } = await sb.from("reviews").select("*").order("created_at", { ascending: false });
        if (error) fail("reviews.listAll", error);
        return (data as Row[]).map(mapReview);
      },
      async setStatus(id, status) {
        const { data, error } = await sb.from("reviews").update({ status }).eq("id", id).select("*").maybeSingle();
        if (error) fail("reviews.setStatus", error);
        return data ? mapReview(data as Row) : null;
      },
      async setOwnerReply(id, reply) {
        const { data, error } = await sb.from("reviews").update({ owner_reply: reply }).eq("id", id).select("*").maybeSingle();
        if (error) fail("reviews.setOwnerReply", error);
        return data ? mapReview(data as Row) : null;
      },
      async stats() {
        const { data, error } = await sb.from("reviews").select("rating").eq("status", "approved");
        if (error) fail("reviews.stats", error);
        return computeStats(data as { rating: Review["rating"] }[]);
      },
      async countRecentByIp(ipHash, sinceIso) {
        const { count, error } = await sb
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", sinceIso);
        if (error) fail("reviews.countRecentByIp", error);
        return count ?? 0;
      },
    },

    applications: {
      async create(input) {
        const { data, error } = await sb
          .from("driver_applications")
          .insert({
            name: input.name,
            phone: input.phone,
            email: input.email ?? null,
            license_plate: input.licensePlate,
            vehicle: input.vehicle,
            years_driving: input.yearsDriving ?? null,
            city: input.city ?? null,
            message: input.message ?? null,
            ip_hash: input.ipHash ?? null,
          })
          .select("*")
          .single();
        if (error) fail("applications.create", error);
        return mapApplication(data as Row);
      },
      async list(opts) {
        let q = sb.from("driver_applications").select("*").order("created_at", { ascending: false });
        if (opts?.status) q = q.eq("status", opts.status);
        const { data, error } = await q;
        if (error) fail("applications.list", error);
        return (data as Row[]).map(mapApplication);
      },
      async get(id) {
        const { data, error } = await sb.from("driver_applications").select("*").eq("id", id).maybeSingle();
        if (error) fail("applications.get", error);
        return data ? mapApplication(data as Row) : null;
      },
      async setStatus(id, status) {
        const { data, error } = await sb.from("driver_applications").update({ status }).eq("id", id).select("*").maybeSingle();
        if (error) fail("applications.setStatus", error);
        return data ? mapApplication(data as Row) : null;
      },
      async setAdminNotes(id, notes) {
        const { data, error } = await sb.from("driver_applications").update({ admin_notes: notes }).eq("id", id).select("*").maybeSingle();
        if (error) fail("applications.setAdminNotes", error);
        return data ? mapApplication(data as Row) : null;
      },
      async countRecentByIp(ipHash, sinceIso) {
        const { count, error } = await sb
          .from("driver_applications")
          .select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash)
          .gte("created_at", sinceIso);
        if (error) fail("applications.countRecentByIp", error);
        return count ?? 0;
      },
    },

    drivers: {
      async create(input) {
        const { data, error } = await sb
          .from("drivers")
          .insert({
            name: input.name,
            phone: input.phone ?? null,
            vehicle: input.vehicle,
            license_plate: input.licensePlate,
            pin_hash: hashPin(input.pin),
          })
          .select("*")
          .single();
        if (error) fail("drivers.create", error);
        return mapDriver(data as Row);
      },
      async list() {
        const { data, error } = await sb.from("drivers").select("*").order("created_at", { ascending: false });
        if (error) fail("drivers.list", error);
        return (data as Row[]).map(mapDriver);
      },
      async listActive() {
        const { data, error } = await sb.from("drivers").select("*").eq("active", true).order("name");
        if (error) fail("drivers.listActive", error);
        return (data as Row[]).map(mapDriver);
      },
      async get(id) {
        const { data, error } = await sb.from("drivers").select("*").eq("id", id).maybeSingle();
        if (error) fail("drivers.get", error);
        return data ? mapDriver(data as Row) : null;
      },
      async verifyPin(id, pin) {
        const { data, error } = await sb.from("drivers").select("pin_hash, active").eq("id", id).maybeSingle();
        if (error) fail("drivers.verifyPin", error);
        if (!data || !(data as Row).active) return false;
        return verifyPinHash(pin, (data as Row).pin_hash as string);
      },
      async setActive(id, active) {
        const { data, error } = await sb.from("drivers").update({ active }).eq("id", id).select("*").maybeSingle();
        if (error) fail("drivers.setActive", error);
        return data ? mapDriver(data as Row) : null;
      },
      async resetPin(id, pin) {
        const { error, count } = await sb.from("drivers").update({ pin_hash: hashPin(pin) }, { count: "exact" }).eq("id", id);
        if (error) fail("drivers.resetPin", error);
        return (count ?? 0) > 0;
      },
    },

    trips: {
      async start(input) {
        const nowIso = new Date().toISOString();
        // One active trip per driver: end any lingering ones.
        const { error: endErr } = await sb
          .from("trips")
          .update({ status: "ended", ended_at: nowIso })
          .eq("driver_id", input.driverId)
          .eq("status", "active");
        if (endErr) fail("trips.start.endPrevious", endErr);

        for (let attempt = 0; attempt < 3; attempt++) {
          const { data, error } = await sb
            .from("trips")
            .insert({
              code: tripCode(),
              driver_id: input.driverId,
              booking_id: input.bookingId ?? null,
              passenger_name: input.passengerName ?? null,
              consent_at: nowIso,
              started_at: nowIso,
            })
            .select(TRIP_SELECT)
            .single();
          if (!error) return mapTrip(data as Row);
          if (error.code !== "23505") fail("trips.start", error);
        }
        throw new Error("[db:trips.start] could not allocate a unique code");
      },
      async end(id) {
        const { data: existing, error: e1 } = await sb.from("trips").select(TRIP_SELECT).eq("id", id).maybeSingle();
        if (e1) fail("trips.end.read", e1);
        if (!existing) return null;
        if ((existing as Row).status === "ended") return mapTrip(existing as Row);
        const { data, error } = await sb
          .from("trips")
          .update({ status: "ended", ended_at: new Date().toISOString() })
          .eq("id", id)
          .select(TRIP_SELECT)
          .single();
        if (error) fail("trips.end", error);
        return mapTrip(data as Row);
      },
      async get(id) {
        const { data, error } = await sb.from("trips").select(TRIP_SELECT).eq("id", id).maybeSingle();
        if (error) fail("trips.get", error);
        return data ? mapTrip(data as Row) : null;
      },
      async getByCode(code) {
        const { data, error } = await sb.from("trips").select(TRIP_SELECT).eq("code", code.toUpperCase()).maybeSingle();
        if (error) fail("trips.getByCode", error);
        return data ? mapTrip(data as Row) : null;
      },
      async getActiveForDriver(driverId) {
        const { data, error } = await sb
          .from("trips")
          .select(TRIP_SELECT)
          .eq("driver_id", driverId)
          .eq("status", "active")
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) fail("trips.getActiveForDriver", error);
        return data ? mapTrip(data as Row) : null;
      },
      async listRecent(limit = 50) {
        const { data, error } = await sb.from("trips").select(TRIP_SELECT).order("started_at", { ascending: false }).limit(limit);
        if (error) fail("trips.listRecent", error);
        return (data as Row[]).map(mapTrip);
      },
    },

    locations: {
      async append(tripId, points) {
        if (points.length === 0) return;
        // Keep only the most recent point (no route history is stored).
        const p = points.reduce((a, b) => (new Date(b.recordedAt) >= new Date(a.recordedAt) ? b : a));
        const { error } = await sb.from("trip_locations").upsert(
          {
            trip_id: tripId,
            lat: Math.round(p.lat * 1e5) / 1e5,
            lng: Math.round(p.lng * 1e5) / 1e5,
            accuracy_m: p.accuracyM ?? null,
            heading_deg: p.headingDeg ?? null,
            speed_mps: p.speedMps ?? null,
            recorded_at: p.recordedAt,
          },
          { onConflict: "trip_id" },
        );
        if (error) fail("locations.append", error);
      },
      async latest(tripId) {
        const { data, error } = await sb.from("trip_locations").select("*").eq("trip_id", tripId).maybeSingle();
        if (error) fail("locations.latest", error);
        return data ? mapLocation(data as Row) : null;
      },
      async purgeExpired(olderThanHours = 24) {
        const cutoff = new Date(Date.now() - olderThanHours * 3600 * 1000).toISOString();
        const { data: expired, error: e1 } = await sb
          .from("trips")
          .select("id")
          .eq("status", "ended")
          .lt("ended_at", cutoff)
          .limit(200);
        if (e1) fail("locations.purgeExpired.find", e1);
        const ids = (expired as Row[]).map((r) => r.id as string);
        if (ids.length === 0) return 0;
        const { error, count } = await sb.from("trip_locations").delete({ count: "exact" }).in("trip_id", ids);
        if (error) fail("locations.purgeExpired.delete", error);
        return count ?? 0;
      },
    },
  };
}
