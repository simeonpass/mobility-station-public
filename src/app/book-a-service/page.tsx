import Link from "next/link";
import { Phone } from "lucide-react";
import { ServiceRequestForm } from "@/components/forms/service-request-form";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Book a Service or Repair", description: "Request servicing or repairs for your scooter, wheelchair or vehicle adaptation. Our Heathrow or Ferndown team will confirm the work, cost and appointment.", path: "/book-a-service" });
export default function BookAServicePage() {
  return <section id="form" className="ms-simple-section"><div className="container-site ms-simple-booking-grid">
    <div className="ms-simple-explainer"><Link href="/servicing" className="ms-link">← Servicing &amp; repairs</Link><h1 className="ms-simple-title">Book a service or repair.</h1><p>Tell us what needs looking at. We’ll contact you to confirm the work, cost and appointment.</p><p>Heathrow &amp; Ferndown workshops.</p><a href={SITE.phoneHref} className="ms-link"><Phone size={18} aria-hidden />{SITE.phone}</a></div>
    <div className="ms-simple-form-panel"><ServiceRequestForm /></div>
  </div></section>;
}
