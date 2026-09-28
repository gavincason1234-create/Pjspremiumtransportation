import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <Container className="text-center">
        <SectionHeading
          align="center"
          eyebrow="404"
          title="That page did not make the trip."
          intro="The link may be old or mistyped. Head back home, or get a quote from here."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/book" variant="outline-gold">
            Get a quote
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
