import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { DIVISIONS } from "@/lib/division";
import { SITE } from "@/lib/seo";

export function SiteFooter() {
  return <footer className="mss-footer">
    <div className="container-site mss-footer-grid">
      <div className="mss-footer-brand">
        <BrandLogo />
        <p>Vehicle adaptations. Everyday mobility.<br />More possibilities.</p>
        <a className="mss-footer-call" href={SITE.phoneHref}>{SITE.phone}</a>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </div>
      <nav className="mss-footer-adapt" aria-label="Vehicle adaptations">
        <h3><span className="mss-dot mss-dot-adapt" aria-hidden />Vehicle adaptations</h3>
        {DIVISIONS.adapt.footer.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <nav className="mss-footer-shop" aria-label="Scooters and wheelchairs">
        <h3><span className="mss-dot mss-dot-shop" aria-hidden />Scooters &amp; wheelchairs</h3>
        {DIVISIONS.shop.footer.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <nav aria-label="Help">
        <h3>Here to help</h3>
        <Link href="/contact">Contact &amp; locations</Link>
        <Link href="/book-a-demo">Book a demo</Link>
        <Link href="/book-a-service">Book a service</Link>
        <Link href="/about-us">About Mobility Station</Link>
        <Link href="/faq">FAQs</Link>
        <Link href="/delivery">Delivery &amp; collection</Link>
      </nav>
      <div className="mss-footer-branches">
        <h3>Come and see us</h3>
        <Link href="/contact#locations"><strong>Heathrow</strong><br />1–2 Horton Close<br />West Drayton, UB7 8EB</Link>
        <Link href="/contact#locations"><strong>Ferndown</strong><br />2 Old Forge Road<br />Wimborne, BH21 7RR</Link>
      </div>
    </div>
    <div className="container-site mss-footer-bottom">
      <span>© {new Date().getFullYear()} Mobility Station · A trading name of Adaptation Station Ltd.</span>
      <nav aria-label="Footer policies"><Link href="/vat-relief">VAT relief</Link><Link href="/privacy-policy">Privacy</Link><Link href="/cookie-policy">Cookies</Link><Link href="/terms">Terms</Link></nav>
    </div>
  </footer>;
}
