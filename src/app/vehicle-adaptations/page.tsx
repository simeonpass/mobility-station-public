import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { ADAPTATION_SERVICES } from "@/data/content";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Vehicle Adaptations | We Come to You",
  description:
    "Hand controls, swivel seats, hoists, ramps and WAVs. Free adaptation assessments from Heathrow & Ferndown. We come to you.",
  path: "/vehicle-adaptations",
});

export default function VehicleAdaptationsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Vehicle Adaptations",
      provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phone },
      areaServed: "GB",
      description:
        "Vehicle adaptations including hand controls, swivel seats, hoists and WAVs with home assessments.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you come to my home for vehicle adaptations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Wherever practical we assess and demonstrate adaptations at your home using your own vehicle.",
          },
        },
        {
          "@type": "Question",
          name: "Which branches cover vehicle adaptations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our Heathrow and Ferndown branches support adaptation assessments, with mobile visits across our service areas.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        title="Vehicle adaptations, assessed around your life"
        subtitle="We come to you with hand controls, swivel seats, scooter hoists, boot openers, ramps and WAV advice — so you can try solutions in your own vehicle."
      />
      <section className="py-16 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold">How our service works</h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Driving and access adaptations should be chosen around your vehicle,
              your strength and your daily journeys. That is why we lead with free
              home demonstrations rather than asking you to browse somewhere
              unfamiliar. Every solution can be referenced with an Adaptation ID
              for clear ongoing support.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADAPTATION_SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/vehicle-adaptations/${service.slug}`}
                  className="group block h-full border-b border-border pb-5 hover:border-accent"
                >
                  <h3 className="text-xl font-bold group-hover:text-primary-dark">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.shortDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaFooter
        title="Book an adaptation demonstration"
        subtitle="Tell us about your vehicle and we will arrange a visit from Heathrow or Ferndown."
      />
    </>
  );
}
