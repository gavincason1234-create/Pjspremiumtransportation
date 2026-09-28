import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <Container className="text-center">
        <SectionHeading
          align="center"
          eyebrow="404"
          title="That page took a wrong turn."
          intro="The link may be out of date. Head back home or reserve a ride from here."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/book" variant="outline-gold">
            Reserve a ride
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
