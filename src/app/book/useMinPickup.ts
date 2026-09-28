"use client";

import { useSyncExternalStore } from "react";
import { nextQuarterHourLocal } from "./time";

/**
 * The earliest value the pickup picker should offer, as a Central-time datetime-local string.
 *
 * Time is client-only state: the server cannot know the visitor's "now" at hydration, and computing it during
 * render would cause a hydration mismatch. Modelled as a tiny external store so the value is `undefined` on the
 * server and during hydration, then filled in on the client and kept fresh once a minute while in use.
 */

const listeners = new Set<() => void>();
let cached: string | undefined;
let timer: ReturnType<typeof setInterval> | undefined;

function refresh() {
  const next = nextQuarterHourLocal();
  if (next !== cached) {
    cached = next;
    listeners.forEach((l) => l());
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(refresh, 60_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot(): string | undefined {
  if (cached === undefined) cached = nextQuarterHourLocal();
  return cached;
}

function getServerSnapshot(): string | undefined {
  return undefined;
}

export function useMinPickup(): string | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
