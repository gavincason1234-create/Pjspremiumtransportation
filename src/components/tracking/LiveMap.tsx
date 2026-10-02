"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { TripLocation } from "@/lib/types";
import { MYRA_TX } from "./geo";

export interface LiveMapProps {
  /** Latest driver position, or null before the first fix. */
  point: TripLocation | null;
  /** When true the map keeps the driver centred as new fixes arrive. */
  follow: boolean;
  /** Called when the viewer drags the map, so the parent can switch "follow" off. */
  onUserInteract: () => void;
}

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const FIRST_FIX_ZOOM = 15;
const GOLD = "#c9a94a";

/**
 * Leaflet map showing a single pulsing driver marker. Leaflet touches `window` at import time,
 * so this component must only ever be loaded through LiveMapLoader (next/dynamic, ssr: false).
 */
export function LiveMap({ point, follow, onUserInteract }: LiveMapProps) {
  const icon = useMemo(
    () => L.divIcon({ className: "", html: '<div class="pj-driver-marker"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
    [],
  );
  const showAccuracy = point?.accuracyM != null && point.accuracyM > 25 && point.accuracyM < 2000;

  return (
    <MapContainer
      center={MYRA_TX}
      zoom={10}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", background: "#0e0e12" }}
    >
      <TileLayer url={TILE_URL} attribution={ATTRIBUTION} maxZoom={19} />
      {point && showAccuracy && (
        <Circle
          center={[point.lat, point.lng]}
          radius={point.accuracyM ?? 0}
          interactive={false}
          pathOptions={{ color: GOLD, weight: 1, opacity: 0.6, fillColor: GOLD, fillOpacity: 0.08 }}
        />
      )}
      {point && <Marker position={[point.lat, point.lng]} icon={icon} keyboard={false} interactive={false} />}
      <FollowController point={point} follow={follow} onUserInteract={onUserInteract} />
    </MapContainer>
  );
}

/** Centres on the first fix, then pans with each new one while "follow" is on. Lives inside MapContainer to use its context. */
function FollowController({ point, follow, onUserInteract }: LiveMapProps) {
  const map = useMap();
  const hasCenteredRef = useRef(false);
  const handlers = useMemo(() => ({ dragstart: onUserInteract }), [onUserInteract]);
  useMapEvents(handlers);

  useEffect(() => {
    if (!point) return;
    const target: L.LatLngExpression = [point.lat, point.lng];
    if (!hasCenteredRef.current) {
      hasCenteredRef.current = true;
      map.setView(target, FIRST_FIX_ZOOM, { animate: false });
      return;
    }
    if (follow) map.panTo(target, { animate: true, duration: 0.75 });
  }, [map, point, follow]);

  return null;
}
