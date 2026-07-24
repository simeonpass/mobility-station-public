import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import {
  getLocationBySlug,
  LOCATION_PAGES,
} from "@/data/location-pages";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCATION_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) {
    return createMetadata({
      title: "Service area",
      description: "Mobility Station service areas.",
      path: `/service-area/${slug}`,
    });
  }
  return createMetadata({
    title: loc.metaTitle.replace(" | Mobility Station", ""),
    description: loc.metaDescription,
    path: `/service-area/${loc.slug}`,
    absoluteTitle: true,
  });
}

export default async function ServiceAreaTownPage({ params }: Props) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) notFound();

  const nearby = loc.nearbyAreas
    .map((name) =>
      LOCATION_PAGES.find(
        (p) => p.town.toLowerCase() === name.toLowerCase(),
      ),
    )
    .filter(Boolean) as typeof LOCATION_PAGES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Mobility Station — ${loc.town}`,
    telephone: loc.branchPhone,
    email: loc.branchEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.branchAddress,
      addressLocality: loc.branch,
      addressCountry: "GB",
    },
    areaServed: loc.town,
    url: `${SITE.url}/service-area/${loc.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero compact title={loc.heroHeading} subtitle={loc.heroSubheading} />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-primary">
              What we offer in {loc.town}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {loc.services.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-soft p-5">
            <h2 className="text-lg font-bold text-primary">
              Your nearest branch — {loc.branch}
            </h2>
            <p className="mt-2 text-sm text-muted">{loc.branchAddress}</p>
            <p className="mt-1 text-sm">
              <a
                href={`tel:${loc.branchPhone.replace(/\s/g, "")}`}
                className="font-semibold text-primary"
              >
                {loc.branchPhone}
              </a>
            </p>
            <p className="text-sm">
              <a
                href={`mailto:${loc.branchEmail}`}
                className="text-primary underline"
              >
                {loc.branchEmail}
              </a>
            </p>
            <p className="mt-3 text-xs text-muted">
              Postcode areas: {loc.postcodes.join(", ")}
            </p>
          </div>

          {nearby.length ? (
            <div>
              <h2 className="text-lg font-bold text-primary">Nearby areas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {nearby.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/service-area/${n.slug}`}
                    className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-primary"
                  >
                    {n.town}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/book-a-demo"
              className="rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground"
            >
              Book a demo
            </Link>
            <Link
              href="/shop"
              className="rounded-xl border border-border px-5 py-3 font-semibold text-primary"
            >
              Browse shop
            </Link>
            <Link
              href="/service-area"
              className="rounded-xl border border-border px-5 py-3 font-semibold text-primary"
            >
              All service areas
            </Link>
          </div>
        </div>
      </section>
      <CtaFooter title={`Book a free demonstration in ${loc.town}`} />
    </>
  );
}
