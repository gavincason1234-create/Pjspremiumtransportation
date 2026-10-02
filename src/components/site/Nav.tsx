"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/cn";

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/track", label: "Track a ride" },
  { href: "/drive", label: "Drive with us" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-ink-950/70">
      <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-cream-50 xl:px-3.5",
                  active && "text-cream-50",
                )}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-cream-100 hover:bg-white/5 xl:px-3.5"
            aria-label={`Call ${BUSINESS.phone}`}
          >
            <Phone className="size-4 text-gold-400" aria-hidden="true" />
            <span className="hidden xl:inline">{BUSINESS.phone}</span>
          </a>
          <ButtonLink href="/book" size="sm">
            Get a quote
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={BUSINESS.phoneHref} className="inline-flex size-10 items-center justify-center rounded-full text-gold-400 hover:bg-white/5" aria-label={`Call ${BUSINESS.phone}`}>
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full text-cream-100 hover:bg-white/5"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden",
          open ? "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-white/5 bg-ink-950" : "hidden",
        )}
      >
        <nav className="container-x flex flex-col py-4" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-white/5 py-4 font-display text-2xl text-cream-50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3" onClick={() => setOpen(false)}>
            <ButtonLink href="/book" size="lg">
              Get a quote
            </ButtonLink>
            <ButtonLink href={BUSINESS.phoneHref} variant="outline-gold" size="lg">
              <Phone className="size-4" aria-hidden="true" /> Call {BUSINESS.phone}
            </ButtonLink>
            <ButtonLink href={BUSINESS.smsQuoteHref} variant="ghost" size="lg">
              Text Patsy
            </ButtonLink>
          </div>
          <p className="mt-8 text-center text-xs text-ink-500">Woman-owned · Locally operated · Myra, Texas</p>
        </nav>
      </div>
    </header>
  );
}
