import Link from "next/link";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";
import { getAdaptationProducts } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Vehicle Adaptations | Supplied & Fitted",
  description:
    "Hand controls, boot hoists, swivel seats and more. Indicative prices and Motability options. Free quotes — we fit at our workshops or mobile where possible.",
  path: "/vehicle-adaptations",
});

export default async function VehicleAdaptationsPage() {
  let products: Awaited<ReturnType<typeof getAdaptationProducts>> = [];
  let errorMessage: string | null = null;

  try {
    products = await getAdaptationProducts();
  } catch (error) {
    console.error("Adaptations catalogue error:", error);
    errorMessage =
      "We could not load adaptations right now. Please call 0800 772 3870.";
  }

  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const cat = p.category || "Other";
    const list = byCategory.get(cat) ?? [];
    list.push(p);
    byCategory.set(cat, list);
  }

  const freeOnMotability = products.filter((p) => p.motability_price === 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vehicle Adaptations",
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      telephone: SITE.phone,
    },
    areaServed: "GB",
    description:
      "Vehicle adaptations supplied and fitted, with free quotations and Motability options.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <section className="border-b border-border bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground">
        <div className="container-site py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Vehicle adaptations
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Expertly fitted around your vehicle
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Prices shown are indicative supplied &amp; fitted figures. Because
            every car and driver is different, we don&apos;t offer online
            checkout for adaptations — we prepare a free quotation after checking
            compatibility, then fit at our workshops (or mobile where possible).
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-a-demo?type=adaptation"
              className="rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Book a free demo
            </Link>
            <Link
              href="/contact?interest=adaptation"
              className="rounded-xl border border-primary-foreground/40 px-6 py-3 text-center font-semibold text-primary-foreground hover:bg-white/10"
            >
              Request a quotation
            </Link>
          </div>
          <ul className="mt-10 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Free advice & home demonstrations",
              "Workshop fitting included",
              "Mobile fitting where possible",
              "Motability scheme options",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl bg-white/10 px-4 py-3 font-medium"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-soft py-8">
        <div className="container-site">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Browse by type
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {ADAPTATION_SECTIONS.map((section) => {
              const count = section.categories.reduce(
                (n, cat) => n + (byCategory.get(cat)?.length ?? 0),
                0,
              );
              return (
                <Link
                  key={section.id}
                  href={sectionHref(section.id)}
                  className="rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-primary">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {section.description}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    {count} product{count === 1 ? "" : "s"} →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container-site py-12 md:py-16">
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <>
            {freeOnMotability.length > 0 ? (
              <section className="mb-14">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold text-primary">
                      Free on Motability
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      Adaptations available with £0 advance payment on the scheme
                      (subject to eligibility and assessment).
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {freeOnMotability.slice(0, 8).map((p) => (
                    <AdaptationCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ) : null}

            {ADAPTATION_SECTIONS.map((section) => {
              const sectionProducts = section.categories.flatMap(
                (cat) => byCategory.get(cat) ?? [],
              );
              if (!sectionProducts.length) return null;

              return (
                <section key={section.id} className="mb-16">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-extrabold text-primary">
                        {section.title}
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm text-muted">
                        {section.description}
                      </p>
                    </div>
                    <Link
                      href={sectionHref(section.id)}
                      className="text-sm font-semibold text-primary underline"
                    >
                      View all {section.title.toLowerCase()}
                    </Link>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {section.categories.map((cat) => {
                      const count = byCategory.get(cat)?.length ?? 0;
                      if (!count) return null;
                      return (
                        <Link
                          key={cat}
                          href={adaptationHref(cat)}
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                        >
                          {cat} ({count})
                        </Link>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {sectionProducts.slice(0, 8).map((p) => (
                      <AdaptationCard key={p.id} product={p} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>

      <section className="border-y border-border bg-soft py-12">
        <div className="container-site grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Workshop fitting",
              body: "Most adaptations are fitted at our Heathrow or Ferndown workshops, with vehicle collection available.",
            },
            {
              title: "Mobile fitting",
              body: "Where the product and your location allow, we can discuss mobile fitting — ask us when you enquire.",
            },
            {
              title: "Free quotation",
              body: "We’ll confirm compatibility with your vehicle, Motability options, and a firm fitted price before any work starts.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-bold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CtaFooter
        title="Get a free adaptation quotation"
        subtitle="Tell us about your vehicle and needs — we’ll confirm the right solution and fitting plan."
      />
    </>
  );
}
