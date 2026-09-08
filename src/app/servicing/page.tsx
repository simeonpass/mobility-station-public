import { CatalogIntro } from "@/components/sections/catalog-intro";
import Link from "next/link";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";
import { CtaFooter } from "@/components/sections/cta-footer";

import { CARE_PLANS } from "@/lib/carePlans";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";


export const metadata = createMetadata({ title: "Servicing & Care Plans", description: "Book a scooter or wheelchair service, or join a Mobility Care Plan from £12.99/month. Heathrow & Ferndown workshops.", path: "/servicing" });

export default function ServicingPage() {
  const offersLd = CARE_PLANS.map((plan) => ({ "@type": "Offer", name: `${plan.name} Care Plan`, description: plan.tagline, price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", priceSpecification: { "@type": "UnitPriceSpecification", price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", billingDuration: "P1M", unitText: "MONTH" }, url: `${SITE.url}/servicing#care-plans`, seller: { "@type": "Organization", name: SITE.name, url: SITE.url } }));
  const jsonLd = [{ "@context": "https://schema.org", "@type": "Service", name: "Mobility Care Plans", serviceType: "Mobility equipment maintenance subscription", provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, areaServed: "GB", description: "Monthly care plans for mobility scooters and wheelchairs from Mobility Station workshops in Heathrow and Ferndown.", hasOfferCatalog: { "@type": "OfferCatalog", name: "Mobility Care Plans", itemListElement: offersLd } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE.url }, { "@type": "ListItem", position: 2, name: "Servicing", item: `${SITE.url}/servicing` }] }];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <CatalogIntro breadcrumb="Support" eyebrow="Servicing & aftercare" title={<>Looking after you.<br />And your independence.</>} subtitle="One-off servicing, repairs and monthly Care Plans. Keep your equipment in good hands with our specialist workshops." primary={{ href: "/book-a-service", label: "Book a service" }} secondary={{ href: "#care-plans", label: "Explore Care Plans" }} image={{ src: "/images/redesign/controls.webp", alt: "Adapted vehicle controls" }} />
    <CarePlansSection />
    <section id="form" className="container-site py-12"><h2 className="text-2xl font-semibold">Need a one-off service or repair?</h2><p className="mt-3 text-muted">Tell us about your equipment and we’ll arrange workshop support. If you have a Care Plan, mention it in your booking.</p><Link href="/book-a-service" className="ms-button mt-6">Book a service ↗</Link></section>
    <CtaFooter title="Not sure which plan fits?" subtitle={`Call ${SITE.phone} and we’ll talk through your equipment and how often you need workshop support.`} primary={{ href: "/contact?interest=callback#callback", label: "Request a callback" }} secondary={{ href: "/book-a-demo", label: "Book a demo" }} />
  </>;
}
