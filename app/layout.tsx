import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./klym-polish.css";
import "./klym-shop.css";
import "./klym-apple.css";
import "./klym-visual.css";
import "./klym-x12-campaign.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://klym.co.uk"),
  title: { default: "KLYM | XSTO Powered Wheelchairs UK", template: "%s | KLYM" },
  description: "Shop XSTO M4, M4B, M4 Pro, X12 and X12 Pro powered mobility from KLYM, with UK delivery, VAT relief for eligible customers and UK after-sales support.",
  alternates: { canonical: "/" },
  openGraph: { title: "KLYM | XSTO Mobility", description: "Shop premium XSTO powered mobility in the UK.", url: "https://klym.co.uk", siteName: "KLYM", type: "website" },
};

function Logo() {
  return <span className="brand" aria-label="KLYM"><span className="wordmark">KL<i>Y</i>M</span><small>XSTO MOBILITY</small></span>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <div className="announcement-bar"><span>VAT relief available for eligible customers</span><span>UK delivery</span><span>UK after-sales support</span></div>
        <header className="site-header shop-header">
          <Link className="shop-logo" href="/"><Logo /></Link>
          <nav className="site-nav shop-nav" aria-label="Main navigation">
            <Link href="/#range">Shop</Link>
            <Link href="/xsto-x12">X12</Link>
            <Link href="/xsto-x12-pro">X12 Pro</Link>
            <Link href="/xsto-m4b">M4 Series <span className="nav-new">NEW</span></Link>
            <Link href="/compare">Compare</Link>
            <Link href="/vat-relief">VAT Relief</Link>
          </nav>
          <div className="header-actions shop-header-actions"><Link className="shop-header-link" href="/xsto-m4b">New M4B</Link><Link className="shop-button primary compact" href="/xsto-x12">Shop X12</Link></div>
        </header>
        <main>{children}</main>
        <footer className="site-footer shop-footer">
          <div className="footer-grid">
            <div className="footer-brand"><Logo /><p>Specialist XSTO powered mobility, sold and supported in the UK.</p><Link className="shop-button primary compact" href="/#range">Shop XSTO</Link></div>
            <div className="footer-col"><h4>Shop</h4><Link href="/xsto-x12">X12</Link><Link href="/xsto-x12-pro">X12 Pro</Link><Link href="/xsto-m4b">M4B</Link><Link href="/xsto-m4">M4</Link><Link href="/xsto-m4-pro">M4 Pro</Link></div>
            <div className="footer-col"><h4>Buying help</h4><Link href="/compare">Compare models</Link><Link href="/vat-relief">VAT relief</Link><Link href="/stair-climbing-wheelchairs">Stair climbers</Link><Link href="/self-balancing-wheelchairs">Self-balancing</Link></div>
            <div className="footer-col"><h4>KLYM</h4><p>Operated by Adaptation Station Ltd, trading as Mobility Station.</p><p>UK sales, delivery and after-sales support.</p></div>
          </div>
          <div className="footer-bottom"><span>© 2026 KLYM.</span><span>Advanced XSTO mobility from Mobility Station.</span></div>
        </footer>
      </body>
    </html>
  );
}
