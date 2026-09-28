import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...rest}>
      {children}
    </section>
  );
}

export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-x", className)} {...rest} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <Tag className="font-display text-3xl leading-[1.1] tracking-tight text-cream-50 sm:text-4xl lg:text-[2.75rem]">{title}</Tag>
      {intro && <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">{intro}</p>}
    </div>
  );
}
