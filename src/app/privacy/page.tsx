import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "What PJ's collects, why, and how trip location sharing works. Plain-English privacy for riders, reviewers, applicants and drivers.",
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE = "September 28, 2026";

export default function PrivacyPage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Privacy notice"
          title="Only what we need to give you a ride."
          intro={`${BUSINESS.name} collects only what it needs to give you a ride, answer you and keep the service safe. Here is what that means in plain terms. Effective ${EFFECTIVE}.`}
        />

        <div className="prose-pj mt-10 space-y-10 text-[15px] leading-relaxed text-ink-200">
          <section>
            <h2 className="font-display text-2xl text-cream-50">What we collect and why</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <strong className="text-cream-50">Ride requests.</strong> Your name, phone number, optional email, pickup and drop-off addresses, date and time, passenger count and notes, so we can confirm and complete your ride. We use your number only to reach you about your rides.
              </li>
              <li>
                <strong className="text-cream-50">Reviews.</strong> The name, rating and comment you post, shown publicly on this site, plus a one-way hashed record of your connection used only to stop spam.
              </li>
              <li>
                <strong className="text-cream-50">Driver applications.</strong> The details you enter on the Drive with PJ&rsquo;s page (name, phone, optional email, license plate, vehicle, optional experience, city and message), so Patsy can reach you and evaluate a fit. We do not collect date of birth, license numbers, Social Security numbers or documents on this site.
              </li>
              <li>
                <strong className="text-cream-50">Trip location (drivers only).</strong> A driver&rsquo;s phone location, only after the driver agrees at the start of a trip and only while that trip is active. It is shown on a private link for that trip so the rider and whoever is meeting them can see the car approaching. Location points are deleted automatically within 24 hours after the trip ends. We never collect a rider&rsquo;s location.
              </li>
              <li>
                <strong className="text-cream-50">Site basics.</strong> Standard server logs (IP address, browser type, pages requested) kept briefly for security and troubleshooting. Sign-in cookies for the owner and driver areas only.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">What we do not do</h2>
            <p className="mt-3">
              We do not sell or rent your information. We do not track riders. We do not run advertising trackers on this site, and we do not share location data with data brokers or advertisers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">Who sees your information</h2>
            <p className="mt-3">
              Patsy and any PJ&rsquo;s driver assigned to your ride, and the service providers that run this site (web hosting, database and email delivery), who may only use it to provide those services to us. We may disclose information when the law requires it. Your review is public once posted.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">How long we keep it</h2>
            <ul className="mt-4 space-y-2">
              <li>Trip location points: deleted within 24 hours after a trip ends.</li>
              <li>Ride requests: about 13 months, then deleted or anonymized. Invoices are kept separately for tax records.</li>
              <li>Driver applications: up to one year after a decision, then deleted.</li>
              <li>Reviews: while published. Hidden reviews are kept for record-keeping and then deleted.</li>
              <li>Server logs and anti-spam hashes: a few days to a few weeks.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">Your choices</h2>
            <p className="mt-3">
              Ask us to see, correct or delete your information at any time by emailing{" "}
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-gold-300 hover:text-gold-200">
                {BUSINESS.email}
              </a>{" "}
              or texting {BUSINESS.phone}. Drivers can stop sharing location at any moment by ending the trip. Because we do not track visitors across other sites, we treat &ldquo;Do Not Track&rdquo; signals the same as any other visit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">Cookies</h2>
            <p className="mt-3">
              This site sets only strictly necessary cookies: a sign-in cookie for the owner area and one for the driver console. No advertising or cross-site cookies are used, so no cookie banner is needed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">Children</h2>
            <p className="mt-3">This site is meant for adults booking transportation. We do not knowingly collect information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream-50">Changes</h2>
            <p className="mt-3">
              If this notice changes in a way that matters, we will update the effective date at the top of this page. Questions: {BUSINESS.email}. See also our{" "}
              <Link href="/terms" className="font-semibold text-gold-300 hover:text-gold-200">
                terms of service
              </Link>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
