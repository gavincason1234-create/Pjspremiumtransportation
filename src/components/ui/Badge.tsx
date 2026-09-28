import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { AvailabilityStatus } from "@/lib/types";
import { AVAILABILITY } from "@/lib/types";

type Tone = "gold" | "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  gold: "border-gold-500/40 bg-gold-500/10 text-gold-300",
  neutral: "border-ink-600 bg-ink-800 text-ink-300",
  success: "border-success-500/40 bg-success-500/10 text-success-400",
  warning: "border-warning-500/40 bg-warning-500/10 text-warning-400",
  danger: "border-danger-500/40 bg-danger-500/10 text-danger-400",
};

export function Badge({ tone = "neutral", children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {dot && <span className={cn("size-1.5 rounded-full", tone === "success" ? "bg-success-400" : tone === "warning" ? "bg-warning-400" : tone === "danger" ? "bg-danger-400" : "bg-current")} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function AvailabilityBadge({ status, className }: { status: AvailabilityStatus; className?: string }) {
  const tone: Tone = status === "accepting" ? "success" : status === "by_appointment" ? "warning" : "danger";
  return (
    <Badge tone={tone} dot className={className}>
      {AVAILABILITY[status].label}
    </Badge>
  );
}
