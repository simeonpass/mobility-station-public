import Link from "next/link";
import { AdaptationCard } from "@/components/product/adaptation-card";

import { CatalogIntro } from "@/components/sections/catalog-intro";
import { SearchForm } from "@/components/layout/search-form";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  ADAPTATION_SECTIONS,
  adaptationHref,
  sectionHref,
} from "@/lib/adaptations";
import {
  getAdaptationProducts,
} from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

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

      <CatalogIntro breadcrumb="Vehicle adaptations" eyebrow="Your car. Your possibilities." title={<>A better way<br />to get going.</>} subtitle="Vehicle adaptations that make driving, getting in and out, and taking your equipment with you easier. Assessed, supplied and fitted by our specialist team." primary={{ href: "/contact?interest=adaptation", label: "Request a quotation" }} secondary={{ href: "/book-a-demo?type=adaptation", label: "Book a demonstration" }} image={{ src: "/images/redesign/seat.webp", alt: "Swivel seat fitted to a vehicle" }} />

      <div id="catalogue" className="container-site scroll-under-header py-10 md:py-16">
        {errorMessage ? (
          <p className="rounded-2xl border border-border bg-soft px-5 py-4 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <>
            <div className="ms-adaptations-search"><div><p className="ms-eyebrow">Specialist vehicle adaptations</p><h2>Find your way forward.</h2><p>Explore the options below. We’ll help you choose and confirm the right fit for your vehicle.</p></div><SearchForm type="adaptations" size="lg" placeholder="Search vehicle adaptations…" /></div>
            <div className="pb-2">
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

            {ADAPTATION_SECTIONS.map((section) => {
              const sectionProducts = section.categories.flatMap((cat) => byCategory.get(cat) ?? []);
              if (!sectionProducts.length) return null;
              const preview = sectionProducts.slice(0, 4);
              const hasMore = sectionProducts.length > preview.length;
              return (
                <section key={section.id} id={section.id} className="mt-16 scroll-under-header border-t border-border pt-10">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{section.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p>
                    </div>
                    <details className="ms-adaptation-categories"><summary>Browse all categories</summary><div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                      {section.categories.map((cat) => {
                        const count = byCategory.get(cat)?.length ?? 0;
                        if (!count) return null;
                        return <Link key={cat} href={adaptationHref(cat)} className="font-medium hover:text-primary hover:underline">{cat} ({count})</Link>;
                      })}
                    </div></details>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {preview.map((p) => <AdaptationCard key={p.id} product={p} />)}
                  </div>
                  {hasMore ? <div className="mt-7"><Link href={sectionHref(section.id)} className="inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">View all {sectionProducts.length} in {section.title}</Link></div> : null}
                </section>
              );
            })}
            {freeOnMotability.length > 0 ? <section id="free-motability" className="ms-adaptation-scheme"><div><h2>Adaptations through Motability</h2><p>Selected adaptations are available with £0 advance payment, subject to assessment and vehicle compatibility.</p></div><Link href="/motability/vehicle-adaptations" className="ms-text-link">Explore Motability options ↗</Link></section> : null}
          </>
        )}
      </div>

      <section className="border-y border-border bg-soft/55 py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">From enquiry to fitting</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">A straightforward process.</h2><p className="mt-3 text-muted">Every adaptation is quoted against your vehicle before we fit.</p></div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">0{item.step}</p>
                <h3 className="mt-5 text-lg font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}{item.href ? <> <Link href={item.href} className="font-semibold text-primary underline underline-offset-2">Full demo terms</Link></> : null}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaFooter title="Get a free adaptation quotation" subtitle="Tell us your vehicle and what you need — we’ll confirm compatibility, Motability options and a firm fitted price." />
    </>
  );
}
