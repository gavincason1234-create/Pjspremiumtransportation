import { CalendarCheck, Receipt, UserRound } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

const ROWS = [
  {
    icon: Receipt,
    title: "A rate you know before you ride",
    pjs: "Your rate is quoted and confirmed before pickup. No surge at 2 a.m., no meter running in traffic.",
    app: "Prices move with demand, and the late-night or holiday fare can be a surprise.",
  },
  {
    icon: CalendarCheck,
    title: "A reservation, not a gamble",
    pjs: "Your ride is booked ahead and planned around your flight or appointment.",
    app: "You request when you need it and hope someone nearby accepts, especially out in Cooke County.",
  },
  {
    icon: UserRound,
    title: "The same trusted driver",
    pjs: "You know who is coming before the car arrives, and you can follow the ride on a private link.",
    app: "A different stranger every time, matched by an algorithm.",
  },
];

export function VsRideshare() {
  return (
    <Section className="border-b border-white/5">
      <Container>
        <SectionHeading
          eyebrow="Why reserve"
          title="Why riders book PJ’s instead of an app"
          intro="Rideshare apps are fine for a quick hop across town. For the rides that matter, an early flight, a big night out, an appointment you cannot miss, a reservation is the better tool."
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {ROWS.map(({ icon: Icon, title, pjs, app }) => (
            <li key={title} className="flex flex-col rounded-2xl border border-ink-700 bg-ink-850 p-5 sm:p-6">
              <Icon className="size-6 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl text-cream-50">{title}</h3>
              <div className="mt-4 rounded-xl border border-gold-500/25 bg-gold-500/5 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">With PJ&rsquo;s</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-cream-100">{pjs}</p>
              </div>
              <div className="mt-3 rounded-xl border border-ink-700 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">With an app</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-300">{app}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
