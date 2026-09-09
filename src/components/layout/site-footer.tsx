import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SITE } from "@/lib/seo";
export function SiteFooter() {
  return <footer className="ms-footer">
    <div className="container-site ms-footer-grid">
      <div><BrandLogo tone="dark" /><p>Vehicle adaptations. Everyday mobility.<br />More possibilities.</p><a className="ms-footer-call" href={SITE.phoneHref}>{SITE.phone}</a><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
      <nav aria-label="Footer products"><h3>Find your freedom</h3><Link href="/vehicle-adaptations">Vehicle adaptations</Link><Link href="/shop">Scooters &amp; wheelchairs</Link><Link href="/hire">Hire</Link><Link href="/motability">Motability</Link><Link href="/support">Support</Link><Link href="/clearance">Clearance</Link></nav>
      <nav aria-label="Footer help"><h3>Here to help</h3><Link href="/contact">Contact &amp; locations</Link><Link href="/servicing">Servicing &amp; aftercare</Link><Link href="/about-us">About Mobility Station</Link><Link href="/our-work">Our recent work</Link><Link href="/faq">FAQs</Link><Link href="/delivery">Delivery &amp; collection</Link></nav>
      <div><h3>Come and see us</h3><Link href="/contact#locations"><strong>Heathrow</strong><br />1–2 Horton Close<br />West Drayton, UB7 8EB</Link><Link href="/contact#locations"><strong>Ferndown</strong><br />2 Old Forge Road<br />Wimborne, BH21 7RR</Link></div>
    </div>
    <div className="container-site ms-footer-bottom"><span>© {new Date().getFullYear()} Mobility Station · A trading name of Adaptation Station Ltd.</span><nav aria-label="Footer policies"><Link href="/vat-relief">VAT relief</Link><Link href="/privacy-policy">Privacy</Link><Link href="/cookie-policy">Cookies</Link><Link href="/terms">Terms</Link></nav></div>
  </footer>;
}
