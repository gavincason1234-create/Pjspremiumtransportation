import type { TripLocation } from "@/lib/types";

/** Default map centre before the first fix: Myra, Texas. */
export const MYRA_TX: [number, number] = [33.63, -97.29];

/** Options for the driver's continuous position watch. */
export const WATCH_OPTIONS: PositionOptions = { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 };

/** Options for the one-off permission check before a trip starts. */
export const FIRST_FIX_OPTIONS: PositionOptions = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 };

const DAY_MS = 24 * 60 * 60 * 1000;

/** Converts a browser Geolocation reading into the point shape the API accepts, clamped to the schema's ranges. */
export function positionToPoint(pos: GeolocationPosition): TripLocation {
  const c = pos.coords;
  const stamp = Number.isFinite(pos.timestamp) && Math.abs(pos.timestamp - Date.now()) < DAY_MS ? pos.timestamp : Date.now();
  const heading = c.heading != null && Number.isFinite(c.heading) ? ((Math.round(c.heading) % 360) + 360) % 360 : null;
  const speed = c.speed != null && Number.isFinite(c.speed) && c.speed >= 0 ? Math.min(200, Math.round(c.speed * 10) / 10) : null;
  const accuracy = Number.isFinite(c.accuracy) && c.accuracy >= 0 ? Math.min(100000, Math.round(c.accuracy)) : null;
  return {
    lat: c.latitude,
    lng: c.longitude,
    accuracyM: accuracy,
    headingDeg: heading,
    speedMps: speed,
    recordedAt: new Date(stamp).toISOString(),
  };
}

/** Metres per second to whole miles per hour. */
export function mph(speedMps: number | null | undefined): number | null {
  if (speedMps == null || !Number.isFinite(speedMps)) return null;
  return Math.round(speedMps * 2.23694);
}

/** "within 40 ft" / "within 0.3 mi" for a GPS accuracy radius in metres. */
export function formatAccuracy(meters: number | null | undefined): string | null {
  if (meters == null || !Number.isFinite(meters)) return null;
  const feet = meters * 3.28084;
  if (feet < 1000) return `within ${Math.round(feet)} ft`;
  return `within ${(feet / 5280).toFixed(1)} mi`;
}

export interface GeoProblem {
  title: string;
  body: string;
  /** True when the browser has blocked the site; the driver must change a setting before retrying. */
  denied: boolean;
}

/** Plain-language explanation of a Geolocation failure, with what the driver can do about it. */
export function describeGeoError(err: unknown): GeoProblem {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return {
      denied: false,
      title: "Location sharing needs a secure connection",
      body: "Open this page over https (the address should start with https://) and try again.",
    };
  }
  const code =
    typeof err === "object" && err !== null && "code" in err && typeof (err as { code: unknown }).code === "number"
      ? (err as { code: number }).code
      : 0;
  switch (code) {
    case 1:
      return {
        denied: true,
        title: "Location access is turned off for this site",
        body: "Your browser blocked location sharing. Open your phone's Settings, find your browser (Safari or Chrome), allow Location for this site, then come back and tap Start again.",
      };
    case 2:
      return {
        denied: false,
        title: "We could not get a GPS fix",
        body: "Make sure Location Services are on and you are not inside a parking garage or basement, then try again.",
      };
    case 3:
      return {
        denied: false,
        title: "Finding your location is taking a while",
        body: "Give it a moment or move somewhere with a clearer view of the sky, then try again.",
      };
    default:
      return {
        denied: false,
        title: "This browser cannot share location",
        body: "Please open this page in Safari or Chrome on your phone and try again.",
      };
  }
}

/** Promise wrapper around getCurrentPosition; rejects when the browser has no Geolocation at all. */
export function getCurrentPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
