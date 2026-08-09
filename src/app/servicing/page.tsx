import Link from "next/link";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { CARE_PLANS } from "@/lib/carePlans";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Servicing & Care Plans",
  description:
    "Book a scooter or wheelchair service, or join a Mobility Care Plan from £12.99/month. Heathrow & Ferndown workshops.",
  path: "/servicing",
});

export default function ServicingPage() {
  const offersLd = CARE_PLANS.map((plan) => ({
    "@type": "Offer",
    name: `${plan.name} Care Plan`,
    description: plan.tagline,
    price: plan.priceMonthly.toFixed(2),
    priceCurrency: "GBP",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: plan.priceMonthly.toFixed(2),
      priceCurrency: "GBP",
      billingDuration: "P1M",
      unitText: "MONTH",
    },
    url: `${SITE.url}/servicing#care-plans`,
    seller: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Mobility Care Plans",
      serviceType: "Mobility equipment maintenance subscription",
      provider: {
        "@type": "LocalBusiness",
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
      },
      areaServed: "GB",
      description:
        "Monthly care plans for mobility scooters and wheelchairs from Mobility Station workshops in Heathrow and Ferndown.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Mobility Care Plans",
        itemListElement: offersLd,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Servicing",
          item: `${SITE.url}/servicing`,
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

      <section className="border-b border-border bg-soft/40">
        <div className="container-site py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Servicing" },
            ]}
          />
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
            Mobility Station
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Servicing &amp; Care Plans
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            Book a one-off service or repair, or join a monthly Care Plan for
            ongoing priority support from Heathrow and Ferndown.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#care-plans"
              className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
            >
              View Care Plans
            </a>
            <a
              href="#form"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md bg-white",
              )}
            >
              Book a one-off service
            </a>
          </div>
        </div>
      </section>

      <CarePlansSection />

      <section id="form" className="scroll-mt-24 py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Book a one-off service or repair
          </h2>
          <p className="mt-3 text-muted">
            Prefer not to subscribe? Tell us about your scooter, wheelchair or
            adaptation and we’ll arrange support.
          </p>
          <div className="mt-8 rounded-2xl bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="service"
              title="Service booking request"
              defaultInterest="Service / repair"
            />
          </div>
          <p className="mt-6 text-sm text-muted">
            Already on a Care Plan? Mention it in your notes so we can apply
            your benefits.{" "}
            <Link
              href="/book-a-service"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Short service form
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaFooter
        title="Not sure which plan fits?"
        subtitle={`Call ${SITE.phone} and we’ll talk through your equipment and how often you need workshop support.`}
        primary={{
          href: "/contact?interest=callback#callback",
          label: "Request a callback",
        }}
        secondary={{ href: "/book-a-demo", label: "Book a demo" }}
      />
    </>
  );
}
