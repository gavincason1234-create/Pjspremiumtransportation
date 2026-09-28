import { cn } from "@/lib/cn";

/** Facebook "f" mark (lucide dropped brand icons). */
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.8v3.1h2.6V21h3.1z" />
    </svg>
  );
}
