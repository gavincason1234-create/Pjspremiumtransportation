import type { Metadata } from "next";
import { Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { FacebookIcon } from "@/components/site/FacebookIcon";
import { Faq } from "@/components/home/Faq";
import { getDb } from "@/lib/db";
import { BUSINESS } from "@/lib/site";
import { AVAILABILITY } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call or text (940) 277-9099, email pjspremiumtransportation@gmail.com, or message PJ's on Facebook. Woman-owned and locally operated in Myra, Texas.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const db = await getDb();
  const settings = await db.settings.get();

  return (
    <>
      <Section className="border-b border-white/5 bg-hero-glow">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              as="h1"
              eyebrow="Contact"
              title="Talk to a person, not a queue."
              intro="Texting is fastest. Calls are answered by Patsy herself. Either way, you get a straight answer about times and rates."
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <AvailabilityBadge status={settings.availabilityStatus} />
              <span className="text-sm text-ink-300">{settings.availabilityNote || AVAILABILITY[settings.availabilityStatus].description}</span>
            </div>
            <p className="mt-4 text-sm text-ink-400">{settings.hoursText}</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardBody>
                  <MessageSquareText className="size-6 text-gold-400" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold text-cream-50">Text</h2>
                  <p className="mt-1 text-sm text-ink-300">Best for quotes and quick questions. Include where, when and how many.</p>
                  <ButtonLink href={BUSINESS.smsQuoteHref} className="mt-4 w-full">
                    Text {BUSINESS.phone}
                  </ButtonLink>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Phone className="size-6 text-gold-400" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold text-cream-50">Call</h2>
                  <p className="mt-1 text-sm text-ink-300">For pickups in the next few hours, call so we can confirm right away.</p>
                  <ButtonLink href={BUSINESS.phoneHref} variant="outline-gold" className="mt-4 w-full">
                    Call {BUSINESS.phone}
                  </ButtonLink>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Mail className="size-6 text-gold-400" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold text-cream-50">Email</h2>
                  <p className="mt-1 text-sm text-ink-300">For standing reservations, corporate travel or anything with details attached.</p>
                  <a href={`mailto:${BUSINESS.email}`} className="mt-4 block break-all text-sm font-semibold text-gold-300 hover:text-gold-200">
                    {BUSINESS.email}
                  </a>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <FacebookIcon className="size-6 text-gold-400" />
                  <h2 className="mt-3 font-semibold text-cream-50">Facebook</h2>
                  <p className="mt-1 text-sm text-ink-300">Photos from the road, updates, and another way to send a message.</p>
                  <a href={BUSINESS.facebookUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-sm font-semibold text-gold-300 hover:text-gold-200">
                    PJ&rsquo;s Premium Transportation on Facebook
                  </a>
                </CardBody>
              </Card>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-ink-700 bg-ink-850 p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold-400" aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-cream-50">Service area</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">
                  Based in {BUSINESS.city}, Texas. Serving Cooke County and Gainesville, DFW International and Dallas Love Field, WinStar World
                  Casino and Resort, and the Dallas–Fort Worth Metroplex. Longer trips by request.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ButtonLink href="/book" size="lg" className="w-full sm:w-auto">
                Get a quote online
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
      <Faq />
    </>
  );
}
