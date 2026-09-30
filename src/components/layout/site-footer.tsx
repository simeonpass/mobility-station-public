import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { DIVISIONS } from "@/lib/division";
import { SITE } from "@/lib/seo";

export function SiteFooter() {
  return <footer className="msx-footer">
    <div className="container-site">
      <div className="msx-footer-top">
        <div className="msx-footer-brand"><BrandLogo /><p>Keeping you moving.<br />Vehicle adaptations. Everyday mobility.</p></div>
        <div className="msx-footer-contact"><a href={SITE.phoneHref}><Phone size={19} aria-hidden="true" />{SITE.phone}</a><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
      </div>
      <div className="msx-footer-grid">
        <nav className="msx-footer-adapt" aria-label="Vehicle adaptations"><h3>Vehicle adaptations</h3>{DIVISIONS.adapt.footer.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <nav className="msx-footer-shop" aria-label="Scooters and wheelchairs"><h3>Scooters &amp; wheelchairs</h3>{DIVISIONS.shop.footer.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <nav aria-label="Advice and support"><h3>Here to help</h3><Link href="/support">Advice &amp; support</Link><Link href="/contact">Contact our team</Link><Link href="/book-a-demo">Book a demonstration</Link><Link href="/book-a-service">Book a service</Link><Link href="/about-us">About Mobility Station</Link><Link href="/faq">Frequently asked questions</Link><Link href="/delivery">Delivery &amp; collection</Link></nav>
        <div className="msx-footer-branches"><h3>Come and see us</h3><Link href="/contact#branch-heathrow"><strong>Heathrow / West Drayton</strong><br />1&ndash;2 Horton Close, UB7 8EB<small>Vehicle adaptation advice &amp; fitting</small></Link><Link href="/contact#branch-ferndown"><strong>Ferndown / Dorset</strong><br />2 Old Forge Road, Wimborne, BH21 7RR<small>Adaptations, scooters &amp; wheelchairs</small></Link><Link href="/locations" className="msx-text-link">Opening times &amp; directions</Link></div>
      </div>
      <div className="msx-footer-bottom"><span>&copy; {new Date().getFullYear()} Mobility Station &middot; A trading name of {SITE.legalName}.</span><nav aria-label="Footer policies"><Link href="/vat-relief">VAT relief</Link><Link href="/privacy-policy">Privacy</Link><Link href="/cookie-policy">Cookies</Link><Link href="/terms">Terms</Link></nav></div>
    </div>
  </footer>;
}
