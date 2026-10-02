import Image from "next/image";
import Link from "next/link";
import { MessageSquareText, Phone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { FacebookIcon } from "@/components/site/FacebookIcon";
import { BUSINESS } from "@/lib/site";
import type { ReviewStats, SiteSettings } from "@/lib/types";
import { AVAILABILITY } from "@/lib/types";

export function Hero({ settings, stats }: { settings: SiteSettings; stats: ReviewStats }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5" aria-labelledby="hero-title">
      {/* Background: the PJ's logo itself, large and luminous behind the headline.
          Phones/tablets: centered and dimmed so the text stays readable.
          Desktop: anchored to the right and fading into the page under the copy. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-4 aspect-square w-[125vw] max-w-[640px] -translate-x-1/2 opacity-[0.28] sm:top-8 sm:w-[90vw] sm:opacity-30 xl:left-auto xl:right-[calc(max(0px,(100vw-76rem)/2)-1.5rem)] xl:top-1/2 xl:w-[min(48vw,720px)] xl:max-w-none xl:translate-x-0 xl:-translate-y-1/2 xl:opacity-100">
          <div className="absolute inset-[6%] rounded-full bg-gold-500/25 blur-3xl" />
          <Image
            src="/brand/profile.jpg"
            alt=""
            fill
            sizes="(min-width: 1280px) 50vw, (min-width: 640px) 90vw, 125vw"
            className="rounded-full object-cover shadow-glow"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        {/* Readability veils */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/20 via-ink-950/75 to-ink-950 xl:hidden" />
        <div className="absolute inset-0 hidden xl:block bg-[linear-gradient(90deg,var(--color-ink-950)_0%,var(--color-ink-950)_38%,rgba(8,8,10,0.75)_52%,rgba(8,8,10,0)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink-950 to-transparent xl:block" />
        <div className="absolute inset-0 bg-hero-glow" />
      </div>

      <div className="container-x relative grid items-center gap-12 pb-16 pt-40 sm:pb-20 sm:pt-56 xl:min-h-[760px] xl:grid-cols-12 xl:py-28">
        <div className="xl:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400 sm:text-xs">
            Myra, Texas · Reservations only · Woman-owned
          </p>
          <h1 id="hero-title" className="mt-4 font-display text-[2.6rem] leading-[1.02] tracking-tight text-cream-50 sm:text-6xl lg:text-[4.4rem]">
            The driver you know.
            <br />
            <span className="text-gold-300">The service you trust.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200 sm:text-xl">
            Airport at 2:30 a.m. or WinStar at midnight, you get the same thing: a clean black Cadillac SUV, a calm drive
            and a driver who answers her own phone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/book" size="lg" className="sm:min-w-44">
              Get a quote
            </ButtonLink>
            <ButtonLink href={BUSINESS.smsQuoteHref} variant="outline-gold" size="lg">
              <MessageSquareText className="size-4" aria-hidden="true" />
              Text Patsy
            </ButtonLink>
            <a href={BUSINESS.phoneHref} className="inline-flex items-center gap-2 px-2 py-2 text-sm font-semibold text-cream-100 hover:text-gold-300 sm:ml-1">
              <Phone className="size-4 text-gold-400" aria-hidden="true" />
              or call {BUSINESS.phone}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300">
            <AvailabilityBadge status={settings.availabilityStatus} />
            <span>{settings.availabilityNote || AVAILABILITY[settings.availabilityStatus].description}</span>
          </div>

          {/* Micro-proof strip: real numbers only */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-ink-300">
            {stats.count > 0 ? (
              <Link href="/reviews" className="inline-flex items-center gap-1.5 font-semibold text-cream-100 hover:text-gold-300">
                <Star className="size-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                {stats.average.toFixed(1)} · {stats.count} rider review{stats.count === 1 ? "" : "s"}
              </Link>
            ) : (
              <span className="font-semibold text-cream-100">Woman-owned</span>
            )}
            <span className="hidden sm:inline text-ink-600" aria-hidden="true">·</span>
            <span>Locally operated in Myra, TX</span>
            <span className="hidden sm:inline text-ink-600" aria-hidden="true">·</span>
            <a href={BUSINESS.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold-300">
              <FacebookIcon className="size-3.5 text-gold-400" /> See us on Facebook
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
