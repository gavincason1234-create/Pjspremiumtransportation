"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

const LABELS: Record<number, string> = {
  1: "Not good",
  2: "Could be better",
  3: "Fine",
  4: "Good",
  5: "Excellent",
};

/** Accessible 1–5 star picker (radio group). Submits as a normal form field via `name`. */
export function StarInput({
  name = "rating",
  defaultValue = 0,
  error,
  className,
}: {
  name?: string;
  defaultValue?: number;
  error?: string;
  className?: string;
}) {
  const [value, setValue] = useState<number>(defaultValue);
  const [hover, setHover] = useState<number>(0);
  const groupId = useId();
  const shown = hover || value;

  return (
    <fieldset className={cn("min-w-0", className)} aria-describedby={error ? `${groupId}-err` : undefined}>
      <legend className="mb-2 block text-sm font-medium text-cream-100">Your rating</legend>
      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer p-1"
              onMouseEnter={() => setHover(n)}
              title={LABELS[n]}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => setValue(n)}
                className="sr-only"
                aria-label={`${n} star${n > 1 ? "s" : ""}: ${LABELS[n]}`}
              />
              <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-150 hover:scale-110">
                <path
                  d="M12 2.5l2.95 6.07 6.7.93-4.87 4.7 1.18 6.65L12 17.7l-5.96 3.15 1.18-6.65L2.35 9.5l6.7-.93L12 2.5z"
                  fill={n <= shown ? "var(--color-gold-400)" : "var(--color-ink-700)"}
                  stroke="var(--color-gold-500)"
                  strokeOpacity={n <= shown ? 1 : 0.4}
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          ))}
        </div>
        <span className="min-w-[8ch] text-sm text-ink-300" aria-live="polite">
          {shown ? LABELS[shown] : "Tap a star"}
        </span>
      </div>
      {error && (
        <p id={`${groupId}-err`} className="mt-1.5 text-sm text-danger-400">
          {error}
        </p>
      )}
    </fieldset>
  );
}
