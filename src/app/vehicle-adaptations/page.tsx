import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  MapPinned,
  Wrench,
} from "lucide-react";
import { AdaptationCard } from "@/components/product/adaptation-card";
import {
  ImageCollage,
  type CollageTile,
} from "@/components/sections/image-collage";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
  type AdaptationSectionId,
} from "@/lib/adaptations";
import {
  getAdaptationProducts,
  primaryImage,
  type ProductListItem,
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

/** Fallback adaptation close-ups if catalogue images are unavailable */
const FALLBACK_COLLAGE: CollageTile[] = [
  {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Hand controls fitted in a vehicle",
  },
  {
    src: "/images/hero-options/09-steering-knob.png",
    alt: "Steering knob adaptation",
  },
  {
    src: "/images/hero-options/07-swivel-seat.png",
    alt: "Swivel seat vehicle access",
  },
  {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Driving controls",
  },
  {
    src: "/images/hero-options/09-steering-knob.png",
    alt: "Steering aid",
  },
];

const SECTION_FALLBACK: Record<AdaptationSectionId, CollageTile> = {
  "driving-controls": {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Driving controls",
  },
  "hoists-stowage": {
    src: "/images/hero-options/09-steering-knob.png",
    alt: "Boot hoist and stowage",
  },
  "vehicle-access": {
    src: "/images/hero-options/07-swivel-seat.png",
    alt: "Vehicle access adaptations",
  },
};

const TRUST = [
  { icon: BadgeCheck, label: "Motability accredited" },
  { icon: Wrench, label: "Workshop fitting included" },
  { icon: MapPinned, label: "Mobile fitting where possible" },
  { icon: FileCheck2, label: "Free quotation" },
] as const;

const HOW_IT_WORKS = [
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
    body: "Book a home visit where needed. Adaptation home demos are £100 — fully refundable if you order.",
    href: "/book-a-demo#demo-terms",
  },
  {
    step: "4",
    title: "Fitted by our team",
    body: "Fitted at Heathrow or Ferndown — or mobile where the product allows.",
  },
] as const;

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

function isCatalogueImage(url: string) {
  return Boolean(url) && !url.includes("placeholder");
}

/** Pick up to 5 adaptation product photos, preferring category variety. */
function pickCollageTiles(products: ProductListItem[]): CollageTile[] {
  const seen = new Set<string>();
  const picks: CollageTile[] = [];

  const tryAdd = (p: ProductListItem) => {
    const src = primaryImage(p);
    if (!isCatalogueImage(src) || seen.has(src)) return false;
    seen.add(src);
    picks.push({ src, alt: p.name });
    return true;
  };

  for (const section of ADAPTATION_SECTIONS) {
    for (const cat of section.categories) {
      const match = products.find((p) => p.category === cat);
      if (match) tryAdd(match);
      if (picks.length >= 5) return picks;
    }
  }

  for (const p of products) {
    tryAdd(p);
    if (picks.length >= 5) break;
  }

  return picks.length >= 3 ? picks : FALLBACK_COLLAGE;
}

function sectionCoverImage(
  sectionId: AdaptationSectionId,
  sectionProducts: ProductListItem[],
): CollageTile {
  for (const p of sectionProducts) {
    const src = primaryImage(p);
    if (isCatalogueImage(src)) {
      return { src, alt: p.name };
    }
  }
  return SECTION_FALLBACK[sectionId];
}

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
  const collageTiles = pickCollageTiles(products);

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f4faf7] via-white to-[#eef5f3]">
        <div
          className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
          aria-hidden
        />
        <div className="container-site relative grid items-center gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:py-20">
          <div className="animate-[fadeRise_700ms_ease-out]">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">
              Vehicle adaptations
            </p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl lg:text-[3.15rem] lg:leading-[1.08]">
              Fitted around{" "}
              <span className="text-accent">your vehicle</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Hand controls, boot hoists, swivel seats and more — assessed for
              your car, quoted free, then fitted at our workshops or mobile where
              possible. Prices shown are indicative supplied &amp; fitted figures.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact?interest=adaptation"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "rounded-xl",
                )}
              >
                Request a quotation
              </Link>
              <Link
                href="/book-a-demo?type=adaptation"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl bg-white/70",
                )}
              >
                Book a home demo
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-xs font-semibold text-primary/85"
                >
                  <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-[fadeRise_900ms_ease-out]">
            <ImageCollage tiles={collageTiles} contain priority />
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="border-y border-border py-14 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Browse by type
            </h2>
            <p className="mt-3 text-muted">
              Three clear paths — pick the area that matches what you need.
            </p>
          </div>

          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {ADAPTATION_SECTIONS.map((section) => {
              const sectionProducts = section.categories.flatMap(
                (cat) => byCategory.get(cat) ?? [],
              );
              const count = sectionProducts.length;
              const cover = sectionCoverImage(section.id, sectionProducts);
              return (
                <li key={section.id}>
                  <Link
                    href={sectionHref(section.id)}
                    className="group block border-t-2 border-border pt-6 transition-colors hover:border-accent"
                  >
                    <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-white">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {section.description}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                      {count} product{count === 1 ? "" : "s"} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft py-14 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted">
              No online checkout for adaptations — every fit is checked against
              your vehicle first.
            </p>
          </div>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="relative">
                <p className="text-sm font-bold uppercase tracking-wider text-accent">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-lg font-bold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
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

      {/* Catalogue */}
      <div className="container-site py-12 md:py-16">
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <>
            {freeOnMotability.length > 0 ? (
              <section className="mb-14">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-primary">
                    Free on Motability
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    £0 advance payment on the scheme — subject to eligibility and
                    assessment.
                  </p>
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
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-16 scroll-mt-28"
                >
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <h2 className="text-2xl font-extrabold text-primary">
                      {section.title}
                    </h2>
                    <Link
                      href={sectionHref(section.id)}
                      className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      View all →
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

      {/* Why fit with us */}
      <section className="border-y border-border bg-soft py-12 md:py-14">
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
        subtitle="Tell us about your vehicle and needs — or call us to book a home demonstration. Adaptation home visits are £100, refundable if you place an order."
      />
    </>
  );
}
