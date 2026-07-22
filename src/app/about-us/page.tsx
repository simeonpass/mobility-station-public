import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Mobility Station",
  description:
    "Mobility Station helps people stay independent with free home demonstrations, Motability support and vehicle adaptations from Heathrow & Ferndown.",
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        title="About Mobility Station"
        subtitle="We help people stay independent with honest advice, free home demonstrations and Motability-accredited support."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/85">
          <p>
            Mobility Station is built around a simple idea: the best mobility
            decisions happen where you live, not in an unfamiliar setting. That
            is why we come to you with scooters, wheelchairs and vehicle
            adaptations.
          </p>
          <p>
            From our Heathrow and Ferndown branches we support private customers
            and Motability clients with assessments, fitting, servicing and
            ongoing advice. Our team focuses on clear explanations, practical
            demonstrations and solutions that fit real daily life.
          </p>
          <p>
            Whether you need hand controls, a folding travel chair or a
            full-size mobility scooter, we will help you compare options without
            pressure.
          </p>
        </div>
      </section>
      <CtaFooter />
    </>
  );
}
