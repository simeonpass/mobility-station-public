import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { ProductSpotlight } from "@/components/sections/product-spotlight";
import { buttonVariants } from "@/components/ui/button";
import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";
import {
  getAdaptationProducts,
  getPopularAdaptations,
} from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Vehicle Adaptations | Supplied & Fitted",
  description:
    "Hand controls, boot hoists, swivel seats and more. Indicative prices and Motability options. Free quotes — we fit at our workshops or mobile where possible.",
  path: "/vehicle-adaptations",
});

const HOW_IT_WORKS: {
  step: string;
  title: string;
  body: string;
  href?: string;
}[] = [
  {
    step: "1",
    title: "Tell us what you need",
    body: "Share your vehicle, condition and goals — driving, access or stowage.",
  },
  {
    step: "2",
    title: "Free quotation",
    body: "We check compatibility and confirm an indicative supplied & fitted price.",
  },
  {
    step: "3",
    title: "Demo or assessment",
    body: "Book a home visit where needed. Adaptation home demos are £100 — refunded if you order with us or via a dealership.",
    href: "/book-a-demo#demo-terms",
  },
  {
    step: "4",
    title: "Fitted by our team",
    body: "Fitted at Heathrow or Ferndown — or mobile where the product allows.",
  },
];

const WHY_US = [
  {
    icon: Wrench,
    title: "Workshop fitting",
    body: "Most adaptations are fitted at Heathrow or Ferndown, with collection available.",
  },
  {
    icon: BadgeCheck,
    title: "Motability options",
    body: "Many adaptations are available on the scheme, including £0 advance payment where eligible.",
  },
  {
    icon: ClipboardList,
    title: "Free quotation",
    body: "We confirm compatibility, Motability options and a firm fitted price before work starts.",
  },
] as const;

export default async function VehicleAdaptationsPage() {
  let products: Awaited<ReturnType<typeof getAdaptationProducts>> = [];
  let popular: Awaited<ReturnType<typeof getPopularAdaptations>> = [];
  let errorMessage: string | null = null;

  try {
    [products, popular] = await Promise.all([
      getAdaptationProducts(),
      getPopularAdaptations(8),
    ]);
  } catch (error) {
    console.error("Adaptations catalogue error:", error);
    errorMessage =
      "We could not load adaptations right now. Please request a callback or try again shortly.";
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

      <CatalogIntro
        title="Vehicle adaptations"
        subtitle="Hand controls, boot hoists, swivel seats and more — assessed for your car, quoted free, then fitted at our workshops or mobile where possible."
        primary={{
          href: "/contact?interest=adaptation",
          label: "Request a quotation",
        }}
        secondary={{
          href: "/book-a-demo?type=adaptation",
          label: "Book a home demo",
        }}
        primaryAction={
          <EnquiryDialog
            mode="enquiry"
            enquiryType="contact"
            title="Request a quotation"
            defaultInterest="Vehicle adaptation quotation"
            triggerClassName={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full",
            )}
          >
            Request a quotation
          </EnquiryDialog>
        }
      />

      <div className="border-b border-border bg-soft/50">
        <div className="container-site flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Prefer a printable list of the full adaptations range?
          </p>
          <Link
            href="/brochure/vehicle-adaptations"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Download vehicle adaptations brochure →
          </Link>
        </div>
      </div>

      {!errorMessage && popular.length > 0 ? (
        <ProductSpotlight
          title="Popular adaptations we fit"
          subtitle="Featured driving controls, hoists and access solutions from our live catalogue."
          viewAllHref="#catalogue"
          viewAllLabel="Browse full catalogue"
        >
          {popular.map((p) => (
            <AdaptationCard key={p.id} product={p} />
          ))}
        </ProductSpotlight>
      ) : null}

      <div id="catalogue" className="container-site scroll-mt-28 py-8 md:py-12">
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <>
            <div
              className="inline-flex flex-wrap rounded-full border border-border bg-white p-1 shadow-[0_1px_0_rgba(0,63,67,0.04)]"
              role="navigation"
              aria-label="Adaptation type"
            >
              <a
                href="#catalogue"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                All
              </a>
              {ADAPTATION_SECTIONS.map((section) => {
                const count = section.categories.reduce(
                  (sum, cat) => sum + (byCategory.get(cat)?.length ?? 0),
                  0,
                );
                if (!count) return null;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft"
                  >
                    {section.title}
                  </a>
                );
              })}
              {freeOnMotability.length ? (
                <a
                  href="#free-motability"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft"
                >
                  Free on Motability
                </a>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-y border-border bg-soft/40 py-4">
              <div>
                <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                  Adaptation catalogue
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {products.length} products · indicative supplied &amp; fitted
                  prices · quotation before fitting
                </p>
              </div>
              <p className="max-w-sm text-sm text-muted">
                No online checkout — every fit is checked against your vehicle
                first.
              </p>
            </div>

            {freeOnMotability.length > 0 ? (
              <section id="free-motability" className="mt-10 scroll-mt-28">
                <div className="mb-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <MotabilityLogo height={22} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      £0 advance payment
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-primary md:text-2xl">
                    Free on Motability
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Subject to eligibility and assessment.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                  {freeOnMotability.slice(0, 12).map((p) => (
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
              const preview = sectionProducts.slice(0, 12);
              const hasMore = sectionProducts.length > preview.length;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="mt-14 scroll-mt-28"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-extrabold text-primary md:text-2xl">
                      {section.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-muted">
                      {section.description}
                    </p>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                    {section.categories.map((cat) => {
                      const count = byCategory.get(cat)?.length ?? 0;
                      if (!count) return null;
                      return (
                        <Link
                          key={cat}
                          href={adaptationHref(cat)}
                          className="hover:text-primary hover:underline"
                        >
                          {cat} ({count})
                        </Link>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {preview.map((p) => (
                      <AdaptationCard key={p.id} product={p} />
                    ))}
                  </div>

                  {hasMore ? (
                    <div className="mt-6 text-center">
                      <Link
                        href={sectionHref(section.id)}
                        className={cn(
                          "inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary",
                          "hover:bg-primary hover:text-primary-foreground",
                        )}
                      >
                        View all {sectionProducts.length} in {section.title}
                      </Link>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </>
        )}
      </div>

      <section className="border-y border-border bg-soft py-10 md:py-12">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Every adaptation is quoted against your vehicle before we fit.
            </p>
          </div>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step}>
                <p className="text-sm font-bold uppercase tracking-wider text-accent">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-base font-bold text-primary">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.body}
                  {item.href ? (
                    <>
                      {" "}
                      <Link
                        href={item.href}
                        className="font-semibold text-primary underline underline-offset-2"
                      >
                        Full demo terms
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Why fit with us
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {WHY_US.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-primary">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaFooter
        title="Get a free adaptation quotation"
        subtitle="Tell us your vehicle and what you need — we’ll confirm compatibility, Motability options and a firm fitted price."
      />
    </>
  );
}
