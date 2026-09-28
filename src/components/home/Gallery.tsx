import Image from "next/image";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FacebookIcon } from "@/components/site/FacebookIcon";
import type { GalleryImage } from "@/lib/gallery";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Real photos from the Facebook page as proof of the service. The grid adapts to however many
 * files are in /public/gallery; the first (or a tall portrait) image gets the feature slot.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <Section id="on-the-road" className="border-b border-white/5">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="On the road"
            title="See PJ's on the road"
            intro="PJ's is a young business with a growing story, and our Facebook page is where it is being told: airport mornings, WinStar nights, the car, and the small details that make a ride feel personal."
          />
          <ButtonLink href={BUSINESS.facebookUrl} variant="outline-gold" external className="self-start lg:self-auto">
            <FacebookIcon className="size-4" /> Follow PJ&rsquo;s on Facebook
          </ButtonLink>
        </div>

        {images.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink-600 p-8 text-center">
            <p className="font-display text-xl text-cream-50">Photos are on the way</p>
            <p className="mt-2 text-sm text-ink-400">In the meantime, see the car, the road and the people behind PJ&rsquo;s on Facebook.</p>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[220px]">
            {images.map((img, i) => {
              const feature = i === 1; // the tall back-seat photo reads best as the feature
              return (
                <li key={img.file} className={cn("group relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-850", feature ? "row-span-2 aspect-[3/4] lg:aspect-auto" : "aspect-square lg:aspect-auto")}>
                  <figure className="h-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-3 pt-10 text-xs leading-snug text-cream-100 sm:text-[13px]">
                      {img.caption}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </Section>
  );
}
