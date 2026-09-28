import type { Metadata } from "next";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CtaBand } from "@/components/home/CtaBand";
import { DriverStandard } from "@/components/home/DriverStandard";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";
import { BedDouble, Gift, HandHeart, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Airport transportation, WinStar and nights out, medical appointments, Metroplex and corporate rides, hourly service and local trips across North Texas. Reservations only.",
  alternates: { canonical: "/services" },
};

const INCLUDED = [
  { icon: Plane, title: "Flight-aware pickups", body: "Share your flight number and the pickup is planned around it, both directions." },
  { icon: HandHeart, title: "Help with bags and doors", body: "A curbside meeting, a hand with luggage, and a calm start to the trip." },
  { icon: Gift, title: "A thank-you bag, every ride", body: "Tissues, mints, a snack and a note from Patsy ride along with you." },
  { icon: BedDouble, title: "Blanket and pillow in the back", body: "For 4 a.m. departures and midnight returns, the back seat is ready to rest." },
];

export default function ServicesPage() {
  return (
    <>
      <Section className="border-b border-white/5 bg-hero-glow pb-8 sm:pb-10">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="Reserved rides, one named driver, any hour."
            intro="From a ten-minute run into Gainesville to a 2:30 a.m. airport departure, every ride with PJ's is booked ahead, quoted before you confirm, and driven by someone you know by name."
          />
        </Container>
      </Section>

      <ServicesGrid />

      <Section className="border-b border-white/5 bg-ink-900/40">
        <Container>
          <SectionHeading eyebrow="Included" title="What comes with every ride" align="center" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Card className="h-full">
                  <CardBody>
                    <Icon className="size-6 text-gold-400" aria-hidden="true" />
                    <h3 className="mt-3 font-semibold text-cream-50">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{body}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-ink-400">Flat rates, quoted before you confirm. No surge, no meter, no surprises.</p>
        </Container>
      </Section>

      <DriverStandard />

      <CtaBand title="Not sure which one fits?" body="Tell us where you are going and when. We will suggest the right option and send a rate." />
    </>
  );
}
