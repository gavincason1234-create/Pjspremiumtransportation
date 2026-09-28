import { BadgeCheck, HandHeart, ShieldCheck, Smile, Timer } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";

const COMMITMENTS = [
  { icon: Smile, title: "Smooth", body: "Calm, steady driving with no hard braking, no phone in hand and no racing the clock. You arrive settled, not rattled." },
  { icon: ShieldCheck, title: "Responsible", body: "A clean, well-kept vehicle before every reservation. Sober, focused and unhurried. Your pickup time is treated as a commitment, not an estimate." },
  { icon: HandHeart, title: "Respectful", body: "Your ride, your rules: quiet or conversation, the temperature you like, the route you prefer. Your privacy and your space are respected without being asked." },
  { icon: Timer, title: "Reliable", body: "A confirmed reservation is honored. If anything changes on our end, you hear it from us first, with a plan." },
  { icon: BadgeCheck, title: "Accountable", body: "Every driver on the PJ's team is known to Patsy by name and held to this standard. If a ride falls short, we want to hear about it, and we make it right." },
];

export function DriverStandard() {
  return (
    <Section id="driver-standard" className="border-b border-white/5 bg-ink-900/40">
      <Container>
        <SectionHeading
          eyebrow="Our promise"
          title="The PJ's Driver Standard"
          intro="Smooth, responsible and respectful. That is the standard every PJ's driver holds, from the first text to the last door closed."
          align="center"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COMMITMENTS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className={i < 3 ? "lg:col-span-1" : "lg:col-span-1"}>
              <Card className="h-full">
                <CardBody className="p-5">
                  <Icon className="size-6 text-gold-400" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-xl text-cream-50">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{body}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
