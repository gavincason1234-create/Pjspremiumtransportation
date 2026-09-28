import { StarRating } from "@/components/ui/StarRating";
import type { ReviewStats } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Average + distribution. Renders an honest empty state when there are no reviews yet. */
export function ReviewSummary({ stats, className, compact }: { stats: ReviewStats; className?: string; compact?: boolean }) {
  if (stats.count === 0) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-ink-600 p-5 text-center", className)}>
        <StarRating value={0} size="lg" label="No ratings yet" className="justify-center opacity-70" />
        <p className="mt-3 font-semibold text-cream-50">No reviews yet</p>
        <p className="mt-1 text-sm text-ink-400">Ridden with PJ&rsquo;s? Be the first to share how it went.</p>
      </div>
    );
  }
  return (
    <div className={cn("rounded-2xl border border-ink-700 bg-ink-850 p-5", className)}>
      <div className="flex items-center gap-4">
        <p className="font-display text-5xl leading-none text-cream-50">{stats.average.toFixed(1)}</p>
        <div>
          <StarRating value={stats.average} size="md" />
          <p className="mt-1 text-sm text-ink-400">
            Based on {stats.count} review{stats.count === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      {!compact && (
        <ul className="mt-5 space-y-1.5" aria-label="Rating breakdown">
          {([5, 4, 3, 2, 1] as const).map((n) => {
            const count = stats.distribution[n];
            const pct = stats.count ? Math.round((count / stats.count) * 100) : 0;
            return (
              <li key={n} className="flex items-center gap-3 text-xs text-ink-300">
                <span className="w-8 shrink-0 tabular-nums">{n} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                  <span className="block h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-6 shrink-0 text-right tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
