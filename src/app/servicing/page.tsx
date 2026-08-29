import Link from "next/link";
import { CarePlansSection } from "@/components/care-plans/care-plans-section";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { CARE_PLANS } from "@/lib/carePlans";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({ title: "Servicing & Care Plans", description: "Book a scooter or wheelchair service, or join a Mobility Care Plan from £12.99/month. Heathrow & Ferndown workshops.", path: "/servicing" });

export default function ServicingPage() {
  const offersLd = CARE_PLANS.map((plan) => ({ "@type": "Offer", name: `${plan.name} Care Plan`, description: plan.tagline, price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", priceSpecification: { "@type": "UnitPriceSpecification", price: plan.priceMonthly.toFixed(2), priceCurrency: "GBP", billingDuration: "P1M", unitText: "MONTH" }, url: `${SITE.url}/servicing#care-plans`, seller: { "@type": "Organization", name: SITE.name, url: SITE.url } }));
  const jsonLd = [{ "@context": "https://schema.org", "@type": "Service", name: "Mobility Care Plans", serviceType: "Mobility equipment maintenance subscription", provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, areaServed: "GB", description: "Monthly care plans for mobility scooters and wheelchairs from Mobility Station workshops in Heathrow and Ferndown.", hasOfferCatalog: { "@type": "OfferCatalog", name: "Mobility Care Plans", itemListElement: offersLd } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE.url }, { "@type": "ListItem", position: 2, name: "Servicing", item: `${SITE.url}/servicing` }] }];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Mobility Station · Workshop support</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Keep moving with confidence.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">One-off servicing and repairs, or monthly Care Plans for ongoing priority support from our Heathrow and Ferndown workshops.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#care-plans" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-7")}>View Care Plans</a><a href="#form" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full bg-white px-7")}>Book a one-off service</a></div></div></section>
    <CarePlansSection />
    <section id="form" className="scroll-mt-24 border-t border-border py-14 md:py-20"><div className="container-site grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">One-off support</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Book a service or repair.</h2><p className="mt-4 text-muted">Tell us about your scooter, wheelchair or adaptation and we’ll arrange the right workshop support.</p><p className="mt-6 text-sm text-muted">Already on a Care Plan? Mention it in your notes so we can apply your benefits. <Link href="/book-a-service" className="font-semibold text-primary underline underline-offset-2">Short service form</Link>.</p></div><div className="rounded-[2rem] border border-border bg-soft/55 p-6 md:p-8"><EnquiryForm enquiryType="service" title="Service booking request" defaultInterest="Service / repair" /></div></div></section>
    <CtaFooter title="Not sure which plan fits?" subtitle={`Call ${SITE.phone} and we’ll talk through your equipment and how often you need workshop support.`} primary={{ href: "/contact?interest=callback#callback", label: "Request a callback" }} secondary={{ href: "/book-a-demo", label: "Book a demo" }} />
  </>;
}
