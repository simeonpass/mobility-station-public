import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Motability Scooters & Wheelchairs",
  description:
    "Motability-accredited advice for scooters and wheelchairs. Free home demonstrations from Heathrow & Ferndown branches.",
  path: "/motability",
});

export default function MotabilityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are you Motability accredited?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Mobility Station is Motability accredited and can guide you through scooter and wheelchair options.",
        },
      },
      {
        "@type": "Question",
        name: "Can I try Motability products at home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We offer free home demonstrations so you can try suitable scooters and wheelchairs where you live.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Motability with Mobility Station"
        subtitle="Accredited advice for scooters and wheelchairs — with free home demonstrations from Heathrow and Ferndown."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/85">
          <p>
            If you receive a qualifying mobility allowance, Motability can help
            you exchange that allowance for a scooter or wheelchair package. As
            an accredited supplier, we explain the process in plain English and
            help you choose equipment that fits your lifestyle.
          </p>
          <p>
            Bring your award details to your demonstration and we will talk
            through suitability, assessment steps and ongoing support. There is
            no obligation to proceed on the day.
          </p>
        </div>
      </section>
      <CtaFooter title="Book a Motability demonstration" />
    </>
  );
}
