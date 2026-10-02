"use client";

import { useCallback, useState, type ReactNode } from "react";
import { LocateFixed } from "lucide-react";
import { ButtonLink, Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TripLocation } from "@/lib/types";
import { LiveMapLoader } from "./LiveMapLoader";

/* Leaflet ships light-themed controls. These rules (scoped to .pj-map, higher specificity than
   leaflet.css) restyle them with the site's tokens so the map sits naturally on the dark page. */
const MAP_THEME_CSS = `
.pj-map .leaflet-container { font-family: inherit; }
.pj-map .leaflet-container .leaflet-bar { border: 1px solid var(--color-ink-700); box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.8); }
.pj-map .leaflet-container .leaflet-bar a { background: var(--color-ink-850); color: var(--color-cream-100); border-bottom-color: var(--color-ink-700); }
.pj-map .leaflet-container .leaflet-bar a:hover, .pj-map .leaflet-container .leaflet-bar a:focus { background: var(--color-ink-800); color: var(--color-gold-300); }
.pj-map .leaflet-container .leaflet-bar a.leaflet-disabled { background: var(--color-ink-900); color: var(--color-ink-500); }
.pj-map .leaflet-container .leaflet-control-attribution { background: rgba(14, 14, 18, 0.85); color: var(--color-ink-400); font-size: 10px; }
.pj-map .leaflet-container .leaflet-control-attribution a { color: var(--color-gold-300); }
`;

export interface MapPanelProps {
  point: TripLocation | null;
  ended: boolean;
  reconnecting: boolean;
  className?: string;
}

/** The rounded map card used on the rider's tracking page: map, follow toggle, and status overlays. */
export function MapPanel({ point, ended, reconnecting, className }: MapPanelProps) {
  const [follow, setFollow] = useState(true);
  const onUserInteract = useCallback(() => setFollow(false), []);

  return (
    <div
      className={cn("pj-map relative isolate overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-900 shadow-card", className)}
      role="region"
      aria-label="Map of your driver's position"
    >
      <style dangerouslySetInnerHTML={{ __html: MAP_THEME_CSS }} />
      <div className="h-[60vh] max-h-[640px] min-h-[320px] lg:h-[520px] lg:max-h-none">
        <LiveMapLoader point={point} follow={follow} onUserInteract={onUserInteract} />
      </div>

      {point && !ended && (
        <button
          type="button"
          aria-pressed={follow}
          onClick={() => setFollow((v) => !v)}
          className={cn(
            "absolute right-3 top-3 z-[1001] inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow-card backdrop-blur-sm transition-colors",
            follow ? "border-gold-500/60 bg-ink-900/90 text-gold-300" : "border-ink-600 bg-ink-900/90 text-cream-100 hover:border-gold-500/60",
          )}
        >
          <LocateFixed className="size-4" aria-hidden="true" />
          {follow ? "Following driver" : "Follow driver"}
        </button>
      )}

      {reconnecting && !ended && (
        <p
          role="status"
          className="absolute bottom-3 left-3 z-[1001] inline-flex items-center gap-2 rounded-full border border-warning-500/40 bg-ink-900/90 px-3 py-1.5 text-xs font-semibold text-warning-400 backdrop-blur-sm"
        >
          <Spinner className="size-3" /> Reconnecting…
        </p>
      )}

      {!point && !ended && (
        <Overlay title="Waiting for the first location update…">
          <p className="mt-1 text-sm leading-relaxed text-ink-300">
            Your driver has started the trip. The map will move as soon as their phone sends a position.
          </p>
          <Spinner className="mx-auto mt-3 text-gold-400" />
        </Overlay>
      )}

      {ended && (
        <Overlay title="This trip has ended.">
          <p className="mt-1 text-sm leading-relaxed text-ink-300">Location sharing has stopped. Thank you for riding with PJ&rsquo;s.</p>
          <ButtonLink href="/reviews" variant="outline-gold" size="sm" className="mt-4">
            Leave a review
          </ButtonLink>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-ink-950/60 p-6 backdrop-blur-[2px]" role="status" aria-live="polite">
      <div className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-850/95 px-5 py-4 text-center shadow-card">
        <p className="font-semibold text-cream-50">{title}</p>
        {children}
      </div>
    </div>
  );
}
