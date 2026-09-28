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
      {/* Background: the owner's own cover artwork, kept subtle so the type stays crisp */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/brand/cover.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.16] blur-[2px] scale-105"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="absolute inset-0 bg-hero-glow" />
      </div>

      <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
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

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="relative mx-auto aspect-square w-64 sm:w-80 lg:w-[22rem]">
            <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-3xl" aria-hidden="true" />
            <Image
              src="/brand/profile.jpg"
              alt="PJ's Premium Transportation logo: a black Cadillac SUV in a gold ring"
              fill
              sizes="(min-width: 1024px) 352px, 320px"
              className="rounded-full object-cover ring-2 ring-gold-500/60 shadow-glow"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <p className="mt-6 text-center font-display text-lg text-cream-200">{BUSINESS.promise}</p>
        </div>
      </div>
    </section>
  );
}
