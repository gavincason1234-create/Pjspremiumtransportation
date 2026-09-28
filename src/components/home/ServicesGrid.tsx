import Link from "next/link";
import { ArrowRight, Briefcase, Clock, MapPin, PartyPopper, Plane, Stethoscope } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES, type ServiceContent } from "@/content/services";
import { BUSINESS } from "@/lib/site";

const ICONS: Record<ServiceContent["icon"], typeof Plane> = {
  plane: Plane,
  party: PartyPopper,
  stethoscope: Stethoscope,
  briefcase: Briefcase,
  clock: Clock,
  mapPin: MapPin,
};

export function ServiceIcon({ icon, className }: { icon: ServiceContent["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden="true" />;
}

export function ServicesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <Section id="services" className="border-b border-white/5">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Where PJ's takes you"
            intro="Every ride is reserved ahead, so your driver is ready before you walk out the door. Rates depend on distance, time of day and waiting time. Request a quote and you will have a clear answer before you confirm."
          />
          {compact && (
            <ButtonLink href="/services" variant="outline-gold" className="self-start lg:self-auto">
              All services <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          )}
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Card className="group flex h-full flex-col transition-colors hover:border-gold-500/40">
                <CardBody className="flex flex-1 flex-col">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10">
                    <ServiceIcon icon={s.icon} className="size-5 text-gold-300" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-cream-50">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-300">{s.oneLiner}</p>
                  {!compact && (
                    <ul className="mt-4 space-y-2 text-sm text-ink-300">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/book?service=${s.serviceType}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
                    >
                      Get a quote for this <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-ink-400">
          Reservations only · Rate confirmed before you ride · Call or text{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold text-cream-100 hover:text-gold-300">
            {BUSINESS.phone}
          </a>
        </p>
      </Container>
    </Section>
  );
}
