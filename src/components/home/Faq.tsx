import { ChevronDown } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FAQ } from "@/content/faq";

export function Faq({ items = FAQ, limit }: { items?: typeof FAQ; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <Section id="faq" className="border-b border-white/5">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" intro="If yours is not here, text or call and you will get a straight answer." />
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-white/10 rounded-2xl border border-ink-700 bg-ink-850">
            {list.map((item, i) => (
              <details key={item.q} className="group px-5 sm:px-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-cream-50 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="size-5 shrink-0 text-gold-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-ink-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: list.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
          }),
        }}
      />
    </Section>
  );
}
