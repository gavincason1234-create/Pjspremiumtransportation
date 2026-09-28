import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Logo({ size = 40, withWordmark = true, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label={`${BUSINESS.name} home`}>
      <Image
        src="/brand/profile.jpg"
        alt=""
        width={size}
        height={size}
        className="rounded-full ring-1 ring-gold-500/50"
        loading="eager"
        fetchPriority="high"
      />
      {withWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-[17px] font-semibold tracking-tight text-cream-50 sm:text-lg">PJ’s Premium</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400">Transportation</span>
        </span>
      )}
    </Link>
  );
}
