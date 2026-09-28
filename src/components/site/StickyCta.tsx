"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";

/** Thumb-reachable action bar on phones. Hidden on operational screens where it would get in the way. */
export function StickyCta() {
  const pathname = usePathname();
  const hidden = ["/book", "/admin", "/driver", "/track/"].some((p) => pathname === p || pathname.startsWith(p));
  if (hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-950/90 pb-[var(--safe-bottom)] backdrop-blur-md lg:hidden" role="region" aria-label="Quick actions">
      <div className="container-x grid grid-cols-3 gap-2 py-2.5">
        <a href={BUSINESS.phoneHref} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-gold-500/50 text-sm font-semibold text-gold-300">
          <Phone className="size-4" aria-hidden="true" /> Call
        </a>
        <a href={BUSINESS.smsQuoteHref} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/15 text-sm font-semibold text-cream-100">
          <MessageSquareText className="size-4" aria-hidden="true" /> Text
        </a>
        <Link href="/book" className="inline-flex h-11 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-ink-950">
          Get a quote
        </Link>
      </div>
    </div>
  );
}
