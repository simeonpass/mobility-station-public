import Link from "next/link";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { SearchForm } from "@/components/layout/search-form";
import { CtaFooter } from "@/components/sections/cta-footer";
import { JourneyCards } from "@/components/sections/journey-cards";
import { ADAPTATION_SECTIONS, adaptationHref, sectionHref } from "@/lib/adaptations";
import { getAdaptationProducts } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const revalidate = 300;
export const metadata = createMetadata({ title: "Vehicle Adaptations | Supplied & Fitted", description: "Hand controls, boot hoists, swivel seats and more. Indicative prices and Motability options. Free quotes - we fit at our workshops or mobile where possible.", path: "/vehicle-adaptations" });
const HOW_IT_WORKS: { step: string; title: string; body: string; href?: string }[] = [
  { step: "1", title: "Tell us what you need", body: "Share your vehicle, condition and goals - driving, access or stowage." },
  { step: "2", title: "Free quotation", body: "We check compatibility and confirm an indicative supplied & fitted price." },
  { step: "3", title: "Demo or assessment", body: "Book a home visit where needed. Home demonstrations are \u00a3195 - deducted in full from your price if you go ahead.", href: "/book-a-demo#demo-terms" },
  { step: "4", title: "Fitted by our team", body: "Fitted at Heathrow or Ferndown - or mobile where the product allows." },
];

export default async function VehicleAdaptationsPage() {
  let products: Awaited<ReturnType<typeof getAdaptationProducts>> = [];
  let errorMessage: string | null = null;
  try { products = await getAdaptationProducts(); }
  catch (error) { console.error("Adaptations catalogue error:", error); errorMessage = "We could not load adaptations right now. Please request a callback or try again shortly."; }
  const byCategory = new Map<string, typeof products>();
  for (const product of products) { const category = product.category || "Other"; const list = byCategory.get(category) ?? []; list.push(product); byCategory.set(category, list); }
  const freeOnMotability = products.filter(product => product.motability_price === 0);
  const jsonLd = { "@context": "https://schema.org", "@type": "Service", name: "Vehicle Adaptations", provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phone }, areaServed: "GB", description: "Vehicle adaptations supplied and fitted, with free quotations and Motability options." };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <CatalogIntro breadcrumb="Vehicle adaptations" eyebrow="Make your vehicle work for you" title={<>Vehicle adaptations,<br />supplied &amp; fitted.</>} subtitle="Help with driving, getting in and out, and taking your scooter or wheelchair with you. Assessed, supplied and fitted by our specialist team." primary={{ href: "/contact?interest=adaptation", label: "Request a free quotation" }} secondary={{ href: "/book-a-demo?type=adaptation", label: "Arrange a demonstration" }} image={{ src: "/images/redesign/seat.webp", alt: "Swivel seat fitted to a vehicle" }} />
    <JourneyCards division="adapt" />
    <div id="catalogue" className="container-site scroll-under-header py-8 md:py-12">
      {errorMessage ? <p role="status" className="rounded-2xl border border-border bg-soft px-5 py-4 text-sm text-primary">{errorMessage}</p> : <>
        <div className="ms-adaptations-search"><div><p className="ms-eyebrow">Specialist vehicle adaptations</p><h2>Explore your adaptation options.</h2><p>We will help you choose and confirm the right fit for your vehicle.</p></div><SearchForm type="adaptations" size="lg" placeholder="Search vehicle adaptations..." /></div>
        <div className="pb-2"><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Browse by adaptation type</p><div className="mt-4 flex flex-wrap gap-2" role="navigation" aria-label="Adaptation type">
          <a href="#catalogue" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">All</a>
          {ADAPTATION_SECTIONS.map(section => { const count = section.categories.reduce((sum, category) => sum + (byCategory.get(category)?.length ?? 0), 0); return count ? <a key={section.id} href={`#${section.id}`} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary">{section.title}</a> : null; })}
          {freeOnMotability.length ? <a href="#free-motability" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary">&pound;0 on Motability</a> : null}
        </div></div>
        {ADAPTATION_SECTIONS.map(section => {
          const sectionProducts = section.categories.flatMap(category => byCategory.get(category) ?? []);
          if (!sectionProducts.length) return null;
          const preview = sectionProducts.slice(0, 4);
          return <section key={section.id} id={section.id} className="mt-12 scroll-under-header border-t border-border pt-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><h3 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{section.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p></div>
              <details className="ms-adaptation-categories"><summary>Browse all categories</summary><div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">{section.categories.map(category => { const count = byCategory.get(category)?.length ?? 0; return count ? <Link key={category} href={adaptationHref(category)} className="font-medium hover:text-primary hover:underline">{category} ({count})</Link> : null; })}</div></details>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">{preview.map(product => <AdaptationCard key={product.id} product={product} />)}</div>
            {sectionProducts.length > preview.length ? <div className="mt-7"><Link href={sectionHref(section.id)} className="ms-button ms-button-secondary">View all {sectionProducts.length} in {section.title}</Link></div> : null}
          </section>;
        })}
        {freeOnMotability.length > 0 ? <section id="free-motability" className="ms-adaptation-scheme"><div><h2>Adaptations through Motability</h2><p>Selected adaptations are available with &pound;0 advance payment, subject to assessment and vehicle compatibility.</p></div><Link href="/motability/vehicle-adaptations" className="ms-text-link">Explore Motability options &rarr;</Link></section> : null}
      </>}
    </div>
    <section id="how-it-works" className="msx-adaptation-process scroll-under-header py-10 md:py-14"><div className="container-site">
      <div className="max-w-2xl"><p className="ms-eyebrow">From enquiry to fitting</p><h2 className="mt-3 text-3xl tracking-tight">A straightforward process.</h2><p className="mt-3 text-muted">Every adaptation is quoted against your vehicle before we fit.</p></div>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{HOW_IT_WORKS.map(item => <li key={item.step}><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">0{item.step}</p><h3 className="mt-4 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{item.body}{item.href ? <> <Link href={item.href} className="font-semibold text-primary underline underline-offset-2">Full demo terms</Link></> : null}</p></li>)}</ol>
    </div></section>
    <CtaFooter title="Get a free adaptation quotation" subtitle="Tell us your vehicle and what you need. We will confirm compatibility, Motability options and a firm fitted price." primary={{ href: "/contact?interest=adaptation", label: "Request a free quotation" }} />
  </>;
}
