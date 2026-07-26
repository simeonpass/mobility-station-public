import Link from "next/link";
import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { ServiceAreaChecker } from "@/components/service-area/service-area-checker";
import { getBranches } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Locations | Heathrow & Ferndown",
  description:
    "Visit Mobility Station in Heathrow or Ferndown, or book a home demonstration. Opening hours, addresses, phone numbers and postcode coverage.",
  path: "/locations",
});

export default async function LocationsPage() {
  const branches = await getBranches();

  const jsonLd = [
    ...branches.map((branch) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `Mobility Station ${branch.name}`,
      telephone: branch.phone,
      email: branch.email,
      url: `${SITE.url}/locations`,
      address: {
        "@type": "PostalAddress",
        streetAddress: [branch.addressLine1, branch.addressLine2]
          .filter(Boolean)
          .join(", "),
        addressLocality: branch.addressLocality,
        postalCode: branch.postalCode,
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: branch.lat,
        longitude: branch.lng,
      },
    })),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Locations",
          item: `${SITE.url}/locations`,
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
        compact
        title="Heathrow & Ferndown branches"
        subtitle="Two workshops with parking and step-free access — or we come to you for a home demonstration."
      />
      <section className="pb-8">
        <div className="container-site grid gap-8 md:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.id} className="border-t border-border pt-6">
              <h2 className="text-2xl font-extrabold">{branch.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                {branch.addressLine1}
                {branch.addressLine2 ? <>, {branch.addressLine2}</> : null}
                <br />
                {branch.addressLocality}, {branch.postalCode}
              </p>
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="mt-3 inline-block font-semibold text-primary hover:text-primary-dark"
              >
                {branch.phone}
              </a>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {branch.openingHours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <BranchMap branches={branches} />

      <section className="border-t border-border bg-soft py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Do we cover you?
          </h2>
          <p className="mt-3 text-muted">
            Check your postcode for home demonstrations, local delivery and
            collection. Large equipment ships nationwide on a pallet.
          </p>
          <div className="mt-8">
            <ServiceAreaChecker />
          </div>
          <p className="mt-6 text-sm text-muted">
            See{" "}
            <Link
              href="/service-area"
              className="font-semibold text-primary underline underline-offset-2"
            >
              call-out bands and the towns we cover
            </Link>
            , or read our{" "}
            <Link
              href="/delivery"
              className="font-semibold text-primary underline underline-offset-2"
            >
              delivery information
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaFooter />
    </>
  );
}
