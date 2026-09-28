import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Alert({ tone = "info", title, children, className }: { tone?: "info" | "success" | "warning" | "danger"; title?: ReactNode; children?: ReactNode; className?: string }) {
  const tones = {
    info: "border-gold-500/30 bg-gold-500/5 text-cream-100",
    success: "border-success-500/40 bg-success-500/10 text-cream-100",
    warning: "border-warning-500/40 bg-warning-500/10 text-cream-100",
    danger: "border-danger-500/40 bg-danger-500/10 text-cream-100",
  } as const;
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", tones[tone], className)}>
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      {children}
    </div>
  );
}
