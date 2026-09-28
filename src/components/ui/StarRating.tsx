import { cn } from "@/lib/cn";

/** Read-only stars. Supports fractional values (e.g. 4.3) for averages. */
export function StarRating({
  value,
  size = "md",
  className,
  label,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const px = size === "sm" ? 14 : size === "lg" ? 26 : 18;
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `${clamped.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - (i - 1)));
        return <Star key={i} fill={fill} px={px} />;
      })}
    </span>
  );
}

export function Star({ fill, px }: { fill: number; px: number }) {
  const id = `star-${px}-${Math.round(fill * 100)}`;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${fill * 100}%`} stopColor="var(--color-gold-400)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--color-ink-600)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.95 6.07 6.7.93-4.87 4.7 1.18 6.65L12 17.7l-5.96 3.15 1.18-6.65L2.35 9.5l6.7-.93L12 2.5z"
        fill={`url(#${id})`}
        stroke="var(--color-gold-500)"
        strokeOpacity={fill > 0 ? 0.9 : 0.35}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
