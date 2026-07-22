import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript } from "@/lib/seo";

const faqs = [
  {
    q: "Do you offer free home demonstrations?",
    a: "Yes. Branch demonstrations are free, and we also offer mobile home demonstrations across our Heathrow and Ferndown service areas.",
  },
  {
    q: "What does a mobile demonstration cost?",
    a: "Mobile demos are £99. That fee is refunded for vehicle adaptations, deducted from private scooter/wheelchair purchases, and free for Motability scooter/wheelchair packages.",
  },
  {
    q: "Where are your branches?",
    a: "We have branches serving Heathrow and Ferndown. Postal addresses use West Drayton and Wimborne localities respectively.",
  },
  {
    q: "Do you supply Motability scooters and wheelchairs?",
    a: "Yes. We are Motability accredited and can guide you through suitable scooter and wheelchair options.",
  },
  {
    q: "What is an Adaptation ID?",
    a: "An Adaptation ID is how we reference a vehicle adaptation setup so servicing and support stay clear and consistent.",
  },
];

export const metadata = createMetadata({
  title: "FAQ | Mobility Station",
  description:
    "Answers about free home demonstrations, Motability, branches, Adaptation IDs and booking with Mobility Station.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Frequently asked questions"
        subtitle="Quick answers about demonstrations, Motability, branches and bookings."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-t border-border pt-5">
              <h2 className="text-xl font-bold">{faq.q}</h2>
              <p className="mt-2 leading-relaxed text-foreground/85">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaFooter />
    </>
  );
}
