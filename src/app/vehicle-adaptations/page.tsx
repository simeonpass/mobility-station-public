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
import { CatalogSearchStrip } from "@/components/sections/catalog-search-strip";
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
    body: "Book a home visit where needed. Home demonstrations are £195 — deducted in full from your price if you go ahead.",
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

function AdaptationsHeroVisual() {
  return (
    <div className="grid h-[390px] grid-cols-5 grid-rows-2 gap-3 sm:h-[470px] sm:gap-4 lg:h-[500px]">
      <div className="relative col-span-3 row-span-2 overflow-hidden rounded-[2rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
        <img
          src="/images/hero-options/06-customer-handover.png"
          alt="Mobility Station specialist supporting a customer with an adapted vehicle"
          className="h-full w-full object-cover object-[50%_35%]"
          width={900}
          height={1100}
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/82 px-4 py-3 text-white backdrop-blur-sm sm:inset-x-5 sm:bottom-5 sm:px-5 sm:py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent sm:text-xs">
            Supplied &amp; fitted
          </p>
          <p className="mt-1 text-sm font-semibold sm:text-base">
            Assessed for you and your vehicle
          </p>
        </div>
      </div>
      <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
        <img
          src="/images/hero-options/05-hand-controls.png"
          alt="Hand controls and steering aid fitted to a vehicle"
          className="h-full w-full object-cover object-center"
          width={700}
          height={500}
          decoding="async"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur sm:bottom-4 sm:left-4 sm:text-xs">
          Driving controls
        </span>
      </div>
      <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
        <img
          src="/images/hero-options/07-swivel-seat.png"
          alt="Swivel seat vehicle adaptation"
          className="h-full w-full object-cover object-center"
          width={700}
          height={500}
          decoding="async"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm backdrop-blur sm:bottom-4 sm:left-4 sm:text-xs">
          Access &amp; seating
        </span>
      </div>
    </div>
  );
}

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
        eyebrow="Mobility Station · Vehicle adaptations"
        title="Adapted around you."
        subtitle="Hand controls, boot hoists, swivel seats and more — assessed for your car, quoted clearly and fitted by our specialist team."
        primary={{
          href: "/contact?interest=adaptation",
          label: "Request a quotation",
        }}
        secondary={{
          href: "/book-a-demo?type=adaptation",
          label: "Book a demonstration",
        }}
        primaryAction={
          <EnquiryDialog
            mode="enquiry"
            enquiryType="contact"
            title="Request a quotation"
            defaultInterest="Vehicle adaptation quotation"
            triggerClassName={cn(
              buttonVariants({ size: "lg" }),
              "h-12 min-h-12 rounded-full px-7 text-base",
            )}
          >
            Request a quotation
          </EnquiryDialog>
        }
        visual={<AdaptationsHeroVisual />}
      />

      <section className="border-b border-border bg-soft/45">
        <div className="container-site grid gap-4 py-5 text-sm sm:grid-cols-3 sm:gap-6">
          <p><strong className="text-primary">Free quotation</strong><br /><span className="text-muted">Compatibility checked before fitting</span></p>
          <p><strong className="text-primary">Heathrow &amp; Ferndown</strong><br /><span className="text-muted">Specialist workshop installation</span></p>
          <p><strong className="text-primary">Motability approved</strong><br /><span className="text-muted">Scheme options across many adaptations</span></p>
        </div>
      </section>

      <CatalogSearchStrip
        type="adaptations"
        title="Find the right adaptation"
        subtitle="Search by product, brand or category — or browse driving, access and stowage solutions below."
      />

      {!errorMessage && popular.length > 0 ? (
        <ProductSpotlight
          title="Popular adaptations"
          subtitle="Frequently chosen driving controls, hoists and access solutions — all checked for vehicle compatibility before fitting."
          viewAllHref="#catalogue"
          viewAllLabel="Browse full catalogue"
        >
          {popular.map((p) => (
            <AdaptationCard key={p.id} product={p} />
          ))}
        </ProductSpotlight>
      ) : null}

      <div id="catalogue" className="container-site scroll-under-header py-10 md:py-16">
        {errorMessage ? (
          <p className="rounded-2xl border border-border bg-soft px-5 py-4 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <>
            <div className="border-b border-border pb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Browse by adaptation type</p>
              <div className="mt-4 flex flex-wrap gap-2" role="navigation" aria-label="Adaptation type">
                <a href="#catalogue" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">All</a>
                {ADAPTATION_SECTIONS.map((section) => {
                  const count = section.categories.reduce((sum, cat) => sum + (byCategory.get(cat)?.length ?? 0), 0);
                  if (!count) return null;
                  return <a key={section.id} href={`#${section.id}`} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary">{section.title}</a>;
                })}
                {freeOnMotability.length ? <a href="#free-motability" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary">£0 on Motability</a> : null}
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Supplied &amp; fitted</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Adaptation catalogue</h2>
                <p className="mt-2 text-sm text-muted">{products.length} products · indicative fitted prices · quotation before fitting</p>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">Every installation is checked against your vehicle first, so there is no unsuitable one-click purchase.</p>
            </div>

            {freeOnMotability.length > 0 ? (
              <section id="free-motability" className="mt-14 scroll-under-header rounded-[2rem] bg-soft/60 p-5 sm:p-7 md:p-9">
                <div className="mb-7">
                  <div className="mb-3 flex flex-wrap items-center gap-3"><MotabilityLogo height={22} /><span className="text-xs font-semibold uppercase tracking-wide text-muted">£0 advance payment</span></div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">£0 adaptations on Motability</h3>
                  <p className="mt-2 text-sm text-muted">Available on qualifying scheme applications, subject to assessment and vehicle compatibility.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                  {freeOnMotability.slice(0, 12).map((p) => <AdaptationCard key={p.id} product={p} />)}
                </div>
              </section>
            ) : null}

            {ADAPTATION_SECTIONS.map((section) => {
              const sectionProducts = section.categories.flatMap((cat) => byCategory.get(cat) ?? []);
              if (!sectionProducts.length) return null;
              const preview = sectionProducts.slice(0, 12);
              const hasMore = sectionProducts.length > preview.length;
              return (
                <section key={section.id} id={section.id} className="mt-16 scroll-under-header border-t border-border pt-10">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{section.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                      {section.categories.map((cat) => {
                        const count = byCategory.get(cat)?.length ?? 0;
                        if (!count) return null;
                        return <Link key={cat} href={adaptationHref(cat)} className="font-medium hover:text-primary hover:underline">{cat} ({count})</Link>;
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {preview.map((p) => <AdaptationCard key={p.id} product={p} />)}
                  </div>
                  {hasMore ? <div className="mt-7"><Link href={sectionHref(section.id)} className="inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">View all {sectionProducts.length} in {section.title}</Link></div> : null}
                </section>
              );
            })}
          </>
        )}
      </div>

      <section className="border-y border-border bg-soft/55 py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">From enquiry to fitting</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">A straightforward process.</h2><p className="mt-3 text-muted">Every adaptation is quoted against your vehicle before we fit.</p></div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">0{item.step}</p>
                <h3 className="mt-5 text-lg font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}{item.href ? <> <Link href={item.href} className="font-semibold text-primary underline underline-offset-2">Full demo terms</Link></> : null}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Specialist installation</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Why fit with Mobility Station?</h2></div>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {WHY_US.map(({ icon: Icon, title, body }) => (
              <li key={title} className="border-t border-primary pt-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Icon className="h-5 w-5" aria-hidden /></span><h3 className="mt-5 text-xl font-bold text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaFooter title="Get a free adaptation quotation" subtitle="Tell us your vehicle and what you need — we’ll confirm compatibility, Motability options and a firm fitted price." />
    </>
  );
}
