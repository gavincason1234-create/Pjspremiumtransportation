import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline-gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-[background-color,color,box-shadow,transform] duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-px whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-glow",
  secondary: "bg-cream-100 text-ink-950 hover:bg-white",
  ghost: "bg-transparent text-cream-100 hover:bg-white/5",
  "outline-gold": "border border-gold-500/60 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400",
  danger: "bg-danger-500 text-white hover:bg-danger-400",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(opts: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[opts.variant ?? "primary"], sizes[opts.size ?? "md"], opts.className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant, size, className, loading, children, disabled, ...rest }: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  "aria-label"?: string;
}) {
  const cls = buttonClasses({ variant, size, className });
  if (external || href.startsWith("tel:") || href.startsWith("sms:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
