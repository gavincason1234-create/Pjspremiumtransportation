import type { Metadata } from "next";
import { MessageSquareText, Phone, Sunrise } from "lucide-react";
import { AvailabilityNotice } from "@/components/booking/AvailabilityNotice";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDb } from "@/lib/db";
import { BUSINESS, smsHref } from "@/lib/site";
import { SERVICE_TYPES, type ServiceType } from "@/lib/types";
import { BookingForm } from "./BookingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserve a ride",
  description:
    "Request a reserved ride with PJ's Premium Transportation: airport runs to DFW and Love Field at any hour, medical appointments, WinStar and the Metroplex. Patsy confirms by text or call.",
  alternates: { canonical: "/book" },
};

const NEXT_STEPS: { title: string; body: string }[] = [
  {
    title: "You send the request",
    body: "About a minute of your time. No account to create and nothing to pay up front.",
  },
  {
    title: `${BUSINESS.ownerFirstName} confirms by text or call`,
    body: "You get availability and the price for your trip before anything is locked in, and you know exactly who is picking you up.",
  },
  {
    title: "On the day, follow along live",
    body: "When your driver starts the trip you can get a private tracking link and watch the black Cadillac SUV on its way to you.",
  },
];

function pickService(raw: string | string[] | undefined): ServiceType {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const match = SERVICE_TYPES.find((s) => s.value === value);
  return match ? match.value : "airport";
}

export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const defaultService = pickService(params.service);
  const db = await getDb();
  const settings = await db.settings.get();
  const textHref = smsHref(BUSINESS.phone, `Hi ${BUSINESS.ownerFirstName}, I'd like to reserve a ride`);

  return (
    <Section className="bg-hero-glow pt-10 sm:pt-14 lg:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Form column */}
          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              as="h1"
              eyebrow="Reservations only"
              title="Reserve your ride"
              intro={`Tell us where and when, ${BUSINESS.ownerFirstName} confirms by text or call, and you know exactly who is picking you up.`}
            />
            <AvailabilityNotice settings={settings} className="mt-8" />
            <BookingForm defaultService={defaultService} className="mt-6" />
          </div>

          {/* Aside */}
          <aside className="min-w-0 space-y-6 lg:col-span-5 lg:self-start lg:sticky lg:top-24" aria-label="Other ways to reserve and what to expect">
            <Card>
              <CardBody>
                <h2 className="font-display text-2xl text-cream-50">Prefer to talk?</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  Call or text {BUSINESS.ownerFirstName} directly. Every reservation is confirmed personally, so you will always hear back from a real person.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <ButtonLink href={BUSINESS.phoneHref} variant="primary" className="w-full sm:flex-1">
                    <Phone className="size-4" aria-hidden="true" /> Call {BUSINESS.phone}
                  </ButtonLink>
                  <ButtonLink href={textHref} variant="outline-gold" className="w-full sm:flex-1">
                    <MessageSquareText className="size-4" aria-hidden="true" /> Text us
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="font-display text-2xl text-cream-50">What happens next</h2>
                <ol className="mt-5 space-y-5">
                  {NEXT_STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 font-display text-base text-gold-300"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 pt-1">
                        <p className="font-semibold text-cream-50">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-300">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-ink-700/80 bg-ink-900/60 p-4 sm:p-5">
              <Sunrise className="mt-0.5 size-5 shrink-0 text-gold-400" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink-200">
                <span className="font-semibold text-cream-50">Early flight?</span> Airport rides that start at 2:30 in the morning are part of the job. Add your
                flight time to the notes and {BUSINESS.ownerFirstName} will plan the pickup around it.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
