import { CatalogIntro } from "@/components/sections/catalog-intro";
import Link from "next/link";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CtaFooter } from "@/components/sections/cta-footer";

import { CARE_PLANS } from "@/lib/carePlans";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";


export const metadata = createMetadata({ title: "Servicing & Care Plans", description: "Book a scooter or wheelchair service, or join a Mobility Care Plan from £12.99/month. Heathrow & Ferndown workshops.", path: "/servicing" });

export default function ServicingPage() {
  const offersLd = CARE_PLANS.map((plan) => ({ "@type": "Offer", name: `${plan.name} Care Plan`, description: plan.tagline, price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", priceSpecification: { "@type": "UnitPriceSpecification", price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", billingDuration: "P1M", unitText: "MONTH" }, url: `${SITE.url}/servicing#care-plans`, seller: { "@type": "Organization", name: SITE.name, url: SITE.url } }));
  const jsonLd = [{ "@context": "https://schema.org", "@type": "Service", name: "Mobility Care Plans", serviceType: "Mobility equipment maintenance subscription", provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, areaServed: "GB", description: "Monthly care plans for mobility scooters and wheelchairs from Mobility Station workshops in Heathrow and Ferndown.", hasOfferCatalog: { "@type": "OfferCatalog", name: "Mobility Care Plans", itemListElement: offersLd } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE.url }, { "@type": "ListItem", position: 2, name: "Servicing", item: `${SITE.url}/servicing` }] }];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <CatalogIntro breadcrumb="Support" eyebrow="Servicing & aftercare" title={<>Looking after you.<br />And your independence.</>} subtitle="One-off servicing, repairs and monthly Care Plans. Keep your equipment in good hands with our specialist workshops." primary={{ href: "#form", label: "Book a service" }} secondary={{ href: "#care-plans", label: "Explore Care Plans" }} image={{ src: "/images/redesign/controls.webp", alt: "Adapted vehicle controls" }} />
    <CarePlansSection />
    <section id="form" className="scroll-mt-24 border-t border-border py-14 md:py-20"><div className="container-site grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">One-off support</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Book a service or repair.</h2><p className="mt-4 text-muted">Tell us about your scooter, wheelchair or adaptation and we’ll arrange the right workshop support.</p><p className="mt-6 text-sm text-muted">Already on a Care Plan? Mention it in your notes so we can apply your benefits. <Link href="/book-a-service" className="font-semibold text-primary underline underline-offset-2">Short service form</Link>.</p></div><div className="rounded-[2rem] border border-border bg-soft/55 p-6 md:p-8"><EnquiryForm enquiryType="service" title="Service booking request" defaultInterest="Service / repair" /></div></div></section>
    <CtaFooter title="Not sure which plan fits?" subtitle={`Call ${SITE.phone} and we’ll talk through your equipment and how often you need workshop support.`} primary={{ href: "/contact?interest=callback#callback", label: "Request a callback" }} secondary={{ href: "/book-a-demo", label: "Book a demo" }} />
  </>;
}
