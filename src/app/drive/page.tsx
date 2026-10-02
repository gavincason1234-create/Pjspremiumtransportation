import type { Metadata } from "next";
import Image from "next/image";
import {
  Ban,
  BellOff,
  CalendarCheck,
  Clock,
  FileX,
  Gauge,
  HandHeart,
  Handshake,
  KeyRound,
  MessageSquareText,
  PhoneCall,
  Scale,
  ShieldCheck,
  Sunrise,
} from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getGalleryImages } from "@/lib/gallery";
import { BUSINESS, smsHref } from "@/lib/site";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Drive with PJ's",
  description:
    "PJ's Premium Transportation is adding a few drivers in Myra and North Texas who share the PJ's standard: smooth, responsible, respectful. Apply in about a minute with your name and plate. No paperwork, no uploads.",
  alternates: { canonical: "/drive" },
};

const STANDARD = [
  {
    icon: Gauge,
    title: "Smooth",
    body: "Calm, steady driving with no hard braking and no racing the clock. Riders arrive relaxed, whether it is a 2:30 a.m. airport run or a night out.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible",
    body: "On time, every time. A clean, well-kept vehicle before every reservation. Sober, focused, phone down.",
  },
  {
    icon: HandHeart,
    title: "Respectful",
    body: "Courteous and discreet. Helpful with bags and doors. Every rider is treated like a neighbor.",
  },
];

const WHY = [
  {
    icon: CalendarCheck,
    title: "Your day is planned",
    body: "Every PJ's ride is reserved ahead of time, so you know your schedule before you start the car.",
  },
  {
    icon: BellOff,
    title: "No app-chasing",
    body: "No pinging, no surge games, no waiting in a lot hoping a fare comes through.",
  },
  {
    icon: PhoneCall,
    title: "A local owner who answers the phone",
    body: `${BUSINESS.ownerFirstName} runs PJ's from ${BUSINESS.city} and picks up when you call. Questions get a person, not a ticket.`,
  },
  {
    icon: Sunrise,
    title: "Early mornings and long hauls",
    body: "Airport runs, WinStar trips and DFW Metroplex rides: the kind of driving that rewards a calm hand and an early alarm.",
  },
];

const STEPS = [
  {
    icon: MessageSquareText,
    title: `${BUSINESS.ownerFirstName} reaches out`,
    body: "She reads every application herself and gets in touch by phone or text.",
  },
  {
    icon: Handshake,
    title: "A short conversation and a ride-along",
    body: "Nothing formal. A talk about availability and the standard, then some time in the car together.",
  },
  {
    icon: KeyRound,
    title: "You are added to the driver console",
    body: "You get your own PIN for the driver console, where trips are started and riders can follow their pickup.",
  },
];

const NOT_COLLECTED = ["Date of birth or age", "Photos or a copy of your ID", "License or Social Security numbers", "Documents of any kind"];

const QUESTION_TEXT = `Hi ${BUSINESS.ownerFirstName}, I saw the Drive with PJ's page and have a question about driving.`;

