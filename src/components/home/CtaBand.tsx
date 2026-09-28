import { MessageSquareText, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { BUSINESS } from "@/lib/site";

export function CtaBand({ title = "Ready when you are.", body = "Tell us where you are going and when. We will confirm the time and the rate before you ride." }: { title?: string; body?: string }) {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <Container className="relative">
        <div className="rounded-3xl border border-gold-500/30 bg-ink-850 p-8 text-center shadow-glow sm:p-12">
          <h2 className="font-display text-3xl tracking-tight text-cream-50 sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-300 sm:text-lg">{body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/book" size="lg">
              Get a quote
            </ButtonLink>
            <ButtonLink href={BUSINESS.smsQuoteHref} variant="outline-gold" size="lg">
              <MessageSquareText className="size-4" aria-hidden="true" /> Text Patsy
            </ButtonLink>
            <ButtonLink href={BUSINESS.phoneHref} variant="ghost" size="lg">
              <Phone className="size-4 text-gold-400" aria-hidden="true" /> {BUSINESS.phone}
            </ButtonLink>
          </div>
          <p className="mt-5 text-xs text-ink-500">Reservations only · No payment online · Woman-owned in Myra, Texas</p>
        </div>
      </Container>
    </Section>
  );
}
