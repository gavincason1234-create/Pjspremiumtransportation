import type { Db } from "./index";
import type {
  Booking,
  Driver,
  DriverApplication,
  Review,
  ReviewStats,
  SiteSettings,
  Trip,
  TripLocation,
} from "@/lib/types";
import { bookingCode, tripCode, uuid } from "@/lib/ids";
import { hashPin, verifyPinHash } from "@/lib/crypto";
import { DEFAULT_SETTINGS } from "@/lib/site";

/**
 * Zero-config in-memory adapter. Data lives for the lifetime of the server process
 * (on Vercel: until the serverless instance is recycled). Good for previews and local dev;
 * configure Supabase for production persistence.
 */

interface Store {
  settings: SiteSettings;
  bookings: (Booking & { ipHash: string | null })[];
  reviews: (Review & { ipHash: string | null })[];
  applications: (DriverApplication & { ipHash: string | null })[];
  drivers: (Driver & { pinHash: string })[];
  trips: Trip[];
  locations: Map<string, TripLocation[]>;
}

declare global {
  var __pjsMemoryStore: Store | undefined;
}

function store(): Store {
  if (!globalThis.__pjsMemoryStore) {
    globalThis.__pjsMemoryStore = {
      settings: { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() },
      bookings: [],
      reviews: [],
      applications: [],
      drivers: [],
      trips: [],
      locations: new Map(),
    };
  }
  return globalThis.__pjsMemoryStore;
}

const now = () => new Date().toISOString();
const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);
const strip = <T extends { ipHash?: string | null }>(row: T): Omit<T, "ipHash"> => {
  const { ipHash: _ignored, ...rest } = row;
  void _ignored;
  return rest;
};

