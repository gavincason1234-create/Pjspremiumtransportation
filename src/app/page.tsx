import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhyPJs } from "@/components/home/WhyPJs";
import { VsRideshare } from "@/components/home/VsRideshare";
import { Gallery } from "@/components/home/Gallery";
import { DriverStandard } from "@/components/home/DriverStandard";
import { MeetTheDriver } from "@/components/home/MeetTheDriver";
import { ReviewsTeaser } from "@/components/home/ReviewsTeaser";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { getDb } from "@/lib/db";
import { getGalleryImages } from "@/lib/gallery";
import { BUSINESS, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BUSINESS.name} · Myra, TX`,
  description:
    "Reserved private rides in a black Cadillac SUV. Airport runs to DFW and Love Field at any hour, WinStar trips, Metroplex travel and medical appointments. Woman-owned in Myra, Texas. Call or text (940) 277-9099.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const db = await getDb();
  const [settings, stats, reviews] = await Promise.all([db.settings.get(), db.reviews.stats(), db.reviews.listPublic(4)]);
  const images = getGalleryImages();
  const patsy = images.find((i) => i.file.includes("patsy-behind"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl()}/#business`,
    name: BUSINESS.name,
    url: siteUrl(),
    telephone: "+1-940-277-9099",
    email: BUSINESS.email,
    image: `${siteUrl()}/brand/profile.jpg`,
    logo: `${siteUrl()}/brand/profile.jpg`,
    description: "Reserved private transportation from Myra, Texas: airport runs, medical appointments, WinStar and the DFW Metroplex.",
    address: { "@type": "PostalAddress", addressLocality: "Myra", addressRegion: "TX", addressCountry: "US" },
    areaServed: ["Myra TX", "Cooke County TX", "Gainesville TX", "Dallas–Fort Worth Metroplex", "WinStar World Casino and Resort"],
    sameAs: [BUSINESS.facebookUrl],
    priceRange: "$$",
    ...(stats.count > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: stats.average, reviewCount: stats.count, bestRating: 5, worstRating: 1 } }
      : {}),
  };

  return (
    <>
      <Hero settings={settings} stats={stats} />
      <TrustStrip />
      <ServicesGrid compact />
      <WhyPJs />
      <VsRideshare />
      <Gallery images={images} />
      <DriverStandard />
      <MeetTheDriver photo={patsy} />
      <ReviewsTeaser stats={stats} reviews={reviews} />
      <Faq limit={6} />
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
