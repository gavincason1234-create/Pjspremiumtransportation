import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Plain-English terms for reserving and riding with PJ's Premium Transportation, using live trip tracking, and posting reviews.",
  alternates: { canonical: "/terms" },
};

const EFFECTIVE = "September 28, 2026";

export default function TermsPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Terms of service"
          title="The short version of how we work together."
          intro={`These terms cover reserving and riding with ${BUSINESS.name}, using this website, live trip tracking and reviews. Effective ${EFFECTIVE}.`}
        />

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-ink-200">
          <section>
            <h2 className="font-display text-2xl text-cream-50">1. Reservations and quotes</h2>
            <ul className="mt-4 space-y-2">
              <li>PJ&rsquo;s is a reservation-only service. A request sent through this site, by text or by phone is not a confirmed booking until we confirm the time and the rate with you.</li>
              <li>Rates are quoted before you confirm and depend on distance, time of day and waiting time. The quoted rate is the rate you pay unless the trip changes (added stops, longer waits, a different destination), in which case we tell you before the change is made whenever possible.</li>
              <li>No payment is collected on this website. Payment terms are agreed when your ride is confirmed.</li>
              <li>Plans change. Please tell us as early as you can. Any cancellation or no-show terms that apply to your ride are stated when we confirm it, never after.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">2. Riding with PJ&rsquo;s</h2>
            <ul className="mt-4 space-y-2">
              <li>Seat belts on, every rider, every trip. No smoking or vaping in the vehicle.</li>
              <li>We treat every rider with respect and ask the same in return. A driver may decline or end a ride when someone&rsquo;s safety is at risk, and may charge a reasonable cleaning fee for damage or soiling, stated at the time.</li>
              <li>Children ride in appropriate car seats as Texas law requires. Tell us in your request so we can plan for it.</li>
              <li>Please keep valuables with you. We will do our best to return anything left behind but cannot guarantee it.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">3. Live trip tracking</h2>
            <p className="mt-3">
              When a driver chooses to share location for your trip, you receive a private link that works only while that trip is active. The link shows the driver&rsquo;s position, name, vehicle and plate so you can be sure you are getting into the right car. Do not share the link publicly. Tracking is a convenience and safety feature, not a guarantee of arrival times, and it stops automatically when the trip ends. See the{" "}
              <Link href="/privacy" className="font-semibold text-gold-300 hover:text-gold-200">
                privacy notice
              </Link>{" "}
              for how location data is handled.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">4. Reviews</h2>
            <p className="mt-3">
              Reviews on this site are written by riders in their own words. We publish them as they come in, positive or critical, and remove only spam, abusive content, personal information about others, or reviews that are clearly not about a ride with PJ&rsquo;s. We do not write, buy or edit reviews, and nothing in these terms limits your right to review or complain about our service honestly. By posting, you allow us to display your review on this site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">5. Drivers and applications</h2>
            <p className="mt-3">
              Submitting an application on the Drive with PJ&rsquo;s page is an introduction, not an offer of work. Every driver who joins PJ&rsquo;s is held to the PJ&rsquo;s Driver Standard and agrees to share location only with their own consent, per trip.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">6. This website</h2>
            <p className="mt-3">
              We work to keep this site accurate and available but cannot promise it will be error-free at all times. Photos are of PJ&rsquo;s vehicle, riders who agreed to be pictured, and the owner. Please do not misuse the site, attempt to access the owner or driver areas without permission, or submit false requests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">7. Liability and law</h2>
            <p className="mt-3">
              To the extent the law allows, PJ&rsquo;s is not liable for indirect losses such as missed flights or appointments caused by events outside our control, including weather, traffic and road closures, though we will always do our best to get you there on time. These terms are governed by the laws of the State of Texas. If any part of these terms cannot be enforced, the rest still applies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">8. Questions</h2>
            <p className="mt-3">
              Email{" "}
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-gold-300 hover:text-gold-200">
                {BUSINESS.email}
              </a>{" "}
              or call or text {BUSINESS.phone}.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
