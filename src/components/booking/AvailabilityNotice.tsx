import { Clock } from "lucide-react";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { AVAILABILITY, type SiteSettings } from "@/lib/types";

/**
 * Current availability, as set by the owner in /admin. Sits above the reservation form so riders know what to
 * expect before they fill anything in. Server component: no client code needed.
 */
export function AvailabilityNotice({ settings, className }: { settings: SiteSettings; className?: string }) {
  const status = settings.availabilityStatus;
  const note = settings.availabilityNote.trim();
  const hours = settings.hoursText.trim();

  return (
    <section aria-labelledby="availability-heading" className={cn("rounded-2xl border border-ink-700/80 bg-ink-900/60 p-4 sm:p-5", className)}>
      <h2 id="availability-heading" className="sr-only">
        Current availability
      </h2>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <AvailabilityBadge status={status} />
        <p className="text-sm leading-relaxed text-ink-200">{AVAILABILITY[status].description}</p>
      </div>
      {note && (
        <p className="mt-3 border-l-2 border-gold-500/60 pl-3 text-sm leading-relaxed text-cream-100">{note}</p>
      )}
      {hours && (
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-400">
          <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
          <span>{hours}</span>
        </p>
      )}
    </section>
  );
}
