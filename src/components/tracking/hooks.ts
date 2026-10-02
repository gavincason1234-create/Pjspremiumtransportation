import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ ticking clock
   One shared one-second interval feeds every subscriber, and the snapshot is a cached number
   (never Date.now() during render), which keeps React's store contract and hydration happy. */

let nowMs = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribeNow(listener: () => void) {
  listeners.add(listener);
  if (timer == null) {
    nowMs = Date.now();
    timer = setInterval(() => {
      nowMs = Date.now();
      for (const l of listeners) l();
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer != null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getNow = () => nowMs;
const getServerNow = () => 0;

/** Current time in ms, refreshed once a second while mounted. Returns 0 on the server and during hydration. */
export function useNow(): number {
  return useSyncExternalStore(subscribeNow, getNow, getServerNow);
}

/* ------------------------------------------------------------------ origin */

const noopSubscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

/** `window.location.origin` after hydration, "" on the server. Lets us build absolute share links without effects. */
export function useOrigin(): string {
  return useSyncExternalStore(noopSubscribe, getOrigin, getServerOrigin);
}
