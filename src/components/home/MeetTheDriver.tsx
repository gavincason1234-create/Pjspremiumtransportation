import Image from "next/image";
import { Container, Section, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FacebookIcon } from "@/components/site/FacebookIcon";
import { BUSINESS } from "@/lib/site";
import type { GalleryImage } from "@/lib/gallery";

export function MeetTheDriver({ photo }: { photo?: GalleryImage }) {
  return (
    <Section className="border-b border-white/5">
      <Container className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-ink-700 bg-ink-850">
            {photo ? (
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
            ) : (
              <Image src="/brand/profile.jpg" alt="PJ's Premium Transportation logo" fill sizes="420px" className="object-cover" />
            )}
          </div>
        </div>
        <div className="lg:col-span-7">
          <Eyebrow>Meet the driver</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-[1.1] tracking-tight text-cream-50 sm:text-4xl">
            &ldquo;When you reserve a ride with PJ&rsquo;s, you know exactly who is coming to pick you up. Me, Patsy.&rdquo;
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
            PJ&rsquo;s Premium Transportation is owned and driven by Patsy, right here in Myra. She started it on a simple idea:
            riders should not have to wonder who is picking them up. Every reservation comes with a name, a face and a phone
            number that gets answered. As PJ&rsquo;s grows, every driver who joins is held to the same standard she drives by.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/book">Get a quote</ButtonLink>
            <ButtonLink href={BUSINESS.facebookUrl} variant="ghost" external>
              <FacebookIcon className="size-4 text-gold-400" /> See PJ&rsquo;s on Facebook
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
