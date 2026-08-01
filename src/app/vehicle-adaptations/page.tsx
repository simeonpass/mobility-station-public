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
import { MotabilityLogo } from "@/components/product/motability-logo";
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

/** Dedicated landscape adaptation photos for the hero collage.
 *  Drop replacements in public/images/adaptations/collage/ (keep filenames). */
const ADAPTATIONS_HERO_COLLAGE: CollageTile[] = [
  {
    src: "/images/adaptations/collage/01-hand-controls.png",
    alt: "Hand controls and steering knob fitted in a VW",
    object: "object-center",
  },
  {
    src: "/images/adaptations/collage/02-steering-knob.png",
    alt: "Push-pull hand control fitted in an Audi",
    object: "object-[45%_50%]",
  },
  {
    src: "/images/adaptations/collage/03-swivel-seat.png",
    alt: "Swivel seat for easier vehicle access",
    object: "object-[55%_45%]",
  },
  {
    src: "/images/adaptations/collage/04-driver-controls.png",
    alt: "Driver using hand controls in a Volvo",
    object: "object-[40%_40%]",
  },
  {
    src: "/images/adaptations/collage/05-boot-hoist.png",
    alt: "Boot hoist lifting a mobility scooter",
    object: "object-[45%_50%]",
  },
];

const SECTION_FALLBACK: Record<AdaptationSectionId, CollageTile> = {
  "driving-controls": {
    src: "/images/adaptations/collage/01-hand-controls.png",
    alt: "Driving controls",
    object: "object-center",
  },
  "hoists-stowage": {
    src: "/images/adaptations/collage/05-boot-hoist.png",
    alt: "Boot hoist and stowage",
    object: "object-[45%_50%]",
  },
  "vehicle-access": {
    src: "/images/adaptations/collage/03-swivel-seat.png",
    alt: "Vehicle access adaptations",
    object: "object-[55%_45%]",
  },
};

const TRUST = [
  { icon: BadgeCheck, label: "Motability accredited" },
  { icon: Wrench, label: "Workshop fitting included" },
  { icon: MapPinned, label: "Mobile fitting where possible" },
  { icon: FileCheck2, label: "Free quotation" },
] as const;

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
    body: "Book a home visit where needed. Adaptation home demos are £100 — fully refundable if you order.",
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
  let errorMessage: string | null = null;

  try {
    products = await getAdaptationProducts();
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-soft via-white to-primary-soft">
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
                href="/quote?interest=adaptation"
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
            <ImageCollage tiles={ADAPTATIONS_HERO_COLLAGE} priority />
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
              const cover = SECTION_FALLBACK[section.id];
              return (
                <li key={section.id}>
                  <Link
                    href={sectionHref(section.id)}
                    className="group block border-t-2 border-border pt-6 transition-colors hover:border-accent"
                  >
                    <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-soft">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className={cn(
                          "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                          cover.object,
                        )}
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
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                  Adaptation catalogue
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {products.length} products · indicative supplied &amp; fitted
                  prices
                </p>
              </div>
              <nav
                className="flex flex-wrap gap-2"
                aria-label="Jump to adaptation type"
              >
                {freeOnMotability.length ? (
                  <a
                    href="#free-motability"
                    className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                  >
                    Free on Motability ({freeOnMotability.length})
                  </a>
                ) : null}
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
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                    >
                      {section.title} ({count})
                    </a>
                  );
                })}
              </nav>
            </div>

            {freeOnMotability.length > 0 ? (
              <section id="free-motability" className="mb-14 scroll-mt-28">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <MotabilityLogo height={22} />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                        £0 advance payment
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-primary">
                      Free on Motability
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Subject to eligibility and assessment.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                  className="mb-16 scroll-mt-28"
                >
                  <div className="mb-3">
                    <h3 className="text-2xl font-extrabold text-primary">
                      {section.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-muted">
                      {section.description}
                    </p>
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
                    {preview.map((p) => (
                      <AdaptationCard key={p.id} product={p} />
                    ))}
                  </div>

                  {hasMore ? (
                    <div className="mt-6 text-center">
                      <Link
                        href={sectionHref(section.id)}
                        className="inline-flex rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
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
        subtitle="Tell us your vehicle and what you need — we’ll confirm compatibility, Motability options and a firm fitted price."
        primaryHref="/quote?interest=adaptation"
        primaryLabel="Request a quotation"
      />
    </>
  );
}