export function createMemoryDb(): Db {
  return {
    kind: "memory",

    settings: {
      async get() {
        return { ...store().settings };
      },
      async update(patch) {
        const s = store();
        s.settings = { ...s.settings, ...patch, updatedAt: now() };
        return { ...s.settings };
      },
    },

    bookings: {
      async create(input) {
        const t = now();
        const row = {
          id: uuid(),
          code: bookingCode(),
          status: "new" as const,
          serviceType: input.serviceType,
          pickupAddress: input.pickupAddress,
          dropoffAddress: input.dropoffAddress,
          pickupAt: input.pickupAt,
          passengers: input.passengers,
          name: input.name,
          phone: input.phone,
          email: input.email ?? null,
          notes: input.notes ?? null,
          createdAt: t,
          updatedAt: t,
          ipHash: input.ipHash ?? null,
        };
        store().bookings.push(row);
        return strip(row);
      },
      async list(opts) {
        let rows = store().bookings.slice().sort(byNewest);
        if (opts?.status) rows = rows.filter((r) => r.status === opts.status);
        if (opts?.limit) rows = rows.slice(0, opts.limit);
        return rows.map(strip);
      },
      async get(id) {
        const r = store().bookings.find((b) => b.id === id);
        return r ? strip(r) : null;
      },
      async getByCode(code) {
        const r = store().bookings.find((b) => b.code.toUpperCase() === code.toUpperCase());
        return r ? strip(r) : null;
      },
      async setStatus(id, status) {
        const r = store().bookings.find((b) => b.id === id);
        if (!r) return null;
        r.status = status;
        r.updatedAt = now();
        return strip(r);
      },
      async countRecentByIp(ipHash, sinceIso) {
        return store().bookings.filter((b) => b.ipHash === ipHash && b.createdAt >= sinceIso).length;
      },
    },

    reviews: {
      async create(input) {
        const row = {
          id: uuid(),
          name: input.name,
          rating: input.rating,
          comment: input.comment,
          serviceType: input.serviceType ?? null,
          status: input.status ?? ("approved" as const),
          ownerReply: null,
          createdAt: now(),
          ipHash: input.ipHash ?? null,
        };
        store().reviews.push(row);
        return strip(row);
      },
      async listPublic(limit) {
        const rows = store().reviews.filter((r) => r.status === "approved").sort(byNewest).map(strip);
        return limit ? rows.slice(0, limit) : rows;
      },
      async listAll() {
        return store().reviews.slice().sort(byNewest).map(strip);
      },
      async setStatus(id, status) {
        const r = store().reviews.find((x) => x.id === id);
        if (!r) return null;
        r.status = status;
        return strip(r);
      },
      async setOwnerReply(id, reply) {
        const r = store().reviews.find((x) => x.id === id);
        if (!r) return null;
        r.ownerReply = reply;
        return strip(r);
      },
      async stats() {
        return computeStats(store().reviews.filter((r) => r.status === "approved"));
      },
      async countRecentByIp(ipHash, sinceIso) {
        return store().reviews.filter((r) => r.ipHash === ipHash && r.createdAt >= sinceIso).length;
      },
    },

    applications: {
      async create(input) {
        const row = {
          id: uuid(),
          name: input.name,
          phone: input.phone,
          email: input.email ?? null,
          licensePlate: input.licensePlate,
          vehicle: input.vehicle,
          yearsDriving: input.yearsDriving ?? null,
          city: input.city ?? null,
          message: input.message ?? null,
          status: "new" as const,
          adminNotes: null,
          createdAt: now(),
          ipHash: input.ipHash ?? null,
        };
        store().applications.push(row);
        return strip(row);
      },
      async list(opts) {
        let rows = store().applications.slice().sort(byNewest);
        if (opts?.status) rows = rows.filter((r) => r.status === opts.status);
        return rows.map(strip);
      },
      async get(id) {
        const r = store().applications.find((a) => a.id === id);
        return r ? strip(r) : null;
      },
      async setStatus(id, status) {
        const r = store().applications.find((a) => a.id === id);
        if (!r) return null;
        r.status = status;
        return strip(r);
      },
      async setAdminNotes(id, notes) {
        const r = store().applications.find((a) => a.id === id);
        if (!r) return null;
        r.adminNotes = notes;
        return strip(r);
      },
      async countRecentByIp(ipHash, sinceIso) {
        return store().applications.filter((a) => a.ipHash === ipHash && a.createdAt >= sinceIso).length;
      },
    },

    drivers: {
      async create(input) {
        const row = {
          id: uuid(),
          name: input.name,
          phone: input.phone ?? null,
          vehicle: input.vehicle,
          licensePlate: input.licensePlate,
          active: true,
          createdAt: now(),
          pinHash: hashPin(input.pin),
        };
        store().drivers.push(row);
        return publicDriver(row);
      },
      async list() {
        return store().drivers.slice().sort(byNewest).map(publicDriver);
      },
      async listActive() {
        return store().drivers.filter((d) => d.active).sort((a, b) => a.name.localeCompare(b.name)).map(publicDriver);
      },
      async get(id) {
        const d = store().drivers.find((x) => x.id === id);
        return d ? publicDriver(d) : null;
      },
      async verifyPin(id, pin) {
        const d = store().drivers.find((x) => x.id === id);
        if (!d || !d.active) return false;
        return verifyPinHash(pin, d.pinHash);
      },
      async setActive(id, active) {
        const d = store().drivers.find((x) => x.id === id);
        if (!d) return null;
        d.active = active;
        return publicDriver(d);
      },
      async resetPin(id, pin) {
        const d = store().drivers.find((x) => x.id === id);
        if (!d) return false;
        d.pinHash = hashPin(pin);
        return true;
      },
    },

    trips: {
      async start(input) {
        const s = store();
        const driver = s.drivers.find((d) => d.id === input.driverId);
        if (!driver) throw new Error("Driver not found");
        // A driver can only share one trip at a time; end any active one first.
        for (const t of s.trips) {
          if (t.driverId === driver.id && t.status === "active") {
            t.status = "ended";
            t.endedAt = now();
          }
        }
        const t = now();
        const trip: Trip = {
          id: uuid(),
          code: tripCode(),
          driverId: driver.id,
          driverName: driver.name,
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          passengerName: input.passengerName ?? null,
          bookingId: input.bookingId ?? null,
          status: "active",
          consentAt: t,
          startedAt: t,
          endedAt: null,
        };
        s.trips.push(trip);
        return { ...trip };
      },
      async end(id) {
        const t = store().trips.find((x) => x.id === id);
        if (!t) return null;
        if (t.status === "active") {
          t.status = "ended";
          t.endedAt = now();
        }
        return { ...t };
      },
      async get(id) {
        const t = store().trips.find((x) => x.id === id);
        return t ? { ...t } : null;
      },
      async getByCode(code) {
        const t = store().trips.find((x) => x.code.toUpperCase() === code.toUpperCase());
        return t ? { ...t } : null;
      },
      async getActiveForDriver(driverId) {
        const t = store().trips.find((x) => x.driverId === driverId && x.status === "active");
        return t ? { ...t } : null;
      },
      async listRecent(limit = 50) {
        return store()
          .trips.slice()
          .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
          .slice(0, limit)
          .map((t) => ({ ...t }));
      },
    },

    locations: {
      async append(tripId, points) {
        const s = store();
        const list = s.locations.get(tripId) ?? [];
        list.push(...points);
        // Keep memory bounded: only the last 2,000 points per trip.
        if (list.length > 2000) list.splice(0, list.length - 2000);
        s.locations.set(tripId, list);
      },
      async latest(tripId) {
        const list = store().locations.get(tripId);
        if (!list || list.length === 0) return null;
        return { ...list[list.length - 1] };
      },
      async purgeExpired(olderThanHours = 24) {
        const s = store();
        const cutoff = Date.now() - olderThanHours * 3600 * 1000;
        let removed = 0;
        for (const t of s.trips) {
          if (t.status === "ended" && t.endedAt && new Date(t.endedAt).getTime() < cutoff) {
            removed += s.locations.get(t.id)?.length ?? 0;
            s.locations.delete(t.id);
          }
        }
        return removed;
      },
    },
  };
}

function publicDriver(d: Driver & { pinHash: string }): Driver {
  const { pinHash: _ignored, ...rest } = d;
  void _ignored;
  return rest;
}

export function computeStats(rows: Pick<Review, "rating">[]): ReviewStats {
  const distribution: ReviewStats["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of rows) {
    distribution[r.rating] += 1;
    sum += r.rating;
  }
  const count = rows.length;
  return { count, average: count ? Math.round((sum / count) * 10) / 10 : 0, distribution };
}
