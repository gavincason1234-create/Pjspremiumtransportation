import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import type { Review, ReviewStats } from "@/lib/types";

export function ReviewsTeaser({ stats, reviews }: { stats: ReviewStats; reviews: Review[] }) {
  return (
    <Section id="reviews" className="border-b border-white/5 bg-ink-900/40">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Reviews" title="What riders say" intro="Honest reviews from real rides, in riders' own words." />
          <ButtonLink href="/reviews" variant="outline-gold" className="self-start lg:self-auto">
            {stats.count > 0 ? "Read all reviews" : "Write the first review"} <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ReviewSummary stats={stats} compact />
            {stats.count === 0 && (
              <p className="mt-4 text-sm leading-relaxed text-ink-400">
                PJ&rsquo;s is new, and we would rather show you nothing than something we made up. If you have ridden with us, your honest
                review helps the next rider decide.
              </p>
            )}
          </div>
          <div className="lg:col-span-8">
            {reviews.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {reviews.slice(0, 4).map((r) => (
                  <li key={r.id}>
                    <ReviewCard review={r} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full flex-col justify-center rounded-2xl border border-ink-700 bg-ink-850 p-6">
                <p className="font-display text-2xl text-cream-50">Be the first to review PJ&rsquo;s</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-300">
                  Two minutes, and it means a great deal to a small business. Reviews are published as they come in, good or critical.
                </p>
                <Link href="/reviews#write" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200">
                  Write a review <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
