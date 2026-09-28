import type { Metadata } from "next";
import { ExternalLink, MessageSquareQuote, PenLine, Star } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { FacebookIcon } from "@/components/site/FacebookIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDb } from "@/lib/db";
import { BUSINESS, siteUrl } from "@/lib/site";
import { ReviewForm } from "./ReviewForm";

/** Reads live review data on every request. */
export const dynamic = "force-dynamic";

const description =
  "Honest reviews from riders of PJ's Premium Transportation in Myra, Texas: airport runs, medical appointments, WinStar and Metroplex trips. Read what riders say, or share your own.";

export const metadata: Metadata = {
  title: "Rider reviews",
  description,
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: `Rider reviews | ${BUSINESS.name}`,
    description,
    url: "/reviews",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: `${BUSINESS.name} — ${BUSINESS.tagline}` }],
  },
};

const WHAT_HELPS = [
  "Which ride it was, and roughly when",
  "How the pickup, timing and the car felt",
  "Anything that could have gone better",
  "Whether you would book again",
];

export default async function ReviewsPage() {
  const db = await getDb();
  const [stats, reviews, settings] = await Promise.all([db.reviews.stats(), db.reviews.listPublic(), db.settings.get()]);
  const facebookUrl = settings.facebookUrl || BUSINESS.facebookUrl;
  const requiresApproval = settings.reviewsRequireApproval;
  const base = siteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#business`,
    name: settings.businessName || BUSINESS.name,
    telephone: "+1-940-277-9099",
    email: BUSINESS.email,
    address: { "@type": "PostalAddress", addressLocality: BUSINESS.city, addressRegion: BUSINESS.state, addressCountry: "US" },
    url: base,
    image: `${base}/brand/profile.jpg`,
    sameAs: [facebookUrl],
    ...(stats.count > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: stats.average, reviewCount: stats.count, bestRating: 5, worstRating: 1 } }
      : {}),
  };

  const intro = requiresApproval
    ? `Every review here comes from a rider, good or critical. ${BUSINESS.ownerFirstName} reads each one before it goes up, and the only things held back are spam and abusive content.`
    : "Every review here comes from a rider and goes up as it arrives, good or critical. The only things removed are spam and abusive content.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Section className="bg-hero-glow">
        <Container>
          <SectionHeading as="h1" eyebrow="Riders’ words" title="What riders say about PJ’s" intro={intro} />

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Review summary">
              <ReviewSummary stats={stats} />

              <ButtonLink href="#share" variant="outline-gold" className="w-full">
                <PenLine className="size-4" aria-hidden="true" />
                Write a review
              </ButtonLink>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-ink-700/80 bg-ink-850 px-4 py-3 text-sm font-medium text-cream-100 transition-colors hover:border-gold-500/40 hover:text-gold-300"
              >
                <FacebookIcon className="size-5 shrink-0 text-gold-400" />
                <span className="flex-1">Also see us on Facebook</span>
                <ExternalLink className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="text-xs leading-relaxed text-ink-500">
                Ride photos and updates from {BUSINESS.ownerFirstName} are posted there as well.
              </p>
            </aside>

            <div id="reviews" className="scroll-mt-24">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-600 px-5 py-10 text-center sm:px-8 sm:py-14">
                  <MessageSquareQuote className="mx-auto size-8 text-gold-400" aria-hidden="true" />
                  <h2 className="mt-4 font-display text-2xl text-cream-50 sm:text-3xl">The first review will go right here.</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300 sm:text-base">
                    This page only shows words from real riders, so it stays empty until the first one arrives. If{" "}
                    {BUSINESS.ownerFirstName} has driven you, a few honest sentences would mean a great deal to her and to the
                    next person deciding whether to book.
                  </p>
                  <ButtonLink href="#share" className="mt-7">
                    <PenLine className="size-4" aria-hidden="true" />
                    Share your experience
                  </ButtonLink>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-xl text-cream-50 sm:text-2xl">
                      {reviews.length === 1 ? "1 rider review" : `${reviews.length} rider reviews`}
                    </h2>
                    <p className="text-xs text-ink-400">Newest first</p>
                  </div>
                  <ol className="space-y-4" aria-label="Rider reviews">
                    {reviews.map((review) => (
                      <li key={review.id}>
                        <ReviewCard review={review} />
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="share" className="scroll-mt-20 border-t border-white/5 bg-ink-900/40">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
            <div>
              <SectionHeading
                eyebrow="Share your experience"
                title={<>Ridden with {BUSINESS.ownerFirstName}? Tell the next rider.</>}
                intro="Your words help someone deciding whether to book a 2:30 a.m. airport run or a first trip to WinStar. A few honest sentences are plenty."
              />
              <ul className="mt-6 space-y-2.5 text-sm text-ink-300" aria-label="What helps other riders">
                {WHAT_HELPS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Star className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card>
              <CardBody>
                <ReviewForm requiresApproval={requiresApproval} />
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