export default function DrivePage() {
  const photo = getGalleryImages().find((i) => i.file.includes("patsy-behind"));

  return (
    <>
      {/* (a) Hero */}
      <Section className="border-b border-white/5 bg-hero-glow">
        <Container className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              as="h1"
              eyebrow={`Join ${BUSINESS.ownerFirstName}'s team`}
              title="Drive with PJ's"
              intro={
                <>
                  PJ&rsquo;s is growing beyond one car. We are looking for a few drivers who share the PJ&rsquo;s standard: smooth,
                  responsible and respectful, on every ride. Applying takes about a minute. No paperwork, no uploads. Just your
                  name, your plate and what you drive.
                </>
              }
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#apply" size="lg" className="w-full sm:w-auto">
                Apply in a minute
              </ButtonLink>
              <ButtonLink href={smsHref(BUSINESS.phone, QUESTION_TEXT)} variant="outline-gold" size="lg" className="w-full sm:w-auto">
                <MessageSquareText className="size-4" aria-hidden="true" /> Questions? Text {BUSINESS.ownerFirstName}
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-300" aria-label="At a glance">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-gold-400" aria-hidden="true" /> About a minute to apply
              </li>
              <li className="flex items-center gap-2">
                <FileX className="size-4 text-gold-400" aria-hidden="true" /> No paperwork or uploads
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-gold-400" aria-hidden="true" /> Reservation-based rides
              </li>
            </ul>
          </div>

          <figure className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-ink-700 bg-ink-850 shadow-card lg:mr-0">
              {photo ? (
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 320px, 80vw" className="object-cover" />
              ) : (
                <Image src="/brand/profile.jpg" alt={`${BUSINESS.name} logo`} fill sizes="320px" className="object-cover" />
              )}
            </div>
            <figcaption className="mx-auto mt-4 max-w-xs text-center text-sm leading-relaxed text-ink-400 lg:mr-0">
              {BUSINESS.ownerFirstName}, owner-operator. Every driver who joins PJ&rsquo;s is held to the standard she drives by.
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* (b) The PJ's driver standard */}
      <Section className="border-b border-white/5 bg-ink-900/40">
        <Container>
          <SectionHeading
            eyebrow="The standard"
            title="The PJ's driver standard"
            intro="Three commitments. They are what riders book PJ's for, and they are the first thing we look for in a driver."
            align="center"
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {STANDARD.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Card className="h-full">
                  <CardBody>
                    <Icon className="size-6 text-gold-400" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-2xl text-cream-50">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-[15px]">{body}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* (c) Why drive with PJ's */}
      <Section className="border-b border-white/5">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Why PJ's"
              title="Why drive with PJ's"
              intro="Fewer, better rides. Booked ahead, quoted before the rider confirms, and driven for people who chose PJ's on purpose."
            />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {WHY.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-ink-700 bg-ink-850 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10" aria-hidden="true">
                  <Icon className="size-5 text-gold-400" />
                </span>
                <div>
                  <h3 className="font-semibold text-cream-50">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-300">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* (d) What to expect after you apply */}
      <Section className="border-b border-white/5 bg-ink-900/40">
        <Container>
          <SectionHeading eyebrow="After you apply" title="What to expect" intro="Three steps, no forms. Most of it is a conversation." align="center" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl border border-ink-700 bg-ink-850 p-5 shadow-card sm:p-6">
                <div className="flex items-center justify-between">
                  <span
                    className="flex size-9 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 font-display text-lg text-gold-300"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <Icon className="size-5 text-gold-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-cream-50">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* (e) The form, (f) fairness note */}
      <Section id="apply" className="scroll-mt-20 border-b border-white/5">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Apply"
              title="Apply in about a minute"
              intro="Your name, a phone number, your plate and what you drive. That is all it takes to start the conversation."
            />

            <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-850 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-400">Not collected at this stage</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-300">
                {NOT_COLLECTED.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Ban className="size-4 shrink-0 text-ink-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-sm leading-relaxed text-ink-300">
              <p className="font-semibold text-cream-50">Prefer to talk first?</p>
              <p className="mt-1">
                <a href={smsHref(BUSINESS.phone, QUESTION_TEXT)} className="font-semibold text-gold-300 hover:text-gold-200">
                  Text
                </a>{" "}
                or{" "}
                <a href={BUSINESS.phoneHref} className="font-semibold text-gold-300 hover:text-gold-200">
                  call {BUSINESS.phone}
                </a>{" "}
                and ask for {BUSINESS.ownerFirstName}.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ApplyForm />

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/5 bg-ink-900/40 p-4 text-sm leading-relaxed text-ink-400">
              <Scale className="mt-0.5 size-5 shrink-0 text-gold-400" aria-hidden="true" />
              <p>
                We consider every application on driving standards and availability only. No identifying documents are collected at
                this stage.{" "}
                <Link href="/privacy" className="font-semibold text-gold-300 hover:text-gold-200">
                  How we handle your details
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
