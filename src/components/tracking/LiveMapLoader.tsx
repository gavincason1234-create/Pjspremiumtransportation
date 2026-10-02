"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Button";
import type { LiveMapProps } from "./LiveMap";

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 bg-ink-900 text-sm text-ink-400" role="status">
      <Spinner className="text-gold-400" /> Loading map
    </div>
  );
}

/** Leaflet reads `window` on import, so the map is client-only and code-split away from the page bundle. */
const LiveMap = dynamic(() => import("./LiveMap").then((m) => m.LiveMap), { ssr: false, loading: MapPlaceholder });

export function LiveMapLoader(props: LiveMapProps) {
  return <LiveMap {...props} />;
}
