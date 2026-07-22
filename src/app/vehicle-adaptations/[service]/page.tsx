import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { getAdaptationService, getAdaptationServices } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

type Props = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  return getAdaptationServices().map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { service: slug } = await params;
  const service = getAdaptationService(slug);
  if (!service) {
    return createMetadata({
      title: "Service not found",
      description: "This adaptation service could not be found.",
      path: `/vehicle-adaptations/${slug}`,
    });
  }
  return createMetadata({
    title: truncate(service.title, 45),
    description: truncate(service.shortDescription, 160),
    path: `/vehicle-adaptations/${service.slug}`,
  });
}

export default async function AdaptationServicePage({ params }: Props) {
  const { service: slug } = await params;
  const service = getAdaptationService(slug);
  if (!service) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: { "@type": "LocalBusiness", name: SITE.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <div className="container-site py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Vehicle Adaptations", href: "/vehicle-adaptations" },
            { label: service.title },
          ]}
        />
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
          {service.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/85">
          {service.description}
        </p>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3 text-sm font-medium text-primary">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              {benefit}
            </li>
          ))}
        </ul>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-extrabold">Frequently asked questions</h2>
          <div className="mt-6 space-y-6">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-4">
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 text-foreground/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CtaFooter title={`Book a demo for ${service.title.toLowerCase()}`} />
    </>
  );
}
