import { ArrowUpRight, Check, Phone } from "lucide-react";
import { ServiceRequestForm } from "@/components/forms/service-request-form";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Servicing & Repairs", description: "Servicing and repairs for mobility scooters, wheelchairs and vehicle adaptations. Contact our Heathrow and Ferndown workshops to arrange support.", path: "/servicing" });

export default function ServicingPage() {
  const serviceLd = { "@context": "https://schema.org", "@type": "Service", name: "Mobility equipment servicing and repairs", serviceType: "Mobility scooter, wheelchair and vehicle adaptation servicing and repairs", provider: { "@type": "Organization", name: SITE.name, url: SITE.url, telephone: SITE.phone }, url: `${SITE.url}/servicing` };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceLd)} />
    <section className="ms-page-intro"><div className="container-site ms-simple-intro"><p className="ms-eyebrow">Heathrow &amp; Ferndown workshops</p><h1>Servicing &amp; repairs.</h1><p>Keep your scooter, wheelchair or vehicle adaptation working as it should. Tell us what you need and we’ll arrange the next step.</p><div className="ms-actions"><a href="#form" className="ms-button">Book a service or repair<ArrowUpRight size={20} aria-hidden /></a><a href={SITE.phoneHref} className="ms-link"><Phone size={18} aria-hidden />{SITE.phone}</a></div></div></section>
    <section id="form" className="ms-simple-section"><div className="container-site ms-simple-booking-grid">
      <div className="ms-simple-explainer"><p className="ms-eyebrow">Here when you need us</p><h2>Let’s get it looked at.</h2><p>Routine service or something that needs fixing — our team can help you find the right support.</p><ul className="ms-simple-checks">{["Mobility scooters", "Wheelchairs & powerchairs", "Vehicle adaptations"].map(item=><li key={item}><Check size={19} aria-hidden />{item}</li>)}</ul><div className="ms-simple-note"><h3>What happens next?</h3><p>We’ll call you to discuss your equipment and arrange an appointment. If getting it to us is difficult, ask about collection.</p></div></div>
      <div className="ms-simple-form-panel"><h2>Request a service or repair</h2><p className="ms-simple-form-lead">A few details so the right person can get back to you.</p><ServiceRequestForm /></div>
    </div></section>
  </>;
}
