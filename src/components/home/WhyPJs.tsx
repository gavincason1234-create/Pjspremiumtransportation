import { CalendarCheck, Car, Gift, Landmark, Sunrise, UserRound } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

const POINTS = [
  { icon: UserRound, title: "You know who is driving.", body: "When you reserve with PJ's, you know exactly who is picking you up. No random assignment, no surprise at the curb." },
  { icon: CalendarCheck, title: "Reservations, not roulette.", body: "Every ride is booked ahead, so the car is clean, the route is planned and the driver is ready before you are." },
  { icon: Sunrise, title: "Any hour, including the hard ones.", body: "A 2:30 a.m. airport run or a late return from WinStar is a normal day here." },
  { icon: Car, title: "The car is part of the service.", body: "A black Cadillac SUV with a panoramic sunroof, a light leather interior, and a blanket and pillow waiting in the back." },
  { icon: Gift, title: "Small touches, every time.", body: "A thank-you bag rides with you: tissues, mints, a snack and a note from Patsy." },
  { icon: Landmark, title: "Local, woman-owned and accountable.", body: "Based in Myra, Texas. Your driver lives here, answers her own phone and stands behind every trip." },
];

export function WhyPJs() {
  return (
    <Section className="border-b border-white/5 bg-ink-900/40">
      <Container>
        <SectionHeading eyebrow="Why PJ's" title="Why riders choose PJ's" align="center" />
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10">
                <Icon className="size-5 text-gold-300" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-cream-50">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-300">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
